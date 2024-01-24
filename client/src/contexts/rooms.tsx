import React, {
  useContext, useEffect, useMemo, useState,
} from 'react';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import {
  getDownloadURL, getStorage, ref, uploadBytes,
} from 'firebase/storage';
import { auth, db } from '../firebase-config';
import { useAuth } from './auth-context';
import { socket } from '../App';

interface RoomProviderProps {
  children: JSX.Element;
}

export type RoomCollection = {
  id: string;
  name: string;
  imageURL?: string;
  users: {
    imageURL: string;
    userId: string;
    username: string;
  }[];
};

export interface UserCollection {
  username: string;
  userId: string,
  rooms: {
    id: string;
    name: string;
    imageURL?: string;
  }[] | [];
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
  getMessages: (roomId: string) => Promise<any>;
  uploadImage: (file: any, roomId: string) => Promise<any>;
  exitRoom: (id: string) => Promise<void>;
  updateRoomName: (name: string, id: string) => Promise<void>;
  updateRooms: (updateRoom: RoomCollection) => void;
  currentRooms: RoomCollection[];
}

const UseRoomContext = React.createContext<RoomProviderType | null>(null);
export const useRooms = () => useContext(UseRoomContext) as RoomProviderType;

export default function RoomsApiProvider({ children }: RoomProviderProps) {
  const { currentUser } = useAuth();
  const [currentRooms, setCurrentRooms] = useState<RoomCollection[]>([]);
  const [loading, setLoading] = useState(true);

  const getUserRooms = async (): Promise<RoomCollection[] | []> => {
    const userDoc = doc(db, 'users', `${auth.currentUser?.uid}`);
    const userDocData = await getDoc(userDoc);
    const roomsCollection = collection(db, 'rooms');
    const { rooms } = userDocData.data() as UserCollection;
    if (!rooms.length) return [];
    const roomQuery = query(roomsCollection, where('id', 'in', rooms.map(({ id }: any) => id)));
    const roomQueryDoc = await getDocs(roomQuery);
    setCurrentRooms(roomQueryDoc.docs.map((e) => e.data()) as RoomCollection[]);
    return roomQueryDoc.docs.map((e) => e.data()) as RoomCollection[];
  };

  useEffect(() => {
    if (!currentUser.isAnonymous) {
      (async () => {
        await getUserRooms().then(() => setLoading(false));
      })();
    } else {
      setCurrentRooms([
        {
          id: 'movie',
          name: 'Movie',
          users: [{ username: 'guest' }, { username: 'guest' }, { username: 'guest' }] as UserCollection[],
        },
        {
          id: 'sport',
          name: 'Sport',
          users: [{ username: 'guest' }, { username: 'guest' }, { username: 'guest' }] as UserCollection[],
        },
        {
          id: 'technology',
          name: 'Technology',
          users: [{ username: 'guest' }, { username: 'guest' }, { username: 'guest' }] as UserCollection[],
        },
        {
          id: 'music',
          name: 'Music',
          users: [{ username: 'guest' }, { username: 'guest' }, { username: 'guest' }] as UserCollection[],
        },
        {
          id: 'memes',
          name: 'Memes',
          users: [{ username: 'guest' }, { username: 'guest' }, { username: 'guest' }] as UserCollection[],
        },
      ]);
      setLoading(false);
    }
  }, [currentUser.isAnonymous]);

  const uploadImage = async (file: any, roomId: string) => {
    const storage = getStorage();
    const storageRef = ref(storage, `room/${roomId}`);
    await uploadBytes(storageRef, file);
    const imageURL = await getDownloadURL(storageRef);
    const roomsCollection = collection(db, 'rooms');
    const roomsQuery = query(roomsCollection, where('id', '==', roomId));
    const roomDocs = await getDocs(roomsQuery);
    const roomDoc = doc(db, 'rooms', `${roomDocs.docs[0].id}`);
    const { imageURL: imgs, ...roomData } = roomDocs.docs[0].data() as RoomCollection;
    setDoc(roomDoc, {
      imageURL,
      ...roomData,
    });
    setCurrentRooms(currentRooms.map((room) => {
      if (room.id === roomId) {
        socket.emit('updateRoom', { ...room, imageURL });
        return { ...room, imageURL };
      }
      return room;
    }));
  };

  const updateRooms = (roomUpdated: RoomCollection) => {
    setCurrentRooms(currentRooms.map(
      (prevRoom) => (prevRoom.id === roomUpdated.id ? roomUpdated : prevRoom),
    ));
  };

  const updateRoomName = async (name: string, id: string) => {
    const roomsCollection = collection(db, 'rooms');
    const roomsQuery = query(roomsCollection, where('id', '==', id));
    const roomsQueryDoc = await getDocs(roomsQuery);
    const roomDoc = doc(db, 'rooms', roomsQueryDoc.docs[0].id);
    const { name: roomName, ...roomData } = (await getDoc(roomDoc)).data() as RoomCollection;
    await setDoc(roomDoc, {
      name,
      ...roomData,
    });
    setCurrentRooms(currentRooms.map((room) => {
      if (room.id === id) {
        socket.emit('updateRoom', { ...room, name });
        return { ...room, name };
      }
      return room;
    }));
  };

  const exitRoom = async (id: string) => {
    const roomsCollection = collection(db, 'rooms');
    const roomsQuery = query(roomsCollection, where('id', '==', id));
    const roomsQueryDoc = await getDocs(roomsQuery);
    const roomDoc = doc(db, 'rooms', roomsQueryDoc.docs[0].id);
    const { users: roomUsers, ...roomData } = (await getDoc(roomDoc)).data() as RoomCollection;

    const userDoc = doc(db, 'users', `${auth.currentUser?.uid}`);
    const { rooms, ...userData } = (await getDoc(userDoc)).data() as UserCollection;

    await setDoc(roomDoc, {
      ...roomData,
      users: roomUsers.filter(({ userId }) => userId !== currentUser.uid),
    });
    await setDoc(userDoc, {
      ...userData,
      rooms: rooms.filter(({ id: roomId }) => roomId !== id),
    });

    setCurrentRooms(currentRooms.filter(({ id: roomId }) => roomId !== id));
    socket.emit('updateRoom', {
      ...userData,
      rooms: rooms.filter(({ id: roomId }) => roomId !== id),
    });
  };

  const joinRoom = async (id: string): Promise<RoomCollection> => {
    const roomsCollection = collection(db, 'rooms');
    const roomsQuery = query(roomsCollection, where('id', '==', id));
    const roomsQueryDoc = await getDocs(roomsQuery);

    if (!roomsQueryDoc.docs.length) throw new Error('room/room-not-found');

    const roomDoc = doc(db, 'rooms', roomsQueryDoc.docs[0].id);
    const { users: roomUsers, ...roomData } = (await getDoc(roomDoc)).data() as RoomCollection;

    const userDoc = doc(db, 'users', `${auth.currentUser?.uid}`);
    const { rooms, ...userData } = (await getDoc(userDoc)).data() as UserCollection;
    const currentRoom = {
      id: roomData.id,
      name: roomData.name,
      imageURL: roomData.imageURL,
      users: [{
        username: currentUser.username,
        userId: currentUser.uid,
        imageURL: currentUser.imageURL,
      }, ...roomUsers],
    } as RoomCollection;

    if (!rooms) {
      await setDoc(userDoc, {
        ...userData,
        rooms: [{ id, name: roomsQueryDoc.docs[0].data().name }],
      });
      await setDoc(roomDoc, {
        ...roomData,
        users: [{
          username: currentUser.username,
          userId: currentUser.uid,
          imageURL: currentUser.imageURL,
        }, ...roomUsers],
      });
      setCurrentRooms(currentRooms?.length ? [...currentRooms, currentRoom] : [currentRoom]);
      socket.emit('updateRoom', {
        ...roomData,
        users: [{
          username: currentUser.username,
          userId: currentUser.uid,
          imageURL: currentUser.imageURL,
        }, ...roomUsers],
      });
      return currentRoom;
    }

    if (rooms.some((room) => room.id === id)) throw new Error('room/room-already-entered');

    await setDoc(roomDoc, {
      ...roomData,
      users: [{
        username: currentUser.username,
        userId: currentUser.uid,
        imageURL: currentUser.imageURL,
      }, ...roomUsers],
    });
    await setDoc(userDoc, {
      ...userData,
      rooms: [{
        id,
        name: roomsQueryDoc.docs[0].data().name,
      }, ...rooms],
    });
    setCurrentRooms(currentRooms?.length ? [...currentRooms, currentRoom] : [currentRoom]);
    socket.emit('updateRoom', {
      ...roomData,
      users: [{
        username: currentUser.username,
        userId: currentUser.uid,
        imageURL: currentUser.imageURL,
      }, ...roomUsers],
    });
    return currentRoom;
  };

  const updateUserRooms = async (id: string): Promise<void> => {
    const roomsCollection = collection(db, 'rooms');
    const roomsQuery = query(roomsCollection, where('id', '==', id));
    const roomsQueryDoc = await getDocs(roomsQuery);

    const userDoc = doc(db, 'users', `${auth.currentUser?.uid}`);
    const { rooms, ...userData } = (await getDoc(userDoc)).data() as UserCollection;

    if (!rooms) {
      await setDoc(userDoc, {
        ...userData,
        rooms: [{ id, name: roomsQueryDoc.docs[0].data().name }],
      });
    }

    await setDoc(userDoc, {
      ...userData,
      rooms: [{
        id,
        name: roomsQueryDoc.docs[0].data().name,
        imageURL: currentUser.imageURL,
      }, ...rooms],
    });
  };

  const sendMessage = async (message: string, room: RoomCollection) => {
    const messagesDoc = doc(db, 'messages', room.id);
    const ress = (await getDoc(messagesDoc)).data() as MessageCollection;
    if (!ress) {
      await setDoc(messagesDoc, {
        roomName: room.name,
        roomId: room.id,
        createdAt: new Date().toISOString(),
        messages: [
          {
            id: auth.currentUser?.uid,
            username: currentUser.username,
            message,
            date: new Date().toISOString(),
          },
        ],
      });
      return;
    }
    const { messages, ...data } = ress;
    await setDoc(messagesDoc, {
      ...data,
      messages: [
        ...messages,
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
    const roomsCollection = await collection(db, 'rooms');
    const q = query(roomsCollection, where('id', '==', id));
    const res = await getDocs(q);

    if (res.docs.length) throw new Error('room/id-already-in-use');

    if (!img) {
      const createdRoom = await addDoc(roomsCollection, {
        id,
        name,
        imageURL: '',
        users: [
          {
            username: currentUser.username,
            userId: currentUser.uid,
            imageURL: currentUser.imageURL,
          },
        ],
      });
      const createdRoomData = (await getDoc(createdRoom)).data() as RoomCollection;
      await updateUserRooms(id);
      setCurrentRooms([...currentRooms as RoomCollection[], createdRoomData]);
      return createdRoomData;
    }

    const storage = getStorage();
    const storageRef = ref(storage, `room/${id}`);
    await uploadBytes(storageRef, img);
    const imageURL = await getDownloadURL(storageRef);
    const createdRoom = await addDoc(roomsCollection, {
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
    });
    const createdRoomData = (await getDoc(createdRoom)).data() as RoomCollection;
    await updateUserRooms(id);
    setCurrentRooms([...currentRooms as RoomCollection[], createdRoomData]);
    return createdRoomData;
  };

  const getMessages = async (roomId: string) => {
    const messagesCollection = await collection(db, 'messages');
    const q = await query(messagesCollection, where('roomId', '==', roomId));
    const res = (await getDocs(q)).docs[0].data();
    return res.messages;
  };

  const value = useMemo(() => ({
    createRoom,
    joinRoom,
    getUserRooms,
    sendMessage,
    getMessages,
    uploadImage,
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
