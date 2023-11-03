import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as actions from './actions';

class JobStatus extends React.Component {
  componentDidMount() {
    if (this.props.jobId) {
      this.props.subscribeToJobStatusWatcher(this.props.jobId);
    }
  }
  componentWillUnmount() {
    this.props.unsubscribeFromJobStatusWatcher(this.props.jobId);
  }

  componentDidUpdate(prevProps) {
    if (this.props.jobId !== prevProps.jobId && this.props.jobId) {
      this.props.subscribeToJobStatusWatcher(this.props.jobId);
    }
    if (this.props.jobCompleted && !prevProps.jobCompleted) {
      this.props.unsubscribeFromJobStatusWatcher(prevProps.jobId);
      this.props.onJobCompleted();
    }
  }

  render() {
    return this.props.content;
  }
}

const mapStateToProps = state => {
  return {
    jobCompleted: state.jobStatus.jobCompleted
  };
};

function mapDispatchToProps(dispatch) {
  return {
    subscribeToJobStatusWatcher: jobId => {
      dispatch(actions.subscribeToJobStatus(jobId));
    },
    unsubscribeFromJobStatusWatcher: jobId => {
      dispatch(actions.unsubscribeFromJobStatus(jobId));
    }
  };
}

JobStatus.propTypes = {
  jobId: PropTypes.string,
  jobCompleted: PropTypes.bool.isRequired,
  onJobCompleted: PropTypes.func,
  content: PropTypes.object
};
JobStatus.defaultProps = {
  jobCompleted: false,
  onJobCompleted: () => {},
  content: null
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JobStatus);
