import axios from 'axios';
import { createHeadersFromToken } from './createHeadersFromToken';
import createCurrencyHeaders from './createCurrencyHeaders';

export function makeRequest(config) {
  return new Promise((resolve, reject) => {
    // create Authorization header based on Token.
    // compose it with currencies header.
    createHeadersFromToken()
      .then(tokenAuthHeader => {
        // compose all headers.
        //let allHeaders = Object.assign({}, tokenAuthHeader);
        let allHeaders = Object.assign({}, tokenAuthHeader, createCurrencyHeaders());
        config.headers = allHeaders;
        axios(config)
          .then(response => {
            resolve(response);
          })
          .catch(err => {
            reject(err);
          });
      })
      .catch(err => {
        reject(err);
      });
  });
}

export function makeRequestWithoutAuth(config) {
  return new Promise((resolve, reject) => {
    axios(config)
      .then(response => {
        resolve(response);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export function put(url, data, shouldAuthenticate = true, requestConfig = {}) {
  requestConfig.url = url;
  requestConfig.method = 'PUT';
  requestConfig.data = data;
  if (shouldAuthenticate) {
    return makeRequest(requestConfig);
  } else {
    return makeRequestWithoutAuth(requestConfig);
  }
}
export function post(url, data, shouldAuthenticate = true, requestConfig = {}) {
  requestConfig.url = url;
  requestConfig.method = 'POST';
  requestConfig.data = data;
  if (shouldAuthenticate) {
    return makeRequest(requestConfig);
  } else {
    return makeRequestWithoutAuth(requestConfig);
  }
}
const del = (url, data, shouldAuthenticate = true, requestConfig = {}) => {
  requestConfig.url = url;
  requestConfig.method = 'DELETE';
  requestConfig.data = data;

  if (shouldAuthenticate) {
    return makeRequest(requestConfig);
  } else {
    return makeRequestWithoutAuth(requestConfig);
  }
};
export { del as delete }; //cannot directly export delete because it is a keyword in JS

export function get(url, data, shouldAuthenticate = true, requestConfig = {}) {
  requestConfig.url = url;
  requestConfig.method = 'GET';
  requestConfig.params = data;
  if (shouldAuthenticate) {
    return makeRequest(requestConfig);
  } else {
    return makeRequestWithoutAuth(requestConfig);
  }
}
