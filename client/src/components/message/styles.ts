import styled from 'styled-components';

interface SMessageContainerProps {
  userMessage: boolean;
}

export const SMessageContainer = styled.div<SMessageContainerProps>`
  margin: 14px 8px;

  display: flex;
  flex-direction: column;
  align-items: ${({ userMessage }) => (userMessage ? 'end' : 'start')};
`;

export const SeverMessage = styled.p`
  display: flex;
  justify-content: center;

  p {
    font-weight: bold;
    font-size: 14px;
    text-align: center;
    width: max-content;
    padding: 8px;
    margin: 8px 0;
    background-color: #034E53;
    color: #F1F8F7;
    border-radius: 4px;
  }
`;

export const SMessageInformationsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SMessageUsername = styled.p`
  font-weight: bold;
  font-size: 1rem;
`;

export const SMessageDate = styled.p`
  color: #0a9c9399;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  &::before {
    content: '•';
    font-size: 1.5rem;
    margin: 0 8px;
  }
`;

export const SMessageContent = styled.p`
  font-size: 1.05rem;
  font-weight: normal;
  border: 1.5px solid #69696980;
  width: min-content;
  padding: 12px 8px;
  border-radius: 8px;
  background-color: white;
`;
