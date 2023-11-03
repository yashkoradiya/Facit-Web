import React from 'react';
import { render, waitFor } from 'test-utils';
import InboxStatusGrid from './InboxStatusGrid';
import {
  failedImportsColDef,
  newAccomColDef,
  nonContractedColDefs,
  unpublishedContractColDef
} from './../../inboxColumnDefinitions';
import * as inboxAPI from './../../api';
import { INBOX_FAILED_IMPORTS, INBOX_NONCONTRACTED_DISCOUNTS, INBOX_UNPUBLISHED_CHANGES } from 'inbox/InboxConstants';

jest.mock('./../../api');

const newAccomTestData = [
  {
    timestamp: '2021-09-22T10:29:17.579465',
    code: 'A0534049',
    name: 'Cleopatra Luxury Resort CFD-6973 Test1',
    id: 'AF2F12E0-751A-4F48-A9F7-050A90D42F6E_S22_CFD-6973_TEST1',
    resort: 'Sharks Bay',
    packageType: 'ACCOMMODATION_ONLY',
    sourceMarkets: 'TUI Netherlands, TUI Belgium',
    contractVersion: 1,
    contractVersionDate: '2021-08-20T13:46:19.274'
  }
];

const failedImportsTestData = [
  {
    date: '2022-02-04T10:55:10.984262',
    type: 'APC',
    id: '791a9f92-58f9-4aa0-8b08-4714675e9912_W22-S23_Belgium',
    description: 'Hotel Riu Palace Aruba',
    reason: 'One or more errors occurred.',
    sourceId: '791a9f92-58f9-4aa0-8b08-4714675e9912_W22-S23_Belgium'
  }
];

const unpublishedContractTestData = [
  {
    timestamp: '2021-09-27T12:27:19.419154',
    changes:
    ["Room type commitment changed", "Discount changed", "Supplement changed"," Room ID changed", "Room type changed", "Child max age changed", "Allotment changed", "Rate changed", "Name changed", "Rate period changed"],
    sourceMarket: 'TUI Netherlands, TUI Belgium, VIP Selection',
    season: 'Winter 2122',
    id: 'A59477B8-DE0D-417D-9C6C-11E9AD1EC4EC_W21',
    description: 'Hotel Riu Palace Maspalomas CFD-7049',
    packageType: 'FLY_AND_STAY',
    code: 'A0209362',
    contractVersion: 9,
    contractVersionDate: '2021-09-16T10:47:05.816'
  }
];

const nonContractedDiscountsTestData = [
  {
    saleableUnitId: '4eb50ec4-a82f-38b0b9b687d6_8513',
    publishedDateTime: '2022-02-22T06:14:09.193898+05:30',
    planningPeriod: 'PERIOD-000000021',
    description: '',
    sourceMarket: 'TUI_BE',
    accommName: 'FACIT NCD TEST 8512',
    accommCode: 'A0000005_8513',
    productType: 'ACCOMMODATION_ONLY',
    discountVersion: '4',
    packageType: 'accommodation_only'
  }
];

const configDepends = {};

describe('InboxStatusGrid', () => {
  beforeEach(() => {
    inboxAPI.getUnpublishedAccommodations.mockResolvedValue({ data: [] });
    inboxAPI.getRejectedProducts.mockResolvedValue({ data: [] });
    inboxAPI.getChangedOfferings.mockResolvedValue({ data: [] });
    inboxAPI.getNonContractedDiscounts.mockResolvedValue({ data: [] });
  });

  it('Should render container div with styles', async () => {
    const { getByTestId } = render(
      <InboxStatusGrid
        gridKey="test-key"
        gridHeight="20vh"
        title="Lorem ipsum"
        columnDefinitions={newAccomColDef}
        dependencies={configDepends}
      />
    );

    const container = await waitFor(() => getByTestId('status-grid-container'));
    expect(container).toHaveStyle('position: relative');
    expect(container).toHaveStyle('width: 100%');
  });

  it('Should render New Accommodations grid', async () => {
    inboxAPI.getUnpublishedAccommodations.mockResolvedValue({ data: newAccomTestData });
    const { getByText, findByTestId, queryByTestId } = render(
      <InboxStatusGrid
        gridKey="inbox-new-accommodations"
        gridHeight="20vh"
        title="New Accommodations"
        columnDefinitions={newAccomColDef}
        dependencies={configDepends}
      />
    );

    expect(getByText(/new accommodations \(0\)/i)).toBeInTheDocument();

    let indicator = await findByTestId('loading-indicator');
    expect(indicator).not.toBeNull();
    await waitFor(() => queryByTestId('loading-indicator'));

    expect(inboxAPI.getUnpublishedAccommodations).toHaveBeenCalledTimes(1);
  });

  it('Should render Failed imports grid', async () => {
    inboxAPI.getRejectedProducts.mockResolvedValue({ data: failedImportsTestData });
    const { getByText, getByTestId } = render(
      <InboxStatusGrid
        gridKey={INBOX_FAILED_IMPORTS}
        gridHeight="20vh"
        title="Failed Imports"
        columnDefinitions={failedImportsColDef}
        dependencies={configDepends}
      />
    );

    expect(getByText(/failed imports \(0\)/i)).toBeInTheDocument();

    await waitFor(() => getByTestId('status-grid-container'));
    expect(inboxAPI.getRejectedProducts).toHaveBeenCalledTimes(1);

    expect(getByText(/failed imports \(1\)/i)).toBeInTheDocument();
  });

  it('Should render Unpublished contract changes grid', async () => {
    inboxAPI.getChangedOfferings.mockResolvedValue({ data: unpublishedContractTestData });
    const { getByText, getByTestId } = render(
      <InboxStatusGrid
        gridKey={INBOX_UNPUBLISHED_CHANGES}
        gridHeight="60vh"
        title="Unpublished Contract Changes"
        columnDefinitions={unpublishedContractColDef}
        dependencies={configDepends}
      />
    );

    expect(getByText(/unpublished contract changes \(0\)/i)).toBeInTheDocument();
    await waitFor(() => getByTestId('status-grid-container'));

    expect(inboxAPI.getChangedOfferings).toHaveBeenCalledTimes(1);

    await waitFor(() => getByTestId('status-grid-container'));  
  });

  it('Should render Non contracted discounts grid', async () => {
    inboxAPI.getNonContractedDiscounts.mockResolvedValue({ data: nonContractedDiscountsTestData });
    const { getByText, getByTestId } = render(
      <InboxStatusGrid
        gridKey={INBOX_NONCONTRACTED_DISCOUNTS}
        gridHeight="30vh"
        title="Non Contracted Discounts"
        columnDefinitions={nonContractedColDefs}
        dependencies={configDepends}
      />
    );

    expect(getByText(/non contracted discounts \(0\)/i)).toBeInTheDocument();

    await waitFor(() => getByTestId('status-grid-container'));
    expect(inboxAPI.getNonContractedDiscounts).toHaveBeenCalledTimes(1);

    expect(getByText(/non contracted discounts \(1\)/i)).toBeInTheDocument();
  });
});
