import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';

export const uploadImage = async (file: any, url: string): Promise<string> => {
  const storage = getStorage();
  const storageRef = ref(storage, url);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};
