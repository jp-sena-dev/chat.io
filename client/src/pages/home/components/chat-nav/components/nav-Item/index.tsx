import { IconButton } from '@mui/material';

interface NavRoomOptionsProps {
  setBodyScreen: () => void;
  children: JSX.Element;
  selected: boolean;
}

export function NavItem({ setBodyScreen, children, selected }: NavRoomOptionsProps) {
  return (
    <IconButton
      onClick={setBodyScreen}
      sx={{
        width: 'calc(100% - 8px)',
        border: 0,
        textAlign: 'left',
        cursor: 'pointer',
        p: '12px',
        borderRadius: '16px',
        m: '0 4px',
        color: 'black',
        bgcolor: selected ? '#d7d6d6' : 'transparent',
      }}
    >
      {children}
    </IconButton>
  );
}
