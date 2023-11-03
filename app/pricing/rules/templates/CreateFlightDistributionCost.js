import React, { PureComponent } from 'react';
import * as rulesApi from '../../../apis/rulesApi';
import CreateRule from '../components/createRule';
import { ruleTabs, getRuleTypeEditCreateCopy } from '../ruleConstants';
import { ruleValidationFunctions } from '../ruleValidationFunctions';
import Header from './Header';
import { mapPropertiesFromBackend } from './utils';



class CreateFlightDistributionCost extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      ruleDefinitions: [],
      selectableProperties: [],
      selectableSourceMarkets: [],
      defaults: null,
      defaultProperties: [{ key: 'flight_direction', value: 'both', displayName: 'Both' }]
    };
  }

  componentDidMount() {
    Promise.all([
      rulesApi.getRuleDefinitions('charter_flight_distcostcomponent'),
      rulesApi.getSelectableItems('charter_flight_distcostcomponent')
    ]).then(responses => {
      this.setState({
        ruleDefinitions: responses[0].data,
        selectableProperties: mapPropertiesFromBackend(responses[1].data.properties),
        selectableSourceMarkets: responses[1].data.sourceMarkets,
        defaults: this.props.location.state
      });
    });
  }

  render() {
    const { ruleDefinitions, defaults, defaultProperties, selectableProperties, selectableSourceMarkets } = this.state;
    if (ruleDefinitions.length === 0 || selectableSourceMarkets.length === 0) {
      return null;
    }

    return (
      <div>
        <Header
          goBackUrl={`/pricing/rules/overview/distribution-cost`}
          title={getRuleTypeEditCreateCopy('charter_flight_distcostcomponent')}
        />
        <CreateRule
          ruleDefinitions={ruleDefinitions}
          ruleKey={ruleTabs.distributionCost}
          validationFunc={ruleValidationFunctions['charter_flight_distcostcomponent']}
          defaults={defaults}
          defaultProperties={defaultProperties}
          selectableProperties={selectableProperties}
          selectableSourceMarkets={selectableSourceMarkets}
        />
      </div>
    );
  }
}

export default CreateFlightDistributionCost;
