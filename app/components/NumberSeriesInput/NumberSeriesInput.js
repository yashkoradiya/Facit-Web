import React, { useState } from 'react';
import InputField from '../FormFields/InputField';

export default function NumberSeriesInput({ width, label, defaultNumbers = [], onChange, onError = () => {} }) {
  const [value, setValue] = useState(convertToString(defaultNumbers));
  const [error, setError] = useState(false);

  const handleChange = e => {
    const value = e.target.value;
    setValue(value);

    if (validate(value)) {
      onChange(convertToArray(value));
      setError(false);
      onError(false);
    } else {
      setError(true);
      onError(true);
    }
  };

  return (
    <InputField
      width={width}
      label={label}
      placeholder="0, 7, 14..."
      errorMessage={error ? 'Invalid durations' : ''}
      value={value}
      onChange={handleChange}
    ></InputField>
  );
}

const validate = value => {
  try {
    if (value.match(/(?<=\d)\s(?=\d)/)) {
      return false;
    }

    const array = convertToArray(value);
    if (array.some(x => x < 0 || isNaN(x))) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};

const convertToString = numbers => numbers.join(', ');

const convertToArray = numbers =>
  numbers
    .replace(/ +$/, '')
    .replace(/,+$/, '')
    .split(',')
    .map(x => parseInt(x.trim()));
