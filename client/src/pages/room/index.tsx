import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { MessageContainer, MessageData } from '../../components/message';
import {
  SChatContainer,
  SWrapperInput,
  SMessagesContainer,
  SRoomContainer,
  SRoomPage,
  SHeaderChat,
  SChatsContainer,
  SChatsContainerHeader,
} from './styles';
import { MessageInput } from '../../components/message-input';

const socket = io('localhost:3000', { transports: ['websocket'] });

export default function Room() {
  const [clientMessage, setClientMesssage] = useState('');
  const [serverMessages, setServerMassages] = useState<(string | MessageData)[]>([]);
  const { username: user, room } = useParams();

  useEffect(() => {
    socket.emit('joinRoom', { username: user as string, room: room as string });
  }, [room, user]);

  useEffect(() => {
    const handleMessages = (newMessage: string | MessageData) => (
      setServerMassages([...serverMessages, newMessage])
    );
    socket.on('comunitMessage', handleMessages);
    socket.on('serverMessage', handleMessages);
  }, [serverMessages]);

  const handleSendMassage = (message: string) => {
    socket.emit('roomClientMessage', {
      room,
      message,
    });
    setClientMesssage('');
  };

  return (
    <SRoomPage>
      <SRoomContainer>
        <SChatsContainer>
          <SChatsContainerHeader>
            <h1>
              Chat
              <span>.io</span>
            </h1>
          </SChatsContainerHeader>
        </SChatsContainer>
        <SChatContainer>
          <SHeaderChat>
            <h2>{room}</h2>
          </SHeaderChat>
          <SMessagesContainer>
            {serverMessages && serverMessages.map((data: MessageData | string) => (
              <MessageContainer data={data} userId={socket.id} />
            ))}
          </SMessagesContainer>
          <SWrapperInput>
            <MessageInput
              HandleSubmit={() => handleSendMassage(clientMessage)}
              message={clientMessage}
              setMessage={setClientMesssage}
            />
          </SWrapperInput>
        </SChatContainer>
      </SRoomContainer>
    </SRoomPage>
  );
}
