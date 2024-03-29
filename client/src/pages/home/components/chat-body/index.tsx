import { Box } from '@mui/material';
import { RoomCollection } from '../../../../contexts/rooms';
import { FormCreateRoom } from '../../../../components/forms/form-create-room';
import { ChatContainer } from '../../../../components/chat-container';
import { FormUpdateRoom } from '../../../../components/forms/form-update-room';
import { FormJoinRoom } from '../../../../components/forms/form-join-room';
import { FormUpdateUser } from '../../../../components/forms/form-update-user';
import { AnimatedBody } from './component/animated-body';
import { About } from './component/About';

interface ChatBodyProps {
  room: RoomCollection | null;
  bodyScreen: string;
  username: string;
  setBodyScreen: (param: string) => void;
  handleChangeName: (id: string, name: string) => void;
  resetCurrentRoom: () => void;
}

export function ChatBody({
  room,
  bodyScreen,
  username,
  setBodyScreen,
  handleChangeName,
  resetCurrentRoom,
}: ChatBodyProps) {
  return (
    <Box sx={{
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      borderRight: '1px solid #efefef',
      borderBottom: '1px solid #efefef',
      borderBottomRightRadius: '14px',
    }}
    >
      {!!room && (
        <ChatContainer
          room={room}
          username={username}
          handleShowChatSettings={() => setBodyScreen('updateRoom')}
          handleChangeClose={() => { setBodyScreen(''); resetCurrentRoom(); }}
        />
      )}
      <AnimatedBody onScreen={bodyScreen === 'userProfileSettings'}><FormUpdateUser handleChangeClose={() => setBodyScreen('')} /></AnimatedBody>
      <AnimatedBody onScreen={bodyScreen === 'about'}><About handleChangeClose={() => setBodyScreen('')} /></AnimatedBody>
      {room && (
        <AnimatedBody onScreen={bodyScreen === 'updateRoom'}>
          <FormUpdateRoom handleChangeClose={() => setBodyScreen('')} handleChangeName={handleChangeName} room={room} />
        </AnimatedBody>
      )}
      <AnimatedBody onScreen={bodyScreen === 'settingsCreateRoom'}><FormCreateRoom /></AnimatedBody>
      <AnimatedBody onScreen={bodyScreen === 'settingsJoinRoom'}><FormJoinRoom /></AnimatedBody>
    </Box>
  );
}
