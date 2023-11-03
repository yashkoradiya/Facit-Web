import React, { PureComponent } from 'react';
import * as rulesApi from '../../../apis/rulesApi';
import CreateRule from '../components/createRule';
import { ruleTabs, getRuleTypeEditCreateCopy } from '../ruleConstants';
import Header from './Header';
import { mapPropertiesFromBackend } from './utils';
import { ruleValidationFunctions } from '../ruleValidationFunctions';

class CreateVAT extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      ruleDefinitions: [],
      selectableSourceMarkets: [],
      defaults: null
    };
  }

  componentDidMount() {
    Promise.all([rulesApi.getRuleDefinitions('vat'), rulesApi.getSelectableItems('vat')]).then(responses => {
      this.setState({
        ruleDefinitions: responses[0].data,
        selectableSourceMarkets: responses[1].data.sourceMarkets,
        selectableProperties: mapPropertiesFromBackend(responses[1].data.properties),
        defaults: this.props.location.state
      });
    });
  }

  render() {
    const { ruleDefinitions, selectableSourceMarkets, selectableProperties, defaults } = this.state;
    if (ruleDefinitions.length === 0 || selectableSourceMarkets === 0) {
      return null;
    }

    const defaultContractType = { key: 'contracttype', value: 'All', displayName: 'All' };
    const defaultProperties = [defaultContractType];

    return (
      <div>
        <Header goBackUrl={`/pricing/rules/overview/vat`} title={getRuleTypeEditCreateCopy('vat')} />
        <CreateRule
          ruleDefinitions={ruleDefinitions}
          ruleKey={ruleTabs.vat}
          validationFunc={ruleValidationFunctions['vat']}
          defaults={defaults}
          defaultProperties={defaultProperties}
          selectableProperties={selectableProperties}
          selectableSourceMarkets={selectableSourceMarkets}
        />
      </div>
    );
  }
}

export default CreateVAT;
