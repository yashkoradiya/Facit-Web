import React, { PureComponent } from 'react';
import * as rulesApi from '../../../../apis/rulesApi';
import CreateRule from '../../components/createRule';
import { ruleTabs, getRuleTypeEditCreateCopy } from '../../ruleConstants';
import { ruleValidationFunctions } from '../../ruleValidationFunctions';
import Header from '../Header';

class AccommodationComponent extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      ruleDefinitions: [],
      selectableSourceMarkets: [],
      defaults: null
    };
  }

  componentDidMount() {
    Promise.all([
      rulesApi.getRuleDefinitions('accommodation_component'),
      rulesApi.getSelectableItems('accommodation_component')
    ]).then(responses => {
      this.setState({
        ruleDefinitions: responses[0].data,
        selectableSourceMarkets: responses[1].data.sourceMarkets,
        defaults: this.props.location.state
      });
    });
  }

  render() {
    const { ruleDefinitions, defaults, selectableSourceMarkets } = this.state;
    if (ruleDefinitions.length === 0 || selectableSourceMarkets.length === 0) {
      return null;
    }
    return (
      <div>
        <Header goBackUrl={`/pricing/rules/overview/accommodation`}
          title={getRuleTypeEditCreateCopy('accommodation_component')} />
        <CreateRule
          ruleDefinitions={ruleDefinitions}
          ruleKey={ruleTabs.accommodation}
          validationFunc={ruleValidationFunctions['accommodation_component']}
          defaults={defaults}
          selectableSourceMarkets={selectableSourceMarkets}
        />
      </div>
    );
  }
}

export default AccommodationComponent;
