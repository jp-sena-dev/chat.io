import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ItemLogin,
  SDesctiprionInput,
  SInput,
  SLoginForm,
  SLogincontainer,
  SLoginPageContainer,
  SSelect,
  SLoginButton,
} from './styles';

export default function Login() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('cinema');
  const navigate = useNavigate();

  const handleJoinRoom = () => {
    if (username.length) {
      navigate(`/room/${username}/${room}`);
    }
  };

  return (
    <SLoginPageContainer>
      <SLogincontainer>
        <div>
          <h1>Login</h1>
          <SLoginForm>
            <ItemLogin>
              <SDesctiprionInput>UserName:</SDesctiprionInput>
              <SInput type="text" value={username} onChange={({ target }) => setUsername(target.value)} />
            </ItemLogin>
            <ItemLogin>
              <SDesctiprionInput>Room:</SDesctiprionInput>
              <SSelect name="room" id="room" onChange={({ target }) => setRoom(target.value)}>
                <option value="cinema">Cinema</option>
                <option value="sport">Sport</option>
                <option value="technology">Technology</option>
                <option value="music">Music</option>
                <option value="memes">Memes</option>
              </SSelect>
            </ItemLogin>
          </SLoginForm>
        </div>
        <SLoginButton isActive={!username.length} onClick={() => handleJoinRoom()}>
          Join
        </SLoginButton>
      </SLogincontainer>
    </SLoginPageContainer>
  );
}
