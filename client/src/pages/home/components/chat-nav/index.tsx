import { Box, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { AnimatedElement } from '../../../../utils/animated-element';
import { RoomCollection } from '../../../../contexts/rooms';
import { NavRoomOptions } from './components/nav-room-options';
import { NavUserSettings } from './components/nav-user-settings';
import { RoomList } from './components/room-list';
import { useAuth } from '../../../../contexts/auth-context';
import { useDialog } from '../../../../contexts/dialog';

interface ChatNavProps {
  userRooms: RoomCollection[];
  navScreen: string;
  bodyScreen: string;
  currentRoom: RoomCollection | null;
  hidden: boolean;
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
  hidden,
}: ChatNavProps) {
  const { currentUser } = useAuth();
  const { dialogNeedsLogin } = useDialog();
  return (
    <Box
      sx={{
        bgcolor: '#efefef',
        borderBottomLeftRadius: '14px',
        position: 'relative',
        flexDirection: 'column',
        overflowY: 'hidden',
        display: 'flex',
        '@media (max-width:530px)': {
          display: hidden ? 'none' : 'flex',
        },
      }}
    >
      {!!userRooms && (
        <RoomList
          handleShowRoomSettings={() => (currentUser.isAnonymous ? dialogNeedsLogin() : setNavScreen('RoomOptions'))}
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
