import React from 'react';
import { cleanup, render, within } from 'test-utils/index';
import TransfersSearchPanel from './TransfersSearchPanel';
import { fromJS } from 'immutable';
import {
  airportTD,
  areaTD,
  productTypeTD,
  seasonTD,
  sourceMarketTD,
  transferTypeTD,
  unitTypeTD,
  weekdayTD
} from './../test-data';
import { transfersPreview } from '../api';
import userEvent from '@testing-library/user-event';

jest.mock('../api');

const searchCB = jest.fn();

const productTypes = fromJS(productTypeTD.values);
const seasons = fromJS(seasonTD.values);
const sourceMarkets = fromJS(sourceMarketTD);
const departurePoint = fromJS(airportTD.values.concat(areaTD.values));
const arrivalPoint = fromJS(airportTD.values.concat(areaTD.values));
const weekdays = fromJS(weekdayTD.values);
const transferTypes = fromJS(transferTypeTD.values);
const unitTypes = fromJS(unitTypeTD.values);

afterEach(cleanup);
let user;
describe('Transfers Search Panel', () => {
  beforeEach(() => {
    user = userEvent.setup();
    transfersPreview.mockResolvedValue({
      data: { transferCount: 1 }
    });
  });

  it('Should render search panel and search button', async () => {
    const { getByTestId, getAllByRole } = render(
      <TransfersSearchPanel
        onSearch={searchCB}
        productTypes={productTypes}
        seasons={seasons}
        sourceMarkets={sourceMarkets}
        departurePoint={departurePoint}
        arrivalPoint={arrivalPoint}
        weekdays={weekdays}
        transferTypes={transferTypes}
        unitTypes={unitTypes}
      />
    );

    expect(getByTestId('search-panel')).toBeInTheDocument();

    const searchBtn = getAllByRole('button').find(item => item.textContent === 'searchSearch');
    expect(searchBtn).toBeInTheDocument();
    await user.click(searchBtn);

    expect(searchCB).toBeCalled();
  });

  it('Should be able to select item from product type filter', async () => {
    const { getByPlaceholderText } = render(
      <TransfersSearchPanel
        onSearch={searchCB}
        productTypes={productTypes}
        seasons={seasons}
        sourceMarkets={sourceMarkets}
        departurePoint={departurePoint}
        arrivalPoint={arrivalPoint}
        weekdays={weekdays}
        transferTypes={transferTypes}
        unitTypes={unitTypes}
      />
    );

    const prodTypeContainer = getByPlaceholderText(/product type/i);
    const prodTypeTF = within(prodTypeContainer).getByRole('textbox');

    await user.click(prodTypeTF);
    const lists = within(prodTypeContainer).getAllByRole('listbox');

    const ul = lists.find(item => item.tagName === 'UL');
    const fItem = ul.children[0];
    await user.click(fItem);
  });
});
