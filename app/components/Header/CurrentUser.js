import React from 'react';
import PropTypes from 'prop-types';
import { Person as PersonIcon } from '@material-ui/icons';
import ModalBase from '../ModalBase';
import { IconButton } from '../styled/Button';
import { Flexbox } from '../styled/Layout';

class CurrentUser extends React.Component {
  state = {
    open: false
  };

  handleClickOpen = () => {
    this.setState({
      open: true
    });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    return (
      <Flexbox marginRight="10px">
        <IconButton onClick={this.handleClickOpen}>
          <PersonIcon fontSize="inherit" />
        </IconButton>

        <ModalBase show={this.state.open} onRequestClose={this.handleClose}>
          <h3>Current logged in user:</h3>
          {this.props.profile.name}
        </ModalBase>
      </Flexbox>
    );
  }
}

CurrentUser.propTypes = {
  onClose: PropTypes.func,
  profile: PropTypes.object.isRequired
};

export default CurrentUser;
