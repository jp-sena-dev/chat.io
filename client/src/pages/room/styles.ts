import styled from 'styled-components';

export const SRoomPage = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SRoomContainer = styled.div`
  display: grid;
  grid-template-columns: 20% 80%;
  gap: 12px;
  @media (min-width: 1440px) {
    height: 99vh;
  }
  max-width: 1440px;
  width: 100vw;
  height: 100vh;
`;

export const SChatContainer = styled.div`
  display: grid;
  min-height: 100%;
  grid-template-rows: 6% 86% 8%;
  background-color: white;

  border: 2px solid #D7D7D7;
  border-radius: 12px;
`;

export const SMessagesContainer = styled.div`
  max-height: 100%;
  overflow-y: auto;
`;

export const SWrapperInput = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const SChatsContainer = styled.div`
  border: 2px solid #D7D7D7;
  border-radius: 12px;
  height: 100%;
`;

export const SHeaderChat = styled.div`
  width: 100%;
  height: 100%;
  border-bottom: 2px solid #D7D7D7;
  padding-left: 8px;
  display: flex;
  align-items: center;
  h2 {
    font-weight: bold;
    font-size: 2.5rem;
    color: #107E78;
  }
`;

export const SChatsContainerHeader = styled.div`
  border-bottom: 2px solid #D7D7D7;
  height: 6%;
  display: flex;
  align-items: center;
  h1 {
    span {
      color: #107E78;
      font-weight: bold;
    }
    padding-left: 8px;
    font-weight: bold;
  }
`;
