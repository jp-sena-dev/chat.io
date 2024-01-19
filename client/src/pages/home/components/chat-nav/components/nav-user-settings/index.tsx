import { Box, Typography } from '@mui/material';
import { NavItem } from '../nav-Item';
import { useAuth } from '../../../../../../contexts/auth-context';

interface NavUserSettingsProps {
  setBodyScreen: (param: string) => void;
  bodyScreen: string;
}

export function NavUserSettings({ setBodyScreen, bodyScreen }: NavUserSettingsProps) {
  const { logout } = useAuth();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '95%',
        justifyContent: 'space-between',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <NavItem
          selected={bodyScreen === 'userProfileSettings'}
          setBodyScreen={() => setBodyScreen('userProfileSettings')}
        >
          <Typography sx={{ fontSize: '2rem', fontWeight: 'bold' }}>User</Typography>
        </NavItem>
        <NavItem
          selected={bodyScreen === 'about'}
          setBodyScreen={() => setBodyScreen('about')}
        >
          <Typography sx={{ fontSize: '2rem', fontWeight: 'bold' }}>About</Typography>
        </NavItem>
      </Box>
      <NavItem
        selected={false}
        setBodyScreen={() => logout()}
      >
        <Typography sx={{ fontSize: '2rem', fontWeight: 'bold' }}>Logout</Typography>
      </NavItem>
    </Box>
  );
}
