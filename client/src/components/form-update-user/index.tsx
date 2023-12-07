import {
  Avatar, Box, Button, IconButton, TextField, styled,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SaveIcon from '@mui/icons-material/Save';
import { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { useAuth } from '../../contexts/auth-context';

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

export default function FormUpdateUser() {
  const { currentUser, uploadImage, updateUsername } = useAuth();
  const [username, setUsername] = useState(currentUser.username);
  const [loading, setLoading] = useState(false);
  const [prevImg, setPrevImg] = useState(null);
  const [file, setFile] = useState(null);

  const handleChangeImage = async (imgFile: any) => {
    const reader = new FileReader();
    setFile(imgFile);
    reader.readAsDataURL(imgFile);
    reader.onload = (e) => setPrevImg((e.target as any).result);
  };

  const HandleChangeSubmit = async () => {
    setLoading(true);
    if (username !== currentUser.username) await updateUsername(username);
    if (file) await uploadImage(file, currentUser.uid);
    setLoading(false);
  };

  return (
    <Box
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
        <IconButton
          sx={{
            borderRadius: '50%',
            width: '150px',
            height: '150px',
            margin: '0 auto',
            backgroundImage: `url(${prevImg || currentUser.imageURL})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
          component="label"
        >
          <VisuallyHiddenInput type="file" onChange={({ target }) => handleChangeImage((target.files as any)[0])} />
        </IconButton>
        <div>
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            variant="filled"
            value={username}
            onChange={({ target: { value } }) => setUsername(value)}
          />
          {/* <Typography component="p" sx={{ color: 'red', textAlign: 'center', mt: '16px' }}>
            requestError
          </Typography> */}
          <LoadingButton
            size="medium"
            onClick={HandleChangeSubmit}
            loading={loading}
            loadingPosition="end"
            type="submit"
            sx={{ width: '100%', mt: '16px' }}
            endIcon={<SaveIcon />}
            variant="contained"
          >
            <span>Send</span>
          </LoadingButton>
        </div>
      </Box>
    </Box>
  );
}