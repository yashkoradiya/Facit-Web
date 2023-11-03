import React, { useState, useEffect } from 'react';
import { PrimaryButton, IconButton, TextButton } from 'components/styled/Button';
import {
  FramedFlexbox,
  FramedTitle,
  StyledTable,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Flexbox
} from 'components/styled/Layout';
import * as preDefinedApi from './api';
import DateBandRuleModal from './modals/DateBandRuleModal';
import { Clear } from '@material-ui/icons';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { getShortDateFormat } from 'helpers/dateHelper';

export default function PreDefinedDateBandRulesEditor({ readOnly }) {
  const [dateBandRules, setDateBandRules] = useState([]);
  const [planningPeriods, setPlanningPeriods] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalKey, setModalKey] = useState('');
  const [editRule, setEditRule] = useState(null);

  useEffect(() => {
    (async () => {
      const promises = [getDateBands(), preDefinedApi.getPlanningPeriods()];

      const responses = await Promise.all(promises);
      setDateBandRules(responses[0].data);
      setPlanningPeriods(mapToKeyValuePair(responses[1].data));
    })();
  }, []);

  useEffect(() => {
    setModalKey(uuidv4());
  }, [showModal]);

  const getDateBands = () => {
    return preDefinedApi.getDateBands();
  };

  const saveDateBandRule = async dateBandRule => {
    const ruleToSave = {
      name: dateBandRule.name,
      seasonId: dateBandRule.selectedSeason.key,
      dateBands: dateBandRule.dateBands.map(dateBand => ({
        from: dateBand.from.format('YYYY-MM-DD'),
        to: dateBand.to.format('YYYY-MM-DD')
      }))
    };
    const saveFunc = editRule
      ? preDefinedApi.updatePreDefinedDateBandRule(editRule.id, ruleToSave)
      : preDefinedApi.createPreDefinedDateBandRule(ruleToSave);

    const saveResponse = await saveFunc;

    if (saveResponse.status === 200) {
      const dateBandsResponse = await getDateBands();
      setDateBandRules(dateBandsResponse.data);
      setShowModal(false);
      setEditRule(null);
    }
  };

  const deleteDateBandRule = async dateBandRule => {
    preDefinedApi.deleteDateBand(dateBandRule.id).then(async response => {
      if (response.status === 200) {
        const dateBandsResponse = await getDateBands();
        setDateBandRules(dateBandsResponse.data);
      }
    });
  };

  const openModalForEdit = rule => {
    setEditRule(rule);
    setShowModal(true);
  };

  const closeModal = () => {
    setEditRule(null);
    setShowModal(false);
  };

  return (
    <React.Fragment>
      <FramedFlexbox width="auto">
        <FramedTitle fontSize="16px">Pre-defined Date Bands</FramedTitle>
        <p>Define a set of date bands that can be used when creating new templates.</p>
        <Flexbox direction="column" alignItems="flex-end">
          <StyledTable style={{ marginBottom: 16 }}>
            <TableHeader>
              <TableRow>
                <TableHead>Planning period</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Start date</TableHead>
                <TableHead>End date</TableHead>
                <TableHead>Periods</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dateBandRules.map((rule, i) => (
                <TableRow key={i}>
                  <TableCell>{rule.seasonName}</TableCell>
                  <TableCell>
                    <TextButton onClick={() => openModalForEdit(rule)}>{rule.name}</TextButton>
                  </TableCell>
                  <TableCell>{format(new Date(rule.startDate), getShortDateFormat())}</TableCell>
                  <TableCell>{format(new Date(rule.endDate), getShortDateFormat())}</TableCell>
                  <TableCell>{rule.periods}</TableCell>
                  <TableCell>
                    {!readOnly && (
                      <IconButton
                        fontSize="16px"
                        marginLeft="7px"
                        marginRight="7px"
                        onClick={() => deleteDateBandRule(rule)}
                        data-id="clear-button"
                      >
                        <Clear fontSize="inherit" />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </StyledTable>
          <PrimaryButton disabled={readOnly} onClick={() => setShowModal(true)}>
            Add new date band set
          </PrimaryButton>
        </Flexbox>
      </FramedFlexbox>
      <DateBandRuleModal
        key={`DateBandRuleModal-${modalKey}`}
        show={showModal}
        readOnly={readOnly}
        title="Date bands"
        onSave={saveDateBandRule}
        onClose={() => closeModal()}
        planningPeriods={planningPeriods}
        dateBandRule={editRule}
      ></DateBandRuleModal>
    </React.Fragment>
  );
}

function mapToKeyValuePair(periods) {
  return periods.map(period => {
    return { key: period.id, value: period.name };
  });
}
