import React, { useState } from 'react';
import ModalBase from '../../../../components/ModalBase';
import { PrimaryButton, Button } from '../../../../components/styled/Button';
import { Flexbox } from '../../../../components/styled/Layout';
import InputRadioButton from '../../../../components/FormFields/InputRadioButton';
import PercentageLabel from '../../../../components/PercentageLabel';

export function CostPhasingModal({
  show,
  onClose,
  onSave,
  commitmentLevel,
  phasingReferenceName,
  phasingOverrideSetting
}) {
  const [phasingSetting, setPhasingSetting] = useState(phasingOverrideSetting);

  return (
    <ModalBase show={show} onRequestClose={onClose} title={'Cost phasing'} width="500px" height="250px">
      <Flexbox height="100%" direction="column" alignItems="flex-start">
        <Flexbox marginBottom="10px">
          Commitment level:&nbsp;
          <PercentageLabel value={commitmentLevel} />
        </Flexbox>
        <Flexbox direction="column" alignItems="flex-start">
          <InputRadioButton
            name={'costPhasingRadioButtons'}
            id={'costPhasingRadioButton_1'}
            type={'radio'}
            checked={phasingSetting === 0}
            label="Use automatic phasing"
            onChange={() => setPhasingSetting(0)}
          />
          <InputRadioButton
            name={'costPhasingRadioButtons'}
            id={'costPhasingRadioButton_2'}
            type={'radio'}
            checked={phasingSetting === 1}
            label={`Always phase guaranteed costs ${
              phasingReferenceName ? '(Current phasing curve: ' + phasingReferenceName + ')' : ''
            }`}
            onChange={() => setPhasingSetting(1)}
          />
          <InputRadioButton
            name={'costPhasingRadioButtons'}
            id={'costPhasingRadioButton_3'}
            type={'radio'}
            checked={phasingSetting === 2}
            label={'Never phase costs'}
            onChange={() => setPhasingSetting(2)}
          />
        </Flexbox>
        <Flexbox alignSelf="flex-end" marginTop="auto">
          <PrimaryButton marginRight="10px" onClick={() => onSave(phasingSetting)}>
            Update cost phasing settings
          </PrimaryButton>
          <Button onClick={onClose}>Cancel</Button>
        </Flexbox>
      </Flexbox>
    </ModalBase>
  );
}
