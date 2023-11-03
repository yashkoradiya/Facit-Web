import React from 'react';
import { MemoryRouter, Route } from 'react-router';
import { render, cleanup, within, waitFor } from 'test-utils/index';
import AccommodationContractOverview from './AccommodationContractOverview';
import * as AccommodationOverviewAPIs from './api';
import * as matchingCriteriasApi from 'apis/matchingCriteriasApi';
import * as sourceMarketApi from 'apis/sourceMarketsApi';
import * as geographyApi from 'components/GeographySearch/api';
import userEvent from '@testing-library/user-event';
import {
  matchingCriteriaApiTD,
  searchTD,
  sourceMarketTD,
  initialState,
  resortTD,
  contractStatusTD,
  commissionMarkerTD
} from './test-data';

jest.mock('./api');
jest.mock('apis/matchingCriteriasApi');
jest.mock('apis/sourceMarketsApi');
jest.mock('components/GeographySearch/api');

afterEach(cleanup);

describe('AccommodationContractOverview', () => {
  beforeEach(() => {
    AccommodationOverviewAPIs.getContractStatus.mockResolvedValue({
      data: contractStatusTD
    });
    matchingCriteriasApi.get.mockResolvedValue({ data: matchingCriteriaApiTD });
    matchingCriteriasApi.getCommissionMarker.mockResolvedValue({ data: commissionMarkerTD });
    sourceMarketApi.getSourceMarkets.mockResolvedValue({ data: sourceMarketTD });
    AccommodationOverviewAPIs.previewSearchAccommodationDefinitions.mockResolvedValue({ data: 0 });

    geographyApi.getPaginatedResorts.mockResolvedValue({
      data: resortTD
    });
    AccommodationOverviewAPIs.searchAccommodationDefinitions.mockResolvedValue({ data: [] });
  });

  it('Should render the component and page title', () => {
    let screen = render(
      <MemoryRouter initialEntries={['/cost/accommodation/search']}>
        <Route
          exact
          path="/cost/accommodation/search"
          component={() => <AccommodationContractOverview selectedCurrency="AED" />}
        />
      </MemoryRouter>,
      initialState
    );

    expect(screen.getByText(/accommodation contract overview/i)).toBeInTheDocument();
  });

  it('Should select planning period and perform search', async () => {
    const user = userEvent.setup();
    AccommodationOverviewAPIs.searchAccommodationDefinitions.mockResolvedValue({ data: searchTD });
    AccommodationOverviewAPIs.previewSearchAccommodationDefinitions.mockResolvedValue({ data: 1 });
    const screen = render(
      <MemoryRouter initialEntries={['/cost/accommodation/search']}>
        <Route
          exact
          path="/cost/accommodation/search"
          component={() => <AccommodationContractOverview selectedCurrency="AED" />}
        />
      </MemoryRouter>,
      initialState
    );

    const planningPeriod = await screen.findByPlaceholderText(/planning period/i);
    const input = within(planningPeriod).getByRole('textbox');
    await user.click(input);
    const listbox = screen.getAllByRole('listbox');
    const ul = listbox.find(item => item.localName === 'ul');
    await user.click(ul.children[0]);

    const searchButton = screen.getAllByText(/search/i).find(item => item.textContent === 'Search');
    expect(searchButton).toBeInTheDocument();

    await user.click(searchButton);

    const spinner = await waitFor(() => screen.queryByTestId('spinner'));
    expect(spinner).not.toBeInTheDocument();

    const rowGroup = await waitFor(() => screen.getAllByRole('rowgroup'));
    expect(rowGroup[1].childElementCount).toBe(1);

    const gridColumns = screen.getAllByRole('columnheader');

    expect(gridColumns.find(item => item.textContent.trim() === 'Commission marker')).toBeInTheDocument();
  });
});
