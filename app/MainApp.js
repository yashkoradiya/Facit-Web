import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Feedback from './core/Feedback';
import Announcements from './core/announcements/Announcements';
import * as announcementConstants from './core/announcements/constants';
import Callback from 'Callback';
import Header from './components/Header/Header';
import CostRoutes from './cost/costRoutes';
import PricingRoutes from './pricing/pricingRoutes';
import PackagingRoutes from './packaging/packagingRoutes';
import SettingsRoutes from './settings/SettingsRoutes';
import Inbox from './inbox/Inbox';
import AccessPendingPage from './components/User/AccessPendingPage';

class MainApp extends Component {
  componentDidMount() {
    this.props.subscribeToAnnouncements();
  }

  isUserAccessDenied = user => {
    const userRoles = user.get('roles');
    const userSourceMarkets = user.get('sourcemarkets');

    if (
      !user ||
      !userRoles.size ||
      userRoles.includes('new_user') ||
      !userRoles.some(item => {
        const words = item.split('.');
        return words.includes('read') || words.includes('write');
      }) ||
      !userSourceMarkets
    ) {
      return true;
    }
  };

  render() {
    const { location, user } = this.props;

    if (this.isUserAccessDenied(user)) {
      return (
        <div data-testid="new-user-container">
          <Header user={user} locationPath={location.pathname} showCurrency={false} />
          <Switch>
            <Route path="/callback" component={() => <Callback />} />
            <Route path="/" component={() => <AccessPendingPage user={user} />} />
          </Switch>
        </div>
      );
    }

    const showMenu =
      [
        '/packaging/charter-package/details',
        '/packaging/package/details',
        '/packaging/charter-flight/details',
        '/packaging/transfers/details'
      ].indexOf(this.props.location.pathname) === -1;

    return (
      <div style={{ height: '100%' }} data-testid="container">
        {showMenu && (
          <Header user={user} locationPath={location.pathname} menuItems={menuItems} settingsMenu={settingsMenu} />
        )}
        <Switch>
          <Route path="/" exact component={() => <Inbox />} />
          <Route path="/callback" component={() => <Callback />} />
          <Route path="/pricing/" component={() => <PricingRoutes />} />
          <Route path="/packaging/" component={() => <PackagingRoutes />} />
          <Route path="/cost/" component={() => <CostRoutes />} />
          <Route path="/settings/" component={() => <SettingsRoutes />} />
          <Route
            component={() => (
              <div style={{ paddingTop: 48, textAlign: 'center' }}>
                <h2>Page not found..</h2>
              </div>
            )}
          />
        </Switch>
        <Announcements />
        <Feedback />
      </div>
    );
  }
}

MainApp.propTypes = {
  user: PropTypes.any //eslint-disable-line
};

MainApp.defaultProps = {
  user: null
};

function mapStateToProps(state) {
  return {
    user: state.appState.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    subscribeToAnnouncements: () => {
      dispatch({
        type: announcementConstants.START_SUBSCRIBE
      });
    }
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MainApp));

const menuItems = [
  {
    name: 'COST',
    relativePath: '/cost',
    items: [
      {
        name: 'Accommodation contract overview',
        iconIdentifier: 'description',
        relativePath: '/cost/accommodation/search',
        roles: ['contracts.accommodations.read', 'contracts.accommodations.write']
      },
      {
        name: 'Phasing rules overview',
        iconIdentifier: 'show_chart',
        relativePath: '/cost/rules/overview',
        roles: ['phasing.templates.read', 'phasing.templates.write']
      }
    ]
  },
  {
    name: 'PRICING',
    relativePath: '/pricing',
    items: [
      {
        name: 'Templates overview',
        iconIdentifier: 'layers',
        relativePath: '/pricing/rules/overview',
        roles: [
          'packagetemplates.accommodationonly.read',
          'packagetemplates.accommodationonly.write',
          'packagetemplates.charterpackage.read',
          'packagetemplates.charterpackage.write',
          'packagetemplates.bulkadjustment.read',
          'packagetemplates.bulkadjustment.write',
          'packagetemplates.minmax.read',
          'packagetemplates.minmax.write',
          'componenttemplates.accommodationcomponents.read',
          'componenttemplates.accommodationcomponents.write',
          'componenttemplates.ancillary.read',
          'componenttemplates.ancillary.write',
          'componenttemplates.boardupgrade.read',
          'componenttemplates.boardupgrade.write',
          'componenttemplates.distributioncost.write',
          'componenttemplates.distributioncost.read',
          'componenttemplates.flightdistributioncost.write',
          'componenttemplates.flightdistributioncost.read',
          'componenttemplates.dynamiccruise.read',
          'componenttemplates.dynamiccruise.write',
          'componenttemplates.flightsupplements.read',
          'componenttemplates.flightsupplements.write',
          'componenttemplates.mandatorysupplement.read',
          'componenttemplates.mandatorysupplement.write',
          'componenttemplates.misccost.read',
          'componenttemplates.misccost.write',
          'componenttemplates.overoccupancy.read',
          'componenttemplates.overoccupancy.write',
          'componenttemplates.roomupgrade.read',
          'componenttemplates.roomupgrade.write',
          'componenttemplates.underoccupancy.read',
          'componenttemplates.underoccupancy.write',
          'componenttemplates.vat.read',
          'componenttemplates.vat.write',
          'componenttemplates.flightvat.write',
          'componenttemplates.flightvat.read',
          'componenttemplates.guaranteefundaccom.write',
          'componenttemplates.guaranteefundaccom.read',
          'componenttemplates.guaranteefundflight.write',
          'componenttemplates.guaranteefundflight.read'
        ]
      },
      {
        name: 'Cost Labels',
        iconIdentifier: 'list',
        relativePath: '/pricing/additional-cost/cost-labels',
        roles: ['componenttemplates.misccost.write', 'componenttemplates.misccost.read']
      },
      {
        name: 'Sandbox',
        roles: ['developer'],
        iconIdentifier: 'insert_emoticon',
        relativePath: '/pricing/sandbox'
      }
    ]
  },
  {
    name: 'PACKAGING',
    relativePath: '/packaging',
    items: [
      // {
      //   name: 'Accommodation Only',
      //   iconIdentifier: 'home',
      //   relativePath: '/packaging/accommodation-only/search',
      //   roles: ['publishpackages.accommodationonly.read', 'publishpackages.accommodationonly.write']
      // },
      {
        name: 'Charter Flight',
        iconIdentifier: 'flight',
        relativePath: '/packaging/charter-flight/search',
        roles: ['publishcomponents.flightsupplements.read', 'publishcomponents.flightsupplements.write']
      },
      {
        name: 'Transfers',
        iconIdentifier: 'directions_car',
        relativePath: '/packaging/transfers/search',
        roles: ['publishpackages.transfer.read', 'publishpackages.transfer.write']
      },
      {
        name: 'Accommodation Product',
        iconIdentifier: 'card_giftcard',
        relativePath: '/packaging/charter-package/search',
        roles: ['publishpackages.charterpackage.read', 'publishpackages.charterpackage.write']
      },
      {
        name: 'Dynamic Cruise',
        iconIdentifier: 'directions_boat',
        relativePath: '/packaging/dynamic-cruise/search',
        roles: ['publishpackages.dynamiccruise.read', 'publishpackages.dynamiccruise.write']
      },
      {
        name: 'Package',
        iconIdentifier: 'card_giftcard',
        relativePath: '/packaging/package/search',
        roles: ['publishpackages.charterpackage.read', 'publishpackages.charterpackage.write']
      }
    ]
  }
];

const settingsMenu = [
  {
    name: 'SETTINGS',
    relativePath: '/settings',
    items: [
      {
        name: 'Template settings',
        iconIdentifier: 'tune',
        relativePath: '/settings/template-settings',
        roles: ['settings.templatesettings.read', 'settings.templatesettings.write']
      },
      {
        name: 'Discounts',
        iconIdentifier: 'local_offer',
        relativePath: '/settings/discounts',
        roles: ['settings.discounts.read', 'settings.discounts.write']
      },
      // {
      //   name: 'Exchange rates',
      //   iconIdentifier: 'swap_horiz',
      //   relativePath: '/settings/exchangerates',
      //   roles: ['settings.exchangerates.read', 'settings.exchangerates.write']
      // },
      {
        name: 'Exchange rates',
        iconIdentifier: 'swap_horiz',
        relativePath: '/settings/exchangerates',
        roles: ['settings.exchangerates.read', 'settings.exchangerates.write']
      },
      {
        name: 'Current configuration',
        iconIdentifier: 'settings_ethernet',
        roles: ['developer'],
        relativePath: '/settings/settings'
      },
      {
        name: 'User roles',
        iconIdentifier: 'emoji_people',
        roles: ['settings.userroles.read', 'settings.userroles.write'],
        relativePath: '/settings/usermanagement'
      }
    ]
  }
];
