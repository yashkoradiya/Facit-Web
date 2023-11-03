import React, { PureComponent } from 'react';
import {
  DropdownButtonListContainer,
  DropdownButtonListTitle,
  DropdownButtonList,
  DropdownButton
} from '../styled/Button';
import { v4 as uuidv4 } from 'uuid';

export default class ButtonList extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };
    this.instanceId = uuidv4();
    document.addEventListener('click', this.handleClick);
  }

  componentWillUnmount = () => {
    document.removeEventListener('click', this.handleClick);
  };

  toggleMenu = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  handleClick = e => {
    const targetClass = e.target.className;

    if (!targetClass || typeof targetClass !== 'string' || !targetClass.includes(this.instanceId)) {
      this.setState({ isOpen: false });
    }
  };

  render() {
    const { children, title, style } = this.props;
    const { isOpen } = this.state;

    if (!children || children.length === 0) return null;

    return (
      <DropdownButtonListContainer className={this.instanceId} style={style}>
        <DropdownButtonListTitle onClick={this.toggleMenu} className={this.instanceId}>
          {title}
        </DropdownButtonListTitle>
        <DropdownButtonList isOpen={isOpen} className={this.instanceId}>
          {isOpen &&
            children.map((childButton, index) => {
              return (
                <DropdownButton key={`key_${index}`} className={this.instanceId}>
                  {childButton}
                </DropdownButton>
              );
            })}
        </DropdownButtonList>
      </DropdownButtonListContainer>
    );
  }
}
