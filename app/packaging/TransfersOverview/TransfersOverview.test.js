import React from 'react';
import { render, cleanup, within } from 'test-utils';
import { MemoryRouter, Route } from 'react-router';
import TransfersOverview from './TransfersOverview';
import * as sourceMarketApi from '../../apis/sourceMarketsApi';
import * as matchingCriteriaApi from '../../apis/matchingCriteriasApi';
import { initialState, matchingCriteriaApiTD, sourceMarketTD, transferSearchTD } from './test-data';
import userEvent from '@testing-library/user-event';
import { transfersPreview, getReview, search } from './api';

jest.mock('apis/matchingCriteriasApi');
jest.mock('apis/sourceMarketsApi');
jest.mock('./api');

afterEach(cleanup);

let user;
describe('Transfers Overview', () => {
  beforeEach(() => {
    user = userEvent.setup();
    matchingCriteriaApi.get.mockResolvedValue({
      data: matchingCriteriaApiTD
    });
    sourceMarketApi.getSourceMarkets.mockResolvedValue({
      data: sourceMarketTD
    });
    transfersPreview.mockResolvedValue({
      data: { transferCount: 1 }
    });
    search.mockResolvedValue({
      data: []
    });
    getReview.mockResolvedValue({
      data: []
    });
  });

  it('Should render the page title and filters', async () => {
    const { getByText, getAllByText, getByTestId } = render(
      <MemoryRouter initialEntries={['/packaging/transfers/search/']}>
        <Route exact path="/packaging/transfers/search/" component={props => <TransfersOverview {...props} />} />
      </MemoryRouter>,
      initialState
    );

    expect(getByText(/transfers overview/i)).toBeInTheDocument();

    expect(getByTestId('search-panel').children.length).toBe(10);

    const searchBtn = getAllByText(/search/i).find(item => item.textContent === 'searchSearch');
    expect(searchBtn).toBeInTheDocument();
    await user.click(searchBtn);
  });

  it('Should open and close publish modal', async () => {
    const { getByText, queryByText, findByText } = render(
      <MemoryRouter initialEntries={['/packaging/transfers/search/']}>
        <Route exact path="/packaging/transfers/search/" component={props => <TransfersOverview {...props} />} />
      </MemoryRouter>,
      initialState
    );

    const publishBtn = getByText('Publish');
    expect(publishBtn).toBeInTheDocument();
    await user.click(publishBtn);

    const modal = await findByText(/review and publish/i);
    expect(modal).toBeInTheDocument();

    const closeBtn = getByText('close');
    await user.click(closeBtn);
    expect(queryByText(/review and publish/i)).not.toBeInTheDocument();
  });

  it('Should render search and click row', async () => {
    search.mockResolvedValue({
      data: transferSearchTD
    });
    const screen = render(
      <MemoryRouter initialEntries={['/packaging/transfers/search/']}>
        <Route exact path="/packaging/transfers/search/" component={props => <TransfersOverview {...props} />} />
      </MemoryRouter>,
      initialState
    );

    const searchBtn = screen.getAllByText(/search/i).find(item => item.textContent === 'searchSearch');
    await user.click(searchBtn);

    const colValue = await screen.findByText(/productSaleableUnitId-SM_SEASON_PU_3/i);
    expect(colValue).toBeInTheDocument();
    const rowgroupContainer = screen.queryAllByRole('rowgroup');
    await user.click(within(rowgroupContainer[1]).getByRole('row'));
  });
});
