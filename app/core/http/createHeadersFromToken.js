import CognitoHelper from '../cognito/cognito-helper';

export function createHeadersFromToken() {
  return new Promise((resolve, reject) => {
    CognitoHelper.tokenExistsInLocalStorage().then(tokenStatus => {
      if (tokenStatus) {
        resolve(CognitoHelper.getHeader());
      } else {
        reject('Could not find token in session storage');
      }
    });
  });
}
