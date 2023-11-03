import React from 'react';
import { NavLink } from 'react-router-dom';
import SubMenuItem from './SubMenuItem';
import { TopNavigationItem, SubMenuBar } from '../styled/Header';

const MainMenuItem = props => {
  const currentUserRoles = props.user.roles;
  const subItems = props.items.filter(x => checkAccess(currentUserRoles, x.roles));
  if (!subItems.length) {
    return null;
  }

  const exact = props.relativePath === '/' ? true : false;
  return (
    <React.Fragment>
      <TopNavigationItem isActive={props.active} hasSubItems={!!subItems}>
        <NavLink exact={exact} to={props.relativePath}>
          <i className="material-icons">{props.iconIdentifier}</i> {props.name}
        </NavLink>
      </TopNavigationItem>
      {subItems && (
        <SubMenuBar isActive={props.active} position={props.subMenuPosition}>
          {subItems.map((item, index) => (
            <SubMenuItem
              key={index}
              isFirstItem={index === 0}
              isLastItem={subItems.length - 1 === index}
              user={props.user}
              item={item}
            />
          ))}
        </SubMenuBar>
      )}
    </React.Fragment>
  );
};

export default MainMenuItem;

const checkAccess = (userRoles, routeRoles) => {
  const hasUserRoles = !routeRoles || routeRoles.some(r => userRoles.includes(r));
  return hasUserRoles;
};
