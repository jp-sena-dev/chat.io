import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Slide,
  TextField,
  Typography,
} from '@mui/material';
import { usePassword } from '../../hooks/passworld';
import { useAuth } from '../../contexts/auth-context';
import { useDoublePassword } from '../../hooks/double-password';
import { useEmail } from '../../hooks/email';

export default function Login() {
  const {
    password: doublePassword,
    confirmPassword: confirmDoublePassword,
    setPassword: setPasswordDoublePassword,
    setConfirmPassword: setConfirmDoublePassword,
    passwordIsValid: doublePasswordIsValid,
    confirmPasswordIsValid: confirmDoublePasswordIsValid,
  } = useDoublePassword();
  const [username, setUsername] = useState('');
  const { email, setEmail, isValid: emailIsValid } = useEmail();
  const { password, setPassword } = usePassword();
  const { login, signup } = useAuth();
  const [IsOnSignupScreen, setIsOnSignupScreen] = useState(true);
  const [requestError, serRequestError] = useState('');

  const resetInfos = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    serRequestError('');
    setConfirmDoublePassword('');
    setPasswordDoublePassword('');
  };

  const handleChangeScreen = () => {
    resetInfos();
    setIsOnSignupScreen(!IsOnSignupScreen);
  };

  const handleSignup = async () => {
    if (username.length && doublePassword.length && emailIsValid && confirmDoublePasswordIsValid) {
      try {
        await signup(email, doublePassword, username);
      } catch (e) {
        switch (e.message) {
          case 'auth/email-already-in-use':
            serRequestError('The email address is already in use by another account.');
            break;
          case 'auth/too-many-requests':
            serRequestError('Your account has been temporarily locked due to multiple unsuccessful login attempts. Please wait and try again."');
            break;
          default:
            serRequestError('An internal error has occurred. Please try again later');
            break;
        }
      }
    }
  };

  const handleLogin = async () => {
    if (email.length) {
      try {
        await login(email, password);
      } catch (e) {
        switch (e.message) {
          case 'auth/invalid-login-credentials':
            serRequestError('Invalid email or password. Please make sure you have entered the correct credentials.');
            break;
          case 'auth/too-many-requests':
            serRequestError('Your account has been temporarily locked due to multiple unsuccessful login attempts. Please wait and try again."');
            break;
          default:
            serRequestError('An internal error has occurred. Please try again later');
            break;
        }
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{ mt: 4 }}
      >
        <Slide direction="right" hidden={!IsOnSignupScreen} in={IsOnSignupScreen}>
          <Box
            component="form"
            onSubmit={(e) => { e.preventDefault(); handleLogin(); }}
            noValidate
          >
            <Typography component="h1" variant="h4">
              Login
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <TextField
                required
                margin="normal"
                fullWidth
                error={email.length ? !emailIsValid : false}
                helperText="example@gmail.com"
                label="E-mail"
                variant="outlined"
                value={email}
                onChange={({ target: { value } }) => setEmail(value)}
                autoComplete="email"
              />
              <TextField
                required
                margin="normal"
                fullWidth
                type="password"
                label="Passowrd"
                autoComplete="current-password"
                variant="outlined"
                value={password}
                onChange={({ target: { value } }) => setPassword(value)}
              />
            </Box>
            {requestError && (
              <Typography component="p" sx={{ color: 'red', textAlign: 'center', mt: 1 }}>
                {`*${requestError}`}
              </Typography>
            )}
            <Typography component="p" sx={{ display: 'flex', alignItems: 'center' }}>
              Don&#39;t have an account?
              <Button onClick={handleChangeScreen}>Register</Button>
            </Typography>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mb: 2, mt: 2 }}
            >
              Login
            </Button>
          </Box>
        </Slide>
        <Slide direction="right" hidden={IsOnSignupScreen} in={!IsOnSignupScreen}>
          <Box
            component="form"
            onSubmit={(e) => { e.preventDefault(); handleSignup(); }}
          >
            <Typography component="h1" variant="h4">
              Sign up
            </Typography>
            <Box>
              <TextField
                error={email.length ? !emailIsValid : false}
                margin="normal"
                fullWidth
                helperText="example@gmail.com"
                label="E-mail"
                variant="outlined"
                autoComplete="email"
                value={email}
                onChange={({ target: { value } }) => setEmail(value)}
              />
              <TextField
                error={doublePassword.length ? !doublePasswordIsValid : false}
                margin="normal"
                fullWidth
                type="password"
                helperText="6+ characters"
                label="Passowrd"
                variant="outlined"
                value={doublePassword}
                onChange={({ target: { value } }) => setPasswordDoublePassword(value)}
              />
              <TextField
                error={confirmDoublePassword.length ? !confirmDoublePasswordIsValid : false}
                margin="normal"
                fullWidth
                type="password"
                helperText="passwords must be the same."
                label="Confirm passowrd"
                variant="outlined"
                value={confirmDoublePassword}
                onChange={({ target: { value } }) => setConfirmDoublePassword(value)}
              />
              <TextField
                label="Username"
                margin="normal"
                required
                fullWidth
                variant="outlined"
                value={username}
                onChange={({ target: { value } }) => setUsername(value)}
              />
            </Box>
            {requestError && (
              <Typography component="p" sx={{ color: 'red', textAlign: 'center', mt: 1 }}>
                {`*${requestError}`}
              </Typography>
            )}
            <Typography component="p" sx={{ display: 'flex', alignItems: 'center' }}>
              Have an account?
              <Button onClick={handleChangeScreen}>Login</Button>
            </Typography>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign up
            </Button>
          </Box>
        </Slide>
      </Box>
    </Container>
  );
}
