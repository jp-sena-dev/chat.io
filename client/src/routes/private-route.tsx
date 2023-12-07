import {
  Navigate, Outlet,
} from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';

export default function PrivateRoute() {
  const { currentUser } = useAuth();

  return !currentUser ? <Navigate to="/login" /> : <Outlet />;
}
