import React from 'react';
import { Flexbox } from 'components/styled/Layout';
import InputField from 'components/FormFields/InputField';
import { InputLabel } from 'components/styled/Input';
import DateInput from 'components/FormFields/DateInput';
import { Button } from 'components/styled/Button';
import SearchBox from 'components/FormFields/SearchBox';

export default function PackageDetailsFilters(props) {
  const {
    filters: { flight, selectedFlightItems, duration, bookingDate, simulationAge, simulationBed },
    disabledItems,
    onRefresh,
    onFilterChange
  } = props;

  return (
    <Flexbox justifyContent="space-evenly" flex="auto" wrap="wrap">
      <SearchBox
        disabled={disabledItems?.includes('flight')}
        items={flight}
        selectedItemIds={selectedFlightItems}
        placeholder={'Flight details'}
        onChange={e => onFilterChange({ key: 'flight', value: e })}
        width={'240px'}
      />
      <InputField
        label={'Duration'}
        value={duration}
        onChange={e => onFilterChange({ key: 'duration', value: parseInt(e.target.value) })}
        type={'number'}
        width={'60px'}
        min="1"
        // onBlur={e => console.log('On BLur: ', e.target.value)}
      />
      <div data-testid="date-picker">
        <InputLabel>Booking date</InputLabel>
        <div style={{ width: '72px' }}>
          <DateInput
            inputHeight={28}
            selected={bookingDate}
            onChange={e => onFilterChange({ key: 'bookingDate', value: e })}
            // onBlur={e => console.log('BookingDate: on Change', e.target.value)}
          />
        </div>
      </div>
      <InputField
        label={'Age'}
        value={simulationAge}
        onChange={e => onFilterChange({ key: 'simulationAge', value: e.target.value })}
        // onBlur={e => console.log('Age: onBlur', e.target.value)}
        type={'number'}
        width={'60px'}
        min="0"
      />
      <InputField
        label={'Person number'}
        value={simulationBed}
        onChange={e => onFilterChange({ key: 'simulationBed', value: e.target.value })}
        // onBlur={e => console.log('PersonNumber: onBlur', e.target.value)}
        type={'number'}
        width={'100px'}
        min="0"
      />
      <Button marginTop="22px" onClick={onRefresh}>
        Refresh
      </Button>
    </Flexbox>
  );
}
