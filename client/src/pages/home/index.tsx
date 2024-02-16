import { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Container,
  Fab,
  Typography,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { RoomCollection, useRooms } from '../../contexts/rooms';
import { useAuth } from '../../contexts/auth-context';
import { ChatBody } from './components/chat-body';
import { ChatNav } from './components/chat-nav';

export default function Home() {
  const { currentRooms } = useRooms();
  const [prevCurrentRooms, setPrevCurrentRooms] = useState(currentRooms);
  const { currentUser } = useAuth();
  const [room, setRoom] = useState<RoomCollection | null>(null);
  const [navScreen, setNavScreen] = useState('');
  const [bodyScreen, setBodyScreen] = useState('');
  const [isBodyOrNav, setIsBodyOrNav] = useState<'nav' | 'body'>('nav');

  useEffect(() => {
    if (room && currentRooms && !currentUser.isAnonymous) {
      setRoom((prevRoom) => (
        currentRooms.find(({ id }) => id === (prevRoom as RoomCollection).id)
      ) as RoomCollection);
    }
  }, [currentRooms, room, currentUser]);

  useEffect(() => {
    if (prevCurrentRooms.length > currentRooms.length) {
      setNavScreen('');
      setRoom(null);
    } else if (prevCurrentRooms.length < currentRooms.length) {
      setNavScreen('');
      setRoom(currentRooms[prevCurrentRooms.length]);
    }
    setPrevCurrentRooms(currentRooms);
  }, [currentRooms, prevCurrentRooms]);

  useEffect(() => {
    if (navScreen !== 'UpdateRoom' && navScreen !== 'userSettings') {
      setBodyScreen('');
    }
    setIsBodyOrNav(navScreen || !room ? 'nav' : 'body');
  }, [navScreen, room]);

  useEffect(() => {
    if (!bodyScreen && !room) {
      setIsBodyOrNav('nav');
    } else {
      setIsBodyOrNav(bodyScreen || room ? 'body' : 'nav');
    }
  }, [bodyScreen, room]);

  if (!currentUser.username) return <div>aaa</div>;

  return (
    <Container
      component="main"
      sx={{
        '@media (max-width:768px)': {
          padding: 0,
        },
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateRows: '10% 90%',
          height: '98vh',
          borderRadius: '14px',
          '@media (max-width:768px)': {
            height: '100vh',
          },
        }}
      >
        <Box
          component="header"
          sx={{
            padding: '0 12px',
            display: 'flex',
            alignItems: 'center',
            bgcolor: '#efefef',
            borderRadius: '14px 14px 0 0',
            justifyContent: 'space-between',
          }}
        >
          <Typography component="h1" sx={{ fontWeight: 'bold' }} variant="h4">
            Chat
            <Typography component="span" color="primary" sx={{ fontWeight: 'bold', fontSize: '2rem' }}>.io</Typography>
          </Typography>
          <Box
            sx={{
              display: 'flex',
            }}
          >
            <Fab size="small" sx={{ m: 1, color: 'black' }} onClick={() => { setNavScreen('userSettings'); setIsBodyOrNav('nav'); }}>
              <SettingsIcon />
            </Fab>
            <Fab size="small" sx={{ m: 1, mr: 0, color: 'black' }} onClick={() => { setNavScreen('userSettings'); setBodyScreen('userProfileSettings'); }}>
              <Avatar
                src={currentUser.imageURL}
                sx={{ bgcolor: '.secondarymain' }}
              />
            </Fab>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'grid',
            '@media (max-width:530px)': {
              gridTemplateColumns: '100%',
              gridTemplateRows: '100%',
            },
            '@media (min-width:530px)': {
              gridTemplateColumns: '25% 75%',
              gridTemplateRows: '100%',
            },
            height: '100%',
          }}
        >
          <>
            <ChatNav
              hidden={isBodyOrNav !== 'nav'}
              bodyScreen={bodyScreen}
              currentRoom={room}
              navScreen={navScreen}
              setBodyScreen={setBodyScreen}
              setNavScreen={setNavScreen}
              setCurrentRoom={setRoom}
              userRooms={currentRooms}
            />
            <ChatBody
              bodyScreen={bodyScreen}
              resetCurrentRoom={() => setRoom(null)}
              room={room}
              username={currentUser.username}
              setBodyScreen={setBodyScreen}
              handleChangeName={() => {}}
            />
          </>
        </Box>
      </Box>
    </Container>
  );
}
