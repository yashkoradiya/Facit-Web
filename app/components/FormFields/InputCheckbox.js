import React from 'react';
import PropTypes from 'prop-types';
import { CheckboxLabel, NiceCheckbox } from '../styled/Input';
import { Flexbox } from '../styled/Layout';

const InputCheckbox = ({ checked, label, disabled, onChange, width, id, style }) => {
  const handleClick = () => {
    onChange(!checked);
  };

  return (
    <Flexbox width={width} style={style}>
      <CheckboxLabel disabled={disabled} onClick={handleClick}>
        <NiceCheckbox data-testid="input-check-box" disabled={disabled} checked={checked} id={id} />
        {label}
      </CheckboxLabel>
    </Flexbox>
  );
};

InputCheckbox.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  width: PropTypes.string,
  style: PropTypes.any
};

export default InputCheckbox;
