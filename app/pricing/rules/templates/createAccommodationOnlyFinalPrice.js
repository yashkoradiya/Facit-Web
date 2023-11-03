import React, { PureComponent } from 'react';
import * as rulesApi from '../../../apis/rulesApi';
import CreateRule from '../components/createRule';
import { ruleTabs, getRuleTypeEditCreateCopy } from '../ruleConstants';
import { addRandomKeyToElements } from './addRandomKeyToElements';
import Header from './Header';
import { ruleValidationFunctions } from '../ruleValidationFunctions';

class CreateAccommodationOnlyFinalPrice extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      ruleDefinitions: [],
      selectableSourceMarkets: [],
      selectableDurationGroups: [],
      defaults: null
    };
  }
  componentDidMount() {
    Promise.all([
      rulesApi.getRuleDefinitions('accommodation_only'),
      rulesApi.getSelectableItems('accommodation_only')
    ]).then(responses => {
      this.setState({
        ruleDefinitions: responses[0].data,
        selectableSourceMarkets: responses[1].data.sourceMarkets,
        selectableDurationGroups: addRandomKeyToElements(responses[1].data.durationGroups),
        defaults: this.props.location.state
      });
    });
  }

  render() {
    const { ruleDefinitions, selectableSourceMarkets, selectableDurationGroups, defaults } = this.state;
    if (ruleDefinitions.length === 0 || selectableSourceMarkets.length === 0) {
      return null;
    }
    return (
      <div>
        <Header goBackUrl={`/pricing/rules/overview/accommodation`}
          title={getRuleTypeEditCreateCopy('accommodation_only')} />
        <CreateRule
          ruleDefinitions={ruleDefinitions}
          selectableSourceMarkets={selectableSourceMarkets}
          selectableDurationGroups={selectableDurationGroups}
          ruleKey={ruleTabs.accommodation}
          validationFunc={ruleValidationFunctions['accommodation_only']}
          defaults={defaults}
        />
      </div>
    );
  }
}

export default CreateAccommodationOnlyFinalPrice;
