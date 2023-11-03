export const ruleDefinitionsTD = [
  {
    id: 1,
    name: 'Reverse Charge',
    description: 'Percentage',
    validForAssociatedProductType: {},
    type: {
      ruleType: 'reverse_charge',
      displayName: 'reverse_charge'
    },
    matchingCriteriaDefinitions: [
      {
        id: 228,
        title: 'Product Type',
        criteriaKey: 'producttype',
        sortOrder: 0,
        score: 1
      },
      {
        id: 226,
        title: 'Country',
        criteriaKey: 'country',
        sortOrder: 1,
        score: 2
      },
      {
        id: 225,
        title: 'Destination',
        criteriaKey: 'destination',
        sortOrder: 2,
        score: 3
      }
    ],
    valueDefinitions: [
      {
        id: 116,
        title: 'Value',
        ageCategoryType: 'All',
        ageCategoryIndex: 0,
        sortOrder: 0,
        valueType: 'Percentage'
      }
    ],
    showCurrency: false
  }
];

export const sourceMarketTD = {
  sourceMarkets: [
    {
      id: 'TUI_BE',
      name: 'TUI Belgium'
    },
    {
      id: 'TUI_NL',
      name: 'TUI Netherlands'
    },
    {
      id: 'VIP',
      name: 'VIP'
    },
    {
      id: 'VIP_BE',
      name: 'VIP Selection'
    },
    {
      id: 'TU_BE',
      name: 'TU_BE'
    }
  ],
  durationGroups: [],
  properties: [],
  templateType: []
};

export const matchingCriteriaDefTD = [
  {
    key: 'producttype',
    values: [
      {
        id: '1',
        name: 'ACCOMMODATION_ONLY',
        code: 'AO',
        node: 'producttype',
        parent: null
      },
      {
        id: '0',
        name: 'FLY_AND_STAY',
        code: 'FS',
        node: 'producttype',
        parent: null
      }
    ]
  },
  {
    key: 'country',
    values: [
      {
        id: '61eb9550-6fe5-5c28-9af8-0cfa4fe702cd',
        name: 'Åland Islands',
        code: 'AX',
        node: 'country',
        parent: null
      }
    ]
  },
  {
    key: 'destination',
    values: [
      {
        id: '19cfed27-ac78-5c19-870d-db250c9809a9',
        name: 'Aargau',
        code: '19cfed27-ac78-5c19-870d-db250c9809a9',
        parentId: '135b9a7b-c5bf-5cdb-af4f-36474ef0ff0b',
        node: 'destination',
        parent: {
          id: '135b9a7b-c5bf-5cdb-af4f-36474ef0ff0b',
          name: 'Switzerland',
          code: 'CH',
          node: 'country',
          parent: null
        }
      }
    ]
  }
];
