import { SInputMessage, SInputMessageContainer } from './styles';

interface InputMessageProps {
  message: string;
  setMessage: (_pram: string) => void;
  HandleSubmit: (_pram: string) => void;
}

export function MessageInput({ message, setMessage, HandleSubmit }: InputMessageProps) {
  return (
    <SInputMessageContainer onSubmit={(e) => e.preventDefault()}>
      <SInputMessage type="text" value={message} onChange={({ target }) => setMessage(target.value)} />
      <button type="submit" onClick={() => HandleSubmit(message)}>submit</button>
    </SInputMessageContainer>
  );
}
