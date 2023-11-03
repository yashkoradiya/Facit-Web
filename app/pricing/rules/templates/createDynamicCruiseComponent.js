import React, { PureComponent } from 'react';
import * as rulesApi from '../../../apis/rulesApi';
import CreateRule from '../components/createRule';
import { ruleTabs, getRuleTypeEditCreateCopy } from '../ruleConstants';
import Header from './Header';
import { ruleValidationFunctions } from '../ruleValidationFunctions';

class CreateAccommodationComponent extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      ruleDefinitions: [],
      selectableSourceMarkets: [],
      defaults: null
    };
  }

  componentDidMount() {
    Promise.all([rulesApi.getRuleDefinitions('dynamic_cruise'), rulesApi.getSelectableItems('dynamic_cruise')]).then(
      responses => {
        this.setState({
          ruleDefinitions: responses[0].data,
          selectableSourceMarkets: responses[1].data.sourceMarkets,
          defaults: this.props.location.state
        });
      }
    );
  }

  render() {
    const { ruleDefinitions, selectableSourceMarkets, defaults } = this.state;
    if (ruleDefinitions.length === 0 || selectableSourceMarkets.length === 0) {
      return null;
    }
    return (
      <div>
        <Header goBackUrl={`/pricing/rules/overview/dynamic-cruise`}
          title={getRuleTypeEditCreateCopy('dynamic_cruise')} />
        <CreateRule
          ruleDefinitions={ruleDefinitions}
          ruleKey={ruleTabs.dynamicCruise}
          validationFunc={ruleValidationFunctions['dynamic_cruise']}
          defaults={defaults}
          selectableSourceMarkets={selectableSourceMarkets}
        />
      </div>
    );
  }
}

export default CreateAccommodationComponent;
