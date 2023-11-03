import React from 'react';
import { render, waitFor, findByText, fireEvent } from 'test-utils';
import ExchangeRateModal from './ExchangeRateModal';
import userEvent from '@testing-library/user-event';

let user;
describe('ExchangeRateModal.test', () => {
  beforeEach(() => {
    user = userEvent.setup();
  });
  it('should call onClose callback when clicking cancel', async () => {
    const onCloseHandler = jest.fn();
    const { getByText } = render(
      <ExchangeRateModal
        show={true}
        currentExchangeRates={[{ sourceMarkets: [{ id: 'SM1', name: 'TUI SE' }], currency: 'EUR', rate: 1 }]}
        sourceMarkets={[{ id: 'SM1', name: 'TUI SE' }]}
        onClose={onCloseHandler}
      />
    );

    await user.click(getByText(/^Cancel$/));

    expect(onCloseHandler).toHaveBeenCalledTimes(1);
  });

  it('should render tab for each group of source markets', async () => {
    const { getByTestId } = render(
      <ExchangeRateModal
        show={true}
        currentExchangeRates={[
          { sourceMarkets: [{ id: 'SM1', name: 'TUI SE' }], currency: 'EUR', rate: 1 },
          { sourceMarkets: [{ id: 'SM2', name: 'TUI NO' }], currency: 'EUR', rate: 2 }
        ]}
        sourceMarkets={[
          { id: 'SM1', name: 'TUI SE' },
          { id: 'SM2', name: 'TUI NO' }
        ]}
        onClose={() => {}}
      />
    );

    const tabs = getByTestId('sourcemarket-tabs');

    expect(await findByText(tabs, /^TUI SE$/)).toBeInTheDocument();
    expect(await findByText(tabs, /^TUI NO$/)).toBeInTheDocument();
  });

  it('should add new tab when splitting source markets', async () => {
    const { getByTestId, getByText, getByRole } = render(
      <ExchangeRateModal
        show={true}
        currentExchangeRates={[
          {
            sourceMarkets: [
              { id: 'SM1', name: 'TUI SE' },
              { id: 'SM2', name: 'TUI NO' }
            ],
            currency: 'EUR',
            rate: 1
          }
        ]}
        sourceMarkets={[
          { id: 'SM1', name: 'TUI SE' },
          { id: 'SM2', name: 'TUI NO' }
        ]}
        onClose={() => {}}
      />
    );

    await user.click(getByText(/split source markets/i));
    await user.click(getByRole('textbox'));
    await user.click(getByText(/^TUI NO$/));

    const tabs = getByTestId('sourcemarket-tabs');

    expect(await findByText(tabs, /^TUI SE$/)).toBeInTheDocument();
    expect(await findByText(tabs, /^TUI NO$/)).toBeInTheDocument();
    ('');
  });

  it('should remove tab when removing source market', async () => {
    const { getByTestId, getByText, getByRole, queryByText } = render(
      <ExchangeRateModal
        show={true}
        currentExchangeRates={[
          { sourceMarkets: [{ id: 'SM1', name: 'TUI SE' }], currency: 'EUR', rate: 1 },
          { sourceMarkets: [{ id: 'SM2', name: 'TUI NO' }], currency: 'EUR', rate: 2 }
        ]}
        sourceMarkets={[
          { id: 'SM1', name: 'TUI SE' },
          { id: 'SM2', name: 'TUI NO' }
        ]}
        onClose={() => {}}
      />
    );

    await user.click(getByRole('textbox'));
    await user.click(getByText(/^cancel$/));

    const tabs = getByTestId('sourcemarket-tabs');

    await waitFor(() => expect(queryByText(/^TUI SE$/)).toBeNull());
    expect(await findByText(tabs, /^TUI NO$/)).toBeInTheDocument();
  });

  it('should add source market to tab when merging source market', async () => {
    const { getByTestId, getByText, getByRole } = render(
      <ExchangeRateModal
        show={true}
        currentExchangeRates={[
          {
            sourceMarkets: [
              { id: 'SM1', name: 'TUI SE' },
              { id: 'SM2', name: 'TUI DK' }
            ],
            currency: 'EUR',
            rate: 1
          },
          {
            sourceMarkets: [
              { id: 'SM3', name: 'TUI NO' },
              { id: 'SM4', name: 'TUI FI' }
            ],
            currency: 'EUR',
            rate: 2
          }
        ]}
        sourceMarkets={[
          { id: 'SM1', name: 'TUI SE' },
          { id: 'SM2', name: 'TUI DK' },
          { id: 'SM3', name: 'TUI NO' },
          { id: 'SM4', name: 'TUI FI' }
        ]}
        onClose={() => {}}
      />
    );

    await user.click(getByText(/^TUI SE, TUI DK$/));
    await user.click(getByRole('textbox'));
    await user.click(getByText(/^TUI NO$/));

    const tabs = getByTestId('sourcemarket-tabs');

    expect(await findByText(tabs, /^TUI SE, TUI DK, TUI NO$/)).toBeInTheDocument();
    expect(await findByText(tabs, /^TUI FI$/)).toBeInTheDocument();
  });

  it('should disable save button if rates contains any rate set to 0', async () => {
    const { findByText } = render(
      <ExchangeRateModal
        show={true}
        currentExchangeRates={[
          {
            currency: 'EUR',
            rate: 1,
            sourceMarkets: [{ id: 'SM1', name: 'TUI SE' }]
          },
          {
            currency: 'SEK',
            rate: 0,
            sourceMarkets: [{ id: 'SM1', name: 'TUI SE' }]
          }
        ]}
        sourceMarkets={[{ id: 'SM1', name: 'TUI SE' }]}
        onClose={() => {}}
      />
    );

    expect(await findByText(/create new version/i)).toBeDisabled();
  });

  it('should disable save button if missing rates for source market', async () => {
    const { findByText, getByRole, getByText } = render(
      <ExchangeRateModal
        show={true}
        currentExchangeRates={[
          { sourceMarkets: [{ id: 'SM1', name: 'TUI SE' }], currency: 'EUR', rate: 1 },
          { sourceMarkets: [{ id: 'SM2', name: 'TUI NO' }], currency: 'EUR', rate: 2 }
        ]}
        sourceMarkets={[
          { id: 'SM1', name: 'TUI SE' },
          { id: 'SM2', name: 'TUI NO' }
        ]}
        onClose={() => {}}
      />
    );

    await user.click(getByRole('textbox'));
    await user.click(getByText(/^cancel$/));

    expect(await findByText(/create new version/i)).toBeDisabled();
  });

  it('should call onSave callback when clicking create new version', async () => {
    const onSaveHandler = jest.fn();
    const { getByText } = render(
      <ExchangeRateModal
        show={true}
        currentExchangeRates={[
          {
            currency: 'EUR',
            name: 'Euro',
            rate: 1,
            baseCurrency: 'EUR',
            sourceMarkets: [{ id: 'SM1', name: 'TUI SE' }]
          },
          {
            currency: 'SEK',
            name: 'Swedish Krona',
            rate: 0,
            baseCurrency: 'EUR',
            sourceMarkets: [{ id: 'SM1', name: 'TUI SE' }]
          }
        ]}
        sourceMarkets={[{ id: 'SM1', name: 'TUI SE' }]}
        onClose={() => {}}
        onSave={onSaveHandler}
      />
    );

    await user.click(getByText(/create new version/i));
    await user.click(getByText(/yes/i));

    await waitFor(() =>
      expect(onSaveHandler).toHaveBeenCalledWith([
        {
          rates: [
            { currency: 'EUR', name: 'Euro', rate: 1, baseCurrency: 'EUR' },
            { currency: 'SEK', name: 'Swedish Krona', rate: 0, baseCurrency: 'EUR' }
          ],
          sourceMarketIds: ['SM1']
        }
      ])
    );
  });

  it('should call onSave callback with splitted source markets when clicking create new version', async () => {
    const onSaveHandler = jest.fn();
    const { getByText, getByRole, typeInCellWithText } = render(
      <ExchangeRateModal
        show={true}
        currentExchangeRates={[
          {
            currency: 'EUR',
            name: 'Euro',
            rate: 1,
            baseCurrency: 'EUR',
            sourceMarkets: [
              { id: 'SM1', name: 'TUI SE' },
              { id: 'SM2', name: 'TUI NO' }
            ]
          },
          {
            currency: 'SEK',
            name: 'Swedish Krona',
            rate: 10,
            baseCurrency: 'EUR',
            sourceMarkets: [
              { id: 'SM1', name: 'TUI SE' },
              { id: 'SM2', name: 'TUI NO' }
            ]
          }
        ]}
        sourceMarkets={[
          { id: 'SM1', name: 'TUI SE' },
          { id: 'SM2', name: 'TUI NO' }
        ]}
        onClose={() => {}}
        onSave={onSaveHandler}
      />
    );

    await user.click(getByText(/split source markets/i));
    await user.click(getByRole('textbox'));
    await user.click(getByText(/^TUI NO$/));

    await typeInCellWithText(/10/i, '12');
    await user.click(getByText(/create new version/i));
    await user.click(getByText(/yes/i));

    await waitFor(() =>
      expect(onSaveHandler).toHaveBeenCalledWith([
        {
          rates: [
            { currency: 'EUR', name: 'Euro', rate: 1, baseCurrency: 'EUR' },
            { currency: 'SEK', name: 'Swedish Krona', rate: 10, baseCurrency: 'EUR' }
          ],
          sourceMarketIds: ['SM1']
        },
        {
          rates: [
            { currency: 'EUR', name: 'Euro', rate: 1, baseCurrency: 'EUR' },
            { currency: 'SEK', name: 'Swedish Krona', rate: 10, baseCurrency: 'EUR' }
          ],
          sourceMarketIds: ['SM2']
        }
      ])
    );
  });

  it('should not call onSave callback when clicking cancel in confirmation box', async () => {
    const onSaveHandler = jest.fn();
    const { getByText } = render(
      <ExchangeRateModal
        show={true}
        currentExchangeRates={[
          {
            currency: 'EUR',
            name: 'Euro',
            rate: 1,
            baseCurrency: 'EUR',
            sourceMarkets: [{ id: 'SM1', name: 'TUI SE' }]
          }
        ]}
        sourceMarkets={[{ id: 'SM1', name: 'TUI SE' }]}
        onClose={() => {}}
        onSave={onSaveHandler}
      />
    );

    await user.click(getByText(/create new version/i));
    await user.click(getByText(/no, cancel/i));

    await waitFor(() => expect(onSaveHandler).not.toHaveBeenCalled());
  });
});
