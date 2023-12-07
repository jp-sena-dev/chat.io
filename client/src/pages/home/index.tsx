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

  useEffect(() => {
    if (room && currentRooms) {
      setRoom((prevRoom) => (
        currentRooms.find((r) => r.id === (prevRoom as RoomCollection).id)
      ) as RoomCollection);
    }
  }, [currentRooms, room]);

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
    if (navScreen !== 'UpdateRoom') setBodyScreen('');
  }, [navScreen]);

  return (
    <Container component="main">
      <Box
        sx={{
          display: 'grid',
          gridTemplateRows: '10% 90%',
          height: '98vh',
          borderRadius: '14px',
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
            <Typography component="span" sx={{ fontWeight: 'bold', fontSize: '2rem', color: '#107E78' }}>.io</Typography>
          </Typography>
          <Box
            sx={{
              display: 'flex',
            }}
          >
            <Fab size="small" sx={{ m: 1, color: 'black' }} onClick={() => setNavScreen('userSettings')}>
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
            gridTemplateColumns: '25% 75%',
            height: '100%',
          }}
        >
          <>
            <ChatNav
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
