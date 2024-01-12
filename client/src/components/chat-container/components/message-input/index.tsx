import { Box, IconButton, InputBase } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';

interface InputMessageProps {
  message: string;
  setMessage: (_pram: string) => void;
  HandleSubmit: (_pram: string) => void;
}

export function MessageInput({ message, setMessage, HandleSubmit }: InputMessageProps) {
  return (
    <Box
      component="form"
      onSubmit={(e) => { e.preventDefault(); HandleSubmit(message); }}
      sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        height: '95%',
        border: '1px solid #d7d7d7',
        borderRadius: '50px',
      }}
    >
      <Box sx={{ p: '10px' }}>
        <AttachFileIcon />
      </Box>
      <InputBase
        value={message}
        onChange={({ target }) => setMessage(target.value)}
        sx={{ ml: 1, flex: 1 }}
        placeholder="Type message"
      />
      <IconButton type="submit" sx={{ p: '10px' }}>
        <SendIcon />
      </IconButton>
    </Box>
  );
}
