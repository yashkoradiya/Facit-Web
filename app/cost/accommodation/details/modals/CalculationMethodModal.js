import React, { useState } from 'react';
import ModalBase from '../../../../components/ModalBase';
import { PrimaryButton, Button } from '../../../../components/styled/Button';
import { Flexbox } from '../../../../components/styled/Layout';
import InputRadioButton from '../../../../components/FormFields/InputRadioButton';

export function CalculationMethodModal({ show, onClose, onSave, calculationMethodDefault }) {
  const [calculationMethod, setCalculationMethod] = useState(calculationMethodDefault);

  return (
    <ModalBase show={show} onRequestClose={onClose} title={'Calculation Method'} width="500px" height="225px">
      <Flexbox height="100%" direction="column" alignItems="flex-start" justifyContent="space-between">
        <Flexbox marginBottom="10px">Choose a Calculation method for the contract:</Flexbox>
        <Flexbox direction="column" alignItems="flex-start">
          <InputRadioButton
            name={'calculationMethodRadioButtons'}
            id={'calculationMethodRadioButton_2'}
            type={'radio'}
            checked={calculationMethod === 'Gross'}
            label={
              'Gross calculation - Cost is not reduced by commission value. Margins, distribution cost or VAT can not be added to final price, only misc. cost can be added.'
            }
            onChange={() => setCalculationMethod('Gross')}
          />
          <InputRadioButton
            name={'calculationMethodRadioButtons'}
            id={'calculationMethodRadioButton_1'}
            type={'radio'}
            checked={calculationMethod === 'Net'}
            label="Net calculation - Cost is reduced by commission value. Margins, misc. cost, distribution cost and VAT can be added to final price."
            onChange={() => setCalculationMethod('Net')}
          />
        </Flexbox>
        <Flexbox alignSelf="flex-end">
          <PrimaryButton marginRight="10px" onClick={() => onSave(calculationMethod)}>
            Update calculation settings
          </PrimaryButton>
          <Button onClick={onClose}>Cancel</Button>
        </Flexbox>
      </Flexbox>
    </ModalBase>
  );
}
