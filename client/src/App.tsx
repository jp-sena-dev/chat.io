import AppRoutes from './routes';
import GlobalStyle from './styles/global';
import UseAuthContext from './contexts/auth-context';

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
