export const localAWSConfig = {
  region: 'eu-central-1',
  userPoolId: 'eu-central-1_gLrhPIt4m',
  userPoolWebClientId: '1ggom03qa2ll6rt7rr7fibbdbc',
  oauth: {
    domain: 'facit-test-local-manual.auth.eu-central-1.amazoncognito.com',
    scope: ['email', 'profile', 'openid', 'api/api'],
    redirectSignIn: 'http://localhost:3003/callback',
    redirectSignOut: 'http://localhost:3003/',
    responseType: 'code'
  }
};

export const devAWSConfig = {
  region: 'eu-central-1',
  userPoolId: 'eu-central-1_KmC9zQqS4',
  userPoolWebClientId: '6fu4g356bq3jpok4jsh8ejlbfb',
  oauth: {
    domain: 'facitng-identity-dv1.auth.eu-central-1.amazoncognito.com',
    scope: ['email', 'profile', 'openid', 'api/api'],
    redirectSignIn: 'https://facitng-web-dev.facitng.aws.tuicloud.net/callback',
    redirectSignOut: 'https://facitng-web-dev.facitng.aws.tuicloud.net/',
    responseType: 'code'
  }
};

export const sitAWSConfig = {
  region: 'eu-central-1',
  userPoolId: '', //TODO: Update the user pool ID
  userPoolWebClientId: '', //TODO: Update the Web client ID
  oauth: {
    domain: '', //TODO: Update the domain
    scope: ['email', 'profile', 'openid', 'api/api'],
    redirectSignIn: 'https://facitng-web-sit.facitng.aws.tuicloud.net/callback',
    redirectSignOut: 'https://facitng-web-sit.facitng.aws.tuicloud.net/',
    responseType: 'code'
  }
};

export const pprdAWSConfig = {
  region: 'eu-central-1',
  userPoolId: '', //TODO: Update the user pool ID
  userPoolWebClientId: '', //TODO: Update the Web client ID
  oauth: {
    domain: '', //TODO: Update the domain
    scope: ['email', 'profile', 'openid', 'api/api'],
    redirectSignIn: 'https://facitng-web-pprd.facitng.aws.tuicloud.net/callback',
    redirectSignOut: 'https://facitng-web-pprd.facitng.aws.tuicloud.net/',
    responseType: 'code'
  }
};

export const prodAWSConfig = {
  region: 'eu-central-1',
  userPoolId: '', //TODO: Update the user pool ID
  userPoolWebClientId: '', //TODO: Update the Web client ID
  oauth: {
    domain: '', //TODO: Update the domain
    scope: ['email', 'profile', 'openid', 'api/api'],
    redirectSignIn: 'https://web.facitng.aws.tuicloud.net/callback',
    redirectSignOut: 'https://web.facitng.aws.tuicloud.net/',
    responseType: 'code'
  }
};
