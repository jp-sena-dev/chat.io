import styled from 'styled-components';

interface SLoginButtonProp {
  isActive: boolean;
}

export const SLoginPageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #252525;
`;

export const SLogincontainer = styled.div`
  background-color: #dbdbdb;
  border-radius: 8px;
  padding: 16px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: 320px) {
    height: 100vh;
    width: 100vw;
  }

  width: 400px;
  height: 60vh;
  h1 {
    font-weight: bold;
  }
`;

export const SLoginForm = styled.div`
  margin: 0 auto;
`;

export const ItemLogin = styled.label`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  align-items: center;
  margin-top: 24px;
  position: relative;
`;

export const SDesctiprionInput = styled.p`
  font-size: 24px;
  font-weight: 300;
  display: flex;
  align-items: center;
`;

export const SSelect = styled.select`
  background-color: white;
  color: black;
  border: 1px solid #69696980;

  cursor: pointer;
  border-radius: 4px;
  min-width: 100px;
  width: min-content;
  height: 40px;
  padding: 0 2px 0 8px;
  font-size: 16px;

  &:focus {
    outline: none!important;
  }

  option {
    cursor: pointer;
    font-size: 16px;
    :hover {
      background: gray;
    }
  }
`;

export const SLoginButton = styled.button<SLoginButtonProp>`
  height: 50px;
  width: 150px;
  font-size: 24px;
  margin-left: auto;
  color: white;
  background-color: ${({ isActive }) => (!isActive ? '#5959D1' : '#8686cf')};
  

  cursor: pointer;
  border-radius: 4px;
  border: none;
`;

export const SInput = styled.input`
  width: 180px;
  font-size: 18px;
  height: 40px;
  border-radius: 4px; 
  padding: 0 4px;
  border: 1px solid #69696980;
  &:focus {
    outline: none!important;
  }
`;
