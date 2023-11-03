import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';
import CloseIcon from '@material-ui/icons/Close';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import IconButton from '@material-ui/core/IconButton';
import green from '@material-ui/core/colors/green';
import { removeFeedback } from './actions';
import createSelector from './selectors';
import { useSelector, useDispatch } from 'react-redux';

const variantIcon = {
  success: CheckCircleIcon,
  error: ErrorIcon
};

function TransitionRight(props) {
  return <Slide {...props} direction="right" />;
}

const queue = [];

const Feedback = ({ classes }) => {
  const [open, setOpen] = useState(false);
  const [messageInfo, setMessageInfo] = useState({});
  const dispatch = useDispatch();
  const state = useSelector(state => createSelector(state));

  useEffect(() => {
    if (!state.feedback || !state.feedback.message) return;

    queue.push({
      feedback: state.feedback
    });

    if (open) {
      handleClose();
    } else {
      processQueue();
    }
  }, [state.feedback, open, handleClose]);

  const handleCloseClick = (e, reason) => {
    if (reason == 'clickaway') return;

    handleClose();
  };

  const handleClose = useCallback(() => {
    setOpen(false);
    remove(messageInfo.feedback.id);
  }, [messageInfo.feedback, remove]);

  const remove = useCallback(id => dispatch(removeFeedback(id)), [dispatch]);

  const handleExited = () => {
    processQueue();
  };

  const processQueue = () => {
    if (queue.length > 0) {
      setMessageInfo(queue.shift());
      setOpen(true);
    }
  };

  const feedback = messageInfo.feedback;
  if (!feedback || !feedback.message) return null;

  const Icon = variantIcon[feedback.type];

  return (
    <Snackbar
      key={feedback.id}
      open={open}
      autoHideDuration={feedback.delay}
      TransitionComponent={TransitionRight}
      onClose={handleClose}
      onExited={handleExited}
      ContentProps={{
        'aria-describedby': 'message-id'
      }}
      message={
        <span id="message-id" className={classes.message}>
          {Icon && <Icon className={classNames(classes.icon, classes.iconVariant, classes[feedback.type])} />}
          {feedback.message}
        </span>
      }
      action={[
        <IconButton key="close" aria-label="Close" color="inherit" className={classes.close} onClick={handleCloseClick}>
          <CloseIcon />
        </IconButton>
      ]}
    />
  );
};

Feedback.propTypes = {
  feedback: PropTypes.any,
  errorQueue: PropTypes.array
};

Feedback.defaultProps = {
  feedback: {}
};

const styles = theme => ({
  close: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit
  },
  success: {
    color: green[600]
  },
  error: {
    color: theme.palette.error.dark
  },
  message: {
    display: 'flex',
    alignItems: 'center'
  }
});

const styledComponent = withStyles(styles)(Feedback);

export default styledComponent;
