import React from 'react';
import { render, cleanup, waitFor, within, screen } from 'test-utils';
import { MemoryRouter, Route } from 'react-router';
import Inbox from './Inbox';
import * as matchingCriteriasApi from 'apis/matchingCriteriasApi';
import * as sourceMarketsApi from 'apis/sourceMarketsApi';
import * as inboxAPI from './api';
import { getPaginatedResorts } from 'components/GeographySearch/api';
import userEvent from '@testing-library/user-event';
import {
  changedOfferings,
  failedExportsTD,
  initialState,
  matchingCriteriaTD,
  rejectedProductsTD,
  resortTD,
  sourceMarketsTD,
  unpublishedTD
} from './test-data';

jest.mock('apis/matchingCriteriasApi');
jest.mock('apis/sourceMarketsApi');
jest.mock('./api');
jest.mock('components/GeographySearch/api');

afterEach(cleanup);

let user;

describe('Inbox Screen', () => {
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
    inboxAPI.getUnpublishedAccommodations.mockResolvedValue({ data: unpublishedTD });
    inboxAPI.getRejectedProducts.mockResolvedValue({ data: rejectedProductsTD });
    inboxAPI.getFailedExports.mockResolvedValue({
      data: failedExportsTD
    });
    inboxAPI.getChangedOfferings.mockResolvedValue({ data: changedOfferings });
    inboxAPI.getNonContractedDiscounts.mockResolvedValue({ data: [] });
  });

  it('Should render the Inbox screen', async () => {
    const { findByTestId } = render(
      <MemoryRouter initialEntries={['/']}>
        <Route path="/" exact component={() => <Inbox />} />
      </MemoryRouter>,
      initialState
    );

    const inboxContainer = await findByTestId('inbox-wrapper');
    expect(inboxContainer).toBeInTheDocument();
  });

  it('Should be able to select a filter', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Route path="/" exact component={() => <Inbox />} />
      </MemoryRouter>,
      initialState
    );
    let view;
    await waitFor(async () => {
      view = await screen.findByTestId('filter-criteria');
    });

    // Get Planning period and select the list item
    const planningPeriod = within(view).getByPlaceholderText(/planning period/i);
    const ppTextbox = within(planningPeriod).getByRole('textbox');
    await user.click(ppTextbox);
    await user.click(screen.getByText(/season 01/i));
  });
});
