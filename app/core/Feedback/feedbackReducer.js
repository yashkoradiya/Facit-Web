import * as constants from './constants';

const initialState = {
  queue: []
};

export default function feedbackReducer(state = initialState, action) {
  let queue;
  switch (action.type) {
    case constants.ADD_FEEDBACK:
      queue = state.queue.slice();
      queue.push({ message: action.payload.message, id: action.payload.id, delay: 6000, type: 'success' });
      return { queue };
    case constants.REMOVE_FEEDBACK:
      queue = state.queue.filter(feedback => {
        return feedback.id !== action.payload.id;
      });
      return { queue };
    default:
      return state;
  }
}
