import { Record } from 'immutable';
import * as constants from './constants';

const initialState = Record({
  jobCompleted: false
});

function jobStatusReducer(state = new initialState(), action) {
  switch (action.type) {
    case constants.START_SUBSCRIBE: 
      return state.set('jobCompleted', false);
      case constants.END_SUBSCRIBE: 
      return state.set('jobCompleted', false);
    case constants.JOB_COMPLETED:
      return state.set('jobCompleted', true);
    default:
      return state;
  }
}

export default jobStatusReducer;
