import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ModalBase from './ModalBase';
import { DeleteButton, Button } from './styled/Button';
import { Flexbox, TextBlock } from './styled/Layout';

class ConfirmButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };

    this.handleConfirmClick = this.handleConfirmClick.bind(this);
    this.handleCancelClick = this.handleCancelClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }
  handleCancelClick() {
    this.setState({
      open: false
    });
  }

  handleConfirmClick(e) {
    this.setState({
      open: false
    });

    this.props.onClick(e);
  }

  handleDeleteClick() {
    this.setState({
      open: true
    });
  }

  render() {
    const { children, confirmContent, confirmButtonText, confirmCancelButtonText } = this.props;
    return (
      <React.Fragment>
        <DeleteButton marginRight={'10px'} onClick={this.handleDeleteClick}>
          {children}
        </DeleteButton>

        <ModalBase
          width={'500px'}
          height={'200px'}
          show={this.state.open}
          onRequestClose={this.handleCancelClick}
          title={'Confirm'}
        >
          <Flexbox direction={'column'} alignItems="flex-start" justifyContent="space-between">
            <Flexbox height={'50px'} width={'90%'}>
              <TextBlock fontSize={'14px'}>{confirmContent}</TextBlock>
            </Flexbox>
            <Flexbox width={'100%'} height={'60px'} alignItems={'flex-end'} justifyContent={'flex-end'}>
              <DeleteButton marginRight={'20px'} onClick={this.handleConfirmClick}>
                {confirmButtonText}
              </DeleteButton>
              <Button onClick={this.handleCancelClick}>{confirmCancelButtonText}</Button>
            </Flexbox>
          </Flexbox>
        </ModalBase>
      </React.Fragment>
    );
  }
}

ConfirmButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.any,
  confirmTitle: PropTypes.string,
  confirmContent: PropTypes.object,
  confirmButtonText: PropTypes.string,
  confirmCancelButtonText: PropTypes.string
};

ConfirmButton.defaultProps = {
  children: 'Delete',
  confirmTitle: 'Are you sure?',
  confirmContent: null,
  confirmButtonText: 'Delete',
  confirmCancelButtonText: 'Cancel'
};

export default ConfirmButton;
