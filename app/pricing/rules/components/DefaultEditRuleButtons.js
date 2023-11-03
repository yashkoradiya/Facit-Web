import React from 'react';
import { Flexbox, TextBlock } from '../../../components/styled/Layout';
import { Button, PrimaryButton } from '../../../components/styled/Button';
import DoneIcon from '@material-ui/icons/Done';

export default function DefaultEditRuleButtons({
  deleteButton,
  onSave,
  onSaveAndReturn,
  dirty,
  onCancel,
  saveSuccess,
  infoText,
  disabled
}) {
  return (
    <Flexbox alignItems="flex-end" direction="column">
      <TextBlock style={{ marginBottom: infoText && '8px' }} fontSize={'10px'}>
        {infoText}
      </TextBlock>
      <Flexbox justifyContent="space-between">
        {!disabled && <div>{deleteButton}</div>}
        <Flexbox justifyContent="flex-end">
          <Button onClick={onSave} marginRight="20px" disabled={disabled || dirty}>
            Save
          </Button>
          <PrimaryButton onClick={onSaveAndReturn} marginRight="20px" disabled={disabled || dirty}>
            Save and return
          </PrimaryButton>

          <Button onClick={onCancel} disabled={disabled}>
            Cancel
          </Button>
          {saveSuccess && <DoneIcon style={{ color: 'green', fontSize: 30, marginLeft: 10 }} />}
        </Flexbox>
      </Flexbox>
    </Flexbox>
  );
}
