import { Route, Routes } from 'react-router-dom';
import Login from '../pages/login';
import Home from '../pages/home';
import PrivateRoute from './private-route';
import PublicRoute from './public-route';
import RoomsApiProvider from '../contexts/rooms';

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
              <Home />
            </RoomsApiProvider>
          )}
        />
      </Route>
    </Routes>
  );
}
