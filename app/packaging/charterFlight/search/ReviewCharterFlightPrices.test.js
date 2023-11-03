import React from 'react';
import { cleanup, render } from '@testing-library/react';
import ReviewCharterFlightPrices from './ReviewCharterFlightPrices';
import userEvent from '@testing-library/user-event';

let user;
afterEach(cleanup);

const onClose = jest.fn();
const onPublished = jest.fn();

describe('Review Charter Flight Prices', () => {
  user = userEvent.setup();
  it('Should render the title and columns', () => {
    const { getByText, getAllByRole } = render(
      <ReviewCharterFlightPrices
        showModal
        onClose={onClose}
        onPublished={onPublished}
        allRows={modalData}
        currency="USD"
      />
    );

    expect(getByText(/review and publish/i)).toBeInTheDocument();
    const heading = getAllByRole('heading');

    const transportCode = heading.find(item => item.textContent === 'Transport Code');
    expect(transportCode).toBeInTheDocument();
    
    const planningPeriod = heading.find(item => item.textContent === 'Planning Period');
    expect(planningPeriod).toBeInTheDocument();
  });

  it('Should be able to check/uncheck rows', () => {
    const { getByTestId } = render(
      <ReviewCharterFlightPrices
        showModal
        onClose={onClose}
        onPublished={onPublished}
        allRows={modalData}
        currency="USD"
      />
    );

    const selectAll = getByTestId('indeterminate-check-box');
    expect(selectAll).toBeInTheDocument();

    user.click(selectAll);

    const firstItem = getByTestId('input-check-box');
    user.click(firstItem);
  });
});

const modalData = [
  {
    id: 'MF1',
    sourceId: 'TB1011 BRUAGP 4_W21',
    sourceMarketId: 'TUI_BE',
    season: 'Winter 2122',
    sourceMarket: 'TUI Belgium',
    departureAirport: 'BRU',
    arrivalAirport: 'AGP',
    airline: 'TB',
    departureCount: 9,
    transportCode: 'TB1011 BRUAGP 4',
    averageCost: {
      values: {
        AED: 0,
        DKK: 0,
        EUR: 0,
        GBP: 0,
        MAD: 0,
        NOK: 0,
        SEK: 0,
        THB: 0,
        USD: 0
      }
    },
    averageMargin: 0,
    averagePrice: 0,
    lastPublished: '2022-04-01T11:25:00.954912+00:00',
    productType: ['FLY_AND_STAY']
  }
];
