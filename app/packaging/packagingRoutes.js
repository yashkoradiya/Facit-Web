import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Sandbox from './sandbox';
import { AccommodationOnlyOverview } from './accommodationOnly/search/AccommodationOnlyOverview/AccommodationOnlyOverview';
import AccommodationOnlyDetailedPricing from './accommodationOnly/details/AccommodationOnlyDetailedPricing';
import { CharterFlightOverview } from './charterFlight/search/CharterFlightOverview/CharterFlightOverview';
import { CharterPackageOverview } from './charterPackage/search/CharterPackageOverview/CharterPackageOverview';
import { Content } from '../components/styled/Content';
import CharterPackagePriceDetails from './charterPackage/details/CharterPackagePriceDetails';
import { DynamicCruiseOverview } from './dynamicCruise/search/DynamicCruiseOverview';
import { PackageOverview } from './package/search/PackageOverview';
import PriceDetailsForCharterFlights from './charterFlight/details/PriceDetailsForCharterFlights';
import TransfersOverview from './TransfersOverview/TransfersOverview';
import { TransfersMessageHandler } from './MessageHandlers/TransfersMessageHandler';
import { PackageMessageHandler } from './MessageHandlers/PackageMessageHandler';

export default class PackagingRoutes extends Component {
  render() {
    return (
      <React.Fragment>
        <Switch>
          <Redirect exact from="/packaging" to="/packaging/accommodation-only/search" />
          <Route
            exact
            path="/packaging/accommodation-only/detailed-pricing/"
            component={AccommodationOnlyDetailedPricing}
          />
          <Route
            exact
            path="/packaging/charter-package/details/"
            component={props => <CharterPackagePriceDetails {...props} />}
          />
          <Content>
            <Route
              exact
              path="/packaging/accommodation-only/search/"
              component={props => <AccommodationOnlyOverview {...props} />}
            />
            <Route
              exact
              path="/packaging/charter-flight/search/"
              component={props => <CharterFlightOverview {...props} />}
            />
            <Route exact path="/packaging/transfers/search/" component={props => <TransfersOverview {...props} />} />
            <Route
              exact
              path="/packaging/charter-package/search/"
              component={props => <CharterPackageOverview {...props} />}
            />
            <Route
              exact
              path="/packaging/dynamic-cruise/search/"
              component={props => <DynamicCruiseOverview {...props} />}
            />
            <Route exact path="/packaging/package/search/" component={props => <PackageOverview {...props} />} />
            <Route exact path="/packaging/package/details/" component={props => <PackageMessageHandler {...props} />} />
            <Route
              exact
              path="/packaging/charter-flight/details/"
              component={props => <PriceDetailsForCharterFlights {...props} />}
            />
            <Route
              exact
              path="/packaging/transfers/details"
              component={props => <TransfersMessageHandler {...props} />}
            />
            <Route exact path="/packaging/sandbox" component={Sandbox} />
          </Content>
        </Switch>
      </React.Fragment>
    );
  }
}
