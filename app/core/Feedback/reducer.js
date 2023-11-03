import { combineReducers } from 'redux';
import errorsReducer from './errorsReducer';
import feedbackReducer from './feedbackReducer';

export default combineReducers({
  errors: errorsReducer,
  feedback: feedbackReducer
});
