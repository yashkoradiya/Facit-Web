import * as React from 'react';
import Icon from '@material-ui/core/Icon';
import { Flexbox } from '../styled/Layout';

function Authenticating({ status }) {
  const color = status === 'error' ? '#cc0000' : '#00448e';

  return (
    <Flexbox direction="column" height="100%" justifyContent="center">
      <div
        css={`
          font-size: 40px;
          color: ${color};
        `}
      >
        <Icon fontSize="inherit">{status === 'error' ? 'error' : 'fingerprint'} </Icon>
      </div>
      {status === 'error' ? (
        <>
          <h2>There was an error while authenticating, please try again.</h2>
          <p>If the problem persists, contact an administrator</p>
        </>
      ) : (
        <h2>Authenticating...</h2>
      )}
    </Flexbox>
  );
}

export default Authenticating;
