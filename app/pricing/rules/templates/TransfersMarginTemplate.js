import React, { useEffect, useState } from 'react';
import * as rulesApi from '../../../apis/rulesApi';
import CreateRule from '../components/createRule';
import { ruleTabs, getRuleTypeEditCreateCopy, ruleTypes } from '../ruleConstants';
import { ruleValidationFunctions } from '../ruleValidationFunctions';
import Header from './Header';
import { mapPropertiesFromBackend } from './utils';

export default function TransfersMarginTemplate(props) {
  const [state, updateState] = useState({
    ruleDefinitions: [],
    selectableProperties: [],
    selectableSourceMarkets: [],
    unitTypes: [],
    defaults: null,
    defaultProperties: [
      { key: 'transfer_direction', value: 'bothtransfer', displayName: 'Both' },
      {
        key: 'transfer_type',
        value: 'ALL',
        displayName: 'All'
      }
    ]
  });

  useEffect(() => {
    Promise.all([
      rulesApi.getRuleDefinitions(ruleTypes.transferMarginComponent),
      rulesApi.getSelectableItems(ruleTypes.transferMarginComponent)
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
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  const { ruleDefinitions, selectableSourceMarkets, defaults, defaultProperties, selectableProperties, unitTypes } =
    state;

  if (!ruleDefinitions.length || !selectableSourceMarkets.length) {
    return null;
  }

  return (
    <div>
      <Header
        goBackUrl={`/pricing/rules/overview/transfers`}
        title={getRuleTypeEditCreateCopy(ruleTypes.transferMarginComponent)}
      />
      <CreateRule
        ruleDefinitions={ruleDefinitions}
        ruleKey={ruleTabs.transfers}
        validationFunc={ruleValidationFunctions[ruleTypes.transferMarginComponent]}
        defaults={defaults}
        defaultProperties={defaultProperties}
        selectableProperties={selectableProperties}
        selectableSourceMarkets={selectableSourceMarkets}
        unitTypes={unitTypes}
      />
    </div>
  );
}
