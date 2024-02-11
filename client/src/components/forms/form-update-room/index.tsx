import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import { LoadingButton } from '@mui/lab';
import { RoomCollection, useRooms } from '../../../contexts/rooms';
import { useAuth } from '../../../contexts/auth-context';
import { useDialog } from '../../../contexts/dialog';
import { InputAvatar } from '../components/input-avatar';
import { RoomParticipants } from './components/room-participants/room-participants';

interface FormUpdateRoomProps {
  room: RoomCollection;
  handleChangeClose: () => void;
  handleChangeName: (id: string, name: string) => void;
}

export function FormUpdateRoom({
  room,
  handleChangeClose,
  handleChangeName,
}: FormUpdateRoomProps) {
  const { updateRoomImage, updateRoomName, exitRoom } = useRooms();
  const { currentUser } = useAuth();
  const { dialogNeedsLogin } = useDialog();
  const [nameRoom, setNameRoom] = useState(!room.name ? '' : room.name);
  const [loading, setLoading] = useState(false);
  const [prevImg, setPrevImage] = useState<null | string>(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    setPrevImage(null);
    setNameRoom(!room.name ? '' : room.name);
  }, [room.id, room.name]);

  const HandleChangeSubmit = async () => {
    if (nameRoom !== room.name || file) {
      setLoading(true);
      if (nameRoom !== room.name) {
        await updateRoomName(nameRoom, room.id).then(() => {
          handleChangeName(nameRoom, room.id);
          setLoading(false);
        });
      }
      if (file) await updateRoomImage(file, room.id).then(() => setLoading(false));
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
      <InputAvatar
        imageURL={prevImg || room.imageURL}
        setPrevImage={setPrevImage}
        setFile={setFile}
      />
      <Typography sx={{ fontWeight: 'bold', textAlign: 'center' }}>
        Room ID:
        {' '}
        <Button size="small" onClick={() => navigator.clipboard.writeText(room.id)}>
          {room.id}
        </Button>
      </Typography>
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
        onClick={() => (currentUser.isAnonymous ? dialogNeedsLogin() : HandleChangeSubmit())}
        loading={loading}
        loadingPosition="end"
        type="submit"
        sx={{ width: '100%' }}
        endIcon={<SaveIcon />}
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
          {room.users && room.users.map((userInRoom) => (
            <RoomParticipants avatar={userInRoom.imageURL} username={userInRoom.username} />
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
        {!currentUser.isAnonymous && (
          <LogoutIcon sx={{ fontSize: '2rem' }} />
        )}
      </IconButton>
    </Box>
  );
}
