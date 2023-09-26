import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('localhost:3000', { transports: ['websocket'] });
socket.emit('joinRoom', { username: 'joão', room: 'cinema' })

export default function App() {
  const [clientMessage, setClientMesssage] = useState('');
  const [serverMessages, setServerMassages] = useState<string[]>([])

  useEffect(() => {
    const handleMessages = (newMessage: string) => (
      setServerMassages([...serverMessages, newMessage])
    );
    socket.on('serverMessage', handleMessages)
  }, [serverMessages])

  const handleSendMassage = (message: string) => {
    socket.emit('roomClientMessage', {
      room: 'cinema',
      message: message,
    });
    setClientMesssage('');
  }

  return (
    <div>
      <input type="text" value={clientMessage} onChange={({ target }) => setClientMesssage(target.value)} />
      <button type="submit" onClick={() => handleSendMassage(clientMessage)}>submit</button>
      <ul>
        {serverMessages && serverMessages.map((message) =>(
          <li>{message}</li>
        ))}
      </ul>
    </div>
  )
}
