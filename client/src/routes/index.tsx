import { Route, Routes } from 'react-router-dom';
import Login from '../pages/login';
import Home from '../pages/home';
import PrivateRoute from './private-route';
import PublicRoute from './public-route';
import RoomsApiProvider from '../contexts/rooms';
import DialogProvider from '../contexts/dialog';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute />}>
        <Route path="login" element={<Login />} />
      </Route>
      <Route path="/" element={<PrivateRoute />}>
        <Route
          index
          element={(
            <RoomsApiProvider>
              <DialogProvider>
                <Home />
              </DialogProvider>
            </RoomsApiProvider>
          )}
        />
      </Route>
    </Routes>
  );
}
