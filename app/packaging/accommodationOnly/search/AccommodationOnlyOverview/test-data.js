export const criteriaTD = [
  {
    key: 'season',
    values: [
      {
        id: 'W23-S24',
        name: 'Winter 2324-Summer 24',
        code: 'W23-S24',
        node: 'season',
        parent: null
      }
    ]
  },
  {
    key: 'classification',
    values: [
      {
        id: '2a55498f-ac84-407b-af7f-5148d9e05477',
        name: '2',
        parentId: '888BBCAA-8AC7-4EDB-B6A4-A7040CAC00F2_S23_NETHERLANDS',
        parent: {
          id: '888BBCAA-8AC7-4EDB-B6A4-A7040CAC00F2_S23_NETHERLANDS',
          parent: null
        }
      }
    ]
  },
  {
    key: 'roomcode',
    values: [
      {
        id: 'DO-02',
        name: 'DO-02',
        parentId: 'A1013003',
        parent: {
          id: 'A1013003',
          parent: null
        }
      }
    ]
  }
];

export const sourceMarketsTD = [
  {
    id: 'TUI_BE',
    name: 'TUI Belgium',
    code: 'TUI_BE',
    parent: null,
    parents: [],
    parentIds: ''
  }
];

export const apiSearchTD = {
  totalHits: 20,
  results: [
    {
      id: '4BE85C0E-A873-436A-AA61-07B61B52416B_S22',
      roomTypeId: 'RT27847',
      sourceMarketId: 'TUI_NL',
      sourceMarket: 'TUI_NL',
      country: 'Cape Verde',
      destination: 'Sal',
      resort: 'Santa Maria (Sal)',
      accommodationContractCode: 'A0555559',
      contractCode: 'DO-03',
      sourceId: '21b0da52-ba2d-4443-a696-f77d04f80fb7_test678',
      accommodationSourceId: '4BE85C0E-A873-436A-AA61-07B61B52416B_S22',
      chainName: 'Test',
      accommodationName: 'Best Tenerife',
      concepts: '',
      facilities: '',
      appliedRules: [
        {
          id: 3006,
          name: 'Test12345_Prudhvi',
          ruleType: 'Accommodation component'
        },
        {
          id: 34,
          name: 'EBD',
          ruleType: 'Discount'
        },
        {
          id: 35,
          name: 'Perceantage',
          ruleType: 'Discount'
        },
        {
          id: 36,
          name: 'FNO',
          ruleType: 'Discount'
        },
        {
          id: 199,
          name: 'Amt Disc',
          ruleType: 'Discount'
        },
        {
          id: 2085,
          name: 'test',
          ruleType: 'Over occupancy'
        }
      ],
      commitmentLevel: 0,
      isBaseRoom: false,
      roomTypeCategory: 'X',
      basicBoardCode: '636aeedc-c29c-4f95-af4c-20078d8202b7|breakfast',
      classification: '4',
      sourceReferenceCode: 'A0555559',
      contractStartDate: '2022-04-01T00:00:00',
      contractEndDate: '2022-10-31T00:00:00',
      averageCost: {
        values: {
          USD: 0,
          SEK: 0,
          NOK: 0,
          MAD: 0,
          GBP: 0,
          EUR: 0,
          DKK: 0,
          AED: 0,
          THB: 0
        }
      },
      rateType: 'N/A',
      warnings: [],
      changes: [],
      hasUnpublishedChanges: false,
      lastPublished: '2022-09-19T09:26:31.908815+00:00',
      publishedBy: 'Syed, Naseer (Ext)',
      description: 'Double Bedroom, High Floor',
      ancillaries: [],
      unacknowledged: false,
      keyAccom: 'False',
      keyDuration: '6,15,24,8,4,17,19,22,18,12,28,11,20,5,21,2,7,25,13,10,26,9,27,23,16,14,3,29'
    }
  ],
  numberOfAccommodationsMissingPackageRule: 0,
  numberOfAccommodationsMissingBrandProductCombinationConfigurationRule: 1
};

export const previewTD = {
  accommodationCount: 1,
  roomTypeCount: 1
};
