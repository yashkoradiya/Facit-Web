import React, { useState, useEffect } from 'react';
import DefaultEditRuleButtons from '../DefaultEditRuleButtons';
import ConfirmPhasingRuleModal from './ConfirmPhasingRuleModal';
import { simulateRuleMatching } from '../../../../apis/rulesApi';

export default function PhasingEditRuleButtons({
  deleteButton,
  onSave,
  onSaveAndReturn,
  disabled,
  dirty,
  onCancel,
  saveSuccess,
  selectedApplicability,
  isEdit,
  ruleId,
  ruleDefinitionId
}) {
  const [showModal, setShowModal] = useState(false);
  const [shouldReturn, setShouldReturn] = useState(false);
  const [affectedAccommodations, setAffectedAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!showModal) {
      setLoading(true);
      setAffectedAccommodations([]);
      return;
    }

    setLoading(true);
    const input = {
      existingRuleId: ruleId,
      ruleDefinitionId: ruleDefinitionId,
      matchingCriterias: selectedApplicability
        .toJS()
        .flatMap(a => a.values.map(v => ({ criteria: a.criteriaKey, value: v })))
    };
    simulateRuleMatching(input).then(r => {
      setLoading(false);
      setAffectedAccommodations(r.data.affectedProducts);
    });
  }, [showModal, ruleDefinitionId, ruleId, selectedApplicability]);

  return (
    <React.Fragment>
      <DefaultEditRuleButtons
        deleteButton={deleteButton}
        onSave={() => {
          setShouldReturn(false);
          setShowModal(true);
        }}
        onSaveAndReturn={() => {
          setShouldReturn(true);
          setShowModal(true);
        }}
        disabled={disabled}
        dirty={dirty}
        onCancel={onCancel}
        saveSuccess={saveSuccess}
        infoText="Once a phasing curve is saved, it is set and will not adjust automatically to future cost changes."
      />
      <ConfirmPhasingRuleModal
        show={showModal}
        isEdit={isEdit}
        loading={loading}
        data={affectedAccommodations}
        onRequestClose={() => {
          setShowModal(false);
        }}
        onConfirm={() => {
          setShowModal(false);
          shouldReturn ? onSaveAndReturn() : onSave();
        }}
        onCancel={() => {
          setShowModal(false);
        }}
      />
    </React.Fragment>
  );
}
