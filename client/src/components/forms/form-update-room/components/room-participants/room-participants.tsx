import { Avatar, Paper, Typography } from '@mui/material';

interface RoomParticipantsProps {
  avatar: string;
  username: string;
}

export function RoomParticipants({
  avatar,
  username,
}: RoomParticipantsProps) {
  return (
    <Paper
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        width: '200px',
        height: '50px',
        p: '12px',
        bgcolor: '#EFEFEF',
      }}
    >
      <Avatar src={avatar} />
      <Typography>{username}</Typography>
    </Paper>
  );
}
