import * as constants from './constants';
import { getErrorConfig } from './errorConfig';

const initialState = {
  queue: []
};

export default function errorsReducer(state = initialState, action) {
  let queue;
  switch (action.type) {
    case constants.ADD_ERROR_MESSAGE:
      queue = state.queue.slice();
      queue.push({ message: action.payload.message, id: action.payload.id, type: 'error' });
      return { queue };
    case constants.ADD_API_ERROR:
    case constants.ADD_ERROR: {
      const config = getErrorConfig(action.payload.code);
      queue = state.queue.slice();
      let message = config.message;
      if (action.payload.errors) {
        message += ` ${action.payload.errors.map(x => x.message).join(' ')}`;
      }
      queue.push({ message: message, id: action.payload.id, delay: config.delay, type: 'error' });
      return { queue };
    }
    case constants.REMOVE_FEEDBACK:
      queue = state.queue.filter(feedback => {
        return feedback.id !== action.payload.id;
      });
      return { queue };
    default:
      return state;
  }
}
