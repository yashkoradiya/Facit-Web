import React, { useEffect, useState } from 'react';
import Header from './Header';
import * as rulesApi from '../../../apis/rulesApi';
import CreateRule from '../components/createRule';
import { mapPropertiesFromBackend } from './utils';
import { ruleTabs, getRuleTypeEditCreateCopy, ruleTypes } from '../ruleConstants';
import { ruleValidationFunctions } from '../ruleValidationFunctions';

export default function TransfersDistributionCost(props) {
  const [state, updateState] = useState({
    ruleDefinitions: [],
    selectableProperties: [],
    selectableSourceMarkets: [],
    unitTypes: [],
    defaults: null,
    defaultProperties: [{ key: 'transfer_direction', value: 'bothtransfer', displayName: 'Both' },{
      key: 'transfer_type',
      value: 'ALL',
      displayName: 'All'
    }]
  });

  useEffect(() => {
    Promise.all([
      rulesApi.getRuleDefinitions(ruleTypes.transferDistributionCost),
      rulesApi.getSelectableItems(ruleTypes.transferDistributionCost)
    ]).then(responses => {
      updateState(prevState => ({
        ...prevState,
        ruleDefinitions: responses[0].data,
        selectableProperties: mapPropertiesFromBackend(responses[1].data.properties),
        selectableSourceMarkets: responses[1].data.sourceMarkets,
        unitTypes: responses[1].data.templateType[0],
        defaults: props.location.state
      }));
    });
  }, [props.location.state]); 

  const { ruleDefinitions, selectableSourceMarkets, defaults, defaultProperties, selectableProperties, unitTypes } =
    state;

  if (!ruleDefinitions.length || !selectableSourceMarkets.length) {
    return null;
  }

  return (
    <div>
      <Header
        goBackUrl={`/pricing/rules/overview/distribution-cost`}
        title={getRuleTypeEditCreateCopy(ruleTypes.transferDistributionCost)}
      />
      <CreateRule
        ruleDefinitions={ruleDefinitions}
        ruleKey={ruleTabs.distributionCost}
        validationFunc={ruleValidationFunctions[ruleTypes.transferDistributionCost]}
        defaults={defaults}
        defaultProperties={defaultProperties}
        selectableProperties={selectableProperties}
        selectableSourceMarkets={selectableSourceMarkets}
        unitTypes={unitTypes}
      />
    </div>
  );
}
