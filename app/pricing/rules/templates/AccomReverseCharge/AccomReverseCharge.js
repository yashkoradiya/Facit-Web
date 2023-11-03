import React, { useEffect, useState } from 'react';
import * as rulesApi from '../../../../apis/rulesApi';
import Header from '../Header';
import { mapPropertiesFromBackend } from './../utils';
import { ruleTabs, getRuleTypeEditCreateCopy, ruleTypes } from '../../ruleConstants';
import CreateRule from 'pricing/rules/components/createRule';
import { ruleValidationFunctions } from 'pricing/rules/ruleValidationFunctions';

export default function AccomReverseCharge(props) {
  const [state, setState] = useState({
    ruleDefinitions: [],
    selectableSourceMarkets: [],
    selectableProperties: []
  });

  useEffect(() => {
    Promise.all(
      [rulesApi.getRuleDefinitions(ruleTypes.accomReverse), rulesApi.getSelectableItems(ruleTypes.accomReverse)] 
    ).then(responses => {
      setState({
        ruleDefinitions: responses[0].data,
        selectableSourceMarkets: responses[1].data.sourceMarkets,
        selectableProperties: mapPropertiesFromBackend(responses[1].data.properties)
      });
    });
  }, []);

  const { ruleDefinitions, selectableSourceMarkets, selectableProperties } = state;

  if (ruleDefinitions.length === 0 || selectableSourceMarkets === 0) {
    return null;
  }

  return (
    <div>
      <Header goBackUrl={`/pricing/rules/overview/vat`} title={getRuleTypeEditCreateCopy(ruleTypes.accomReverse)} />
      <CreateRule
        ruleDefinitions={ruleDefinitions}
        ruleKey={ruleTabs.vat}
        validationFunc={ruleValidationFunctions[ruleTypes.accomReverse]}
        defaults={props.location.state}
        selectableProperties={selectableProperties}
        selectableSourceMarkets={selectableSourceMarkets}
      />
    </div>
  );
}
