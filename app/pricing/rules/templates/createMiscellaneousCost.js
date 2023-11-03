import React, { PureComponent } from 'react';
import * as rulesApi from '../../../apis/rulesApi';
import { mapPropertiesFromBackend } from './utils';
import CreateRule from '../components/createRule';
import { ruleTabs, getRuleTypeEditCreateCopy } from '../ruleConstants';
import Header from './Header';
import { ruleValidationFunctions } from '../ruleValidationFunctions';

class CreateMiscCost extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      ruleDefinitions: [],
      selectableProperties: [],
      selectableSourceMarkets: [],
      defaults: null
    };
  }
  componentDidMount() {
    Promise.all([
      rulesApi.getRuleDefinitions('miscellaneous_cost'),
      rulesApi.getSelectableItems('miscellaneous_cost')
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
    const { ruleDefinitions, selectableProperties, selectableSourceMarkets, defaults } = this.state;
    if (ruleDefinitions.length === 0 || selectableProperties.length === 0 || selectableSourceMarkets.length === 0) {
      return null;
    }

    const defaultProperties = [
      { key: 'rate_type', value: 'PPPN', displayName: 'Per person per night' },
      { key: 'cost_label', value: '', displayName: '' },
      { key: 'package_type', value: 'all', displayName: 'All' }
    ];

    return (
      <div>
        <Header
          goBackUrl={`/pricing/rules/overview/miscellaneous-cost`}
          title={getRuleTypeEditCreateCopy('miscellaneous_cost')}
        />

        <CreateRule
          ruleDefinitions={ruleDefinitions}
          defaultProperties={defaultProperties}
          selectableProperties={selectableProperties}
          selectableSourceMarkets={selectableSourceMarkets}
          ruleKey={ruleTabs.miscellaneousCost}
          validationFunc={ruleValidationFunctions['miscellaneous_cost']}
          defaults={defaults}
        />
      </div>
    );
  }
}

export default CreateMiscCost;
