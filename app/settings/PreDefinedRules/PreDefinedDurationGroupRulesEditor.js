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
import DurationGroupRuleModal from './modals/DurationGroupRuleModal';
import { Clear } from '@material-ui/icons';
import { v4 as uuidv4 } from 'uuid';

export default function PreDefinedDurationGroupRulesEditor({ readOnly }) {
  const [durationGroupRules, setDurationGroupRules] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalKey, setModalKey] = useState('');
  const [editRule, setEditRule] = useState(null);

  const getDurationGroups = async () => {
    const response = await preDefinedApi.getDurationGroups();
    setDurationGroupRules(response.data);
  };

  useEffect(() => {
    getDurationGroups();
  }, []);

  useEffect(() => {
    setModalKey(uuidv4());
  }, [showModal]);

  const saveDurationGroupRule = async ruleToSave => {
    const saveFunc = editRule
      ? preDefinedApi.updateDurationGroup(editRule.id, ruleToSave)
      : preDefinedApi.createDurationGroup(ruleToSave);

    const saveResponse = await saveFunc;

    if (saveResponse.status === 200) {
      getDurationGroups();
      setShowModal(false);
      setEditRule(null);
    }
  };

  const deleteDurationGroupRule = durationGroupRule => {
    preDefinedApi.deleteDurationGroup(durationGroupRule.id).then(response => {
      if (response.status === 200) {
        getDurationGroups();
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
        <FramedTitle fontSize="16px">Pre-defined Duration Groups</FramedTitle>

        <Flexbox direction="column" alignItems="flex-end">
          <p>Define a set of duration groups that can be used when creating new templates.</p>
          <StyledTable style={{ marginBottom: 16, width: '100%' }}>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Duration groups (No. of nights)</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {durationGroupRules.map((rule, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <TextButton onClick={() => openModalForEdit(rule)}>{rule.name}</TextButton>
                  </TableCell>
                  <TableCell>{rule.durations}</TableCell>
                  <TableCell>
                    {!readOnly && (
                      <IconButton
                        fontSize="16px"
                        marginLeft="7px"
                        marginRight="7px"
                        onClick={() => deleteDurationGroupRule(rule)}
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
            Add new duration group
          </PrimaryButton>
        </Flexbox>
      </FramedFlexbox>
      <DurationGroupRuleModal
        key={`DurationGroupRuleModal-${modalKey}`}
        show={showModal}
        readOnly={readOnly}
        title="Duration groups"
        onSave={saveDurationGroupRule}
        onClose={() => closeModal(false)}
        durationGroupRule={editRule}
      ></DurationGroupRuleModal>
    </React.Fragment>
  );
}
