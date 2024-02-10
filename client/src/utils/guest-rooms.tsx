import { RoomCollection, RoomInUserType } from '../contexts/rooms';

const guestUser: RoomInUserType = {
  imageURL: '',
  userId: 'guest',
  username: 'guest',
};

export const guetRooms: RoomCollection[] = [
  {
    id: 'movie',
    name: 'Movie',
    users: [guestUser, guestUser, guestUser],
  },
  {
    id: 'sport',
    name: 'Sport',
    users: [guestUser, guestUser, guestUser],
  },
  {
    id: 'technology',
    name: 'Technology',
    users: [guestUser, guestUser, guestUser],
  },
  {
    id: 'music',
    name: 'Music',
    users: [guestUser, guestUser, guestUser],
  },
  {
    id: 'memes',
    name: 'Memes',
    users: [guestUser, guestUser, guestUser],
  },
];
