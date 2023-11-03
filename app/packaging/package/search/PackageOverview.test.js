import React from 'react';
import { render, screen, waitFor, within } from 'test-utils';
import userEvent from '@testing-library/user-event';
import { PackageOverview } from './PackageOverview';
import * as api from './api';
import * as geographyApi from '../../../components/GeographySearch/api';
import * as matchingCriteriaApi from '../../../apis/matchingCriteriasApi';
import { getPaginatedResorts } from 'components/GeographySearch/api';
import {
  accomTD,
  countriesTD,
  destinationTD,
  initialState,
  paginatedResortTD,
  sourceMarketsTD
} from 'test-utils/test-data';
import { matchingCriteriaApiTD, packageOverviewSearchTD } from './test-data';

jest.mock('./api');
jest.mock('../../../components/GeographySearch/api');
jest.mock('../../../apis/matchingCriteriasApi');
jest.mock('components/GeographySearch/api');

let user;
describe('PackageOverview Component', () => {
  beforeEach(() => {
    user = userEvent.setup();
    geographyApi.getSourceMarkets.mockResolvedValue({ data: sourceMarketsTD });
    matchingCriteriaApi.get.mockResolvedValue({
      data: matchingCriteriaApiTD
    });
    geographyApi.getCountries.mockResolvedValue({ data: countriesTD });
    geographyApi.getDestinations.mockResolvedValue({ data: destinationTD });
    geographyApi.getAccommodations.mockResolvedValue({ data: accomTD });
    getPaginatedResorts.mockResolvedValue({ data: paginatedResortTD });
    api.searchPreview.mockResolvedValue({
      data: {
        accommodationCount: 1,
        roomTypeCount: 1
      }
    });
    api.search.mockResolvedValue({
      data: packageOverviewSearchTD
    });
  });
  it('should render the Package Overview page', async () => {
    render(<PackageOverview />, initialState);
    await waitFor(() => {
      screen.getByRole('heading', {
        name: /package/i
      });
    });
  });

  it('should be able peform search and select and unselect grid data', async () => {
    render(<PackageOverview />, initialState);
    let searchBtn;
    await waitFor(() => {
      searchBtn = screen.getByRole('button', {
        name: /search search prices/i
      });
    });
    await user.click(searchBtn);

    const rowgroupContainer = screen.queryAllByRole('rowgroup');
    await user.click(within(rowgroupContainer[1]).getByRole('row'));
    await user.click(within(rowgroupContainer[1]).getByRole('row'));
  });
});
