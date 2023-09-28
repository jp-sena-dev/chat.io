import { Route, Routes } from 'react-router-dom';
import Login from '../pages/login';
import Room from '../pages/room';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="room/:username/:room" element={<Room />} />
      <Route path="login" element={<Login />} />
    </Routes>
  );
}
