import { Box, Typography } from '@mui/material';
import { NavItem } from '../nav-Item';

interface NavRoomOptionsProps {
  setBodyScreen: (param: string) => void;
  bodyScreen: string;
}

export function NavRoomOptions({ setBodyScreen, bodyScreen }: NavRoomOptionsProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <NavItem
        selected={bodyScreen === 'settingsCreateRoom'}
        setBodyScreen={() => setBodyScreen('settingsCreateRoom')}
      >
        <Typography sx={{ fontSize: '2rem', fontWeight: 'bold' }}>Create</Typography>
      </NavItem>
      <NavItem
        selected={bodyScreen === 'settingsJoinRoom'}
        setBodyScreen={() => setBodyScreen('settingsJoinRoom')}
      >
        <Typography sx={{ fontSize: '2rem', fontWeight: 'bold' }}>Join</Typography>
      </NavItem>
    </Box>
  );
}
