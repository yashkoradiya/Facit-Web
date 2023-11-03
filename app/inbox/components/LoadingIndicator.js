import React from 'react';
import styled from 'styled-components';
import { SpinnerIcon } from 'components/styled/Loaders';
import { Camera } from '@material-ui/icons';

export default function LoadingIndicator({ loading, iconSize }) {
  if (!loading) return null;
  return (
    <Background data-testid="loading-indicator">
      <SpinnerIcon size={iconSize ?? '50px'}>
        <Camera />
      </SpinnerIcon>
    </Background>
  );
}

const Background = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  z-index: 99;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.5);
`;
