import React, { useState } from 'react';
import ModalBase from 'components/ModalBase';
import { Flexbox, TextBlock } from 'components/styled/Layout';
import { Button, PrimaryButton } from 'components/styled/Button';
import InputField from 'components/FormFields/InputField';
import DurationGroupsEditor from 'pricing/rules/components/durationGroupsEditor/DurationGroupsEditor';
import { v4 as uuidv4 } from 'uuid';

export default function DurationGroupRuleModal({ title, show, onClose, onSave, durationGroupRule, readOnly }) {
  const [durationGroups, setDurationGroups] = useState(
    durationGroupRule
      ? durationGroupRule.durationGroups.map(x => {
          return {
            key: uuidv4(),
            from: x.from,
            to: x.to
          };
        })
      : [
          {
            key: uuidv4(),
            from: 1,
            to: 1
          }
        ]
  );
  const [name, setName] = useState(durationGroupRule ? durationGroupRule.name : '');
  const [durationGroupRuleIsValid, setDurationGroupRuleIsValid] = useState(false);
  const [validationActive, setValidationActive] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  const valid = name.length > 0 && durationGroupRuleIsValid;

  const handleClose = () => {
    if (!hasChanges || confirm('You have unsaved changes. Are you sure you want to leave this page?')) {
      onClose();
    }
  };

  const handleOnSave = () => {
    setHasSaved(true);
    onSave({ name, durationGroups });
  };

  return (
    <ModalBase show={show} onRequestClose={handleClose} title={title} width="500px" height="500px">
      <Flexbox height="100%" direction="column" alignItems="flex-start">
        <Flexbox justifyContent="space-between" marginBottom="20px">
          <InputField
            disabled={readOnly}
            errorMessage={validationActive && name.length === 0 ? 'Invalid name' : ''}
            label="Name"
            value={name}
            onChange={e => {
              setValidationActive(true);
              setHasChanges(true);
              setName(e.target.value);
            }}
          ></InputField>
        </Flexbox>

        <DurationGroupsEditor
          disabled={readOnly}
          durationGroups={durationGroups}
          onChange={e => {
            setDurationGroups(e);
            setHasChanges(true);
          }}
          onValidation={setDurationGroupRuleIsValid}
          key={`DurationGroupsEditor-${durationGroups.length}`} // TODO fix this work around which fixes bug where editor didn't receive correct props
        ></DurationGroupsEditor>
        {durationGroupRule && (
          <TextBlock style={{ marginTop: 14 }}>
            Updating an existing rule will not affect previously created duration groups.
          </TextBlock>
        )}
        <Flexbox alignSelf="flex-end" marginTop="auto">
          <PrimaryButton disabled={readOnly || !valid || hasSaved} marginRight="10px" onClick={handleOnSave}>
            Save and return
          </PrimaryButton>
          <Button onClick={handleClose}>Cancel</Button>
        </Flexbox>
      </Flexbox>
    </ModalBase>
  );
}
