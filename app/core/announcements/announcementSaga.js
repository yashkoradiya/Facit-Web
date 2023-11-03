import { takeLatest, put, fork, all } from 'redux-saga/effects';
import * as signalrActions from '../signalr/actions';
import { addAnnouncement } from './actions';
import * as constants from './constants';

export function* handleStartSubscription() {
  const group = getGroupName();
  yield put(signalrActions.subscribeGroup('announcement', group, addAnnouncement));
}

export function* handleUnsusbcribe() {
  const group = getGroupName();
  yield put(signalrActions.unsubscribeGroup('announcement', group));
}

function getGroupName() {
  return `System.Announcements`;
}

export function* watch() {
  yield takeLatest(constants.START_SUBSCRIBE, handleStartSubscription);
  yield takeLatest(constants.END_SUBSCRIBE, handleUnsusbcribe);
}

export default function* root() {
  yield all([fork(watch)]);
}
