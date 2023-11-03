import { combineReducers } from 'redux';
import feedbackReducer from '../core/Feedback/reducer';
import jobStatusReducer from '../pricing/components/JobStatus/reducer';
import appStateReducer from '../appState/appStateReducer';
import packagePublishStatusReducer from '../packaging/components/PublishStatus/reducer';
import announcementReducer from '../core/announcements/announcementReducer';

export default combineReducers({
  feedback: feedbackReducer,
  appState: appStateReducer,
  jobStatus: jobStatusReducer,
  packagePublishStatus: packagePublishStatusReducer,
  announcements: announcementReducer
});
