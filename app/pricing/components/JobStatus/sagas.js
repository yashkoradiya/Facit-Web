import { takeLatest, put, fork, all } from 'redux-saga/effects';
import * as signalrActions from '../../..//core/signalr/actions';
import * as constants from './constants';
import * as actions from './actions';

export function* handleStartSubscription(action) {
  const { id } = action.payload;
  const group = getGroupName(id);
  yield put(signalrActions.subscribeGroup('jobCompleted', group, actions.jobCompleted));
}

export function* handleUnsusbcribe(action) {
  const { id } = action.payload;
  const group = getGroupName(id);
  yield put(signalrActions.unsubscribeGroup('jobCompleted', group));
}

function getGroupName(id) {
  return `Rules.JobStatus.${id}`;
}

export function* watch() {
  yield takeLatest(constants.START_SUBSCRIBE, handleStartSubscription);
  yield takeLatest(constants.END_SUBSCRIBE, handleUnsusbcribe);
}

export default function* root() {
  yield all([fork(watch)]);
}
