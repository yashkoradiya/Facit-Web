import React, { PureComponent } from 'react';
import * as rulesApi from '../../../apis/rulesApi';
import CreateRule from '../components/createRule';
import { ruleTabs, getRuleTypeEditCreateCopy } from '../ruleConstants';
import Header from './Header';
import { ruleValidationFunctions } from '../ruleValidationFunctions';

class CreateUnderOccupancy extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      ruleDefinitions: [],
      selectableSourceMarkets: [],
      defaults: null
    };
  }

  componentDidMount() {
    Promise.all([rulesApi.getRuleDefinitions('under_occupancy'), rulesApi.getSelectableItems('under_occupancy')]).then(
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
    const { ruleDefinitions, defaults, selectableSourceMarkets } = this.state;
    if (ruleDefinitions.length === 0 || selectableSourceMarkets.length === 0) {
      return null;
    }
    return (
      <div>
        <Header goBackUrl={`/pricing/rules/overview/accommodation`} title={getRuleTypeEditCreateCopy('under_occupancy')} />
        <CreateRule
          ruleDefinitions={ruleDefinitions}
          ruleKey={ruleTabs.accommodation}
          validationFunc={ruleValidationFunctions['under_occupancy']}
          defaults={defaults}
          selectableSourceMarkets={selectableSourceMarkets}
        />
      </div>
    );
  }
}

export default CreateUnderOccupancy;
