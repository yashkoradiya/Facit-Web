import React from 'react';
import { render, waitFor, prettyDOM } from 'test-utils';
import PublishStatusModal from './PublishStatusModal';
import * as inboxApi from '../api';
import * as matchingCriteriasApi from 'apis/matchingCriteriasApi';
import * as sourceMarketsApi from 'apis/sourceMarketsApi';
jest.mock('apis/sourceMarketsApi');
sourceMarketsApi.getSourceMarkets.mockImplementation(
  () =>
    new Promise(resolve => {
      resolve({
        data: sourceMarketData
      });
    })
);
jest.mock('apis/matchingCriteriasApi');
matchingCriteriasApi.get.mockImplementation(
  () =>
    new Promise(resolve => {
      resolve({
        data: matchingCriteriaData
      });
    })
);

jest.mock('../api');

describe('PublishStatusModal', () => {
  afterEach(() => {
    inboxApi.getPublishStatus.mockClear();
  });

  it('should render row for data', async () => {
    inboxApi.getPublishStatus.mockResolvedValue({
      data: [
        {
          accommodation: 'hotel name',
          accommodationContractCode: 'contract-identifier',
          roomCount: 1337,
          sourceMarketName: 'Tui SE',
          packageType: 'Charter package',
          publishedAt: '01-01-2020 13:00',
          publishedBy: 'user',
          status: 'AdapterTimedOut',
          republishAvailable: true,
          id: 'MA1',
          sourceMarketId: 'SM1'
        }
      ]
    });

    const { findByText, getAllByRole } = render(<PublishStatusModal show={true} onClose={() => {}} />);
    await waitFor(() => getAllByRole('rowgroup'));

    getAllByRole('rowgroup').forEach(item => {
      console.log(prettyDOM(item));
    });
    expect(await findByText(/hotel name/i)).toBeInTheDocument();
    expect(await findByText(/contract-identifier/i)).toBeInTheDocument();
    expect(await findByText(/1337/i)).toBeInTheDocument();
    expect(await findByText(/Tui SE/i)).toBeInTheDocument();
    expect(await findByText(/Charter package/i)).toBeInTheDocument();
    expect(await findByText(/01-01-2020 13:00/i)).toBeInTheDocument();
    expect(await findByText(/^published$/i)).toBeInTheDocument();
    expect(await findByText(/^time-out$/i)).toBeInTheDocument();
  });

  it('should render republish button', async () => {
    inboxApi.getPublishStatus.mockResolvedValueOnce({
      data: [
        {
          republishAvailable: true,
          status: 'FacitFailed',
          publishedAt: '01-01-2020 13:00',
          id: 'MA1',
          sourceMarketId: 'SM1'
        }
      ]
    });

    const { findAllByText } = render(<PublishStatusModal show={true} onClose={() => {}} />);

    expect(await findAllByText(/Re-publish/i)).toHaveLength(2);
  });

  it('should  render republish button when republish is available', async () => {
    inboxApi.getPublishStatus.mockResolvedValue({
      data: [
        {
          status: 'AdapterTimedOut',
          republishAvailable: false,
          publishedAt: '01-01-2020 13:00',
          id: 'MA1',
          sourceMarketId: 'SM1'
        }
      ]
    });

    const { queryByTestId, getAllByRole } = render(<PublishStatusModal show={true} onClose={() => {}} />);
    await waitFor(() => getAllByRole('rowgroup'));
    const buttonWrapper = queryByTestId('button-cell-renderer');

    expect(buttonWrapper).not.toBeNull();
  });
});

const sourceMarketData = [
  {
    id: 'BR-000004',
    name: 'TUI NO'
  }
];

const matchingCriteriaData = [
  {
    key: 'season',
    values: [
      {
        id: 'W19',
        name: 'Winter 2019',
        code: 'W19',
        node: 'season',
        parent: null
      }
    ]
  },
  {
    key: 'destination',
    values: [
      {
        id: 'G-000000741',
        name: 'Barcelona',
        code: 'ESGR',
        parentId: 'G-000073',
        node: 'destination',
        parent: {
          id: 'G-000073',
          name: 'Spain',
          code: 'ES',
          node: 'country',
          parent: null
        }
      }
    ]
  },
  {
    key: 'accommodation',
    values: [
      {
        id: 'PC-500032773',
        name: 'Abora Catarina by Lopesan Hotels (Winter 2021)',
        code: 'IFC',
        parentId: 'G-000098',
        node: 'accommodation',
        parent: {
          id: 'G-000098',
          name: 'Playa del Ingles',
          code: 'PLI',
          node: 'resort',
          parent: null
        }
      }
    ]
  }
];
