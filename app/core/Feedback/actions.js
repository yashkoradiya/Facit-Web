import * as constants from './constants';
import { v4 as uuidv4 } from 'uuid';

export function addError(code) {
  return {
    type: constants.ADD_ERROR,
    payload: {
      code,
      id: uuidv4()
    }
  };
}

export function addApiError(response) {
  return {
    type: constants.ADD_API_ERROR,
    payload: {
      code: response.status,
      errors: response.data.errors,
      id: uuidv4()
    }
  };
}

export function addErrorMessage(message) {
  return {
    type: constants.ADD_ERROR_MESSAGE,
    payload: {
      message,
      id: uuidv4()
    }
  };
}

export function addFeedback(message) {
  return {
    type: constants.ADD_FEEDBACK,
    payload: {
      message,
      id: uuidv4()
    }
  };
}

export function removeFeedback(id) {
  return {
    type: constants.REMOVE_FEEDBACK,
    payload: {
      id
    }
  };
}
