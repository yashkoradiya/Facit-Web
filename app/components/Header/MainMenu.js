import React, { Component } from 'react';
import { Record } from 'immutable';
import PropTypes from 'prop-types';
import MainMenuItem from './MainMenuItem';
import { Flexbox } from '../styled/Layout';

class MainMenu extends Component {
  render() {
    const { menuItems, activePath, user, position } = this.props;
    return (
      <Flexbox>
        {menuItems.map((menuItem, idx) => {
          let isActive = false;
          const activeTopLevel = activePath.split('/')[1];
          const itemTopLevel = menuItem.relativePath.split('/')[1];
          if (activeTopLevel === itemTopLevel) {
            isActive = true;
          }
          return (
            <MainMenuItem
              key={idx}
              relativePath={menuItem.relativePath}
              name={menuItem.name}
              iconIdentifier={menuItem.iconIdentifier}
              items={menuItem.items}
              active={isActive}
              roles={menuItem.roles}
              user={user}
              subMenuPosition={position}
            />
          );
        })}
      </Flexbox>
    );
  }
}

MainMenu.propTypes = {
  menuItems: PropTypes.array,
  activePath: PropTypes.string.isRequired,
  user: PropTypes.instanceOf(Record)
};

MainMenu.defaultProps = {
  menuItems: []
};

export default MainMenu;
