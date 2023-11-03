import React from 'react';
import { Auth } from 'aws-amplify';
import { useHistory } from 'react-router';

export default function Callback() {
  const history = useHistory();

  Auth.currentSession()
    .then(() => {
      history.push('/');
    })
    .catch(err => console.log(err));
  return <div data-testid="callback-container"><h1>Redirecting...</h1></div>;
}
