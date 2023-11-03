import React from 'react';
import { render, cleanup, within, act } from 'test-utils';
import { MemoryRouter, Route } from 'react-router';
import { AccommodationOnlyOverview } from './AccommodationOnlyOverview';
import userEvent from '@testing-library/user-event';
import { apiSearchTD, criteriaTD, previewTD, sourceMarketsTD } from './test-data';
import { accomTD, countriesTD, destinationTD, initialState, paginatedResortTD, resortsTD } from 'test-utils/test-data';

import * as api from '../api';
import * as geographyApi from 'components/GeographySearch/api';
import * as matchingCriteriaApi from '../../../../apis/matchingCriteriasApi';

jest.mock('../api');
jest.mock('components/GeographySearch/api');
jest.mock('../../../../apis/matchingCriteriasApi');

afterEach(cleanup);

describe('Accommodation Only Overview', () => {
  matchingCriteriaApi.get.mockResolvedValue({
    data: criteriaTD
  });
  geographyApi.getSourceMarkets.mockResolvedValue({
    data: sourceMarketsTD
  });
  geographyApi.getDestinations.mockResolvedValue({
    data: destinationTD
  });
  geographyApi.getCountries.mockResolvedValue({
    data: countriesTD
  });
  geographyApi.getAccommodations.mockResolvedValue({
    data: accomTD
  });
  geographyApi.getResorts.mockResolvedValue({
    data: resortsTD
  });
  geographyApi.getPaginatedResorts.mockResolvedValue({
    data: paginatedResortTD
  });
  api.getReview.mockImplementation(() => Promise.resolve({ data: [] }));

  api.searchPreview.mockResolvedValue({
    data: previewTD
  });

  it('Should render the page title and elements', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/packaging/accommodation-only/search']}>
        <Route
          exact
          path="/packaging/accommodation-only/search"
          component={props => <AccommodationOnlyOverview {...props} />}
        />
      </MemoryRouter>,
      initialState
    );
    expect(getByText('Accommodation Only')).toBeInTheDocument();

    const filtersToggleBtn = getByText(/hide search filters/i);
    expect(filtersToggleBtn).toBeInTheDocument();
    userEvent.click(filtersToggleBtn);
  });

  it('Should render publish and evaluate button', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/packaging/accommodation-only/search']}>
        <Route
          exact
          path="/packaging/accommodation-only/search"
          component={props => <AccommodationOnlyOverview {...props} />}
        />
      </MemoryRouter>,
      initialState
    );

    const publishBtn = getByText(/publish prices/i);
    expect(publishBtn).toBeInTheDocument();
    userEvent.click(publishBtn);

    const evaluateBtn = getByText(/evaluate prices/i);
    expect(evaluateBtn).toBeInTheDocument();
    userEvent.click(evaluateBtn);
  });

  it('Should render search button and perform search operation', async () => {
    const user = userEvent.setup();

    const { findByTestId, findAllByRole } = render(
      <MemoryRouter initialEntries={['/packaging/accommodation-only/search']}>
        <Route
          exact
          path="/packaging/accommodation-only/search"
          component={props => <AccommodationOnlyOverview {...props} />}
        />
      </MemoryRouter>,
      initialState
    );
    const buttonContainer = await findByTestId('buttons-container');
    const searchBtn = within(buttonContainer)
      .getAllByRole('button', { hidden: true })
      .find(item => item.textContent === 'searchSearch prices');

    expect(searchBtn).toBeInTheDocument();

    api.search.mockResolvedValue({
      data: apiSearchTD
    });

    await act(async () => {
      await user.click(searchBtn);
    });

    const rowGroup = await findAllByRole('rowgroup');
    expect(rowGroup[1].childElementCount).toBe(1);
  });

  // TODO: Unable to mock window object when mocking grid row selection
  // We need to check appropriate mocking implementation for code coverage.

  // it('Should render grid data', async () => {
  //   const { findByTestId, getAllByRole, getByTestId } = render(
  //     <MemoryRouter initialEntries={['/packaging/accommodation-only/search']}>
  //       <Route
  //         exact
  //         path="/packaging/accommodation-only/search"
  //         component={props => <AccommodationOnlyOverview {...props} />}
  //       />
  //     </MemoryRouter>,
  //     { wrapper: Wrapper }
  //   );
  //   const buttonContainer = await findByTestId('buttons-container');
  //   const searchBtn = within(buttonContainer)
  //     .getAllByRole('button', { hidden: true })
  //     .find(item => item.textContent === 'searchSearch prices');

  //   api.search.mockResolvedValue({
  //     data: apiSearchTD
  //   });

  //   expect(searchBtn).toBeInTheDocument();
  //   userEvent.click(searchBtn);

  //   await waitForElement(() => getByTestId('spinner'));
  //   const rowGroup = await waitForElement(() => getAllByRole('rowgroup'));
  //   const rowItem = within(rowGroup[1]).getByRole('row');
  //   userEvent.click(rowItem);
  // });
});
