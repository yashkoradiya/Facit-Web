import React, { PureComponent } from 'react';
import * as rulesApi from '../../../apis/rulesApi';
import CreateRule from '../components/createRule';
import { ruleTabs, getRuleTypeEditCreateCopy } from '../ruleConstants';
import { ruleValidationFunctions } from '../ruleValidationFunctions';
import Header from './Header';
import { mapPropertiesFromBackend } from './utils';

class CreateFlightMiscCost extends PureComponent {
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
      rulesApi.getRuleDefinitions('guaranteefund_flight_misccostcomponent'),
      rulesApi.getSelectableItems('guaranteefund_flight_misccostcomponent')
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
          goBackUrl={`/pricing/rules/overview/miscellaneous-cost`}
          title={getRuleTypeEditCreateCopy('guaranteefund_flight_misccostcomponent')}
        />
        <CreateRule
          ruleDefinitions={ruleDefinitions}
          ruleKey={ruleTabs.miscellaneousCost}
          validationFunc={ruleValidationFunctions['guaranteefund_flight_misccostcomponent']}
          defaults={defaults}
          defaultProperties={defaultProperties}
          selectableProperties={selectableProperties}
          selectableSourceMarkets={selectableSourceMarkets}
        />
      </div>
    );
  }
}

export default CreateFlightMiscCost;
