import React, { PureComponent } from 'react';
import * as rulesApi from '../../../apis/rulesApi';
import CreateRule from '../components/createRule';
import { ruleTabs, getRuleTypeEditCreateCopy } from '../ruleConstants';
import Header from './Header';
import { ruleValidationFunctions } from '../ruleValidationFunctions';

class CreateAncillary extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      ruleDefinitions: [],
      selectableSourceMarkets: [],
      defaults: null
    };
  }

  componentDidMount() {
    Promise.all([rulesApi.getRuleDefinitions('ancillary'), rulesApi.getSelectableItems('ancillary')]).then(
      responses => {
        this.setState({
          ruleDefinitions: responses[0].data,
          selectableSourceMarkets: responses[1].data.sourceMarkets,
          selectableAssociatedProducts: responses[1].data.associatedProducts,
          defaults: this.props.location.state
        });
      }
    );
  }

  render() {
    const { ruleDefinitions, selectableSourceMarkets, selectableAssociatedProducts, defaults } = this.state;
    if (ruleDefinitions.length === 0 || selectableSourceMarkets === 0) {
      return null;
    }

    return (
      <div>
        <Header goBackUrl={`/pricing/rules/overview/accommodation`} title={getRuleTypeEditCreateCopy('ancillary')} />
        <CreateRule
          ruleDefinitions={ruleDefinitions}
          ruleKey={ruleTabs.accommodation}
          validationFunc={ruleValidationFunctions['ancillary']}
          defaults={defaults}
          selectableSourceMarkets={selectableSourceMarkets}
          selectableAssociatedProducts={selectableAssociatedProducts}
        />
      </div>
    );
  }
}

export default CreateAncillary;
