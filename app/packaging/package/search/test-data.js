export const matchingCriteriaApiTD = [
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
        id: 'aea6cc04-ee94-40b6-a005-0fdc868a9012',
        name: '1',
        parentId: '0F545732-C448-4C0E-9A11-116F1DA4EA92',
        parent: {
          id: '0F545732-C448-4C0E-9A11-116F1DA4EA92',
          parent: null
        }
      }
    ]
  },
  {
    key: 'roomcode',
    values: [
      {
        id: '1BU-01',
        name: '1BU-01',
        parentId: 'A0540172',
        parent: {
          id: 'A0540172',
          parent: null
        }
      }
    ]
  }
];

export const packageOverviewSearchTD = {
  charterPackages: [
    {
      id: '1F286FDC-FE68-439B-AB52-BFC10C824CD2_S23_NETHERLANDS',
      roomTypeId: 'RT1037',
      sourceMarketId: 'TUI_NL',
      sourceMarket: 'TUI Netherlands',
      country: 'Turkey',
      destination: 'Antalya',
      resort: 'Side',
      accommodationContractCode: 'A0434799',
      contractCode: 'DO-06',
      sourceId: '1d844286-bfe7-4268-9faa-31c6b7fb8f71',
      accommodationSourceId: '1F286FDC-FE68-439B-AB52-BFC10C824CD2_S23_NETHERLANDS',
      chainName: 'Barut',
      accommodationName: 'TUI BLUE Barut Andiz',
      concepts: '',
      facilities: '',
      commitmentLevel: 0,
      roomTypeCategory: 'X',
      basicBoardCode: 'all inclusive',
      classification: '5',
      productType: 'FLY_AND_STAY',
      sourceReferenceCode: 'A0434799',
      contractStartDate: '2023-04-01T00:00:00',
      contractEndDate: '2023-10-31T00:00:00',
      airportId: '33591d9e-c522-5e35-8a0f-d090b4b6b586',
      airportName: 'Antalya Domestic Airport (AYT)',
      airportCode: 'AYT',
      averageCost: {
        values: {
          AED: 0,
          DKK: 0,
          EUR: 0,
          GBP: 0,
          MAD: 0,
          NOK: 0,
          SEK: 0,
          THB: 0,
          USD: 0
        }
      },
      appliedRules: [
        {
          id: 38,
          name: 'EBD',
          ruleType: 'Discount'
        },
        {
          id: 40,
          name: 'Percentage discount ',
          ruleType: 'Discount'
        },
        {
          id: 803,
          name: 'test_distr',
          ruleType: 'Distribution cost'
        },
        {
          id: 760,
          name: 'test',
          ruleType: 'Min/max adjustment'
        },
        {
          id: 805,
          name: 'Misc test',
          ruleType: 'Miscellaneous cost',
          label: 'TestCostLabel'
        },
        {
          id: 133,
          name: 'under_occ_per',
          ruleType: 'Under occupancy'
        },
        {
          id: 200,
          name: 'VAT_ACCOM',
          ruleType: 'VAT'
        },
        {
          id: 808,
          name: 'VAT SIM',
          ruleType: 'VAT'
        }
      ],
      isBaseRoom: true,
      hasDynamicFlightCost: false,
      contractLevel: 'Optional',
      warnings: [
        {
          message: 'Missing margin template',
          warningLevel: 'BlockPublish'
        }
      ],
      changes: [],
      hasUnpublishedChanges: false,
      description: 'Double Bedroom',
      ancillaries: [],
      unacknowledged: false,
      keyAccom: 'False',
      keyDuration: '5,10,8,4,3,11,9,7,2,6',
      destinationId: 'c6b99bb4-fb69-5d40-9529-9e455b21ed3d',
      countryId: 'dde153fa-23cd-5752-9329-415419ee3e1a',
      seasonId: 'S23',
      season: 'Summer 23'
    }
  ],
  numberOfAccommodationsMissingReferenceFlights: 167,
  numberOfAccommodationsMissingPackageRule: 89,
  numberOfAccommodationsMissingBrandProductCombinationConfigurationRule: 0,
  missingExchangeRatesCount: 0
};
