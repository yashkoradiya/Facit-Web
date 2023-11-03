import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './ag-grid-override.scss';
import App from './App';
import configureStore from './reduxSetup/configure-store';
import Authenticating from './components/Misc/Authenticating';
import { LicenseManager } from 'ag-grid-enterprise';
import { register } from 'register-service-worker';
import agGridLicense from './ag-grid-license';
import { Amplify, Auth } from 'aws-amplify';
import Logger from 'logger/logger';
import settings from './core/settings/settings';

LicenseManager.setLicenseKey(agGridLicense);

const container = document.getElementById('root');
const root = createRoot(container);

Amplify.configure({
  Auth: settings.COGNITO
});

function updateAuthenticationStatus(status) {
  root.render(<Authenticating status={status} />);
}

register('/serviceWorker.js', {
  registrationOptions: { scope: '/' },
  ready() {
    console.log('Service worker is ready');
  },
  registered() {
    console.log('Service worker has been registered.');
  },
  error(error) {
    console.error('Error during service worker registration:', error);
  }
});

updateAuthenticationStatus('authenticating');

const store = configureStore({});

Auth.currentAuthenticatedUser()
  .then(cognitoUser => {
    /**
     * The refreshSession call is required, so that any change to the user role can be updated,
     * when the user refreshes the page.
     * Since, the access token is updated only when it expires.
     **/
    cognitoUser.refreshSession(cognitoUser.signInUserSession.refreshToken, (sessionError, session) => {
      if (sessionError) {
        updateAuthenticationStatus('error');

        Logger.error('Failed to acquire session credentials', sessionError);
      } else {
        root.render(<App store={store} userSession={session} />);
      }
    });
  })
  .catch(authError => {
    Logger.info('User not Authenticated, attempting sign-in.', authError);
    Auth.federatedSignIn({ provider: 'cognito-identity-provider' }).catch(error => {
      updateAuthenticationStatus('error');

      Logger.error('Sign-In Failed', error);
    });
  })
  .finally(() => {
    document.querySelector('#app-loading-wrapper').remove();
    document.querySelector('body').classList.remove('facit-body-loading');
  });
