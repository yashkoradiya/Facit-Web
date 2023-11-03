import React from 'react';
import {  render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TransfersPriceDetails from './TransfersPriceDetails';
import rootReducer from 'reduxSetup/rootReducer';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { datasetsTD, initialState, priceDetailsTD } from './test-data';

const store = createStore(rootReducer, initialState);
const Wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;

const datasetChangeCB = jest.fn();
const onRefreshCB = jest.fn();

// TODO: There seems to be a problem with react-chart-2-js and chartjs.
// When making assertions with data change for the Bar component.
// The error: Cannot set properties of '_options' to undefined.
// Possible solution: Update both the libraries without losing intended graph implementation.

describe('Transfers Price Details', () => {
  it('Should render nothing when datasets are empty', async () => {
    const { queryByRole } = render(
      <TransfersPriceDetails
        datasets={[]}
        onDatasetUpdate={datasetChangeCB}
        priceDetails={[]}
        onRefresh={onRefreshCB}
      />,
      {
        wrapper: Wrapper
      }
    );

    const heading = queryByRole('heading', {
      name: /transfer pricing details/i
    });
    expect(heading).not.toBeInTheDocument();
  });

  it('Should render the summary and options', () => {
    const {  getByRole, getByTestId, getByText } = render(
      <TransfersPriceDetails
        datasets={datasetsTD}
        onDatasetUpdate={datasetChangeCB}
        priceDetails={priceDetailsTD}
        onRefresh={onRefreshCB}
      />,
      {
        wrapper: Wrapper
      }
    );

    const heading = getByRole('heading', {
      name: /transfer pricing details/i
    });

    expect(heading).toBeInTheDocument();

    const summaryContainer = getByTestId('chart-tile-container');
    expect(summaryContainer.children.length).toBe(1);
    // const tile = summaryContainer.childNodes[0];
    // userEvent.click(tile);
    // expect(datasetChangeCB).toHaveBeenCalled();

    const ageCategoryOptions = getByTestId('age-category-container');
    expect(ageCategoryOptions).toBeInTheDocument();
    // const adultCheckbox = within(ageCategoryOptions.firstChild).getByTestId('input-check-box');
    // userEvent.click(adultCheckbox);

    const refreshBtn = getByText(/refresh/i);
    expect(refreshBtn).toBeInTheDocument();
    // userEvent.click(refreshBtn);
    // expect(onRefreshCB).toHaveBeenCalled();
  });

  it('Should be able select data ranges', () => {
    const {  getByTestId, } = render(
      <TransfersPriceDetails
        datasets={datasetsTD}
        onDatasetUpdate={datasetChangeCB}
        priceDetails={priceDetailsTD}
        onRefresh={onRefreshCB}
      />,
      {
        wrapper: Wrapper
      }
    );

    const dateRangeContainer = getByTestId('date-range-selector');

    const buttons = within(dateRangeContainer).getAllByRole('button');

    const addAllDatesBtn = buttons[0];
    userEvent.click(addAllDatesBtn);

    // const showPricesBtn = buttons[1];
    // userEvent.click(showPricesBtn);
  });
});
