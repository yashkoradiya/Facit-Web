import React, { PureComponent } from 'react';
import * as rulesApi from '../../../apis/rulesApi';
import CreateRule from '../components/createRule';
import { ruleTabs, getRuleTypeEditCreateCopy } from '../ruleConstants';
import Header from './Header';
import { addRandomKeyToElements } from './addRandomKeyToElements';
import { mapPropertiesFromBackend } from './utils';
import { ruleValidationFunctions } from '../ruleValidationFunctions';

class CreateBulkAdjustment extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      ruleDefinitions: [],
      selectableProperties: [],
      selectableSourceMarkets: [],
      selectableDurationGroups: [],
      defaults: null
    };
  }

  componentDidMount() {
    Promise.all([rulesApi.getRuleDefinitions('bulk_adjustment'), rulesApi.getSelectableItems('bulk_adjustment')]).then(
      responses => {
        this.setState({
          ruleDefinitions: responses[0].data,
          selectableProperties: mapPropertiesFromBackend(responses[1].data.properties),
          selectableSourceMarkets: responses[1].data.sourceMarkets,
          selectableDurationGroups: addRandomKeyToElements(responses[1].data.durationGroups),
          defaults: this.props.location.state
        });
      }
    );
  }

  render() {
    const {
      ruleDefinitions,
      selectableProperties,
      selectableSourceMarkets,
      selectableDurationGroups,
      defaults
    } = this.state;
    if (ruleDefinitions.length === 0 || selectableSourceMarkets === 0) {
      return null;
    }

    const packageType = this.props.location.packageType || { key: 'package_type', value: '', displayName: '' };  
    const defaultProperties = [packageType];

    return (
      <div>
        <Header
          goBackUrl={`/pricing/rules/overview/accommodation`}
          title={getRuleTypeEditCreateCopy('bulk_adjustment')}
        />
        <CreateRule
          ruleDefinitions={ruleDefinitions}
          ruleKey={ruleTabs.bulkAdjustment}
          validationFunc={ruleValidationFunctions['bulk_adjustment']}
          defaults={defaults}
          defaultProperties={defaultProperties}
          selectableProperties={selectableProperties}
          selectableSourceMarkets={selectableSourceMarkets}
          selectableDurationGroups={selectableDurationGroups}
        />
      </div>
    );
  }
}

export default CreateBulkAdjustment;
