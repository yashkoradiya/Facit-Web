import React from 'react';
import { render, cleanup, within } from 'test-utils';
import PackageDetailsFilters from './PackageDetailsFilters';
import { fromJS, List } from 'immutable';
import moment from 'moment';
import userEvent from '@testing-library/user-event';

const onFilterChangeCB = jest.fn();
const onRefreshCB = jest.fn();

const testData = {
  flight: fromJS([
    {
      id: 'MF829|MF2247',
      name: '3701|3701, AMS~SID, Tue|Tue'
    },
    {
      id: 'MF335|MF2248',
      name: '3701|3701, AMS~SID, Fri|Fri'
    }
  ]),
  selectedFlightItems: List(),
  duration: 7,
  bookingDate: moment(),
  simulationAge: null,
  simulationBed: null
};

let user;

beforeEach(() => {
  user = userEvent.setup();
});
afterEach(cleanup);
describe('PackageDetailsFilters', () => {
  it('should renders all filters and buttons', () => {
    const { getByLabelText, getByPlaceholderText, getByText, getByTestId } = render(
      <PackageDetailsFilters filters={testData} onFilterChange={onFilterChangeCB} onRefresh={onRefreshCB} />
    );

    const searchBox = getByPlaceholderText(/flight details/i);
    expect(searchBox).toBeInTheDocument();

    const durationInput = getByLabelText('Duration');
    expect(durationInput).toBeInTheDocument();

    const bookingDateInput = getByTestId('date-picker');
    expect(bookingDateInput).toBeInTheDocument();

    const ageInput = getByLabelText('Age');
    expect(ageInput).toBeInTheDocument();

    const personNumberInput = getByLabelText('Person number');
    expect(personNumberInput).toBeInTheDocument();

    const refreshButton = getByText('Refresh');
    expect(refreshButton).toBeInTheDocument();
  });

  it('should be able to manipulate all filters', async () => {
    const screen = render(
      <PackageDetailsFilters filters={testData} onFilterChange={onFilterChangeCB} onRefresh={onRefreshCB} />
    );

    const flightPicker = screen.getByPlaceholderText(/flight details/i);
    const flightTF = within(flightPicker).getByRole('textbox');
    await user.click(flightTF);
    const lists = within(flightPicker).getAllByRole('listbox');
    const ul = lists.find(item => item.tagName === 'UL');
    const fItem = ul.children[0];
    await user.click(fItem);

    const durationInput = screen.getByLabelText('Duration');
    await user.type(durationInput, '8');
    expect(onFilterChangeCB).toHaveBeenCalled();

    const bookingDateInput = screen.getByTestId('date-picker');
    const dateInput = within(bookingDateInput).getByRole('textbox');
    await user.type(dateInput, '26-06-2023');
    expect(onFilterChangeCB).toHaveBeenCalled();

    const ageInput = screen.getByLabelText('Age');
    await user.type(ageInput, '20');
    expect(onFilterChangeCB).toHaveBeenCalled();

    const personNumberInput = screen.getByLabelText('Person number');
    await user.type(personNumberInput, '2');
    expect(onFilterChangeCB).toHaveBeenCalled();

    const refreshButton = screen.getByText('Refresh');
    await user.click(refreshButton);
    expect(onRefreshCB).toHaveBeenCalled();
  });
});
