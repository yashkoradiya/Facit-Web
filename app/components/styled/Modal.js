import styled from 'styled-components';
import { colours } from './defaults';

export const ModalBackground = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: rgba(150, 150, 150, 0.4);
  position: fixed;
  display: ${props => (props.show ? 'flex' : 'none')};
  justify-content: center;
  align-items: flex-start;
  top: 0;
  left: 0;
  z-index: 200;
`;

export const ModalHeader = styled.div`
  width: 100%;
  background-color: ${colours.tuiBlue100};
  color: ${colours.tuiBlue500};
  font-size: 16px;
  font-weight: bold;
  padding: 12px;
  text-transform: uppercase;
  height: 42px;
`;

export const ModalContent = styled.div`
  overflow-y: auto;
  position: initial;

  padding: 20px;
  width: 100%;
  height: 100%;
`;

export const ModalContainer = styled.div`
  position: relative;
  background: #fff;
  display: flex;
  flex-direction: column;
  margin-top: ${props => (props.marginTop ? props.marginTop : '80px')};
  width: ${props => (props.width ? props.width : '300px')};
  height: ${props => (props.height ? props.height : 'auto')};
  min-height: ${props => (props.height ? '0' : '300px')};
  max-height: ${props => (props.height ? props.height : '90vh')};
  overflow-y: auto;
  border-radius: 4px;
  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14),
    0px 1px 10px 0px rgba(0, 0, 0, 0.12);
`;

export const BlueModalContent = styled(ModalContent)`
  margin-top: 33px;
`;

export const BlueModalContainer = styled(ModalContainer)`
  background: linear-gradient(to bottom, ${colours.tuiBlue300} 33px, white 33px);
`;

export const ModalCloseButton = styled.button`
  position: absolute;
  right: 4px;
  top: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  width: 24px;
  border-radius: 50%;
  border: none;
  outline: 0;
  background-color: ${colours.tuiBlue100};
  color: ${colours.tuiBlue500};
  &:hover,
  &:focus {
    background-color: rgba(73, 169, 204, 0.4);
    border-color: ${colours.tuiBlue400};
  }
  &:active {
    background-color: rgba(73, 169, 204, 0.4);
    border-color: ${colours.tuiBlue400};
    color: ${colours.tuiBlue100};
  }
`;
