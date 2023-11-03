import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Content } from '../components/styled/Content';
import Sandbox from './sandbox';
import AccommodationCostDetails from './accommodation/details/AccommodationCostDetail/AccommodationCostDetails';
import AccommodationContractOverview from './accommodation/overview/AccommodationContractOverview';
import PhasingReferenceOverview from './rules/PhasingReferenceOverview';
import CreatePhasingTemplate from '../pricing/rules/templates/CreatePhasingTemplate';
import EditRuleWrapper from '../pricing/rules/templates/editRuleWrapper';

class CostRoutes extends Component {
  render() {
    return (
      <Switch>
        <Redirect exact from="/cost" to="/cost/accommodation/search" />
        <Content>
          <Route
            exact
            path="/cost/accommodation/search"
            component={() => <AccommodationContractOverview selectedCurrency={this.props.selectedCurrency} />}
          />
          <Route path="/cost/rules/overview" component={PhasingReferenceOverview} />
          <Route exact path="/cost/rules/templates/create/phasing" component={CreatePhasingTemplate} />

          <Route
            exact
            path="/cost/rules/templates/edit/:id/:transactionId?"
            component={routing => <EditRuleWrapper {...routing} />}
          />
          <Route
            path="/cost/accommodation/details/:id/:definitionId?"
            exact
            component={props => <AccommodationCostDetails {...props} />}
          />

          <Route path="/cost/sandbox" component={Sandbox} />
        </Content>
      </Switch>
    );
  }
}

const mapStateToProps = state => {
  return {
    selectedCurrency: state.appState.selectedCurrency
  };
};

const connected = connect(mapStateToProps)(CostRoutes);
export default connected;
