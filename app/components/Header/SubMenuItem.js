import * as React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { colours } from '../styled/defaults';

const SubMenuItem = ({ isFirstItem, isLastItem, item, user }) => {
  const { name, relativePath, iconIdentifier, roles } = item;
  const isActive = window.location.pathname.indexOf(relativePath) !== -1;

  const currentUserRoles = user.roles;
  if (roles) {
    let found = roles.some(r => currentUserRoles.includes(r));
    if (!found) return null;
  }
  return (
    <StyledSubMenuItem isActive={isActive} isFirstItem={isFirstItem} isLastItem={isLastItem}>
      <NavLink key={name} to={relativePath} activeClassName="active">
        <i className="material-icons">{iconIdentifier}</i>
        <SubMenuLabel isActive={isActive} isFirstItem={isFirstItem}>
          {name}
        </SubMenuLabel>
      </NavLink>
    </StyledSubMenuItem>
  );
};

const SubMenuLabel = styled.span`
  display: block;
  text-decoration: ${props => (props.isActive ? 'underline' : 'none')};
`;

const StyledSubMenuItem = styled.div`
  color: ${colours.tuiBlue500};
  background-color: ${colours.tuiBlue100};
  height: 34px;
  padding-right: 2px;
  margin-right: ${props => (props.isLastItem ? '-10px' : 0)};
  margin-left: ${props => (props.isFirstItem ? '10px' : 0)};
  & > a {
    display: flex;
    justify-content: center;
    padding-top: 1px;
    padding-bottom: 1px;
    padding-right: 5px;
    padding-left: 5px;
    margin-top: 8px;
    align-self: baseline;
    color: ${colours.tuiBlue500};
    text-decoration: none;
    white-space: nowrap;
    font-weight: normal;
    border-left: ${props => (props.isFirstItem ? 'none' : `1px solid ${colours.tuiBlue500}`)};
    padding-left: ${props => (props.isFirstItem ? '0px' : '10px')};

    & > i {
      margin-right: 4px;
      font-size: 16px;
      color: ${colours.tuiBlue500};
    }
  }

  &:hover {
    background-color: ${colours.tuiBlue200};
  }
`;

export default SubMenuItem;
