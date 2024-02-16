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
    imageURL: '/rooms/movies.jpg',
    users: [guestUser, guestUser, guestUser],
  },
  {
    id: 'sport',
    name: 'Sport',
    imageURL: 'rooms/sports.jpg',
    users: [guestUser, guestUser, guestUser],
  },
  {
    id: 'technology',
    name: 'Technology',
    imageURL: 'rooms/technology.jpg',
    users: [guestUser, guestUser, guestUser],
  },
  {
    id: 'music',
    name: 'Music',
    imageURL: 'rooms/music.jpg',
    users: [guestUser, guestUser, guestUser],
  },
  {
    id: 'memes',
    name: 'Memes',
    imageURL: 'rooms/memes.jpg',
    users: [guestUser, guestUser, guestUser],
  },
];
