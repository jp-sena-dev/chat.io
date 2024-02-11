import { useEffect, useRef, useState } from 'react';
import {
  Box,
  IconButton,
  Typography,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { MessageContainer } from './components/message';
import { MessageInput } from './components/message-input';
import { MessageType, RoomCollection, useRooms } from '../../contexts/rooms';
import { auth } from '../../firebase-config';
import { socket } from '../../App';
import { useAuth } from '../../contexts/auth-context';

interface ChatContainerProps {
  username: string;
  room: RoomCollection;
  handleShowChatSettings: () => void;
}

export function ChatContainer({ username = 'guest', room, handleShowChatSettings }: ChatContainerProps) {
  const { currentUser } = useAuth();
  const {
    sendMessage,
    getMessages,
    updateRoom,
  } = useRooms();
  const messageRef = useRef(null);
  const [clientMessage, setClientMesssage] = useState('');
  const [serverMessages, setServerMassages] = useState<MessageType[]>();
  const [currentRoomId, setCurrentRoomId] = useState('');
  useEffect(() => {
    if (room.id !== currentRoomId) {
      if (currentRoomId) socket.emit('leaveRoom', currentRoomId);
      setServerMassages([]);
      (async () => {
        const currentMessages = await getMessages(room.id);
        setServerMassages(currentMessages);
      })();
      socket.emit('joinRoom', { username, room: room.id, userId: auth.currentUser?.uid });
      setCurrentRoomId(room.id);
    }
  }, [currentRoomId, getMessages, room.id, username]);

  useEffect(() => {
    const handleUpdateRoomSocket = (updatedRoom: RoomCollection) => {
      if (updatedRoom.users.find(({ userId }) => userId === auth.currentUser?.uid)) {
        updateRoom(room.id, updatedRoom);
      }
    };
    socket.on('updateRoom', handleUpdateRoomSocket);
  }, [room.id, updateRoom]);

  useEffect(() => {
    const handleMessages = (newMessage: MessageType) => (
      !serverMessages?.length
        ? setServerMassages([newMessage])
        : setServerMassages([...serverMessages, newMessage])
    );

    socket.on('comunitMessage', handleMessages);

    if (messageRef.current) messageRef.current.scrollTop = messageRef.current.scrollHeight;
  }, [serverMessages]);

  const handleSendMassage = (message: string) => {
    if (message.trim().length) {
      (async () => {
        if (!currentUser.isAnonymous) await sendMessage(message, room);
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
                  cursor: 'pointer',
                }}
                onClick={handleShowChatSettings}
              >
                {room.name}
              </Typography>
              <Typography
                component="p"
                color="primary"
                sx={{
                  fontSize: '12px',
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
            {serverMessages && serverMessages.map((data: MessageType, index) => (
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
