import React, { useEffect, useState } from 'react';
import { connect, Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import MainApp from './MainApp';
import jwt_decode from 'jwt-decode';
import { setUserState } from 'appState/appStateActions';
import Authenticating from 'components/Misc/Authenticating';

function App(props) {
  const { dispatchUserState } = props;
  const [userAuthenticated, setAuthenticationStatus] = useState();

  useEffect(() => {
    // This property is not destructured due to the dependency array.
    const userSession = props.userSession;

    if (userSession) {
      const decodedToken = jwt_decode(userSession.idToken.jwtToken);

      const roles = decodedToken['cognito:groups'] ?? [];
      const sourcemarkets = decodedToken['custom:sourcemarkets'] ?? '';
      const userName = decodedToken.name;

      dispatchUserState({ name: userName, role: roles, sourcemarkets });
      setAuthenticationStatus(true);
    } else {
      setAuthenticationStatus(false);
    }
  }, [dispatchUserState, props.userSession]);

  if (!userAuthenticated) {
    return <Authenticating />;
  }

  return (
    <Provider store={props.store}>
      <BrowserRouter>
        <MainApp />
      </BrowserRouter>
    </Provider>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    dispatchUserState: userData => dispatch(setUserState(userData))
  };
}

export default connect(null, mapDispatchToProps)(App);
