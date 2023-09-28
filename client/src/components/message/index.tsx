import {
  SMessageContainer,
  SMessageContent,
  SMessageDate,
  SMessageInformationsContainer,
  SMessageUsername,
  SeverMessage,
} from './styles';

export type MessageData = {
  username: string;
  message: string;
  id: string
  date: string
};

interface MessageProps {
  data: string | MessageData;
  userId: string;
}

export function MessageContainer({ data, userId }: MessageProps) {
  if (typeof data === 'string') {
    return (
      <SeverMessage>
        <p>{data}</p>
      </SeverMessage>
    );
  }

  return (
    <SMessageContainer userMessage={data.id === userId}>
      <SMessageInformationsContainer>
        <SMessageUsername>{data.username}</SMessageUsername>
        <SMessageDate>{`${new Date(data.date).getHours()}:${new Date(data.date).getMinutes()}`}</SMessageDate>
      </SMessageInformationsContainer>
      <SMessageContent>{data.message}</SMessageContent>
    </SMessageContainer>
  );
}
