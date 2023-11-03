import React, { useState } from 'react';
import * as api from '../../apis/versionsApi';
import { Button } from '../styled/Button';
import { Flexbox } from '../styled/Layout';
import ModalBase from '../ModalBase';
import Spinner from 'components/Spinner';
import styled from 'styled-components';

export default function Version() {
  const [state, setState] = useState({
    open: false,
    serviceVersions: []
  });
  const [loading, setLoading] = useState(false);

  const handleClickOpen = async () => {
    setLoading(true);
    const response = await api.getServiceVersions();
    setState({
      open: !state.open,
      serviceVersions: [...response.data, { name: 'Web', version: process.env.APP_VERSION }]
    });
    setLoading(false);
  };

  const handleClose = () => {
    setState({ ...state, open: !state.open });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(
      '||Service||Version||' + state.serviceVersions.map(x => `\r\n|${x.name}|${x.version || 'N/A'}|`).join('')
    );
  };

  return (
    <Flexbox>
      <Button onClick={handleClickOpen} style={{ width: '80px' }}>
        {loading ? (
          <SpinningIcon className="material-icons" style={{ fontSize: '16px' }}>
            loop
          </SpinningIcon>
        ) : (
          'About'
        )}
      </Button>
      <Spinner loading={false} />
      <ModalBase show={state.open} onRequestClose={handleClose}>
        <table cellPadding="2">
          <thead style={{ textAlign: 'left' }}>
            <tr>
              <th colSpan="2">Service name</th>
              <th>Version</th>
            </tr>
          </thead>
          <tbody>
            {state.serviceVersions.map((x, i) => {
              return (
                <tr key={i}>
                  <td>
                    {x.version !== undefined ? (
                      <i title="Service ok" style={{ fontSize: 14, color: 'green' }} className="material-icons">
                        done
                      </i>
                    ) : (
                      <i
                        title="Service not responding"
                        style={{ fontSize: 14, color: 'red' }}
                        className="material-icons"
                      >
                        error_outline
                      </i>
                    )}
                  </td>
                  <td>{x.name}</td>
                  <td>{x.version}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Button onClick={copyToClipboard} style={{ marginTop: '20px' }}>
          Copy to clipboard
        </Button>
      </ModalBase>
    </Flexbox>
  );
}

const SpinningIcon = styled.i`
  animation-name: spin;
  animation-duration: 1500ms;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  animation-direction: reverse;
`;
