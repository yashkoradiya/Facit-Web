import React, { useState, useEffect } from 'react';
import * as rulesApi from '../../../apis/rulesApi';
import CreateRule from '../components/createRule';
import { ruleTabs, getRuleTypeEditCreateCopy, ruleTypes } from '../ruleConstants';
import Header from './Header';

export default function CreateRoomUpgrade(props) {
  const [ruleDefinitions, setRuleDefinitions] = useState([]);
  const [selectableSourceMarkets, setSelectableSourceMarkets] = useState([]);

  useEffect(() => {
    Promise.all([
      rulesApi.getRuleDefinitions(ruleTypes.roomUpgrade),
      rulesApi.getSelectableItems(ruleTypes.roomUpgrade)
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
      <Header goBackUrl={`/pricing/rules/overview/room-upgrade`} title={getRuleTypeEditCreateCopy('room_upgrade')} />
      <CreateRule
        ruleDefinitions={ruleDefinitions}
        ruleKey={ruleTabs.accommodation}
        defaults={props.location.state}
        selectableSourceMarkets={selectableSourceMarkets}
      />
    </div>
  );
}
