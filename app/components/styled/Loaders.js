import styled from 'styled-components';

export const SpinnerContainer = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: rgba(150, 150, 150, 0.6);
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  z-index: 1001;
`;

export const SpinnerIcon = styled.span`
  animation: spinning 2s ease infinite;
  width: 90px;
  height: 90px;
  display: flex;
  justify-content: center;
  align-items: center;

  & svg {
    font-size: ${props => (props.size ? props.size : '80px')};
  }

  @keyframes spinning {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
