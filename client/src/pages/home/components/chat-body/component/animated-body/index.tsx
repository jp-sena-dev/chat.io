import { Box } from '@mui/material';
import { AnimatedElement } from '../../../../../../utils/animated-element';

interface AnimatedBodyProps {
  onScreen: boolean;
  children: JSX.Element;
}

export function AnimatedBody({ children, onScreen }: AnimatedBodyProps) {
  return (
    <AnimatedElement onScreen={onScreen} direction="left">
      <Box
        sx={{
          borderRight: '1px solid #efefef',
          borderBottom: '1px solid #efefef',
          borderBottomRightRadius: '14px',
          bgcolor: 'white',
          height: '100%',
          width: '100%',
        }}
      >
        {children}
      </Box>
    </AnimatedElement>
  );
}
