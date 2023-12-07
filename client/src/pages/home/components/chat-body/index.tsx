import { Box } from '@mui/material';

import { RoomCollection } from '../../../../contexts/rooms';
import { FormCreateRoom } from '../../../../components/form-create-room';
import { ChatContainer } from '../../../../components/chat-container';
import { FormUpdateRoom } from '../../../../components/form-update-room';
import { FormJoinRoom } from '../../../../components/form-join-room';
import FormUpdateUser from '../../../../components/form-update-user';
import { AnimatedBody } from './component/animated-body';

interface ChatBodyProps {
  room: RoomCollection | null;
  bodyScreen: string;
  username: string;
  setBodyScreen: (param: string) => void;
  handleChangeName: (id: string, name: string) => void;
}

export function ChatBody({
  room,
  bodyScreen,
  username,
  setBodyScreen,
  handleChangeName,
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
        />
      )}
      <AnimatedBody onScreen={bodyScreen === 'userProfileSettings'}><FormUpdateUser /></AnimatedBody>
      <AnimatedBody onScreen={bodyScreen === 'about'}><div>a</div></AnimatedBody>
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
