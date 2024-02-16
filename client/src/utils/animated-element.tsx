import { Box } from '@mui/material';

interface AnimatedElementProps {
  children: JSX.Element;
  onScreen: boolean;
  direction: 'left' | 'right',
}

export function AnimatedElement({ children, onScreen, direction }: AnimatedElementProps) {
  return (
    <Box
      sx={{
        position: 'absolute',
        transition: '0.5s',
        left: onScreen ? 0 : `${direction === 'right' ? '-100%' : '100%'}`,
        top: 0,
        bgcolor: '#efefef',
        height: '100%',
        width: '100%',
        zIndex: 2,
      }}
    >
      {children}
    </Box>
  );
}
