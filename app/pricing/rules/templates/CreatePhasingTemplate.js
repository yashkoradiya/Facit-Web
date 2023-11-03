import React, { useEffect, useState } from 'react';
import * as rulesApi from '../../../apis/rulesApi';
import CreateRule from '../components/createRule';
import { ruleTabs, getRuleTypeEditCreateCopy, ruleTypes } from '../ruleConstants';
import PhasingConfigurationsEditor from '../components/phasingReference/PhasingConfigurationsEditor';
import Header from './Header';

export default function CreatePhasingTemplate(props) {
  const [ruleDefinitions, setRuleDefinitions] = useState([]);
  const [selectableSourceMarkets, setSelectableSourceMarkets] = useState([]);

  useEffect(() => {
    Promise.all([
      rulesApi.getRuleDefinitions(ruleTypes.phasingReference),
      rulesApi.getSelectableItems(ruleTypes.phasingReference)
    ]).then(responses => {
      setRuleDefinitions(responses[0].data);
      setSelectableSourceMarkets(responses[1].data.sourceMarkets);
    });
  }, []);

  if (ruleDefinitions.length === 0 || selectableSourceMarkets.length === 0) {
    return null;
  }

  return (
    <div>
      <Header goBackUrl={`/cost/rules/overview`} title={getRuleTypeEditCreateCopy(ruleTypes.phasingReference)} />
      <CreateRule
        ruleDefinitions={ruleDefinitions}
        ruleKey={ruleTabs.accommodation}
        defaults={props.location.state}
        selectableSourceMarkets={selectableSourceMarkets}
        ConfigurationsEditorComponent={PhasingConfigurationsEditor}
      />
    </div>
  );
}
