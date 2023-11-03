import * as constants from './constants';

export function jobCompleted() {
  return {
    type: constants.JOB_COMPLETED,
    payload: {}
  };
}

export function subscribeToJobStatus(id) {
  return {
    type: constants.START_SUBSCRIBE,
    payload: { id }
  };
}

export function unsubscribeFromJobStatus(id) {
  return {
    type: constants.END_SUBSCRIBE,
    payload: { id }
  };
}
