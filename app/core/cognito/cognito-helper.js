import jwt_decode from 'jwt-decode';
import { Auth } from 'aws-amplify';
import settings from '../../core/settings/settings';

export default class CognitoHelper {
  static getUserId() {
    const userIdKey = `CognitoIdentityServiceProvider.${settings.COGNITO.userPoolWebClientId}.LastAuthUser`;
    return localStorage.getItem(userIdKey);
  }

  static getAccessToken() {
    const userId = this.getUserId();
    if (!userId) return false;

    const accessTokenKey = `CognitoIdentityServiceProvider.${settings.COGNITO.userPoolWebClientId}.${userId}.accessToken`;
    return localStorage.getItem(accessTokenKey);
  }

  static async tokenExistsInLocalStorage() {
    const accessToken = this.getAccessToken();

    if (!accessToken) return accessToken;
    const decodedToken = jwt_decode(accessToken);

    const tokenExpirationTime = decodedToken.exp * 1000;
    const currentTime = new Date().getTime();
    if (tokenExpirationTime < currentTime) {
      const cognitoUser = await Auth.currentAuthenticatedUser();
      const currentSession = cognitoUser.signInUserSession;

      return await new Promise((resolve, reject) => {
        cognitoUser.refreshSession(currentSession.refreshToken, (err, session) => {
          if (err) {
            reject(false);
          } else {
            resolve(!!session.accessToken.jwtToken);
          }
        });
      });
    }

    return !!accessToken;
  }

  static getHeader() {
    return { Authorization: 'Bearer ' + this.getAccessToken() };
  }
}
