import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router';
import AccommodationCostDetails from './AccommodationCostDetails';
import rootReducer from 'reduxSetup/rootReducer';
import { accommCostDetailsAPIData, initialState } from './test-data';
import * as API from '../api';

afterEach(cleanup);

jest.mock('../api');

const store = createStore(rootReducer, initialState);

const Wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;

describe('Accommodation Cost Details', () => {
  beforeEach(() => {
    API.getAccommodationRoomTypeBaseCosts.mockResolvedValue({ data: [] });

    API.getAccommodationCostDetails.mockResolvedValue({ data: {} });
    API.getAccommodationRoomTypeOccupancy.mockResolvedValue({ data: [] });
    API.getAccommodationUnderOccupancyCosts.mockResolvedValue({ data: [] });
    API.getAccommodationOverOccupancyCosts.mockResolvedValue({ data: [] });
    API.getAccommodationChildCosts.mockResolvedValue({ data: [] });
    API.getAllotmentData.mockResolvedValue({ data: [] });
    API.getMandatorySupplements.mockResolvedValue({ data: [] });
    API.getAncillaries.mockResolvedValue({ data: [] });
    API.getBoardUpgrade.mockResolvedValue({ data: [] });
    API.getDiscounts.mockResolvedValue({
      data: {
        costs: [],
        combinabilityGroups: [],
        noCombinationsEnabled: true
      }
    });
    API.getContractVersions.mockResolvedValue({ data: [] });
    API.getComments.mockResolvedValue({ data: [] });
  });

  it('Should show loading spinner on initial load', () => {
    const { queryByTestId } = render(
      <MemoryRouter initialEntries={['/cost/accommodation/details/123']}>
        <Route
          path="/cost/accommodation/details/:id/:definitionId?"
          exact
          component={props => <AccommodationCostDetails {...props} />}
        />
      </MemoryRouter>,
      { wrapper: Wrapper }
    );

    expect(queryByTestId('spinner')).toBeInTheDocument();
  });

  it('Should call all apis', () => {
    render(
      <MemoryRouter initialEntries={['/cost/accommodation/details/123']}>
        <Route
          path="/cost/accommodation/details/:id/:definitionId?"
          exact
          component={props => <AccommodationCostDetails {...props} />}
        />
      </MemoryRouter>,
      { wrapper: Wrapper }
    );

    expect(API.getAccommodationRoomTypeBaseCosts).toHaveBeenCalled();
    expect(API.getAccommodationCostDetails).toHaveBeenCalled();
    expect(API.getAccommodationRoomTypeOccupancy).toHaveBeenCalled();
    expect(API.getAccommodationUnderOccupancyCosts).toHaveBeenCalled();
    expect(API.getAccommodationOverOccupancyCosts).toHaveBeenCalled();
    expect(API.getAccommodationChildCosts).toHaveBeenCalled();
    expect(API.getAllotmentData).toHaveBeenCalled();
    expect(API.getMandatorySupplements).toHaveBeenCalled();
    expect(API.getAncillaries).toHaveBeenCalled();
    expect(API.getBoardUpgrade).toHaveBeenCalled();
    expect(API.getDiscounts).toHaveBeenCalled();
  });

  it('Should not show loading spinner after data is loaded', async () => {
    API.getAccommodationCostDetails.mockResolvedValue({ data: accommCostDetailsAPIData });
    const { findByTestId } = render(
      <MemoryRouter initialEntries={['/cost/accommodation/details/123']}>
        <Route
          path="/cost/accommodation/details/:id/:definitionId?"
          exact
          component={props => <AccommodationCostDetails {...props} />}
        />
      </MemoryRouter>,
      { wrapper: Wrapper }
    );

    expect(await findByTestId('spinner')).not.toBeInTheDocument();
  });

  it('Should show the accommodation contract name', async () => {
    API.getAccommodationCostDetails.mockResolvedValue({ data: accommCostDetailsAPIData });
    const { findByText } = render(
      <MemoryRouter initialEntries={['/cost/accommodation/details/123']}>
        <Route
          path="/cost/accommodation/details/:id/:definitionId?"
          exact
          component={props => <AccommodationCostDetails {...props} />}
        />
      </MemoryRouter>,
      { wrapper: Wrapper }
    );

    expect(
      await findByText('Sandos Playacar Beach Resort Spa (A1016) - Playa del Carmen -Quintana Roo - Mexico')
    ).toBeInTheDocument();
  });
});
