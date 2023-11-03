import { devAWSConfig, localAWSConfig, pprdAWSConfig, prodAWSConfig, sitAWSConfig } from 'aws-config';
import config from './config';

export const getConfig = hostname => {
  let environment;
  let environmentColour;
  let awsConfig;

  if (hostname === 'facitng-web-dev.facitng.aws.tuicloud.net') {
    environment = 'DEV';
    environmentColour = '#C4B8B8';
    awsConfig = devAWSConfig;
  } else if (hostname === 'facitng-web-sit.facitng.aws.tuicloud.net') {
    environment = 'SIT';
    environmentColour = '#C4B8B8';
    awsConfig = sitAWSConfig;
  } else if (hostname === 'facitng-web-pprd.facitng.aws.tuicloud.net') {
    environment = 'PRE_PROD';
    environmentColour = '#C4B8B8';
    awsConfig = pprdAWSConfig;
  } else if (hostname === 'web.facitng.aws.tuicloud.net') {
    environment = 'PROD';
    environmentColour = '#8BA88F';
    awsConfig = prodAWSConfig;
  } else if (hostname === 'wr-facit-web.test.tuicloud.io') {
    environment = 'WR_TEST';
  } else if (hostname === 'facit-web.uat.tuicloud.io') {
    environment = 'UAT';
    environmentColour = '#8BA88F';
  } else if (hostname === 'facit-web.uat2.tuicloud.io') {
    environment = 'UAT2';
    environmentColour = '#F5D796';
  } else if (hostname === 'nordic-facit-web.uat.tuicloud.io') {
    environment = 'NORDIC_UAT';
    environmentColour = '#8BA88F';
  } else if (hostname === 'nordic-facit-web.tuicloud.io') {
    environment = 'NORDIC_PRODUCTION';
  } else if (hostname === 'wr-facit-web.uat.tuicloud.io') {
    environment = 'WR_UAT';
    environmentColour = '#8BA88F';
  } else if (hostname === 'facit-web.tuicloud.io') {
    environment = 'PRODUCTION';
  } else {
    environment = 'LOCAL';
    awsConfig = localAWSConfig;
  }

  let envConfig = {};
  Object.keys(config[environment]).forEach(key => {
    envConfig[key] = config[environment][key];
  });
  envConfig['ENVIRONMENT'] = environment;
  envConfig['ENVIRONMENTCOLOUR'] = environmentColour;
  envConfig['COGNITO'] = awsConfig;

  return envConfig;
};

const hostname = window && window.location && window.location.hostname;
const settings = getConfig(hostname);
export default settings;
