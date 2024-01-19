import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
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
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { auth, db } from '../firebase-config';

interface AuthProviderProps {
  children: JSX.Element;
}

interface UserRoomType {
  id: string;
  name: string;
}

interface UserType {
  imageURL: string;
  uid: string;
  username: string;
  email: string;
  rooms?: UserRoomType[];
}

interface AuthProviderType {
  signup: (email: string, password: string, name: string) => void;
  login: (email: string, password: string) => void;
  logout: () => void;
  uploadImage: (param: any, userId: string) => Promise<void>;
  updateUsername: (param: string) => Promise<void>
  currentUser: UserType;
}

const UseAuthContext = React.createContext<AuthProviderType | null>(null);
export const useAuth = () => useContext(UseAuthContext) as AuthProviderType;

export default function UserApiProvider({ children }: AuthProviderProps) {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  const uploadImage = async (file: any, userId: string) => {
    const storage = getStorage();
    const storageRef = ref(storage, `users/${userId}`);
    await uploadBytes(storageRef, file);
    const imageURL = await getDownloadURL(storageRef);
    const userDoc = await doc(db, 'users', `${userId}`);
    const { ...userData } = (await getDoc(userDoc)).data();
    await setDoc(userDoc, {
      ...userData,
      imageURL,
    });
    if (currentUser?.rooms) {
      const roomsCollection = collection(db, 'rooms');
      const RoomsQuery = query(roomsCollection, where('id', 'in', currentUser?.rooms.map((room) => room.id)));
      const RoomsDocs = await getDocs(RoomsQuery);
      RoomsDocs.docs.forEach((currentUserDoc) => {
        const roomData = currentUserDoc.data();
        const roomdDoc = doc(db, 'rooms', currentUserDoc.id);
        setDoc(roomdDoc, {
          ...roomData,
          users: roomData.users.map((userRoomInformation: any) => (
            userRoomInformation.userId === currentUser?.uid
              ? { ...userRoomInformation, imageURL }
              : userRoomInformation
          )),
        });
      });
    }
    setCurrentUser({ ...currentUser, imageURL } as UserType);
  };

  const updateCurrentUser = async (user: any) => {
    const userDoc = await doc(db, 'users', `${user.uid}`);
    const { username, imageURL, rooms } = (await getDoc(userDoc)).data() as UserType;
    setCurrentUser({
      ...user,
      username,
      imageURL,
      rooms,
    });
  };

  const updateUsername = async (username: string) => {
    const userDoc = doc(db, 'users', `${(currentUser as UserType).uid}`);
    const userData = (await getDoc(userDoc)).data() as UserType;
    setDoc(userDoc, {
      ...userData,
      username,
    });
    if (currentUser?.rooms) {
      const roomsCollection = collection(db, 'rooms');
      const RoomsQuery = query(roomsCollection, where('id', 'in', currentUser?.rooms.map((room) => room.id)));
      const RoomsDocs = await getDocs(RoomsQuery);
      RoomsDocs.docs.forEach((currentUserDoc) => {
        const roomData = currentUserDoc.data();
        const roomdDoc = doc(db, 'rooms', currentUserDoc.id);
        setDoc(roomdDoc, {
          ...roomData,
          users: roomData.users.map((userRoomInformation: any) => (
            userRoomInformation.userId === currentUser?.uid
              ? { ...userRoomInformation, username }
              : userRoomInformation
          )),
        });
      });
    }
    setCurrentUser({ ...currentUser, username } as UserType);
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (user: any) => {
      if (user) await updateCurrentUser(user);
      setLoading(false);
    });
  }, []);

  const signup = async (email: string, password: string, username: string) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      const userDoc = doc(db, 'users', `${user.uid}`);
      setDoc(userDoc, {
        username,
        rooms: [],
        imageURL: '',
        userId: user.uid,
      });
    } catch ({ code }: any) {
      throw new Error(code);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      updateCurrentUser(user);
    } catch ({ code }: any) {
      throw new Error(code);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
  };

  const value = useMemo(() => ({
    signup,
    login,
    uploadImage,
    updateUsername,
    logout,
    currentUser,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [currentUser]);

  return (
    <UseAuthContext.Provider value={value as AuthProviderType}>
      { !loading && children }
    </UseAuthContext.Provider>
  );
}
