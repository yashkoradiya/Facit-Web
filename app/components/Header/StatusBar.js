import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../../packaging/components/PublishStatus/actions';
import { Flexbox } from '../styled/Layout';
import StatusPanel from './StatusPanel';

export default function StatusBar() {
  const dispatch = useDispatch();
  const publishJobs = useSelector(state => state.packagePublishStatus.publishJobs);

  useEffect(() => {
    const approvalIds = Object.values(publishJobs).flatMap(job => job.data.map(d => d.approvalId));
    const uniqueApprovalIds = new Set(approvalIds);
    uniqueApprovalIds.forEach(x => dispatch(actions.subscribeToSockets(x)));

    return () => {
      uniqueApprovalIds.forEach(x => dispatch(actions.unsubscribeFromSockets(x)));
    };
  }, [publishJobs, dispatch]);

  const handleOnClose = jobId => dispatch(actions.stopMonitorPublishJob(jobId));
  return (
    <Flexbox>
      {Object.keys(publishJobs).map(jobId => {
        const job = publishJobs[jobId];
        return <StatusPanel key={jobId} publishingJob={job} onClose={() => handleOnClose(jobId)} />;
      })}
    </Flexbox>
  );
}
