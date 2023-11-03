import React, { useState, useEffect, useCallback } from 'react';
import { formatDecimal } from 'helpers/numberHelper';
import './dateBand.css';
import styled from 'styled-components';

export default function DateBandValueInput({
  className,
  flatDateBand,
  propertyName,
  onKeyDown,
  onKeyUp,
  onBlur,
  colIndex,
  rowIndex,
  valueType,
  disabled
}) {
  const [componentValue, setValue] = useState('');

  useEffect(() => {
    setInitialData();
  }, [setInitialData, onBlur]);

  const setInitialData = useCallback(() => {
    const incomingValue = flatDateBand[propertyName];
    let value = '';
    if (incomingValue !== undefined && incomingValue !== null) {
      if (valueType === 'Percentage') {
        value = formatDecimal(incomingValue * 100, 2);
      } else {
        value = incomingValue;
      }
    }
    setValue(value);
  }, [flatDateBand, propertyName, valueType]);

  const handleOnChange = ({ target }) => 
  {
    setValue(target.value);
  };

  const handleOnBlur = ({ target }) => {
    let outgoingValue = target.value;

    if (outgoingValue === '') {
      outgoingValue = null;
    }

    if (outgoingValue !== undefined && outgoingValue !== null) {
      if (valueType === 'Percentage') {
        // Format two times because of this: (try setting 5.2)
        // https://x10hosting.com/community/threads/javascript-dividing-by-100-giving-long-decimal-numbers.174699/
        const formattedValue = formatDecimal(outgoingValue, 2);
        outgoingValue = parseFloat(formatDecimal(formattedValue / 100, 4));
        setValue(formattedValue);
      } else {
        outgoingValue = formatDecimal(outgoingValue, 2);
        setValue(outgoingValue);
      }
    }
    onBlur({ dataset: target.dataset, value: outgoingValue });
  };

  return (
    <ValueInput
      disabled={disabled}
      className={className}
      type="text"
      value={componentValue}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      id={`${flatDateBand.key}_${propertyName}`}
      onChange={handleOnChange}
      data-colindex={colIndex}
      data-rowindex={rowIndex}
      data-datebandkey={flatDateBand.key}
      data-propertyname={propertyName}
      onBlur={handleOnBlur}
      onFocus={event => event.target.select()}
    />
  );
}

const ValueInput = styled.input`
  &:disabled {
    background-color: transparent;
  }
`;