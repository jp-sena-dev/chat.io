import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
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
import { RoomCollection, RoomInUserType } from './rooms';
import { uploadImage } from '../services/upload-image';

interface AuthProviderProps {
  children: JSX.Element;
}

// export interface UserInRoomType {
//   id: string;
//   name: string;
//   imageURL?: string;
// }

interface UserInDatabase {
  imageURL: string;
  uid: string;
  username: string;
  rooms?: RoomCollection[];
}

type UserType = User & UserInDatabase;

interface AuthProviderType {
  signup: (email: string, password: string, name: string) => Promise<void>;
  signInGuest: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserImage: (param: any, uid: string) => Promise<void>;
  updateUsername: (param: string) => Promise<void>;
  updateUserInDatabase: (updateInfo: Partial<UserInDatabase>) => Promise<void>;
  currentUser: UserType;
}

const UseAuthContext = React.createContext<AuthProviderType | null>(null);
export const useAuth = () => useContext(UseAuthContext) as AuthProviderType;

export default function UserApiProvider({ children }: AuthProviderProps) {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  const updateUserInRooms = async (rooms: RoomCollection[], user: Partial<RoomInUserType>) => {
    const roomsCollection = collection(db, 'rooms');
    const roomsDocs = await getDocs(query(roomsCollection, where('id', 'in', rooms.map((room) => room.id))));
    roomsDocs.docs.forEach((roomDoc) => {
      const roomData = roomDoc.data();
      setDoc(doc(db, 'rooms', roomDoc.id), {
        ...roomData,
        users: roomData.users.map((roomUser: RoomInUserType) => (
          roomUser.userId === currentUser?.uid
            ? { ...roomUser, ...user }
            : roomUser
        )),
      });
    });
    setCurrentUser({ ...currentUser, ...user } as UserType);
  };

  const updateUserInDatabase = async (updateInfo: Partial<UserInDatabase>): Promise<void> => {
    const userDoc = doc(db, 'users', `${currentUser?.uid}`);
    const userData = (await getDoc(userDoc)).data();
    await setDoc(userDoc, {
      ...userData,
      ...updateInfo,
    });
  };

  const updateUserImage = async (file: any): Promise<void> => {
    const imageURL = await uploadImage(file, `users/${currentUser?.uid}`);
    await updateUserInDatabase({ imageURL });

    if (currentUser?.rooms) await updateUserInRooms(currentUser.rooms, { imageURL });

    setCurrentUser({ ...currentUser, imageURL } as UserType);
  };

  const updateCurrentUser = async (user: User): Promise<void> => {
    if (!user.isAnonymous) {
      const { username, imageURL, rooms } = (await getDoc(doc(db, 'users', user.uid))).data() as UserType;
      setCurrentUser({
        ...user,
        username,
        imageURL,
        rooms,
      } as UserType);
    } else {
      setCurrentUser({
        ...user,
        imageURL: '',
        username: 'guest',
        rooms: [],
      } as UserType);
    }
  };

  const updateUsername = async (username: string): Promise<void> => {
    setCurrentUser({ ...currentUser as UserType, username });
    await updateUserInDatabase({ username });
    if (currentUser?.rooms) await updateUserInRooms(currentUser.rooms, { username });
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (user: User | null) => {
      if (user) await updateCurrentUser(user);
      setLoading(false);
    });
  }, []);

  const signInGuest = async (): Promise<void> => {
    await signInAnonymously(auth);
  };

  const signup = async (email: string, password: string, username: string): Promise<void> => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      setDoc(doc(db, 'users', `${user.uid}`), {
        username,
        rooms: [],
        imageURL: '',
        uid: user.uid,
      });
    } catch ({ code }: any) {
      throw new Error(code);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      updateCurrentUser(user);
    } catch ({ code }: any) {
      throw new Error(code);
    }
  };

  const logout = async (): Promise<void> => {
    await signOut(auth);
    setCurrentUser(null);
  };

  const value = useMemo(() => ({
    signup,
    login,
    updateUserImage,
    updateUsername,
    logout,
    signInGuest,
    updateUserInDatabase,
    currentUser,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [currentUser]);

  return (
    <UseAuthContext.Provider value={value as AuthProviderType}>
      { !loading && children }
    </UseAuthContext.Provider>
  );
}
