import { fork, all } from 'redux-saga/effects';
import signalrSaga from '../core/signalr/saga';
import jobStatusSaga from '../pricing/components/JobStatus/sagas';
import packagePublishStatusSagas from '../packaging/components/PublishStatus/sagas';
import announcementsSaga from '../core/announcements/announcementSaga';

export default function* root() {
  yield all([fork(jobStatusSaga), fork(packagePublishStatusSagas), fork(announcementsSaga), fork(signalrSaga)]);
}
