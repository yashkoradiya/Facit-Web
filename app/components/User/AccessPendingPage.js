import * as React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Icon from '@material-ui/core/Icon';

const styles = theme => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: theme.spacing.unit * 2,
    padding: theme.spacing.unit * 2
  },
  icon: {
    fontSize: 72,
    margin: theme.spacing.unit
  }
});

class AccessPendingPage extends React.Component {
  render() {
    const { classes, user } = this.props;
    const name = user.name;
    return (
      <Paper className={classes.wrapper}>
        <h2>User access pending</h2>
        <Icon className={classes.icon}>fingerprint</Icon>
        <div>
          Hello <strong>{name}</strong>, your user is currently awaiting approval.
        </div>
      </Paper>
    );
  }
}

AccessPendingPage.propTypes = {
  user: PropTypes.object
};

const styledComponent = withStyles(styles)(AccessPendingPage);
export default withRouter(styledComponent);
