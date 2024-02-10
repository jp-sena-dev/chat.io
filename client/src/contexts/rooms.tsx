import React, {
  useContext, useEffect, useMemo, useState,
} from 'react';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { auth, db } from '../firebase-config';
import { useAuth } from './auth-context';
import { socket } from '../App';
import { uploadImage } from '../services/upload-image';
import { guetRooms } from '../utils/guest-rooms';

interface RoomProviderProps {
  children: JSX.Element;
}

export interface RoomInUserType {
  imageURL: string;
  userId: string;
  username: string;
}

export interface RoomCollection {
  id: string;
  name: string;
  imageURL?: string;
  users: RoomInUserType[];
}

export interface UserCollection {
  username: string;
  userId: string,
  rooms: RoomCollection[] | [];
  imageURL?: string;
}

type MessageType = {
  date: string;
  id: string;
  message: string;
  username: string;
};

export interface MessageCollection {
  createdAt: string;
  roomId: string;
  roomName: string;
  messages: MessageType[];
}

interface RoomProviderType {
  createRoom: (name: string, id: string, img: any) => Promise<RoomCollection>;
  joinRoom: (id: string) => Promise<RoomCollection>;
  getUserRooms: () => Promise<RoomCollection[] | []>;
  sendMessage: (message: string, room: RoomCollection) => void;
  getMessages: (roomId: string) => Promise<MessageCollection[]>;
  updateRoomImage: (file: any, roomId: string) => Promise<any>;
  exitRoom: (id: string) => Promise<void>;
  updateRoomName: (name: string, id: string) => Promise<void>;
  updateRooms: (roomId: string, updateInfos: Partial<RoomCollection>) => void;
  currentRooms: RoomCollection[];
}

const UseRoomContext = React.createContext<RoomProviderType | null>(null);
export const useRooms = () => useContext(UseRoomContext) as RoomProviderType;

export default function RoomsApiProvider({ children }: RoomProviderProps) {
  const { currentUser, updateUserInDatabase } = useAuth();
  const [currentRooms, setCurrentRooms] = useState<RoomCollection[]>([]);
  const [loading, setLoading] = useState(true);

  const getUserRooms = async (): Promise<RoomCollection[] | []> => {
    const { rooms } = (await getDoc(doc(db, 'users', `${auth.currentUser?.uid}`))).data() as UserCollection;
    if (!rooms.length) return [];
    const roomsDoc = await getDocs(query(collection(db, 'rooms'), where('id', 'in', rooms.map(({ id }: any) => id))));
    const roomsData = roomsDoc.docs.map((roomDoc) => roomDoc.data()) as RoomCollection[];
    setCurrentRooms(roomsData);
    return roomsData;
  };

  useEffect(() => {
    if (!currentUser.isAnonymous) {
      (async () => {
        await getUserRooms().then(() => setLoading(false));
      })();
    } else {
      setCurrentRooms(guetRooms);
      setLoading(false);
    }
  }, [currentUser.isAnonymous]);

  const updateRooms = (roomId: string, updateInfos: Partial<RoomCollection>): void => {
    setCurrentRooms(currentRooms.map((room) => {
      if (room.id === roomId) {
        socket.emit('updateRoom', { ...room, ...updateInfos });
        return { ...room, ...updateInfos };
      }
      return room;
    }));
  };

  const updateRoomInDatabase = async (
    roomId: string,
    updateInfos: Partial<RoomCollection>,
  ): Promise<void> => {
    const roomDoc = doc(db, 'room', `${roomId}`);
    const roomData = (await getDoc(roomDoc)).data();
    setDoc(roomDoc, {
      ...roomData,
      ...updateInfos,
    });
  };

  const updateRoomImage = async (file: any, roomId: string) => {
    const imageURL = await uploadImage(file, `room/${roomId}`);

    await updateRoomInDatabase(roomId, { imageURL });

    updateRooms(roomId, { imageURL });
  };

  const updateRoomName = async (name: string, id: string) => {
    updateRoomInDatabase(id, { name });

    updateRooms(id, { name });
  };

  const exitRoom = async (roomId: string) => {
    const { users: roomUsers } = (await getDoc(doc(db, 'rooms', roomId))).data() as RoomCollection;

    const { ...userData } = (await getDoc(doc(db, 'users', `${auth.currentUser?.uid}`))).data() as UserCollection;

    await updateRoomInDatabase(
      roomId,
      { users: roomUsers.filter(({ userId }) => userId !== currentUser.uid) },
    );

    updateUserInDatabase({ rooms: currentRooms.filter(({ id }) => id !== roomId) });

    setCurrentRooms(currentRooms.filter(({ id }) => id !== roomId));

    socket.emit('updateRoom', {
      ...userData,
      rooms: currentRooms.filter(({ id }) => id !== roomId),
    });
  };

  const joinRoom = async (id: string): Promise<RoomCollection> => {
    const roomData = (await getDoc(doc(db, 'rooms', id))).data() as RoomCollection;

    if (currentRooms.some((room) => room.id === id)) throw new Error('room/room-already-entered');

    if (!roomData) throw new Error('room/room-not-found');

    updateUserInDatabase({
      rooms: [...currentUser.rooms as RoomCollection[], roomData],
    });

    updateRoomInDatabase(id, {
      users: [...roomData.users, {
        username: currentUser.username,
        userId: currentUser.uid,
        imageURL: currentUser.imageURL,
      }],
    });

    socket.emit('updateRoom', {
      ...roomData,
      users: [...roomData.users, {
        username: currentUser.username,
        userId: currentUser.uid,
        imageURL: currentUser.imageURL,
      }],
    });

    setCurrentRooms([...currentRooms, roomData]);

    return roomData;
  };

  const sendMessage = async (message: string, room: RoomCollection) => {
    const messagesDoc = doc(db, 'messages', room.id);
    const messagesData = (await getDoc(messagesDoc)).data() as MessageCollection;
    await setDoc(messagesDoc, {
      roomName: messagesData.roomName || room.name,
      roomId: messagesData.roomId || room.id,
      createdAt: messagesData.createdAt || new Date().toISOString(),
      messages: [
        ...messagesData.messages,
        {
          id: auth.currentUser?.uid,
          username: currentUser.username,
          message,
          date: new Date().toISOString(),
        },
      ],
    });
  };

  const createRoom = async (name: string, id: string, img: any): Promise<RoomCollection> => {
    const roomExists = !(await getDoc(doc(db, 'rooms', id))).data();
    if (!roomExists) throw new Error('room/id-already-in-use');

    let imageURL = '';
    if (img) imageURL = await uploadImage(img, `room/${id}`);

    const createdRoom = {
      id,
      name,
      imageURL,
      users: [
        {
          username: currentUser.username,
          userId: currentUser.uid,
          imageURL: currentUser.imageURL,
        },
      ],
    };

    await setDoc(doc(db, 'rooms', id), createdRoom);
    await updateUserInDatabase({ rooms: [...currentRooms, createdRoom] });
    setCurrentRooms([...currentRooms, createdRoom]);

    return createdRoom;
  };

  const getMessages = async (roomId: string): Promise<MessageCollection[]> => {
    const messages = (await getDoc(doc(db, 'messages', roomId))).data() as MessageCollection[];
    return messages;
  };

  const value = useMemo(() => ({
    createRoom,
    joinRoom,
    getUserRooms,
    sendMessage,
    getMessages,
    updateRoomImage,
    exitRoom,
    updateRoomName,
    updateRooms,
    currentRooms,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [currentRooms]);

  return (
    <UseRoomContext.Provider value={value as RoomProviderType}>
      { !loading && children }
    </UseRoomContext.Provider>
  );
}
