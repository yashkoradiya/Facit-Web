import React, { useEffect } from 'react';
import { SpinnerContainer, SpinnerIcon } from './styled/Loaders';
import { Camera } from '@material-ui/icons';

const Spinner = ({ loading }) => {
  useEffect(() => {
    if (loading) document.body.classList.add('isLocked');
    else document.body.classList.remove('isLocked');
  }, [loading]);
 
  return loading ? (
    <SpinnerContainer data-testid="spinner">
      <SpinnerIcon>
        <Camera />
      </SpinnerIcon>
    </SpinnerContainer>
  ) : null;
};

export default Spinner;
