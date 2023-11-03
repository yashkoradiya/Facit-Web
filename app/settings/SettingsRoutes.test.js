import React from 'react';
import { render, cleanup, waitFor } from 'test-utils';

import SettingsRoutes from './SettingsRoutes';
import { MemoryRouter } from 'react-router';
import * as userManagementApi from './UserManagement/api';
import * as exchangeRatesApi from './ExchangeRates/api';
import * as rulesApi from 'apis/rulesApi';
import * as matchingCriteriasApi from 'apis/matchingCriteriasApi';
import * as sourceMarketsApi from 'apis/sourceMarketsApi';
import { getPaginatedResorts } from 'components/GeographySearch/api';
import * as preDefinedApi from './PreDefinedRules/api';
import {
  userRolesTD,
  userRegionsTD,
  datePeriodsTD,
  ratesByDateTD,
  planningPeriodsTD,
  searchTD,
  discountRuleTD,
  discountMatchingCriteriaTD,
  sourcemarketTD,
  resortTD,
  initialState
} from './test-data';

jest.mock('./UserManagement/api');
jest.mock('./ExchangeRates/api');
jest.mock('apis/rulesApi');
jest.mock('apis/matchingCriteriasApi');
jest.mock('apis/sourceMarketsApi');
jest.mock('components/GeographySearch/api');
jest.mock('./PreDefinedRules/api');

afterEach(cleanup);

describe('Settings Routes', () => {
  beforeEach(() => {
    userManagementApi.getUserRoles.mockResolvedValue({ data: userRolesTD });
    userManagementApi.getUsers.mockResolvedValue({
      data: []
    });
    userManagementApi.getUserRegions.mockResolvedValue({
      data: userRegionsTD
    });
    exchangeRatesApi.getExchangeRatesByDatePeriod.mockResolvedValue({ data: datePeriodsTD });
    exchangeRatesApi.getExchangeRatesByDate.mockResolvedValue({ data: ratesByDateTD });
    exchangeRatesApi.getPlanningPeriods.mockResolvedValue({ data: planningPeriodsTD });
    exchangeRatesApi.getExchangeRates.mockResolvedValue({ data: ratesByDateTD });

    matchingCriteriasApi.get.mockResolvedValue({ data: discountMatchingCriteriaTD });
    getPaginatedResorts.mockResolvedValue({ data: resortTD });
    sourceMarketsApi.getSourceMarkets.mockResolvedValue({ data: sourcemarketTD });
    rulesApi.getSelectableItems.mockResolvedValue({ data: discountRuleTD });
    rulesApi.search.mockResolvedValue({ data: searchTD });
    preDefinedApi.getPlanningPeriods.mockResolvedValue({ data: planningPeriodsTD });
    preDefinedApi.getDateBands.mockResolvedValue({ data: [] });
    preDefinedApi.getDurationGroups.mockResolvedValue({ data: [] });
  });

  it('should render settings component', async () => {
    let screen = render(
      <MemoryRouter initialEntries={['/settings/']}>
        <SettingsRoutes />
      </MemoryRouter>,
      initialState
    );

    let asserter;
    await waitFor(() => {
      asserter = screen.getAllByText(/user roles/i);
    });
    expect(asserter).toHaveLength(2);

    screen = render(
      <MemoryRouter initialEntries={['/settings/exchangerates']}>
        <SettingsRoutes />
      </MemoryRouter>,
      initialState
    );

    await waitFor(() => {
      asserter = screen.getByRole('heading', {
        name: /exchange rates/i
      });
    });
    expect(asserter).toBeInTheDocument();

    // screen = render(
    //   <MemoryRouter initialEntries={['/settings/exchangerates']}>
    //     <SettingsRoutes />
    //   </MemoryRouter>,
    //   initialState
    // );

    // await waitFor(() => {
    //   asserter = screen.getAllByRole('heading', {
    //     name: /exchange rates/i
    //   });
    // });
    // expect(asserter).toHaveLength(2);
  });

  it('should render Discount template', async () => {
    let screen = render(
      <MemoryRouter initialEntries={['/settings/discounts']}>
        <SettingsRoutes />
      </MemoryRouter>,
      initialState
    );

    let asserter;
    await waitFor(() => {
      asserter = screen.getByRole('heading', {
        name: /discounts/i
      });
    });
    expect(asserter).toBeInTheDocument();
  });
  it('should render Template settings', async () => {
    let screen = render(
      <MemoryRouter initialEntries={['/settings/template-settings']}>
        <SettingsRoutes />
      </MemoryRouter>,
      initialState
    );

    let asserter;
    await waitFor(() => {
      asserter = screen.getByRole('heading', {
        name: /template settings/i
      });
    });
    expect(asserter).toBeInTheDocument();
  });
});
