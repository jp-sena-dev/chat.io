import { Avatar, Box } from '@mui/material';
import styled from 'styled-components';

interface InputAvatarProps {
  imageURL?: string;
  setFile: (file: any) => void;
  setPrevImage: (image: any) => void;
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export function InputAvatar({
  imageURL,
  setFile,
  setPrevImage,
}: InputAvatarProps) {
  const handleChangeImage = async (imageFile: any) => {
    const reader = new FileReader();
    setFile(imageFile);
    reader.readAsDataURL(imageFile);
    reader.onload = (e) => setPrevImage((e.target as any).result);
  };

  return (
    <Box component="label">
      <Avatar
        src={imageURL}
        sx={{
          width: '150px',
          height: '150px',
          margin: '12px auto 0',
          cursor: 'pointer',
        }}
      />
      <VisuallyHiddenInput type="file" onChange={({ target }: any) => handleChangeImage((target.files as any)[0])} />
    </Box>
  );
}
