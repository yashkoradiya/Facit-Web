import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from 'reduxSetup/rootReducer';
import { newUserState, userState } from './test-data';
import MainApp from './MainApp';
import { MemoryRouter } from 'react-router';

import * as matchingCriteriasApi from 'apis/matchingCriteriasApi';
import * as sourceMarketsApi from 'apis/sourceMarketsApi';
import * as inboxAPI from './inbox/api';
import * as rulesAPI from 'apis/rulesApi';
import * as costAPI from 'cost/accommodation/overview/api';

jest.mock('apis/matchingCriteriasApi');
jest.mock('apis/sourceMarketsApi');
jest.mock('./inbox/api');
jest.mock('apis/rulesApi');
jest.mock('components/GeographySearch/api');
jest.mock('./packaging/charterFlight/search/api');
jest.mock('cost/accommodation/overview/api');

afterEach(cleanup);

let store;

const Wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;

describe('Main App', () => {
  beforeEach(() => {
    matchingCriteriasApi.get.mockResolvedValue({
      data: []
    });
    matchingCriteriasApi.getCommissionMarker.mockResolvedValue({ data: [] });
    sourceMarketsApi.getSourceMarkets.mockResolvedValue({
      data: []
    });
    inboxAPI.getUnpublishedAccommodations.mockResolvedValue({ data: [] });
    inboxAPI.getRejectedProducts.mockResolvedValue({ data: [] });
    inboxAPI.getFailedExports.mockResolvedValue({
      data: []
    });
    inboxAPI.getChangedOfferings.mockResolvedValue({ data: [] });
    inboxAPI.getNonContractedDiscounts.mockResolvedValue({ data: [] });

    rulesAPI.getSelectableItems.mockResolvedValue({
      data: {
        properties: []
      }
    });
    rulesAPI.search.mockResolvedValue({
      data: {
        results: []
      }
    });
    rulesAPI.searchPreview.mockResolvedValue({
      data: []
    });

    costAPI.getContractStatus.mockResolvedValue({
      data: []
    });
    costAPI.previewSearchAccommodationDefinitions.mockResolvedValue({
      data: 0
    });
  });

  it('Should not render the main container, when user is empty', () => {
    store = createStore(rootReducer, {});
    const { queryByTestId } = render(
      <MemoryRouter initialEntries={['/']}>
        <MainApp />
      </MemoryRouter>,
      { wrapper: Wrapper }
    );
    expect(queryByTestId('container')).toBeNull();
  });

  it('Should render the new user container, when user roles include New User', () => {
    store = createStore(rootReducer, newUserState);

    const { queryByTestId } = render(
      <MemoryRouter initialEntries={['/']}>
        <MainApp />
      </MemoryRouter>,
      { wrapper: Wrapper }
    );
    expect(queryByTestId('new-user-container')).toBeInTheDocument();
  });

  it('Should render the default page', () => {
    store = createStore(rootReducer, userState);

    const { queryByTestId } = render(
      <MemoryRouter initialEntries={['/']}>
        <MainApp />
      </MemoryRouter>,
      { wrapper: Wrapper }
    );
    expect(queryByTestId('container')).toBeInTheDocument();
  });

  it('Should render the callback page', () => {
    store = createStore(rootReducer, userState);
    const { queryByTestId } = render(
      <MemoryRouter initialEntries={['/callback']}>
        <MainApp />
      </MemoryRouter>,
      { wrapper: Wrapper }
    );

    expect(queryByTestId('callback-container')).toBeInTheDocument();
  });

  it('Should render the pricing page', () => {
    store = createStore(rootReducer, userState);

    const { getByText } = render(
      <MemoryRouter initialEntries={['/pricing/rules/overview']}>
        <MainApp />
      </MemoryRouter>,
      { wrapper: Wrapper }
    );

    expect(getByText(/Templates Overview/)).toBeInTheDocument();
  });

  it('Should render the Package page', () => {
    store = createStore(rootReducer, userState);
    const { getByText } = render(
      <MemoryRouter initialEntries={['/packaging/charter-flight/search']}>
        <MainApp />
      </MemoryRouter>,
      { wrapper: Wrapper }
    );

    expect(getByText(/Flight Overview/)).toBeInTheDocument();
  });

  it('Should render the cost route', () => {
    store = createStore(rootReducer, userState);
    const { getByText } = render(
      <MemoryRouter initialEntries={['/cost/accommodation/search']}>
        <MainApp />
      </MemoryRouter>,
      { wrapper: Wrapper }
    );

    expect(getByText(/Accommodation Contract Overview/)).toBeInTheDocument();
  });
});
