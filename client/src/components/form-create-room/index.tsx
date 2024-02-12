import {
  Avatar,
  Box,
  TextField,
  Typography,
  styled,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import { useState } from 'react';
import { useRooms } from '../../contexts/rooms';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export function FormCreateRoom() {
  const { createRoom } = useRooms();
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [file, setFile] = useState('');
  const [prevImg, setPrevImg] = useState(null);
  const [requestError, serRequestError] = useState('');
  const [loading, setLoading] = useState(false);

  const HandelSubmit = async () => {
    setLoading(true);
    try {
      await createRoom(name, id, file);
      setName('');
      setId('');
      setFile('');
      setPrevImg(null);
      serRequestError('');
    } catch (e: any) {
      switch (e.message) {
        case 'room/id-already-in-use':
          serRequestError('Sorry, the room has already been created.');
          break;
        default:
          serRequestError('An internal error has occurred. Please try again later.');
          break;
      }
    }
    setLoading(false);
  };

  const handleChangeFile = (imgFile: any) => {
    setFile(imgFile);

    const reader = new FileReader();
    reader.readAsDataURL(imgFile);
    reader.onload = (e) => setPrevImg((e.target as any).result);
  };

  return (
    <Box
      component="form"
      onSubmit={(e) => { e.preventDefault(); HandelSubmit(); }}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        p: '12px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '18px',
        }}
      >
        <Box component="label">
          <Avatar
            src={prevImg || ''}
            sx={{
              width: '150px',
              height: '150px',
              margin: '12px auto 0',
              cursor: 'pointer',
            }}
          />
          <VisuallyHiddenInput type="file" onChange={({ target }) => handleChangeFile((target.files as any)[0])} />
        </Box>
        <div>
          <TextField
            required
            fullWidth
            margin="normal"
            label="Room name"
            variant="filled"
            value={name}
            onChange={({ target: { value } }) => setName(value)}
          />
          <TextField
            required
            fullWidth
            margin="normal"
            label="Room ID"
            variant="filled"
            value={id}
            onChange={({ target: { value } }) => setId(value)}
          />
          <Typography component="p" sx={{ color: 'red', textAlign: 'center', mt: '16px' }}>
            {requestError && requestError}
          </Typography>
          <LoadingButton
            loading={loading}
            type="submit"
            sx={{ width: '100%', mt: '16px' }}
            variant="contained"
            endIcon={<SendIcon />}
          >
            Send
          </LoadingButton>
        </div>
      </Box>
    </Box>
  );
}
