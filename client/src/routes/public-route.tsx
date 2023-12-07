import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';

export default function PublicRoute() {
  const { currentUser } = useAuth();
  console.log(currentUser);
  return !currentUser ? <Outlet /> : <Navigate to="/" />;
}
