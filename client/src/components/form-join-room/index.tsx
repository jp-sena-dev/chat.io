import {
  Box, TextField, Typography,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { useRooms } from '../../contexts/rooms';

export function FormJoinRoom() {
  const { joinRoom } = useRooms();
  const [roomId, setRoomId] = useState('');
  const [requestError, serRequestError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangeJoinRoom = async () => {
    if (roomId.length) {
      setLoading(true);
      try {
        await joinRoom(roomId);
        setRoomId('');
      } catch (e: any) {
        switch (e.message) {
          case 'room/room-already-entered':
            serRequestError('Great! You have already entered the room.');
            break;
          case 'room/room-not-found':
            serRequestError('Sorry, room not found.');
            break;
          default:
            serRequestError('An internal error has occurred. Please try again later.');
            break;
        }
      }
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={(e) => { e.preventDefault(); handleChangeJoinRoom(); }}
      sx={{ height: '100%', p: '12px' }}
    >
      <Box maxWidth="sm" sx={{ m: '38px auto 0' }}>
        <TextField
          required
          fullWidth
          label="Room ID"
          variant="filled"
          value={roomId}
          onChange={({ target: { value } }) => setRoomId(value)}
        />
        <Typography component="p" sx={{ color: 'red', textAlign: 'center', mt: 1 }}>
          {requestError && requestError}
        </Typography>
        <LoadingButton
          loading={loading}
          type="submit"
          sx={{ width: '100%', mt: '16px' }}
          variant="contained"
          endIcon={<SendIcon />}
        >
          Join
        </LoadingButton>
      </Box>
    </Box>
  );
}
