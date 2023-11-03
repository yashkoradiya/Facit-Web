import React from 'react';
import { render, cleanup, within } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router';
import { createStore } from 'redux';
import { CharterPackageOverview } from './CharterPackageOverview';
import { Provider } from 'react-redux';
import rootReducer from '../../../../reduxSetup/rootReducer';
import * as productTypesApi from '../../../../../app/apis/productTypeApi';
import * as geographyApi from '../../../../components/GeographySearch/api';
import * as matchingCriteriaApi from '../../../../apis/matchingCriteriasApi';
import * as api from './../api';
import {
  initialState,
  prodTypeTD,
  criteriaTD,
  resortTD,
  sourceMarketsTD,
  destinationTD,
  countriesTD,
  accomTD,
  apiSearchTD,
  apiSearchPrevTD,
  dynamicAccomTD
} from './test-data';

jest.mock('../../../../../app/apis/productTypeApi');
jest.mock('../../../../components/GeographySearch/api');
jest.mock('../../../../apis/matchingCriteriasApi');
jest.mock('./../api');

afterEach(cleanup);

const store = createStore(rootReducer, initialState);

const Wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;

describe('Charter Package Overview', () => {
  beforeEach(() => {
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
    geographyApi.getPaginatedResorts.mockResolvedValue({
      data: resortTD
    });
    geographyApi.getDynamicAccom.mockResolvedValue({
      data: dynamicAccomTD
    });
    matchingCriteriaApi.get.mockResolvedValue({
      data: criteriaTD
    });
    productTypesApi.getProductTypes.mockResolvedValue({
      data: prodTypeTD
    });
    api.search.mockResolvedValue({
      data: apiSearchTD
    });
    api.searchPreview.mockResolvedValue({
      data: apiSearchPrevTD
    });
    api.getReview.mockResolvedValue({
      data: [
        {
          id: 'DFDCEBA9-D9F0-4765-BA42-DCC578677611_W22_NETHERLANDS',
          roomTypes: ['DO-01', 'DO-01 - P'],
          lastPublished: {},
          sourceMarketId: 'TUI_NL',
          sourceReferenceCode: 'A0363797',
          productType: ['FLY_AND_STAY']
        }
      ]
    });
  });

  it('Should render the page title', async () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/packaging/charter-package/search/']}>
        <Route
          exact
          path="/packaging/charter-package/search/"
          component={props => <CharterPackageOverview {...props} />}
        />
      </MemoryRouter>,
      { wrapper: Wrapper }
    );

    expect(getByText('Accommodation Product')).toBeInTheDocument();
  });

  it('Should render the AG Grid', async () => {
    const { findByRole } = render(
      <MemoryRouter initialEntries={['/packaging/charter-package/search/']}>
        <Route
          exact
          path="/packaging/charter-package/search/"
          component={props => <CharterPackageOverview {...props} />}
        />
      </MemoryRouter>,
      { wrapper: Wrapper }
    );

    expect(await findByRole('treegrid')).toBeInTheDocument();
  });

  it('Should render all the filters and search button', async () => {
    window.history.pushState({}, '', '/packaging/charter-package/search/');
    const { findByPlaceholderText, findAllByRole } = render(
      <MemoryRouter initialEntries={['/packaging/charter-package/search/']}>
        <Route
          exact
          path="/packaging/charter-package/search/"
          component={props => <CharterPackageOverview {...props} />}
        />
      </MemoryRouter>,
      { wrapper: Wrapper }
    );

    // Product type
    const productTypeContainer = await findByPlaceholderText(/product type/i);
    const productTypeField = within(productTypeContainer).getByRole('textbox');
    expect(productTypeField).toBeInTheDocument();

    // Planning period
    const planningPeriodContainer = await findByPlaceholderText(/planning period/i);
    const planningPeriodField = within(planningPeriodContainer).getByRole('textbox');
    expect(planningPeriodField).toBeInTheDocument();

    // Source market
    const sourceMarketContainer = await findByPlaceholderText(/source market/i);
    const sourceMarketField = within(sourceMarketContainer).getByRole('textbox');
    expect(sourceMarketField).toBeInTheDocument();

    // Country
    const countryContainer = await findByPlaceholderText(/country/i);
    const countryField = within(countryContainer).getByRole('textbox');
    expect(countryField).toBeInTheDocument();

    // Destination
    const destinationContainer = await findByPlaceholderText(/destination/i);
    const destinationField = within(destinationContainer).getByRole('textbox');
    expect(destinationField).toBeInTheDocument();

    // Resort
    const resortContainer = await findByPlaceholderText(/resort/i);
    const resortField = within(resortContainer).getByRole('textbox');
    expect(resortField).toBeInTheDocument();

    // Accommodation
    const accomContainer = await findByPlaceholderText(/accommodation/i);
    const accomField = within(accomContainer).getByRole('textbox');
    expect(accomField).toBeInTheDocument();

    // Classification
    const classificationContainer = await findByPlaceholderText(/classification/i);
    const classificationField = within(classificationContainer).getByRole('textbox');
    expect(classificationField).toBeInTheDocument();

    // Roomcode
    const roomCodeContainer = await findByPlaceholderText(/room code/i);
    const roomCodeField = within(roomCodeContainer).getByRole('textbox');
    expect(roomCodeField).toBeInTheDocument();

    // Search button should be in the document
    const buttons = await findAllByRole('button');
    const searchButton = buttons.find(item => item.textContent === 'searchSearch prices');
    expect(searchButton).toBeInTheDocument();
  }, 10000);
});
