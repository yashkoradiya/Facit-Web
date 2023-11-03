import React from 'react';
import DiscountTemplateOverview from './DiscountTemplateOverview';
import { render } from 'test-utils';
jest.mock('../../core/http/http');
jest.mock('../../core/identity/useAuth');

import * as rulesApi from '../../apis/rulesApi';
jest.mock('../../apis/rulesApi');

import * as sourceMarketsApi from '../../apis/sourceMarketsApi';
jest.mock('../../apis/sourceMarketsApi');
sourceMarketsApi.getSourceMarkets.mockImplementation(() =>
  Promise.resolve({
    data: sourceMarketData
  })
);

import * as matchingCriteriasApi from '../../apis/matchingCriteriasApi';
import userEvent from '@testing-library/user-event';
import { waitFor, within } from '@testing-library/react';

jest.mock('../../apis/matchingCriteriasApi');
matchingCriteriasApi.get.mockImplementation(() =>
  Promise.resolve({
    data: matchingCriteriaData
  })
);
jest.mock('../../apis/rulesApi');
rulesApi.getSelectableItems.mockImplementation(() =>
  Promise.resolve({
    data: selectableItemsData
  })
);

describe('DiscountTemplateOverview', () => {
  beforeEach(() => {
    rulesApi.search.mockResolvedValue({
      data: {
        results: [],
        totalHits: 0
      }
    });
  });

  it('should render AG grid when data is not empty', async () => {
    rulesApi.search.mockImplementationOnce(() =>
      Promise.resolve({
        data: ruleSearchData
      })
    );

    const { findByTestId } = render(<DiscountTemplateOverview readOnly={false} />);

    expect(await findByTestId('discount-template-overview')).toBeInTheDocument();
  });

  it('should render AG grid when result is empty but totalHits is larger than 0', async () => {
    rulesApi.search.mockImplementationOnce(() =>
      Promise.resolve({
        data: {
          results: [],
          totalHits: 1
        }
      })
    );
    const { findByTestId } = render(<DiscountTemplateOverview readOnly={false} />);

    expect(await findByTestId('discount-template-overview')).toBeInTheDocument();
  });

  it('should render a message when totalHits is 0', async () => {
    rulesApi.search.mockImplementationOnce(() =>
      Promise.resolve({
        data: {
          results: [],
          totalHits: 0
        }
      })
    );
    const { findByText } = render(<DiscountTemplateOverview readOnly={false} />);
    expect(await findByText(/no discounts are passed through./i)).toBeInTheDocument();
  });

  it('should render clear button', async () => {
    const { findByText } = render(<DiscountTemplateOverview readOnly={false} />);
    const clearButton = await findByText(/clear filters/i);
    expect(clearButton).toBeInTheDocument();

    userEvent.click(clearButton);
  });

  it('should render filter criterias and select an item', async () => {
    const user = userEvent.setup();
    const { getByTestId, getAllByRole } = render(<DiscountTemplateOverview readOnly={false} />);

    const filtersContainer = await waitFor(() => getByTestId('filters-container'));
    expect(filtersContainer.childElementCount).toBe(8);

    const searchField = within(filtersContainer.firstChild).getByRole('textbox');
    await user.click(searchField);

    const selectableItems = getAllByRole('listbox').find(item => item.localName === 'ul');
    const planningPeriodItem = selectableItems.firstChild;

    await user.click(planningPeriodItem);
  });
});

const ruleSearchData = {
  results: [
    {
      id: 1,
      name: 'Template name',
      sourceMarkets: 'TUI NO, TUI SE',
      valueType: 'Percentage',
      currency: 'EUR',
      marginBandStart: '2020-02-07T00:00:00',
      marginBandEnd: '2020-03-01T00:00:00',
      ruleType: 'discount',
      criterias: [
        {
          criteriaKey: 'country',
          criteriaTitle: 'Country',
          value: 'C1',
          valueTitle: 'Sweden',
          score: 1
        },
        {
          criteriaKey: 'destination',
          criteriaTitle: 'Destination',
          value: 'D1',
          valueTitle: 'Destination 1',
          score: 2
        },
        {
          criteriaKey: 'resort',
          criteriaTitle: 'Resort',
          value: 'R1',
          valueTitle: 'Resort 1',
          score: 3
        },
        {
          criteriaKey: 'accommodation',
          criteriaTitle: 'Accommodation',
          value: 'A1',
          valueTitle: 'Hotel 1',
          score: 4
        }
      ],
      assignedProducts: 0,
      properties: [],
      averageMargin: '15',
      lastModifiedAt: '2020-02-03T13:29:32.130699',
      lastModifiedByUserName: 'Team Production',
      assignedProductIds: []
    }
  ]
};

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
    key: 'country',
    values: [
      {
        id: 'G-000143',
        name: 'Cape Verde',
        code: 'CV',
        node: 'country',
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
    key: 'accommodationcode',
    values: [
      {
        id: 'A00000TESTLocalFinal',
        name: 'A00000TESTLocalFinal TestLocal Final',
        code: 'A00000TESTLocalFinal',
        parentId: '469a7b76-6d97-5048-9247-478336598453',
        node: 'accommodationcode',
        parent: {
          id: '469a7b76-6d97-5048-9247-478336598453',
          name: 'La Caleta',
          code: '469a7b76-6d97-5048-9247-478336598453',
          node: 'resort',
          parent: null
        }
      }
    ]
  }
];

const selectableItemsData = {
  sourceMarkets: [],
  durationGroups: [],
  properties: [
    {
      key: 'discount_type',
      label: 'Discount Type',
      values: [
        {
          value: 'ADC',
          displayName: 'Amount Discount'
        }
      ]
    },
    {
      key: 'contracted_source',
      label: 'Contracted Source',
      values: [
        {
          value: 'yield_reduction',
          displayName: 'YIELD_REDUCTION'
        }
      ]
    }
  ]
};
