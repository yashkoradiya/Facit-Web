import React from 'react';
import { user, render } from 'test-utils';
import ExchangeRates from './index';

import * as api from './api';
jest.mock('./api');
api.getPlanningPeriods.mockResolvedValue({
  data: [{ id: 'PERIOD-000000014', name: 'Summer 19' }]
});

const intialState = {
  appState: {
    user: {
      access: {
        settings: {
          exchangerates: {
            write: true
          }
        }
      }
    }
  }
};

describe('ExchangeRateModal.test', () => {
  it('should render planning periods', async () => {
    api.getExchangeRates.mockResolvedValueOnce({
      data: {
        exchangeRateVersions: [],
        enabledCurrencies: [],
        defaultSourceMarkets: []
      }
    });
    const { findByPlaceholderText } = render(<ExchangeRates />, intialState);

    expect(await findByPlaceholderText(/summer 19/i)).toBeInTheDocument();
  });

  it('should render latest version', async () => {
    api.getExchangeRates.mockResolvedValueOnce({
      data: {
        exchangeRateVersions: [
          {
            versionNumber: 2,
            createdDate: '2020-01-02',
            rates: []
          },
          {
            versionNumber: 1,
            createdDate: '2020-01-01',
            rates: []
          }
        ],
        enabledCurrencies: [],
        defaultSourceMarkets: []
      }
    });
    const { findByPlaceholderText } = render(<ExchangeRates />, intialState);

    expect(await findByPlaceholderText(/v.2/i)).toBeInTheDocument();
  });

  it('should render rates grouped by source market', async () => {
    api.getExchangeRates.mockResolvedValueOnce({
      data: {
        exchangeRateVersions: [
          {
            versionNumber: 1,
            createdDate: '2020-01-02',
            rates: [
              {
                currency: 'EUR',
                rate: 22,
                sourceMarkets: [{ id: 'SM1', name: 'TUI SE' }]
              },
              {
                currency: 'EUR',
                rate: 33,
                sourceMarkets: [{ id: 'SM2', name: 'TUI NO' }]
              }
            ]
          }
        ],
        enabledCurrencies: [],
        defaultSourceMarkets: [
          { id: 'SM1', name: 'TUI SE' },
          { id: 'SM2', name: 'TUI NO' }
        ]
      }
    });
    const { findByText } = render(<ExchangeRates />, intialState);

    expect(await findByText(/22/)).toBeInTheDocument();
    expect(await findByText(/33/i)).toBeInTheDocument();
    expect(await findByText(/^TUI SE$/i)).toBeInTheDocument();
    expect(await findByText(/^TUI NO$/i)).toBeInTheDocument();
  });

  it('should render rates grouped by value and currency', async () => {
    api.getExchangeRates.mockResolvedValueOnce({
      data: {
        exchangeRateVersions: [
          {
            versionNumber: 1,
            createdDate: '2020-01-02',
            rates: [
              {
                currency: 'EUR',
                rate: 1337,
                sourceMarkets: [{ id: 'SM1', name: 'TUI SE' }]
              },
              {
                currency: 'EUR',
                rate: 1337,
                sourceMarkets: [{ id: 'SM2', name: 'TUI NO' }]
              }
            ]
          }
        ],
        enabledCurrencies: [],
        defaultSourceMarkets: [
          { id: 'SM1', name: 'TUI SE' },
          { id: 'SM2', name: 'TUI NO' }
        ]
      }
    });
    const { findByText } = render(<ExchangeRates />, intialState);

    expect(await findByText(/1337/)).toBeInTheDocument();
    expect(await findByText(/^TUI NO, TUI SE$/i)).toBeInTheDocument();
  });

  it('should render ExchangeRateModal when clicking on add new exchange rate', async () => {
    api.getExchangeRates.mockResolvedValueOnce({
      data: {
        exchangeRateVersions: [],
        enabledCurrencies: [],
        defaultSourceMarkets: []
      }
    });
    const { getByText, findByText } = render(<ExchangeRates />, intialState);

    user.click(getByText(/add new exchange rate/i));
    expect(await findByText(/new exchange rate/i)).toBeInTheDocument();
  });
});
