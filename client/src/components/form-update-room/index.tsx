import { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  IconButton,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { RoomCollection, useRooms } from '../../contexts/rooms';

interface FormUpdateRoomProps {
  room: RoomCollection;
  handleChangeClose: () => void;
  handleChangeName: (id: string, name: string) => void;
}

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

export function FormUpdateRoom({
  room,
  handleChangeClose,
  handleChangeName,
}: FormUpdateRoomProps) {
  const { uploadImage, updateRoomName, exitRoom } = useRooms();
  const [nameRoom, setNameRoom] = useState(!room.name ? '' : room.name);
  const [loading, setLoading] = useState(false);
  const [prevImg, setPrevImg] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    setPrevImg(null);
    setNameRoom(!room.name ? '' : room.name);
  }, [room.id, room.name]);

  const handleChangeImg = async (imgFile: any) => {
    setFile(imgFile);
    const reader = new FileReader();
    reader.readAsDataURL(imgFile);
    reader.onload = (e) => setPrevImg((e.target as any).result);
  };

  const HandleChangeSubmit = async () => {
    if (nameRoom !== room.name || file) {
      setLoading(true);
      if (nameRoom !== room.name) {
        await updateRoomName(nameRoom, room.id).then(() => {
          handleChangeName(nameRoom, room.id);
          setLoading(false);
        });
      }
      if (file) await uploadImage(file, room.id).then(() => setLoading(false));
    }
  };

  useEffect(() => {
    handleChangeClose();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room.id]);

  return (
    <Box
      component="form"
      onSubmit={(e) => e.preventDefault()}
      sx={{
        transition: '0.5s',
        height: '100%',
        minWidth: '300px',
        maxWidth: '350px',
        display: 'flex',
        margin: '0 auto',
        flexDirection: 'column',
        bgcolor: 'white',
        gap: '8px',
      }}
    >
      <IconButton
        onClick={handleChangeClose}
        sx={{
          position: 'absolute',
          right: 0,
          top: 0,
        }}
      >
        <CloseIcon sx={{ fontSize: '2rem' }} />
      </IconButton>
      <Box component="label">
        <Avatar
          src={prevImg || room.imageURL}
          sx={{
            width: '150px',
            height: '150px',
            margin: '12px auto 0',
            cursor: 'pointer',
          }}
        />
        <VisuallyHiddenInput type="file" onChange={({ target }) => handleChangeImg((target.files as any)[0])} />
      </Box>
      <TextField
        fullWidth
        margin="normal"
        label="Room Name"
        variant="filled"
        value={nameRoom}
        onChange={({ target: { value } }) => setNameRoom(value)}
      />
      <LoadingButton
        size="medium"
        onClick={HandleChangeSubmit}
        loading={loading}
        loadingPosition="end"
        type="submit"
        sx={{ width: '100%' }}
        endIcon={<SendIcon />}
        variant="contained"
      >
        <span>Send</span>
      </LoadingButton>
      <Box sx={{
        mt: '24px',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
      }}
      >
        <Typography sx={{ mb: '4px', fontWeight: 'bold' }}>
          Members:
          {' '}
          {room.users && room.users.length}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {room.users && room.users.map((e) => (
            <Paper
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '200px',
                height: '50px',
                p: '12px',
                bgcolor: '#EFEFEF',
              }}
            >
              <Avatar src={e.imageURL} />
              <Typography>{e.username}</Typography>
            </Paper>
          ))}
        </Box>
      </Box>
      <IconButton
        onClick={() => exitRoom(room.id)}
        sx={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          color: 'red',
        }}
      >
        <LogoutIcon sx={{ fontSize: '2rem' }} />
      </IconButton>
    </Box>
  );
}
