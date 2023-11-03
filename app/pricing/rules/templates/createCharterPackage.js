import React, { PureComponent } from 'react';
import * as rulesApi from '../../../apis/rulesApi';
import CreateRule from '../components/createRule';
import { ruleTabs, getRuleTypeEditCreateCopy } from '../ruleConstants';
import { addRandomKeyToElements } from './addRandomKeyToElements';
import Header from './Header';
import { ruleValidationFunctions } from '../ruleValidationFunctions';

class CreateCharterPackage extends PureComponent {
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
    Promise.all([rulesApi.getRuleDefinitions('charter_package'), rulesApi.getSelectableItems('charter_package')]).then(
      responses => {
        this.setState({
          ruleDefinitions: responses[0].data,
          selectableSourceMarkets: responses[1].data.sourceMarkets,
          selectableDurationGroups: addRandomKeyToElements(responses[1].data.durationGroups),
          defaults: this.props.location.state
        });
      }
    );
  }

  render() {
    const { ruleDefinitions, selectableSourceMarkets, selectableDurationGroups, defaults } = this.state;
    if (ruleDefinitions.length === 0 || selectableSourceMarkets.length === 0) {
      return null;
    }
    return (
      <div>
        <Header goBackUrl={`/pricing/rules/overview/charter-package`}
          title={getRuleTypeEditCreateCopy('charter_package')} />
        <CreateRule
          ruleDefinitions={ruleDefinitions}
          selectableSourceMarkets={selectableSourceMarkets}
          selectableDurationGroups={selectableDurationGroups}
          ruleKey={ruleTabs.charterPackage}
          validationFunc={ruleValidationFunctions['charter_package']}
          defaults={defaults}
        />
      </div>
    );
  }
}

export default CreateCharterPackage;
