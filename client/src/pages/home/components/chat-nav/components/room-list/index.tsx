import { Box, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { RoomCollection } from '../../../../../../contexts/rooms';

interface RoomListProps {
  rooms: RoomCollection[];
  selectedRoom: RoomCollection | null;
  setRoom: (param: RoomCollection) => void;
  handleShowRoomSettings: () => void;
}

export function RoomList({
  rooms,
  selectedRoom,
  setRoom,
  handleShowRoomSettings,
}: RoomListProps) {
  return (
    <Box sx={{ overflowY: 'scroll', width: '100%', height: '100%' }}>
      <IconButton
        onClick={handleShowRoomSettings}
        color="success"
        size="large"
        sx={{
          position: 'absolute',
          bottom: '8px',
          left: '8px',
          color: 'white',
          bgcolor: '#107E78',
          zIndex: 1,
          ':hover': {
            bgcolor: '#0a4b47',
          },
        }}
      >
        <AddIcon fontSize="medium" />
      </IconButton>
      {rooms && rooms.map((room: RoomCollection) => (
        <IconButton
          id={room.id}
          component="button"
          onClick={() => setRoom(room)}
          sx={{
            width: 'calc(100% - 8px)',
            display: 'grid',
            gridTemplateColumns: '48px calc(100% - 48px)',
            padding: '0 4px',
            border: 0,
            textAlign: 'left',
            cursor: 'pointer',
            p: '12px',
            borderRadius: '16px',
            m: '0 4px',
            color: 'black',
            bgcolor: !selectedRoom ? 'transparent' : `${selectedRoom.id === room.id && '#d7d6d6'}`,
          }}
        >
          <Box
            component={room.imageURL ? 'img' : 'div'}
            src={room.imageURL}
            sx={{
              width: '48px',
              height: '48px',
              bgcolor: '#107E78',
              borderRadius: '30%',
            }}
          />
          <Box
            sx={{
              marginLeft: '4px',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <Typography
                component="p"
                sx={{
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                }}
              >
                {room.name}
              </Typography>
              {/* <Typography
                component="p"
                sx={{
                  fontSize: '0.8rem',
                }}
              >
                02:03 p.m.
              </Typography> */}
            </Box>
            {/* <Typography component="p" sx={{ fontSize: '0.75rem' }}>
              ID:
              {' '}
              <Typography component="span" sx={{ fontWeight: '600', fontSize: '0.75rem' }}>
                {room.id}
              </Typography>
            </Typography> */}
          </Box>
        </IconButton>
      ))}
    </Box>
  );
}
