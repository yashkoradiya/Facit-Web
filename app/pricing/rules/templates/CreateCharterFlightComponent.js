import React, { PureComponent } from 'react';
import * as rulesApi from '../../../apis/rulesApi';
import CreateRule from '../components/createRule';
import { ruleTabs, getRuleTypeEditCreateCopy } from '../ruleConstants';
import { ruleValidationFunctions } from '../ruleValidationFunctions';
import Header from './Header';
import { mapPropertiesFromBackend } from './utils';

class CreateFlightComponent extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      ruleDefinitions: [],
      selectableProperties: [],
      templateMargins: [],
      selectableSourceMarkets: [],
      defaults: null,
      defaultProperties: [{ key: 'flight_direction', value: 'both', displayName: 'Both' }],
    };
  }

  componentDidMount() {
    Promise.all([
      rulesApi.getRuleDefinitions('charter_flight_component'),
      rulesApi.getSelectableItems('charter_flight_component')
    ]).then(responses => {
      this.setState({
        ruleDefinitions: responses[0].data,
        selectableProperties: mapPropertiesFromBackend(responses[1].data.properties),
        templateMargins: responses[1].data.templateType[0],
        selectableSourceMarkets: responses[1].data.sourceMarkets,
        defaults: this.props.location.state
      });
    });
  }

  render() {
    const { ruleDefinitions, defaults, defaultProperties, selectableProperties, selectableSourceMarkets, templateMargins } = this.state;
    if (ruleDefinitions.length === 0 || selectableSourceMarkets.length === 0) {
      return null;
    }

    return (
      <div>
        <Header
          goBackUrl={`/pricing/rules/overview/flight`}
          title={getRuleTypeEditCreateCopy('charter_flight_component')}
        />
        <CreateRule
          ruleDefinitions={ruleDefinitions}
          ruleKey={ruleTabs.flight}
          validationFunc={ruleValidationFunctions['charter_flight_component']}
          defaults={defaults}
          defaultProperties={defaultProperties}
          selectableProperties={selectableProperties}
          selectableSourceMarkets={selectableSourceMarkets}
          templateMargins={templateMargins}
        />
      </div>
    );
  }
}

export default CreateFlightComponent;
