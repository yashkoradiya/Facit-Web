import React from 'react';
import { RadioButton, InputRadioButtonLabel } from '../styled/Input';

export default function InputRadioButton({ disabled, name, id, onChange, checked, label }) {
  return (
    <InputRadioButtonLabel>
      <RadioButton disabled={disabled} name={name} id={id} onChange={onChange} type={'radio'} checked={checked} />
      <div>{label}</div>
    </InputRadioButtonLabel>
  );
}
