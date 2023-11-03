import { takeLatest, put, fork, all } from 'redux-saga/effects';
import * as signalrActions from '../../..//core/signalr/actions';
import * as constants from './constants';
import * as actions from './actions';

export function* handleStartSubscription(action) {
  const { approvalId } = action.payload;
  const group = getGroupName(approvalId);
  yield put(signalrActions.subscribeGroup('packagePublished', group, actions.packagePublished));
}

export function* handleUnsusbcribe(action) {
  const { approvalId } = action.payload;
  const group = getGroupName(approvalId);
  yield put(signalrActions.unsubscribeGroup('packagePublished', group));
}
function getGroupName(approvalId) {
  return `Packaging.Publish.${approvalId}`;
}

export function* handleStartSubscriptionPublishStatusChanged() {
  yield put(
    signalrActions.subscribeGroup(
      'packagePublishStatusChanged',
      'Packaging.Publish.Status.Changed',
      actions.packagePublishStatusChanged
    )
  );
}

export function* handleUnsubscribePublishStatusChanged() {
  yield put(signalrActions.unsubscribeGroup('packagePublishStatusChanged', 'Packaging.Publish.Status.Changed'));
}

export function* watch() {
  yield takeLatest(constants.START_SUBSCRIBE, handleStartSubscription);
  yield takeLatest(constants.END_SUBSCRIBE, handleUnsusbcribe);
  yield takeLatest(
    constants.START_SUBSCRIBE_PACKAGE_PUBLISH_STATUS_CHANGED,
    handleStartSubscriptionPublishStatusChanged
  );
  yield takeLatest(constants.END_SUBSCRIBE_PACKAGE_PUBLISH_STATUS_CHANGED, handleUnsubscribePublishStatusChanged);
}

export default function* root() {
  yield all([fork(watch)]);
}
