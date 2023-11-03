import React from 'react';
import { cleanup, render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fromJS, List } from 'immutable';
import FilteredSearchBoxes from './FilteredSearchBoxes';
import {
  initialState,
  productTypeFilters,
  countryFilterItems,
  selectedSourceMarkets,
  accomTestFilterItems,
  accomTestSelectedItemIds
} from './test-data';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './../../../reduxSetup/rootReducer';
import { getPaginatedResorts } from 'components/GeographySearch/api';

afterEach(cleanup);

jest.mock('components/GeographySearch/api');
getPaginatedResorts.mockImplementation(() => Promise.resolve({ data: { totalRowCount: 0, geographyViewModel: [] } }));

const store = createStore(rootReducer, initialState);

const Wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;

const onChange = jest.fn();

let user;
describe('Filtered Search Box', () => {
  beforeEach(() => {
    user = userEvent.setup();
  });
  it('Should be able to select an item from the search box', async () => {
    const selectedItemIds = List();
    const { getByRole, getAllByRole } = render(
      <FilteredSearchBoxes
        items={productTypeFilters}
        filteredItems={productTypeFilters}
        selectedItemIds={selectedItemIds}
        onChange={onChange}
      />,
      { wrapper: Wrapper }
    );
    let inputFiled = getByRole('textbox');

    await user.click(inputFiled);
    let lists = getAllByRole('listbox');

    let ul = lists.find(item => item.localName === 'ul'); //Suggestions list box.
    const aoItem = ul.children[0]; //Access the first item.
    await user.click(aoItem); //Mock first item selection.
  });

  it('Should be able to select an item when an item is already selected in the search box', async () => {
    const selectedItemIds = fromJS([
      {
        criteriaKey: 'package_type',
        values: ['accommodation_only']
      }
    ]);

    const { getByRole, getAllByRole } = render(
      <FilteredSearchBoxes
        items={productTypeFilters}
        filteredItems={productTypeFilters}
        selectedItemIds={selectedItemIds}
        onChange={onChange}
      />,
      { wrapper: Wrapper }
    );
    const inputFiled = getByRole('textbox');

    await user.click(inputFiled);
    const lists = getAllByRole('listbox');

    const ul = lists.find(item => item.localName === 'ul');
    const fsItem = ul.children[1];
    await user.click(fsItem);
  });

  it('Should be able to remove an item from the search box', async () => {
    const selectedItemIds = fromJS([
      {
        criteriaKey: 'package_type',
        values: ['accommodation_only']
      }
    ]);

    const { getByTitle } = render(
      <FilteredSearchBoxes
        items={productTypeFilters}
        filteredItems={productTypeFilters}
        selectedItemIds={selectedItemIds}
        onChange={onChange}
      />,
      { wrapper: Wrapper }
    );

    const searchBox = getByTitle(/accommodation_only/i);
    const cancelBtn = within(searchBox).getByRole('button');
    await user.click(cancelBtn);
  });

  it('Should filter child items based on parent item selection', async () => {
    const { getByPlaceholderText } = render(
      <FilteredSearchBoxes
        key={`FilteredSearchBoxes_${countryFilterItems.map(x => x.id).join('_')}`}
        items={countryFilterItems}
        filteredItems={countryFilterItems}
        selectedItemIds={List()}
        onChange={onChange}
        selectedSourceMarkets={selectedSourceMarkets}
      />,
      { wrapper: Wrapper }
    );

    const countryContainer = getByPlaceholderText(/country/i);
    const countryTF = within(countryContainer).getByRole('textbox');

    await user.click(countryTF);
    const lists = within(countryContainer).getAllByRole('listbox');

    const ul = lists.find(item => item.tagName === 'UL');
    const fItem = ul.children[0];
    await user.click(fItem);
  });

  it('Should filter accommodation items', async () => {
    getPaginatedResorts.mockResolvedValue({
      data: {
        totalRowCount: 1,
        geographyViewModel: [
          {
            id: '02c7eecd-f8fe-5ce1-92bf-6f31cec12482',
            name: 'Adrasan',
            code: '02c7eecd-f8fe-5ce1-92bf-6f31cec12482',
            parent: {
              id: 'c6b99bb4-fb69-5d40-9529-9e455b21ed3d',
              name: 'Antalya',
              code: 'c6b99bb4-fb69-5d40-9529-9e455b21ed3d',
              parents: [],
              parentIds: ''
            },
            parents: [],
            parentIds: 'c6b99bb4-fb69-5d40-9529-9e455b21ed3d'
          }
        ]
      }
    });
    const { getByPlaceholderText } = render(
      <FilteredSearchBoxes
        key={`FilteredSearchBoxes_${accomTestFilterItems.map(x => x.id).join('_')}`}
        items={accomTestFilterItems}
        filteredItems={accomTestFilterItems}
        selectedItemIds={accomTestSelectedItemIds}
        onChange={onChange}
        selectedSourceMarkets={selectedSourceMarkets}
      />,
      { wrapper: Wrapper }
    );

    const accomContainer = getByPlaceholderText(/accommodation/i);
    const accTF = within(accomContainer).getByRole('textbox');

    await user.click(accTF);
    const lists = within(accomContainer).getAllByRole('listbox');

    const ul = lists.find(item => item.tagName === 'UL');
    const fItem = ul.children[0];
    await user.click(fItem);
  });
});
