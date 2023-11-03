import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Content } from 'components/styled/Content';
import EditRuleWrapper from 'pricing/rules/templates/editRuleWrapper';
import CreateDiscountTemplate from 'pricing/rules/templates/CreateDiscountTemplate';
import CurrentConfig from './CurrentConfig';
import Discounts from './Discounts/Discounts';
import UserManagement from './UserManagement/UserManagement';
import TemplateSettings from './PreDefinedRules/TemplateSettings';
import { NewExchangeRates } from './ExchangeRates/NewExchangeRates';

class SettingsRoutes extends Component {
  render() {
    return (
      <Switch>
        <Redirect exact from="/settings" to="/settings/usermanagement" />
        <Content>
          <Route exact path="/settings/settings" component={() => <CurrentConfig />} />
          <Route exact path="/settings/template-settings" component={() => <TemplateSettings />} />
          <Route exact path="/settings/discounts" component={() => <Discounts />} />
          <Route exact path="/settings/discounts/create" component={() => <CreateDiscountTemplate />} />
          <Route
            exact
            path="/settings/discounts/edit/:id/:transactionId?"
            component={routing => <EditRuleWrapper {...routing} />}
          />
          {/* <Route exact path="/settings/exchangerates" component={() => <ExchangeRates />} /> */}
          <Route exact path="/settings/exchangerates" component={() => <NewExchangeRates />} />
          <Route exact path="/settings/usermanagement" component={() => <UserManagement />} />
        </Content>
      </Switch>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.appState.user
  };
};

const connected = connect(mapStateToProps)(SettingsRoutes);
export default connected;
