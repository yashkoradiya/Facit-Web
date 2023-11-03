import React from 'react';
import { render, screen } from 'test-utils';
import { NewExchangeRates } from './NewExchangeRates';
import * as api from './api';
import userEvent from '@testing-library/user-event';
import { exchangeRateByDatePeriodTD, exchangeRateByDateTD, initialState } from './test-data';

jest.mock('./api');

let user;
describe('NewExchangeRates', () => {
  beforeEach(() => {
    user = userEvent.setup();
    api.getExchangeRatesByDatePeriod.mockResolvedValue({
      data: exchangeRateByDatePeriodTD
    });

    api.getExchangeRatesByDate.mockResolvedValue({
      data: exchangeRateByDateTD
    });
  });

  it('Should render the component and elements', async () => {
    render(<NewExchangeRates />, initialState);

    expect(screen.getByText('Exchange rates')).toBeInTheDocument();
    const textboxes = await screen.findAllByRole('textbox');
    expect(textboxes).toHaveLength(3);
  });

  it('Should be able to enter from and to dates', async () => {
    render(<NewExchangeRates />, initialState);

    const inputs = screen.getAllByRole('textbox');

    const fromDate = inputs[0];
    const toDate = inputs[1];

    // This should be able to cover the invalid date case, but the DatePicker triggers value with Invalid date.
    await user.type(toDate, '01/09/2022');
    await user.type(fromDate, '10/11/2022');

    // Should be able set valid dates.
    await user.type(fromDate, '10/11/2022');
    await user.type(toDate, '10/12/2022');
    expect(api.getExchangeRatesByDatePeriod).toHaveBeenCalled();
  });
});
