import React, { useState, useEffect } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import DropdownMenu from 'components/FormFields/DropdownMenu';
import { Flexbox } from 'components/styled/Layout';
import { IconButton } from 'components/styled/Button';

export default function TimeRangeSelector({
  selectedFromTime,
  selectedToTime,
  onChange,
  errorMessage,
  hours,
  disabled
}) {
  const [fromTime, setFromTime] = useState(selectedFromTime);
  const [toTime, setToTime] = useState(selectedToTime);
  const [availableFromHours, setAvailableFromHours] = useState([]);
  const [availableToHours, setAvailableToHours] = useState([]);

  useEffect(() => {
    setAvailableFromHours(getAvailableHours(hours, toTime, 'from'));
    setAvailableToHours(getAvailableHours(hours, fromTime, 'to'));
  }, [fromTime, toTime, hours]);

  const handleOnFromTimeChange = e => {
    setFromTime(e.value);
    onChange(e.value, toTime);
  };

  const handleOnToTimeChange = e => {
    setToTime(e.value);
    onChange(fromTime, e.value);
  };

  const handleClear = () => {
    setFromTime(null);
    setToTime(null);
    onChange(null, null);
  };

  const validationErrorMessage = errorMessage && (errorMessage.applicability || errorMessage.departureTime);

  return (
    <Flexbox width="220px">
      <Flexbox justifyContent="space-between" width="200px">
        <DropdownMenu
          label="(UTC) Dep. Time From"
          width="97px"
          defaultValue={fromTime}
          items={availableFromHours}
          onChange={handleOnFromTimeChange}
          errorMessage={validationErrorMessage}
          disabled={disabled}
        ></DropdownMenu>
        <DropdownMenu
          label="(UTC) Dep. Time To"
          width="97px"
          defaultValue={toTime}
          items={availableToHours}
          onChange={handleOnToTimeChange}
          errorMessage={validationErrorMessage}
          disabled={disabled}
        ></DropdownMenu>
      </Flexbox>
      <IconButton
        disabled={disabled}
        marginBottom="3px"
        width="20px"
        style={{ alignSelf: 'flex-end', fontSize: '11px' }}
        onClick={handleClear}
      >
        <CloseIcon fontSize="inherit" />
      </IconButton>
    </Flexbox>
  );
}

const getAvailableHours = (hours, value, direction) => {
  if (!value) return hours;

  if (direction === 'from') {
    return hours.filter(x => x.value !== '23:59' && x.value <= value);
  }

  if (direction === 'to') {
    return hours.filter(x => x.value >= value);
  }
};
