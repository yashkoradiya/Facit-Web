import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as rulesApi from 'apis/rulesApi';
import CreateRule from '../components/createRule';
import { ruleTabs, getRuleTypeEditCreateCopy } from '../ruleConstants';
import { ruleValidationFunctions } from '../ruleValidationFunctions';
import Header from './Header';
import { addRandomKeyToElements } from './addRandomKeyToElements';
import { mapPropertiesFromBackend } from './utils';

export default function CreateMinMax() {
  const [ruleDefinitions, setRuleDefinitions] = useState([]);
  const [selectableProperties, setSelectableProperties] = useState([]);
  const [selectableSourceMarkets, setSelectableSourceMarkets] = useState([]);
  const [selectableDurationGroups, setSelectableDurationGroups] = useState([]);
  const location = useLocation();
  useEffect(() => {
    Promise.all([rulesApi.getRuleDefinitions('min_max'), rulesApi.getSelectableItems('min_max')]).then(responses => {
      setRuleDefinitions(responses[0].data);
      setSelectableProperties(mapPropertiesFromBackend(responses[1].data.properties));
      setSelectableSourceMarkets(responses[1].data.sourceMarkets);
      setSelectableDurationGroups(addRandomKeyToElements(responses[1].data.durationGroups));
    });
  }, []);

  if (!ruleDefinitions.length || !selectableSourceMarkets.length || !selectableDurationGroups.length) {
    return null;
  }

  const packageType = location.packageType || { key: 'package_type', value: '', displayName: '' };
  const defaultProperties = [packageType];
  return (
    <div>
      <Header goBackUrl={`/pricing/rules/overview/min-max`} title={getRuleTypeEditCreateCopy('min_max')} />
      <CreateRule
        ruleDefinitions={ruleDefinitions}
        ruleKey={ruleTabs.minMax}
        validationFunc={ruleValidationFunctions['min_max']}
        defaults={location.state}
        defaultProperties={defaultProperties}
        selectableProperties={selectableProperties}
        selectableSourceMarkets={selectableSourceMarkets}
        selectableDurationGroups={selectableDurationGroups}
      />
    </div>
  );
}
