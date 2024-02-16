import { io } from 'socket.io-client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AppRoutes from './routes';
import GlobalStyle from './styles/global';
import UseAuthContext from './contexts/auth-context';

export const socket = io(import.meta.env.VITE_SERVER_URL as string, { transports: ['websocket'] });

const theme = createTheme({
  palette: {
    primary: {
      light: '#18B8B0',
      main: '#107E78',
      dark: '#0B524F',
      contrastText: '#EFEFEF',
    },
  },
});

export default function App() {
  return (
    <UseAuthContext>
      <ThemeProvider theme={theme}>
        <AppRoutes />
        <GlobalStyle />
      </ThemeProvider>
    </UseAuthContext>
  );
}
