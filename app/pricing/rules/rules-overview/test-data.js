import { userStateTD } from 'appState/appState-testdata';
import { Record, Map } from 'immutable';

const appState = new (Record({ user: userStateTD, resortsList: [], dynamicAccommodation: Map() }))();

export const initialState = {
  appState
};

export const matchingCriteriaApiData = [
  {
    key: 'producttype',
    values: [
      {
        id: '1',
        name: 'PRODUCT 1',
        code: 'P1',
        node: 'producttype',
        parent: null
      }
    ]
  },
  {
    key: 'season',
    values: [
      {
        id: 'S01',
        name: 'SEASON 01',
        code: 'S01',
        node: 'season'
      }
    ]
  },
  {
    key: 'country',
    values: [
      {
        id: '123',
        name: 'COUNTRY ONE',
        code: 'CO',
        node: 'country',
        parent: null
      }
    ]
  },
  {
    key: 'destination',
    values: [
      {
        id: '123',
        name: 'DESTINATION_ONE',
        code: 'D_O',
        parentId: 'PD01',
        node: 'destination',
        parent: {
          id: 'PD01',
          name: 'PARENT_DESTINATION_ONE',
          code: 'PDO',
          node: 'country',
          parent: null
        }
      }
    ]
  }
];

export const sourceMarketsApiData = [
  {
    id: 'M_O',
    name: 'MARKET ONE'
  },
  {
    id: 'M_T',
    name: 'MARK_TWO'
  },
  {
    id: 'M_TH',
    name: 'MAKR_THREE'
  }
];

export const selectableItemsApiData = [
  {
    key: 'cost_label',
    label: 'Cost Label',
    values: [
      {
        value: 'Transfer',
        displayName: 'Transfer'
      }
    ]
  },
  {
    key: 'product_type_for_vat',
    label: 'Product Type',
    values: [
      {
        value: 'vat',
        displayName: 'Accommodation'
      },
      {
        value: 'charter_flight_vat',
        displayName: 'Flight'
      }
    ]
  },
  {
    key: 'contracttype',
    label: 'Contract Type',
    values: [
      {
        value: 'all',
        displayName: 'All'
      },
      {
        value: 'gross',
        displayName: 'Gross Contract'
      },
      {
        value: 'net',
        displayName: 'Net Contract'
      }
    ]
  },
  {
    key: 'flight_template_type',
    label: 'Template Type',
    templateTypes: [
      {
        id: 1,
        value: 'Flight Margin',
        displayName: 'Flight Margin'
      },
      {
        id: 2,
        value: 'Day of Week',
        displayName: 'Day of Week'
      }
    ]
  }
];
export const apiSearchData = [
  {
    id: 1,
    name: 'Accom one',
    sourceMarkets: 'MARKET_ONE',
    valueType: 'SOME VALUE',
    currency: 'USD',
    marginBandStart: '2021-01-01T00:00:00',
    marginBandEnd: '2024-01-01T00:00:00',
    ruleType: 'RULE_ONE',
    criterias: [
      {
        criteriaKey: 'season',
        criteriaTitle: 'Season',
        value: 'SEASON-01',
        valueTitle: 'SEASON 0101',
        score: 2
      },
      {
        criteriaKey: 'producttype',
        criteriaTitle: 'Producttype',
        value: 'PRODUCT_ONE',
        valueTitle: 'PRODUCT_01',
        valueCode: 'P1',
        score: 1
      }
    ],
    assignedProducts: 0,
    properties: [],
    averageMargin: '10',
    firstMargin: '10.0',
    lastModifiedAt: '2021-12-01T01:01:00.0000',
    lastModifiedByUserName: 'JOHN DOE',
    assignedProductIds: [],
    flightTemplateType: ''
  }
];

export const apiSearchPreviewData = [
  {
    key: 'flight',
    count: 0
  },
  {
    key: 'charter-package',
    count: 1
  },
  {
    key: 'miscellaneous-cost',
    count: 2
  },
  {
    key: 'distribution-cost',
    count: 1
  },
  {
    key: 'dynamic-cruise',
    count: 0
  },
  {
    key: 'vat',
    count: 1
  },
  {
    key: 'room-upgrade',
    count: 1
  },
  {
    key: 'bulk-adjustment',
    count: 0
  },
  {
    key: 'min-max',
    count: 0
  }
];
