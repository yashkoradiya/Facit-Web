export const SOCKETS_CONNECTION_FAILED = 'facit/feedback/error/codes/SOCKETS_CONNECTION_FAILED';

const errorConfig = {
  [SOCKETS_CONNECTION_FAILED]: {
    delay: 10000,
    message: 'Sockets connection failed, real time updates not available'
  },
  403: {
    delay: 6000,
    message: 'You are not authorized to perform this specific action.'
  },
  400: {
    delay: 6000,
    message: 'Bad request. Check your input.'
  },
  422: {
    delay: 6000,
    message: 'Input data not valid.'
  }
};

export const getErrorConfig = code => {
  const config = errorConfig[code];
  return config ? config : { delay: 6000, message: `Something went wrong. (${code})` };
};
