import { localAWSConfig } from 'aws-config';
import config from './config';
import { getConfig } from './settings';

describe('Settings', () => {
  it('localhost is using local endpoints', () => {
    const settings = getConfig('localhost');
    delete settings['ENVIRONMENT'];
    expect(settings).toEqual({ ...config['LOCAL'], COGNITO: localAWSConfig });
  });
});
