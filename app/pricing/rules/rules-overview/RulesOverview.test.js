import React from 'react';
import { render, cleanup, within } from 'test-utils';
import RulesOverview from './RulesOverview';
import { MemoryRouter, Route } from 'react-router';
import * as matchingCriteriasApi from 'apis/matchingCriteriasApi';
import * as sourceMarketsApi from 'apis/sourceMarketsApi';
import * as api from '../../../apis/rulesApi';
import { getPaginatedResorts } from 'components/GeographySearch/api';
import {
  initialState,
  matchingCriteriaApiData,
  selectableItemsApiData,
  sourceMarketsApiData,
  apiSearchData,
  apiSearchPreviewData
} from './test-data';
import userEvent from '@testing-library/user-event';

jest.mock('apis/matchingCriteriasApi');
jest.mock('apis/sourceMarketsApi');
jest.mock('apis/rulesApi');
jest.mock('components/GeographySearch/api');

afterEach(cleanup);

let user;
describe('Rules Overview', () => {
  beforeEach(() => {
    user = userEvent.setup();
    matchingCriteriasApi.get.mockResolvedValue({
      data: matchingCriteriaApiData
    });
    matchingCriteriasApi.getCommissionMarker.mockResolvedValue({ data: [] });
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
    sourceMarketsApi.getSourceMarkets.mockResolvedValue({
      data: sourceMarketsApiData
    });
    api.getSelectableItems.mockResolvedValue({
      data: {
        properties: selectableItemsApiData
      }
    });
    api.search.mockResolvedValue({
      data: {
        results: apiSearchData
      }
    });
    api.searchPreview.mockResolvedValue({
      data: apiSearchPreviewData
    });
  });

  it('Should display page title, clear filter button and template name filter', async () => {
    matchingCriteriasApi.get.mockResolvedValue({
      data: []
    });
    matchingCriteriasApi.getCommissionMarker.mockResolvedValue({ data: [] });
    sourceMarketsApi.getSourceMarkets.mockResolvedValue({
      data: []
    });
    api.getSelectableItems.mockResolvedValue({
      data: {
        properties: []
      }
    });
    api.search.mockResolvedValue({
      data: {
        results: []
      }
    });
    api.searchPreview.mockResolvedValue({
      data: []
    });

    const { getByText, findByTestId, findByText } = render(
      <MemoryRouter initialEntries={['/pricing/rules/overview']}>
        <Route exact path="/pricing/rules/overview" component={RulesOverview} />
      </MemoryRouter>,
      initialState
    );

    expect(getByText(/templates overview/i)).toBeInTheDocument();
    const nodes = await findByTestId('filters-container');
    expect(nodes.children).toHaveLength(1);
    expect(await findByText(/clear filters/i)).toBeInTheDocument();
  });

  it('Should display all the filters', async () => {
    const { findByTestId } = render(
      <MemoryRouter initialEntries={['/pricing/rules/overview']}>
        <Route exact path="/pricing/rules/overview" component={RulesOverview} />
      </MemoryRouter>,
      initialState
    );

    const nodes = await findByTestId('filters-container');
    expect(nodes.children).toHaveLength(7);
  });

  it('Should select a filter', async () => {
    const screen = render(
      <MemoryRouter initialEntries={['/pricing/rules/overview']}>
        <Route exact path="/pricing/rules/overview" component={RulesOverview} />
      </MemoryRouter>,
      initialState
    );
    const prodTypeContainer = await screen.findByPlaceholderText(/product type/i);

    const prodTF = within(prodTypeContainer).getByRole('textbox');
    await user.click(prodTF);
    const lists = within(prodTypeContainer).getAllByRole('listbox');

    const ul = lists.find(item => item.tagName === 'UL');
    const fItem = ul.children[0];
    await user.click(fItem);
  });
});
