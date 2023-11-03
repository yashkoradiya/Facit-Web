import React from 'react';
import { render, screen } from 'test-utils';
import userEvent from '@testing-library/user-event';
import PackagePriceDetailsFilters from './PackagePriceDetailsFilters';
import moment from 'moment';

let user;
describe('PackagePriceDetailsFilters Component', () => {
  beforeEach(() => {
    user = userEvent.setup();
  });
  it('Should render PackagePriceDetailsFilters component', () => {
    render(<PackagePriceDetailsFilters />);
    expect(screen.getByText('Duration')).toBeInTheDocument();
    expect(screen.getByText('Refresh')).toBeInTheDocument();
  });

  it('Should change duration value on input change', async () => {
    const durationValueChangedMock = jest.fn();
    render(
      <PackagePriceDetailsFilters
        packageType={'package_price'}
        duration={7}
        durationValueChanged={durationValueChangedMock}
      />
    );
    const durationInput = screen.getByLabelText('Duration');
    await user.clear(durationInput);
    await user.type(durationInput, '10');
    expect(durationValueChangedMock).toHaveBeenCalled();
  });

  it('Should call onOutboundFlightChange when selecting a value in the "Outbound Flight" dropdown', async () => {
    const onOutboundFlightChangeMock = jest.fn();
    const outboundFlights = [
      { key: 1, value: 'Flight 1' },
      { key: 2, value: 'Flight 2' }
    ];
    render(
      <PackagePriceDetailsFilters
        packageType={'package_price'}
        selectedOutBoundFlight={1}
        outboundFlights={outboundFlights}
        onOutboundFlightChange={onOutboundFlightChangeMock}
      />
    );
    const outboundFlightDropdown = screen.getByPlaceholderText('1');
    await user.click(outboundFlightDropdown);
    let lists = screen.getAllByRole('listbox');

    let ul = lists.find(item => item.localName === 'ul');
    const firstItem = ul.children[0];
    await user.click(firstItem);
    expect(onOutboundFlightChangeMock).toHaveBeenCalled();
  });

  it('Should call onHomeboundFlightChange when selecting a value in the "Homebound Flight" dropdown', async () => {
    const onHomeboundFlightChangeMock = jest.fn();
    const homeboundFlights = [
      { key: 1, value: 'Flight A' },
      { key: 2, value: 'Flight B' }
    ];
    render(
      <PackagePriceDetailsFilters
        packageType={'package_price'}
        selectedHomeBoundFlight={1}
        homeboundFlights={homeboundFlights}
        onHomeboundFlightChange={onHomeboundFlightChangeMock}
      />
    );
    const homeboundFlightDropdown = screen.getByPlaceholderText('1');
    await user.click(homeboundFlightDropdown);
    let lists = screen.getAllByRole('listbox');

    let ul = lists.find(item => item.localName === 'ul');
    const firstItem = ul.children[0];
    await user.click(firstItem);
    expect(onHomeboundFlightChangeMock).toHaveBeenCalled();
  });

  it('Should call onSimulationAgeChanged when age is changed', async () => {
    const onSimulationAgeChangedMock = jest.fn();
    render(
      <PackagePriceDetailsFilters
        packageType={'charter_package'}
        bookingDate={moment('2023-07-31')}
        onBookingDateChange={jest.fn()}
        onBookingDateBlur={jest.fn()}
        simulationAge={30}
        onSimulationAgeChanged={onSimulationAgeChangedMock}
        onSimulationAgeBlur={jest.fn()}
        simulationBed={2}
        onSimulationBedChanged={jest.fn()}
        onSimulationBedBlur={jest.fn()}
      />
    );

    const ageInput = screen.getByLabelText('Age');
    await user.clear(ageInput);
    await user.type(ageInput, '40');
    expect(onSimulationAgeChangedMock).toHaveBeenCalled();
  });

  it('Should call onSimulationBedChanged when person number is changed', async () => {
    const onSimulationBedChangedMock = jest.fn();
    render(
      <PackagePriceDetailsFilters
        packageType={'charter_package'}
        bookingDate={moment('2023-07-31')}
        onBookingDateChange={jest.fn()}
        onBookingDateBlur={jest.fn()}
        simulationAge={30}
        onSimulationAgeChanged={jest.fn()}
        onSimulationAgeBlur={jest.fn()}
        simulationBed={2}
        onSimulationBedChanged={onSimulationBedChangedMock}
        onSimulationBedBlur={jest.fn()}
      />
    );

    const personNumberInput = screen.getByLabelText('Person number');
    await user.clear(personNumberInput);
    await user.type(personNumberInput, '3');
    expect(onSimulationBedChangedMock).toHaveBeenCalled();
  });
});
