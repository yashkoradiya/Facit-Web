import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import MainMenu from './MainMenu';
import CurrentUser from './CurrentUser';
import Version from './Version';
import StatusBar from './StatusBar';
import * as appStateActions from '../../appState/appStateActions';
import CurrencySelector from '../FormFields/CurrencySelector';
import { HeaderContainer, HeaderLogo, HeaderTextLogo, Environment } from '../styled/Header';
import { Flexbox } from '../styled/Layout';
import { Camera } from '@material-ui/icons';
import settings from '../../core/settings/settings';
import { colours } from '../styled/defaults';

const StyledNavLink = styled(NavLink)`
  &:hover {
    text-decoration: none;
  }
`;

const Header = props => {
  const { menuItems, user, locationPath, showCurrency, changeCurrency, selectedCurrency, settingsMenu } = props;

  let backgroundColour;
  if (settings.PRODUCTION && user && user.get('roles').size > 0) {
    backgroundColour = user.get('roles').includes('developer') ? 'orangered' : colours.tuiBlue300;
  } else {
    backgroundColour = settings.ENVIRONMENTCOLOUR;
  }

  return (
    <div style={{ height: '80px' }}>
      <HeaderContainer backgroundColour={backgroundColour}>
        <Flexbox>
          <StyledNavLink to="/">
            <HeaderLogo>
              <Camera />
              <HeaderTextLogo>Facit</HeaderTextLogo>
            </HeaderLogo>
          </StyledNavLink>
          <MainMenu menuItems={menuItems} activePath={locationPath} user={user} />
        </Flexbox>
        {!settings.PRODUCTION && <Environment>{settings.ENVIRONMENT}</Environment>}
        <Flexbox>
          <StatusBar />
          {showCurrency && <CurrencySelector onChange={changeCurrency} selectedCurrency={selectedCurrency} />}
          {user && <CurrentUser profile={user} />}
          <Version />
          <div style={{ marginLeft: 10 }}>
            <MainMenu menuItems={settingsMenu} activePath={locationPath} user={user} position="right" />
          </div>
        </Flexbox>
      </HeaderContainer>
    </div>
  );
};

Header.propTypes = {
  menuItems: PropTypes.array,
  user: PropTypes.object,
  locationPath: PropTypes.string.isRequired,
  showCurrency: PropTypes.bool,
  onCurrencyChange: PropTypes.func,
  selectedCurrency: PropTypes.string
};

Header.defaultProps = {
  menuItems: [],
  showCurrency: true
};

function mapDispatchToProps(dispatch) {
  return {
    changeCurrency: currency => dispatch(appStateActions.changeCurrency(currency))
  };
}

function mapStateToProps(state) {
  return {
    user: state.appState.user,
    selectedCurrency: state.appState.selectedCurrency
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
