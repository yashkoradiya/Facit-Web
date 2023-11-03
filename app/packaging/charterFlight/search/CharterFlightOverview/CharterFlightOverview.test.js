import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, cleanup } from 'test-utils';
import { MemoryRouter, Route } from 'react-router';
import { initialState, sourceMarketsAPIData, matchingCriteriaAPIData, searchFlightAPIData } from './test-data';
import { CharterFlightOverview } from './CharterFlightOverview';
import * as matchingCriteriaApi from '../../../../apis/matchingCriteriasApi';
import * as sourceMarketApi from '../../../../apis/sourceMarketsApi';
import { searchFlightSeries } from '../api';

jest.mock('apis/matchingCriteriasApi');
jest.mock('apis/sourceMarketsApi');
jest.mock('../api');

afterEach(cleanup);

describe('Charter Flight Overview', () => {
  beforeEach(() => {
    matchingCriteriaApi.get.mockResolvedValue({
      data: matchingCriteriaAPIData
    });
    sourceMarketApi.getSourceMarkets.mockResolvedValue({
      data: sourceMarketsAPIData
    });
    searchFlightSeries.mockResolvedValue({ data: searchFlightAPIData });
  });

  it('Should open and close evaluate price modal', async () => {
    const user = userEvent.setup();
    const { getByText, findByText, getByRole, queryByText } = render(
      <MemoryRouter initialEntries={['/packaging/charter-flight/search/']}>
        <Route
          exact
          path="/packaging/charter-flight/search/"
          component={props => <CharterFlightOverview {...props} />}
        />
      </MemoryRouter>,
      initialState
    );

    const evaluateBtn = await findByText(/evaluate price/i);
    expect(evaluateBtn).toBeInTheDocument();
    await user.click(evaluateBtn);
    expect(getByText(/review and evaluate/i)).toBeInTheDocument();
    const cancelBtn = getByRole('button', {
      name: /cancel/i
    });
    await user.click(cancelBtn);
    expect(queryByText(/review and evaluate/i)).not.toBeInTheDocument();
  });

  it('Should open and close publish modal', async () => {
    const user = userEvent.setup();
    const { getByText, findByRole, queryByText, getByRole } = render(
      <MemoryRouter initialEntries={['/packaging/charter-flight/search/']}>
        <Route
          exact
          path="/packaging/charter-flight/search/"
          component={props => <CharterFlightOverview {...props} />}
        />
      </MemoryRouter>,
      initialState
    );

    const publishBtn = await findByRole('button', { name: 'publish Publish' });
    expect(publishBtn).toBeInTheDocument();
    await user.click(publishBtn);
    expect(getByText(/review and publish/i)).toBeInTheDocument();
    const closeBtn = getByRole('button', {
      name: 'close'
    });
    await user.click(closeBtn);
    expect(queryByText(/review and publish/i)).not.toBeInTheDocument();
  });
});
