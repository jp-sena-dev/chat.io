import { io } from 'socket.io-client';
import AppRoutes from './routes';
import GlobalStyle from './styles/global';
import UseAuthContext from './contexts/auth-context';

export const socket = io(import.meta.env.VITE_SERVER_URL as string, { transports: ['websocket'] });

export default function App() {
  return (
    <UseAuthContext>
      <>
        <AppRoutes />
        <GlobalStyle />
      </>
    </UseAuthContext>
  );
}
