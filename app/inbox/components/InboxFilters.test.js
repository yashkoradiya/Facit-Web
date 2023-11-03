import React from 'react';
import { render, cleanup, waitFor, within } from '@testing-library/react';
import InboxFilters from './InboxFilters';
import * as matchingCriteriasApi from 'apis/matchingCriteriasApi';
import * as sourceMarketsApi from 'apis/sourceMarketsApi';
import { getPaginatedResorts } from 'components/GeographySearch/api';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './../../reduxSetup/rootReducer';
import { initialState, matchingCriteriaTD, resortTD, sourceMarketsTD } from 'inbox/test-data';
import userEvent from '@testing-library/user-event';

jest.mock('apis/matchingCriteriasApi');
jest.mock('apis/sourceMarketsApi');
jest.mock('components/GeographySearch/api');

afterEach(cleanup);

const store = createStore(rootReducer, initialState);

const Wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;

const onChange = jest.fn();

let user;
describe('InboxFilters', () => {
  beforeEach(() => {
    user = userEvent.setup();
    matchingCriteriasApi.get.mockResolvedValue({
      data: matchingCriteriaTD
    });
    sourceMarketsApi.getSourceMarkets.mockResolvedValue({
      data: sourceMarketsTD
    });
    getPaginatedResorts.mockResolvedValue({
      data: resortTD
    });
  });
  it('Should not display any criteria filters', async () => {
    matchingCriteriasApi.get.mockResolvedValue({
      data: []
    });
    sourceMarketsApi.getSourceMarkets.mockResolvedValue({
      data: []
    });
    const { findByTestId } = render(<InboxFilters onChange={onChange} />, { wrapper: Wrapper });
    const nodes = await findByTestId('filter-criteria');
    expect(nodes.children).toHaveLength(0);
  });

  it('Should display all criteria filters', async () => {
    const { findByTestId } = render(<InboxFilters onChange={onChange} />, { wrapper: Wrapper });
    const nodes = await findByTestId('filter-criteria');
    expect(nodes.children).toHaveLength(7);
  });

  it('Should be able to select a filter', async () => {
    const screen = render(<InboxFilters onChange={onChange} />, { wrapper: Wrapper });
    let view;
    await waitFor(async () => {
      view = await screen.findByTestId('filter-criteria');
    });

    // Get Planning period and select the list item
    const planningPeriod = within(view).getByPlaceholderText(/planning period/i);
    const ppTextbox = within(planningPeriod).getByRole('textbox');
    await user.click(ppTextbox);
    await user.click(screen.getByText(/season 01/i));
    expect(onChange).toHaveBeenCalled();
  });
});
