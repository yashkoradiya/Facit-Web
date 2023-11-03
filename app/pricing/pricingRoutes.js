import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Content } from '../components/styled/Content';
import CostLabels from './costLabels';
import RulesOverview from './rules/rules-overview/RulesOverview';
import Sandbox from './sandbox';
import EditRuleWrapper from './rules/templates/editRuleWrapper';
import CreateDynamicCruiseComponent from './rules/templates/createDynamicCruiseComponent';
import CreateAccommodationOnlyFinalPrice from './rules/templates/createAccommodationOnlyFinalPrice';
import CreateDistributionCost from './rules/templates/DistributionCost/CreateDistributionCost';
import CreateMiscellaneousCost from './rules/templates/createMiscellaneousCost';
import CreateVAT from './rules/templates/createVAT';
import CreateOverOccupancy from './rules/templates/createOverOccupancy';
import CreateUnderOccupancy from './rules/templates/createUnderOccupancy';
import CreateBoardUpgrade from './rules/templates/createBoardUpgrade';
import CreateMandatorySupplement from './rules/templates/createMandatorySupplement';
import CreateAncillary from './rules/templates/createAncillary';
import CreateCharterFlightComponent from './rules/templates/CreateCharterFlightComponent';
import CreateCharterPackage from './rules/templates/createCharterPackage';
import CreateRoomUpgrade from './rules/templates/CreateRoomUpgrade';
import CreateBulkAdjustment from './rules/templates/createBulkAdjustment';
import CreateMinMax from './rules/templates/CreateMinMax';
import CreateFlightDistributionCost from './rules/templates/CreateFlightDistributionCost';
import CreateAccomMiscCost from './rules/templates/CreateAccomMiscCost';
import CreateFlightMiscCost from './rules/templates/CreateFlightMiscCost';
import CreateFlightVat from './rules/templates/CreateFlightVat';
import TransfersMarginTemplate from './rules/templates/TransfersMarginTemplate';
import TransfersDistributionCost from './rules/templates/TransfersDistributionCost';
import TransferVat from './rules/templates/TransferVat';
import AccomReverseCharge from './rules/templates/AccomReverseCharge/AccomReverseCharge';
import AccommodationComponent from './rules/templates/AccommodationComponent/AccommodationComponent';

export default class PricingRoutes extends Component {
  render() {
    return (
      <Switch>
        <Redirect exact from="/pricing" to="/pricing/rules/overview" />
        <Route exact path="/pricing/rules/overview" component={RulesOverview} />
        <Route exact path="/pricing/rules/overview/:id" component={routing => <RulesOverview {...routing} />} />
        <Content>
          <Route
            exact
            path="/pricing/rules/templates/create/accommodation-component"
            component={AccommodationComponent}
          />

          <Route exact path="/pricing/rules/templates/create/dynamic-cruise" component={CreateDynamicCruiseComponent} />
          <Route
            exact
            path="/pricing/rules/templates/create/accommodation-only"
            component={CreateAccommodationOnlyFinalPrice}
          />
          <Route exact path="/pricing/rules/templates/create/charter-package" component={CreateCharterPackage} />

          <Route exact path="/pricing/rules/templates/create/miscellaneous-cost" component={CreateMiscellaneousCost} />

          <Route
            exact
            path="/pricing/rules/templates/create/guaranteefund-accom-misccostcomponent"
            component={CreateAccomMiscCost}
          />
          <Route
            exact
            path="/pricing/rules/templates/create/guaranteefund-flight-misccostcomponent"
            component={CreateFlightMiscCost}
          />
          <Route exact path="/pricing/rules/templates/create/distribution-cost" component={CreateDistributionCost} />
          <Route exact path="/pricing/rules/templates/create/vat" component={CreateVAT} />
          <Route exact path="/pricing/rules/templates/create/reverse-charge" component={AccomReverseCharge} />
          <Route exact path="/pricing/rules/templates/create/over-occupancy" component={CreateOverOccupancy} />
          <Route exact path="/pricing/rules/templates/create/under-occupancy" component={CreateUnderOccupancy} />
          <Route exact path="/pricing/rules/templates/create/board-upgrade" component={CreateBoardUpgrade} />
          <Route
            exact
            path="/pricing/rules/templates/create/mandatory-supplement"
            component={CreateMandatorySupplement}
          />
          <Route exact path="/pricing/rules/templates/create/ancillary" component={CreateAncillary} />
          <Route exact path="/pricing/rules/templates/create/bulk-adjustment" component={CreateBulkAdjustment} />
          <Route exact path="/pricing/rules/templates/create/min-max" component={CreateMinMax} />
          <Route
            exact
            path="/pricing/rules/templates/create/charter-flight-component"
            component={CreateCharterFlightComponent}
          />
          <Route exact path="/pricing/rules/templates/create/room-upgrade" component={CreateRoomUpgrade} />

          <Route
            exact
            path="/pricing/rules/templates/edit/:id/:transactionId?"
            component={routing => <EditRuleWrapper {...routing} />}
          />

          <Route exact path="/pricing/additional-cost/cost-labels" component={CostLabels} />
          <Route exact path="/pricing/sandbox" component={Sandbox} />

          <Route exact path="/pricing/rules/templates/Create/flight-vat" component={CreateFlightVat} />

          <Route
            exact
            path="/pricing/rules/templates/Create/flight-distribution-cost"
            component={CreateFlightDistributionCost}
          />
          <Route
            exact
            path="/pricing/rules/templates/Create/transfer-distribution-cost"
            component={TransfersDistributionCost}
          />
          <Route exact path="/pricing/rules/templates/Create/transfer-vat" component={TransferVat} />
          <Route exact path="/pricing/rules/templates/create/transfers-margin" component={TransfersMarginTemplate} />
        </Content>
      </Switch>
    );
  }
}
