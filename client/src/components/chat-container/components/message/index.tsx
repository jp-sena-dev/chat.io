import { Avatar, Box, Typography } from '@mui/material';
import { MessageType, RoomCollection } from '../../../../contexts/rooms';
import { useAuth } from '../../../../contexts/auth-context';

interface MessageProps {
  data: MessageType;
  userId: string;
  isGrouped: boolean;
  room: RoomCollection;
}

export function MessageContainer({
  data,
  userId,
  isGrouped,
  room,
}: MessageProps) {
  const { currentUser } = useAuth();
  const currentUserMessage = room.users.find((user) => user.userId === data.id);

  return (
    <Box
      sx={{
        m: '2px 8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: data.id === userId ? 'end' : 'start',
        position: 'relative',
        px: '32px',
      }}
    >
      <Avatar
        src={
          data.id === currentUser.uid
            ? currentUser.imageURL
            : currentUserMessage?.imageURL
        }
        sx={{
          width: '32px',
          height: '32px',
          borderRadius: '30%',
          position: 'absolute',
          right: data.id === userId ? '-2px' : '',
          left: data.id === userId ? '' : '-2px',
          bottom: '0',
        }}
      />
      <Box
        bgcolor={({ palette }) => (
          data.id === userId
            ? palette.primary.main
            : palette.primary.contrastText
        )}
        sx={{
          p: '12px',
          maxWidth: '50%',
          borderRadius: () => {
            if (data.id === userId) {
              if (!isGrouped) {
                return '16px 16px 0px 16px';
              }
              return '16px 0px 0px 16px';
            }
            if (!isGrouped) {
              return '16px 16px 16px 0px';
            }
            return '0px 16px 16px 0px';
          },
        }}
      >
        {!isGrouped && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '2px',
            }}
          >
            <Typography
              sx={{
                fontWeight: 'bold',
                fontSize: '14px',
              }}
            >
              {data.id === currentUser.uid ? currentUser.username : `${currentUserMessage?.username || 'guest'}` }
            </Typography>
            <Typography
              sx={{
                fontSize: '12px',
              }}
            >
              {`${new Date(data.createdAt).getHours()}:${new Date(data.createdAt).getMinutes()}`}
            </Typography>
          </Box>
        )}
        <Typography>{data.message}</Typography>
      </Box>
    </Box>
  );
}
