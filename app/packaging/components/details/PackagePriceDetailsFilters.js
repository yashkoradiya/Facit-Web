import React from 'react';
import { Flexbox } from 'components/styled/Layout';
import InputField from 'components/FormFields/InputField';
import { InputLabel } from 'components/styled/Input';
import DateInput from 'components/FormFields/DateInput';
import { Button } from 'components/styled/Button';
import DropdownMenu from 'components/FormFields/DropdownMenu';

export default function PackagePriceDetailsFilters({
  duration,
  durationValueChanged,
  onDurationBlur,
  packageType,
  bookingDate,
  onBookingDateChange,
  onBookingDateBlur,
  simulationAge,
  onSimulationAgeChanged,
  onSimulationAgeBlur,
  simulationBed,
  onSimulationBedChanged,
  onSimulationBedBlur,
  onRefresh,
  homeboundFlights,
  outboundFlights,
  selectedHomeBoundFlight,
  selectedOutBoundFlight,
  onHomeboundFlightChange,
  onOutboundFlightChange
}) {
  return (
    <Flexbox style={{ marginRight: '23px', marginBottom: '6px', alignItems: 'flex-end' }}>
      {packageType === 'package_price' && (
        <Flexbox childrenMarginRight="10px" justifyContent={'space-between'} width={'100%'}>
          <div style={{ marginLeft: '10px', marginRight: '10px' }}>
            <DropdownMenu
              label="Outbound Flight"
              width={'170px'}
              defaultValue={selectedOutBoundFlight}
              onChange={onOutboundFlightChange}
              items={outboundFlights?.map(obFlight => ({
                key: obFlight.key,
                value: obFlight.value
              }))}
            />
          </div>
          <div style={{ marginRight: '10px' }}>
            <DropdownMenu
              label="Homebound Flight"
              width={'170px'}
              defaultValue={selectedHomeBoundFlight}
              onChange={onHomeboundFlightChange}
              items={homeboundFlights?.map(hbFlight => ({
                key: hbFlight.key,
                value: hbFlight.value
              }))}
            />
          </div>
        </Flexbox>
      )}
      {(packageType !== 'charterflight_pricedetails') && (
        <div>
          <div style={{ marginRight: '10px' }}>
            <InputField
              label={'Duration'}
              value={duration || 7}
              onChange={e => durationValueChanged(e.target.value)}
              type={'number'}
              width={'60px'}
              min="1"
              onBlur={onDurationBlur}
            />
          </div>
        </div>
      )}
      {(packageType !== 'charterflight_pricedetails') && (
        <React.Fragment>
          {packageType === 'charter_package' |
            packageType === 'accommodation_only' |
            packageType === 'package_price' && (
              <React.Fragment>
                <div style={{ marginRight: '37px', width: '44px' }}>
                  <InputLabel>Booking date</InputLabel>
                  <div style={{ width: '72px' }}>
                    <DateInput
                      inputHeight={28}
                      selected={bookingDate}
                      onChange={onBookingDateChange}
                      onBlur={onBookingDateBlur}
                    />
                  </div>
                </div>
                <div style={{ marginRight: '10px' }}>
                  <InputField
                    label={'Age'}
                    value={simulationAge ? simulationAge : undefined}
                    onChange={e => onSimulationAgeChanged(e.target.value)}
                    onBlur={onSimulationAgeBlur}
                    type={'number'}
                    width={'60px'}
                    min="0"
                  />
                </div>
                <div style={{ marginRight: '10px' }}>
                  <InputField
                    label={'Person number'}
                    value={simulationBed ? simulationBed : undefined}
                    onChange={e => onSimulationBedChanged(e.target.value)}
                    onBlur={onSimulationBedBlur}
                    type={'number'}
                    width={'80px'}
                    min="0"
                  />
                </div>
              </React.Fragment>

            )}
        </React.Fragment>
      )}


      <div style={{ marginRight: '10px' }}>
        <Button onClick={onRefresh}>Refresh</Button>
      </div>
    </Flexbox>
  );
}
