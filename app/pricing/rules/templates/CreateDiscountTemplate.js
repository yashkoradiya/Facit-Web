import React, { useEffect, useState } from 'react';
import * as rulesApi from '../../../apis/rulesApi';
import { ruleTypes } from '../ruleConstants';
import CreateRule from '../components/createRule';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import { mapPropertiesFromBackend } from './utils';

export default function CreateDiscountTemplate() {
  const [ruleDefinitions, setRuleDefinitions] = useState([]);
  const [selectableSourceMarkets, setSelectableSourceMarkets] = useState([]);
  const [selectableProperties, setSelectableProperties] = useState([]);
  const location = useLocation();

  useEffect(() => {
    Promise.all([
      rulesApi.getRuleDefinitions(ruleTypes.discount),
      rulesApi.getSelectableItems(ruleTypes.discount)
    ]).then(responses => {
      setRuleDefinitions(responses[0].data);
      setSelectableSourceMarkets(responses[1].data.sourceMarkets);
      setSelectableProperties(mapPropertiesFromBackend(responses[1].data.properties));
    });
  }, []);

  if (ruleDefinitions.length === 0 || selectableSourceMarkets.length === 0) {
    return null;
  }

  return (
    <div>
      <Header goBackUrl={`/settings/discounts/`} title={'Discount template'} />
      <CreateRule
        ruleDefinitions={ruleDefinitions}
        ruleKey={ruleTypes.discount}
        defaults={location.state}
        selectableSourceMarkets={selectableSourceMarkets}
        defaultProperties={[{ key: 'contracted_source', value: 'both', displayName: 'BOTH' }]}
        selectableProperties={selectableProperties}
        ruleType={ruleTypes.discount}
      />
    </div>
  );
}
