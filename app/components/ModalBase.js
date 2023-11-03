import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { isEscapeKey } from '../helpers/keyChecker';
import { ModalBackground, ModalContainer, ModalContent, ModalHeader, ModalCloseButton } from './styled/Modal';

class ModalBase extends PureComponent {
  handleClick = event => {
    if (event.target.className.includes && event.target.className.includes('ModalBackground')) {
      this.props.onRequestClose();
    }
  };

  componentDidMount() {
    document.addEventListener('keyup', this.handleKeyUp);
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.handleKeyUp);
  }

  handleKeyUp = event => {
    if (isEscapeKey(event.which) && this.props.show) {
      this.props.onRequestClose();
    }
  };

  handleScrollLock = isLocked => {
    if (isLocked) document.body.classList.add('isLocked');
    else document.body.classList.remove('isLocked');
  };

  render() {
    const { show, height, width, title, marginTop, children, onRequestClose } = this.props;
    this.handleScrollLock(show);

    return (
      <ModalBackground show={show} onClick={this.handleClick}>
        <ModalContainer marginTop={marginTop} width={width} height={height}>
          {title && (
            <ModalHeader>
              {title}
              <ModalCloseButton onClick={onRequestClose}>
                <i className="material-icons">close</i>
              </ModalCloseButton>
            </ModalHeader>
          )}
          <ModalContent>{children}</ModalContent>
        </ModalContainer>
      </ModalBackground>
    );
  }
}

ModalBase.propTypes = {
  show: PropTypes.bool.isRequired,
  title: PropTypes.string,
  onRequestClose: PropTypes.func.isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
  marginTop: PropTypes.string
};

export default ModalBase;
