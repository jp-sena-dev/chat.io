import { Box, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { AnimatedElement } from '../../../../utils/animated-element';
import { RoomCollection } from '../../../../contexts/rooms';
import { NavRoomOptions } from './components/nav-room-options';
import { NavUserSettings } from './components/nav-user-settings';
import { RoomList } from './components/room-list';

interface ChatNavProps {
  userRooms: RoomCollection[];
  navScreen: string;
  bodyScreen: string;
  currentRoom: RoomCollection | null,
  setCurrentRoom: (param: RoomCollection) => void;
  setNavScreen: (param: string) => void
  setBodyScreen: (param: string) => void;
}

export function ChatNav({
  bodyScreen,
  navScreen,
  userRooms,
  currentRoom,
  setCurrentRoom,
  setNavScreen,
  setBodyScreen,
}: ChatNavProps) {
  return (
    <Box
      sx={{
        bgcolor: '#efefef',
        borderBottomLeftRadius: '14px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'hidden',
      }}
    >
      {!!userRooms && (
        <RoomList
          handleShowRoomSettings={() => setNavScreen('RoomOptions')}
          rooms={userRooms}
          selectedRoom={currentRoom}
          setRoom={setCurrentRoom}
        />
      )}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <AnimatedElement onScreen={navScreen === 'userSettings'} direction="right">
          <>
            <Box>
              <IconButton onClick={() => setNavScreen('')}>
                <ArrowBackIcon />
              </IconButton>
            </Box>
            <NavUserSettings bodyScreen={bodyScreen} setBodyScreen={setBodyScreen} />
          </>
        </AnimatedElement>
        <AnimatedElement onScreen={navScreen === 'RoomOptions'} direction="right">
          <>
            <Box>
              <IconButton onClick={() => setNavScreen('')}>
                <ArrowBackIcon />
              </IconButton>
            </Box>
            <NavRoomOptions bodyScreen={bodyScreen} setBodyScreen={setBodyScreen} />
          </>
        </AnimatedElement>
      </Box>
    </Box>
  );
}
