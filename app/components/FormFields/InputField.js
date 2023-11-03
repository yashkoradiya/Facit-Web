import React from 'react';
import PropTypes from 'prop-types';
import { Input, InputBox, InputLabel } from '../styled/Input';
import { ErrorToolTip } from '../styled/Layout';
import { DebounceInput } from 'react-debounce-input';

const InputField = ({
  value,
  defaultValue,
  placeholder,
  errorMessage,
  label,
  disabled,
  onChange,
  onBlur,
  onKeyUp,
  width,
  height,
  border,
  id,
  type,
  name,
  min,
  max,
  elementRef,
  debounceTimeout
}) => {
  const handleChange = evt => {
    if (onChange) onChange(evt);
  };

  const handleBlur = evt => {
    if (onBlur) onBlur(evt);
  };

  const handleKeyUp = evt => {
    if (onKeyUp) onKeyUp(evt);
  };

  return (
    <InputBox hasErrorMessage={!!errorMessage} hasLabel={!!label} width={width}>
      {label && <InputLabel htmlFor={id}>{label}</InputLabel>}
      {!debounceTimeout && (
        <Input
          aria-label={label}
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          onKeyUp={handleKeyUp}
          onChange={handleChange}
          onBlur={handleBlur}
          id={id}
          name={name}
          autoComplete="off"
          type={type}
          min={min}
          max={max}
          width={width}
          height={height}
          border={border}
          borderRadius={'0'}
          ref={elementRef}
        />
      )}
      {debounceTimeout && (
        <DebounceInput
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          onKeyUp={handleKeyUp}
          onChange={handleChange}
          onBlur={handleBlur}
          id={id}
          name={name}
          autoComplete="off"
          type={type}
          min={min}
          max={max}
          width={width}
          height={height}
          border={border}
          ref={elementRef}
          debounceTimeout={debounceTimeout}
        />
      )}
      <ErrorToolTip>{errorMessage}</ErrorToolTip>
    </InputBox>
  );
};

InputField.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  errorMessage: PropTypes.string,
  onKeyUp: PropTypes.func,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  debounceTimeout: PropTypes.number
};

export default InputField;
