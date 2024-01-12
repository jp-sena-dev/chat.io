import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';

export default function PublicRoute() {
  const { currentUser } = useAuth();
  return !currentUser ? <Outlet /> : <Navigate to="/" />;
}
