import { Record } from 'immutable';
import * as constants from './constants';

const initialState = Record({
  publishStatus: {},
  publishJobs: {},
  packagePublishedStatus: {},
});

function publishStatusReducer(state = new initialState(), action) {
  const publishStatus = { ...state.publishStatus };
  const publishJobs = { ...state.publishJobs };

  switch (action.type) {
    case constants.START_SUBSCRIBE:
      if (!publishStatus[action.payload.approvalId]) {
        publishStatus[action.payload.approvalId] = 'PENDING';
      }
      return state.set('publishStatus', publishStatus);
    case constants.PUBLISHED:
      publishStatus[action.payload.approvalId] = action.payload.publishError ? 'FAILED' : 'PUBLISHED';
      return state.set('publishStatus', publishStatus);
    case constants.MONITOR_JOB_STARTED:
      publishJobs[action.payload.jobId] = {
        type: action.payload.jobType,
        data: action.payload.jobData,
      };
      return state.set('publishJobs', publishJobs);
    case constants.STOP_MONITOR_JOB: {
      const groupApprovalIds = publishJobs[action.payload.jobId].data.map((x) => x.approvalId);
      for (const approvalId of groupApprovalIds) {
        delete publishStatus[approvalId];
      }
      delete publishJobs[action.payload.jobId];
      return state.set('publishJobs', publishJobs).set('publishStatus', publishStatus);
    }
    case constants.PACKAGE_PUBLISH_STATUS_CHANGED:
      return state.set('packagePublishedStatus', action.payload);
    default:
      return state;
  }
}

export default publishStatusReducer;
