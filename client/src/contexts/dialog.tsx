import React, { useContext, useMemo, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';

interface DialogProviderProps {
  children: JSX.Element
}

interface DialogProviderType {
  dialog: (title: string, description: string) => void;
  dialogNeedsLogin: () => void;
}

const UseDialogContext = React.createContext<DialogProviderType | null>(null);
export const useDialog = () => useContext(UseDialogContext) as DialogProviderType;

export default function DialogProvider({ children }: DialogProviderProps) {
  const [open, setOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogDescription, setDialogDescription] = useState('');

  const dialog = (title: string, description: string) => {
    setOpen(true);
    setDialogTitle(title);
    setDialogDescription(description);
  };

  const dialogNeedsLogin = () => {
    setOpen(true);
    setDialogTitle('Need login');
    setDialogDescription('To use this feature you need to login');
  };

  const handleClose = () => setOpen(false);

  const value = useMemo(() => ({
    dialog,
    dialogNeedsLogin,
  }), []);

  return (
    <UseDialogContext.Provider value={value as DialogProviderType}>
      <>
        <Dialog
          open={open}
          onClose={handleClose}
        >
          <DialogTitle>
            {dialogTitle}
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent dividers>
            <Typography gutterBottom>
              {dialogDescription}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
        { children }
      </>
    </UseDialogContext.Provider>
  );
}
