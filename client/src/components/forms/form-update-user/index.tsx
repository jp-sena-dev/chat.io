import { Box, TextField } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { useAuth } from '../../../contexts/auth-context';
import { useDialog } from '../../../contexts/dialog';
import { InputAvatar } from '../components/input-avatar';

export default function FormUpdateUser() {
  const { currentUser, updateUserImage, updateUsername } = useAuth();
  const { dialogNeedsLogin } = useDialog();
  const [username, setUsername] = useState(currentUser.username);
  const [loading, setLoading] = useState(false);
  const [prevImage, setPrevImage] = useState(null);
  const [file, setFile] = useState(null);

  const HandleChangeSubmit = async () => {
    if (!currentUser.isAnonymous) {
      setLoading(true);
      if (username !== currentUser.username) await updateUsername(username);
      if (file) await updateUserImage(file);
      setLoading(false);
    } else {
      dialogNeedsLogin();
    }
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
        <InputAvatar
          imageURL={prevImage || currentUser.imageURL}
          setPrevImage={setPrevImage}
          setFile={setFile}
        />
        <div>
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            variant="filled"
            value={username}
            onChange={({ target: { value } }) => setUsername(value)}
          />
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
