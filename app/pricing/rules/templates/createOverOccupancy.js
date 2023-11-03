import React, { PureComponent } from 'react';
import * as rulesApi from '../../../apis/rulesApi';
import CreateRule from '../components/createRule';
import { ruleTabs, getRuleTypeEditCreateCopy } from '../ruleConstants';
import Header from './Header';
import { ruleValidationFunctions } from '../ruleValidationFunctions';

class CreateOverOccupancy extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      ruleDefinitions: [],
      selectableSourceMarkets: [],
      defaults: null
    };
  }

  componentDidMount() {
    Promise.all([rulesApi.getRuleDefinitions('over_occupancy'), rulesApi.getSelectableItems('over_occupancy')]).then(
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
    if (ruleDefinitions.length === 0 || selectableSourceMarkets === 0) {
      return null;
    }
    return (
      <div>
        <Header goBackUrl={`/pricing/rules/overview/accommodation`}
          title={getRuleTypeEditCreateCopy('over_occupancy')} />
        <CreateRule
          ruleDefinitions={ruleDefinitions}
          ruleKey={ruleTabs.accommodation}
          validationFunc={ruleValidationFunctions['over_occupancy']}
          defaults={defaults}
          selectableSourceMarkets={selectableSourceMarkets}
        />
      </div>
    );
  }
}

export default CreateOverOccupancy;
