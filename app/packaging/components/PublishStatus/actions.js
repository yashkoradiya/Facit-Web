import * as constants from './constants';

export function subscribeToSockets(approvalId) {
  return {
    type: constants.START_SUBSCRIBE,
    payload: { approvalId },
  };
}

export function unsubscribeFromSockets(approvalId) {
  return {
    type: constants.END_SUBSCRIBE,
    payload: { approvalId },
  };
}

export function packagePublished(payload) {
  return {
    type: constants.PUBLISHED,
    payload,
  };
}

export function startPublishJob(jobId, jobType, jobData) {
  return {
    type: constants.JOB_STARTED,
    payload: { jobId, jobType, jobData },
  };
}

export function monitorPublishJob(jobId, jobType, jobData) {
  return {
    type: constants.MONITOR_JOB_STARTED,
    payload: { jobId, jobType, jobData },
  };
}

export function publishJobCompleted(jobId) {
  return {
    type: constants.JOB_COMPLETED,
    jobId,
  };
}

export function stopMonitorPublishJob(jobId) {
  return {
    type: constants.STOP_MONITOR_JOB,
    payload: { jobId },
  };
}

export function subscribeToPackagePublishStatusChanged() {
  return {
    type: constants.START_SUBSCRIBE_PACKAGE_PUBLISH_STATUS_CHANGED,
  };
}

export function unSubscribeToPackagePublishStatusChanged() {
  return {
    type: constants.END_SUBSCRIBE_PACKAGE_PUBLISH_STATUS_CHANGED,
  };
}

export function packagePublishStatusChanged(payload) {
  return {
    type: constants.PACKAGE_PUBLISH_STATUS_CHANGED,
    payload,
  };
}
