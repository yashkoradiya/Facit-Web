import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Flexbox } from '../styled/Layout';
import DoneIcon from '@material-ui/icons/Done';
import WarningIcon from '@material-ui/icons/Warning';
import CircularProgress from '@material-ui/core/CircularProgress';
import BlockIcon from '@material-ui/icons/Block';
import { EVALUATE_PACKAGE_TYPES, getColumnDefinition } from './statusPanelColDefs';
import { TextButton } from '../styled/Button';
import PublishingJobModal from './PublishingJobModal';

export default function StatusPanel({ publishingJob, onClose }) {
  const [showModal, setShowModal] = useState(false);
  const publishStatus = useSelector(state => state.packagePublishStatus.publishStatus);
  const publishData = publishingJob.data.map(d => ({ ...d, status: publishStatus[d.approvalId] }));
  const groupStatus = getPublishedGroupStatus(publishData, publishStatus);
  const jobType = publishingJob.type;

  return (
    <div>
      {publishData.length > 0 && (
        <Flexbox
          style={{
            backgroundColor: getStatusColor(groupStatus),
            marginRight: '20px',
            maxHeight: '40px',
            padding: '15px',
            border: '3px',
            borderColor: '#ddd',
            verticalAlign: 'super'
          }}
        >
          <div style={{ verticalAlign: 'inherit' }}>
            {getStatusIcon(groupStatus)}
            <span style={{ verticalAlign: 'inherit' }}>
              {getStatusText(groupStatus, getPublishingStatusCount(publishData), publishData.length, jobType)}
            </span>
            <TextButton
              onClick={() => setShowModal(true)}
              style={{
                display: 'inline-block',
                verticalAlign: 'inherit'
              }}
            >
              <span>Show list</span>
            </TextButton>

            <TextButton
              onClick={onClose}
              style={{
                display: 'inline-block',
                verticalAlign: 'inherit'
              }}
            >
              <span>Close</span>
            </TextButton>
          </div>
        </Flexbox>
      )}

      <React.Fragment>
        <PublishingJobModal
          show={showModal}
          onRequestClose={() => setShowModal(false)}
          width={'900px'}
          data={publishData}
          jobType={jobType}
          columnDefinitions={getColumnDefinition(jobType)}
        />
      </React.Fragment>
    </div>
  );
}

const getStatusColor = status => {
  switch (status) {
    case 'successful':
      return '#A5E2CF';
    case 'warnings':
      return '#F7D59A';
    case 'failed':
      return '#F9999B';
    default:
      return '#fff';
  }
};

const getStatusIcon = status => {
  switch (status) {
    case 'successful':
      return <DoneIcon style={{ color: 'green', fontSize: 24, marginRight: 12 }} />;
    case 'warnings':
      return <WarningIcon />;
    case 'failed':
      return <BlockIcon />;
    default:
      return <CircularProgress style={{ marginRight: 12 }} size={20} />;
  }
};

const getStatusText = (status, publishinggStatusCount, publishingJobLength, jobType) => {
  switch (status) {
    case 'successful':
      return EVALUATE_PACKAGE_TYPES.includes(jobType)
        ? `Evaluate completed ${publishinggStatusCount} of ${publishingJobLength}`
        : `Publish completed ${publishinggStatusCount} of ${publishingJobLength}`;
    case 'warnings':
      return EVALUATE_PACKAGE_TYPES.includes(jobType)
        ? 'Evaluate completed with errors'
        : 'Publish completed with errors';
    case 'failed':
      return EVALUATE_PACKAGE_TYPES.includes(jobType) ? 'Evaluate failed' : 'Publish failed';
    default:
      return EVALUATE_PACKAGE_TYPES.includes(jobType)
        ? `Evaluating ${publishinggStatusCount + 1} of ${publishingJobLength}`
        : `Publishing ${publishinggStatusCount + 1} of ${publishingJobLength}`;
  }
};

const getPublishedGroupStatus = (offerings, publishStatus) => {
  const offeringCount = offerings.length;

  const publishedOfferings = offerings.filter(o => publishStatus[o.approvalId] === 'PUBLISHED');
  const failedOfferings = offerings.filter(o => publishStatus[o.approvalId] === 'FAILED');

  if (publishedOfferings.length === 0 && failedOfferings.length === 0) return '';

  const completed = publishedOfferings.length + failedOfferings.length === offeringCount;

  let status = 'inprogress';
  if (completed) {
    if (publishedOfferings.length === offeringCount) status = 'successful';
    if (failedOfferings.length > 0 && failedOfferings.length < offeringCount) status = 'warnings';
    if (failedOfferings.length === offeringCount) status = 'failed';
  }

  return status;
};

const getPublishingStatusCount = publishData => {
  const publishedJobs = publishData.filter(d => d.status === 'PUBLISHED');
  const failedJobs = publishData.filter(d => d.status === 'FAILED');

  return publishedJobs.length + failedJobs.length;
};
