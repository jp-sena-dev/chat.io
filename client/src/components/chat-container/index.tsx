import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import {
  Box,
  IconButton,
  Typography,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { MessageContainer, MessageData } from './components/message';
import { MessageInput } from './components/message-input';
import { RoomCollection, useRooms } from '../../contexts/rooms';
import { auth } from '../../firebase-config';

interface ChatContainerProps {
  username: string;
  room: RoomCollection;
  handleShowChatSettings: () => void;
}

export const socket = io(import.meta.env.VITE_SERVER_URL as string, { transports: ['websocket'] });

export function ChatContainer({ username, room, handleShowChatSettings }: ChatContainerProps) {
  const { sendMessage, getMessages, getUserRooms } = useRooms();
  const messageRef = useRef(null);
  const [clientMessage, setClientMesssage] = useState('');
  const [serverMessages, setServerMassages] = useState<MessageData[]>();
  const [currentRoomId, setCurrentRoomId] = useState('');

  useEffect(() => {
    if (room.id !== currentRoomId) {
      console.log('a');
      socket.emit('joinRoom', { username, room: room.id, userId: auth.currentUser?.uid });
      setServerMassages([]);
      (async () => {
        const currentMessages = await getMessages(room.id);
        setServerMassages(currentMessages);
      })();
      setCurrentRoomId(room.id);
    }
  }, [currentRoomId, getMessages, room.id, username]);

  useEffect(() => {
    socket.on('updateRoom', getUserRooms);
  }, [getUserRooms]);

  console.log(currentRoomId);

  useEffect(() => {
    const handleMessages = (newMessage: MessageData) => (
      !serverMessages?.length
        ? setServerMassages([newMessage])
        : setServerMassages([...serverMessages, newMessage])
    );

    socket.on('comunitMessage', handleMessages);
    socket.on('serverMessage', handleMessages);

    if (messageRef.current) messageRef.current.scrollTop = messageRef.current.scrollHeight;
  }, [serverMessages]);

  const handleSendMassage = (message: string) => {
    if (message.trim().length) {
      (async () => {
        await sendMessage(message, room);
        socket.emit('roomClientMessage', {
          room: room.id,
          message,
        });
        setClientMesssage('');
      })();
    }
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateRows: '10% 83% 7%',
        padding: '0 12px',
        height: '100%',
        maxHeight: '89vh',
        overflow: 'hidden',
      }}
    >
      {room.id && (
        <>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Box>
              <Typography
                component="h1"
                variant="h5"
                sx={{
                  fontWeight: 'bold',
                }}
              >
                {room.name}
              </Typography>
              <Typography
                component="p"
                sx={{
                  fontSize: '12px',
                  color: '#107E78',
                }}
              >
                {`${room.users.length} members`}
              </Typography>
            </Box>
            <IconButton onClick={handleShowChatSettings}>
              <MoreVertIcon />
            </IconButton>
          </Box>
          <Box ref={messageRef} sx={{ overflowY: 'auto' }}>
            {serverMessages && serverMessages.map((data: MessageData, index) => (
              <MessageContainer
                room={room}
                data={data}
                isGrouped={index > 0 ? serverMessages[index - 1].id === data.id : false}
                userId={auth.currentUser?.uid as string}
              />
            ))}
          </Box>
          <MessageInput
            HandleSubmit={handleSendMassage}
            message={clientMessage}
            setMessage={setClientMesssage}
          />
        </>
      )}
    </Box>
  );
}
