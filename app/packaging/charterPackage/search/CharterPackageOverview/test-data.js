import { Record, List, Map } from 'immutable';

export const initialState = {
  appState: new (Record({
    user: new (Record({
      name: 'User A',
      roles: List([
        'componenttemplates.overoccupancy.write',
        'componenttemplates.underoccupancy.write',
        'componenttemplates.vat.write',
        'componenttemplates.flightsupplements.write',
        'componenttemplates.dynamiccruise.write',
        'packagetemplates.bulkadjustment.write',
        'packagetemplates.accommodationonly.write',
        'packagetemplates.charterpackage.write',
        'publishcomponents.flightsupplements.write',
        'publishpackages.accommodationonly.write',
        'publishpackages.charterpackage.write',
        'publishpackages.dynamiccruise.write',
        'contracts.accommodations.write',
        'phasing.templates.write',
        'settings.userroles.write',
        'componenttemplates.roomupgrade.write',
        'settings.exchangerates.write',
        'settings.discounts.write',
        'settings.templatesettings.write',
        'componenttemplates.accommodationcomponents.write',
        'componenttemplates.ancillary.write',
        'componenttemplates.boardupgrade.write',
        'componenttemplates.distributioncost.write',
        'componenttemplates.flightdistributioncost.write',
        'componenttemplates.flightvat.write',
        'componenttemplates.guaranteefundaccom.write',
        'componenttemplates.guaranteefundflight.write',
        'componenttemplates.mandatorysupplement.write',
        'componenttemplates.misccost.write',
        'referenceflights.referenceflights.write',
        'packagetemplates.minmax.write'
      ]),
      access: {
        settings: {
          userroles: {
            read: true,
            write: true
          },
          exchangerates: {
            read: true,
            write: true
          },
          discounts: {
            read: true,
            write: true
          },
          templatesettings: {
            read: true,
            write: true
          }
        },
        componenttemplates: {
          accommodationcomponents: {
            read: true,
            write: true
          },
          underoccupancy: {
            read: true,
            write: true
          },
          overoccupancy: {
            read: true,
            write: true
          },
          boardupgrade: {
            read: true,
            write: true
          },
          mandatorysupplement: {
            read: true,
            write: true
          },
          ancillary: {
            read: true,
            write: true
          },
          roomupgrade: {
            read: true,
            write: true
          },
          flightsupplements: {
            read: true,
            write: true
          },
          dynamiccruise: {
            read: true,
            write: true
          },
          distributioncost: {
            read: true,
            write: true
          },
          flightdistributioncost: {
            read: true,
            write: true
          },
          vat: {
            read: true,
            write: true
          },
          misccost: {
            read: true,
            write: true
          },
          flightvat: {
            read: true,
            write: true
          },
          guaranteefundaccom: {
            read: true,
            write: true
          },
          guaranteefundflight: {
            read: true,
            write: true
          }
        },
        packagetemplates: {
          accommodationonly: {
            read: true,
            write: true
          },
          charterpackage: {
            read: true,
            write: true
          },
          bulkadjustment: {
            read: true,
            write: true
          },
          minmax: {
            read: true,
            write: true
          }
        },
        publishcomponents: {
          flightsupplements: {
            read: true,
            write: true
          }
        },
        publishpackages: {
          accommodationonly: {
            read: true,
            write: true
          },
          charterpackage: {
            read: true,
            write: true
          },
          dynamiccruise: {
            read: true,
            write: true
          }
        },
        contracts: {
          accommodations: {
            read: true,
            write: true
          }
        },
        phasing: {
          templates: {
            read: true,
            write: true
          }
        },
        referenceflights: {
          referenceflights: {
            read: true,
            write: true
          }
        }
      }
    }))(),
    selectedCurrency: 'USD',
    resortsList: [],
    dynamicAccommodation: Map()
  }))()
};

export const prodTypeTD = [
  {
    id: '0',
    name: 'FLY_AND_STAY'
  },
  {
    id: '1',
    name: 'ACCOMMODATION_ONLY'
  }
];

export const criteriaTD = [
  {
    key: 'season',
    values: [
      {
        id: 'W22',
        name: 'Winter 2223',
        code: 'W22',
        node: 'season',
        parent: null
      },
      {
        id: 'S22',
        name: 'Summer 22',
        code: 'S22',
        node: 'season',
        parent: null
      },
      {
        id: 'PERIOD-000000021',
        name: 'Winter 2122',
        code: 'W21',
        node: 'season',
        parent: null
      }
    ]
  },
  {
    key: 'classification',
    values: [
      {
        id: '9f83805c-8180-42ce-8d40-7c42ebbede95',
        name: '3',
        parentId: 'DFDCEBA9-D9F0-4765-BA42-DCC578677611_W22_NETHERLANDS',
        parent: {
          id: 'DFDCEBA9-D9F0-4765-BA42-DCC578677611_W22_NETHERLANDS',
          parent: null
        }
      }
    ]
  },
  {
    key: 'roomcode',
    values: [
      {
        id: '2DO-08',
        name: '2DO-08',
        parentId: '77EB04B1-8C1A-4929-9222_6488',
        parent: {
          id: '77EB04B1-8C1A-4929-9222_6488',
          parent: null
        }
      }
    ]
  }
];

export const resortTD = {
  totalRowCount: 1,
  geographyViewModel: [
    {
      id: '02c7eecd-f8fe-5ce1-92bf-6f31cec12482',
      name: 'Adrasan',
      code: '02c7eecd-f8fe-5ce1-92bf-6f31cec12482',
      parent: {
        id: 'c6b99bb4-fb69-5d40-9529-9e455b21ed3d',
        name: 'Antalya',
        code: 'c6b99bb4-fb69-5d40-9529-9e455b21ed3d',
        parents: [],
        parentIds: ''
      },
      parents: [],
      parentIds: 'c6b99bb4-fb69-5d40-9529-9e455b21ed3d'
    }
  ]
};

export const dynamicAccomTD = {
  totalRowCount: 1,
  geographyAccommodationViewModel: [
    {
      id: 'A00000TESTLocalFinal',
      name: 'A00000TESTLocalFinal TestLocal Final',
      code: 'A00000TESTLocalFinal',
      accommodationType: 'contracted',
      parent: {
        id: '469a7b76-6d97-5048-9247-478336598453',
        name: 'La Caleta',
        code: '469a7b76-6d97-5048-9247-478336598453',
        parents: [],
        parentIds: ''
      },
      parents: [],
      parentIds: '469a7b76-6d97-5048-9247-478336598453'
    }
  ]
};

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

export const destinationTD = [
  {
    id: '19cfed27-ac78-5c19-870d-db250c9809a9',
    name: 'Aargau',
    code: '19cfed27-ac78-5c19-870d-db250c9809a9',
    parent: {
      id: '135b9a7b-c5bf-5cdb-af4f-36474ef0ff0b',
      name: 'Switzerland',
      code: 'CH',
      parent: null,
      parents: [],
      parentIds: ''
    },
    parents: [],
    parentIds: '135b9a7b-c5bf-5cdb-af4f-36474ef0ff0b'
  }
];

export const countriesTD = [
  {
    id: '61eb9550-6fe5-5c28-9af8-0cfa4fe702cd',
    name: 'Åland Islands',
    code: 'AX',
    parent: null,
    parents: [],
    parentIds: ''
  }
];

export const accomTD = [
  {
    id: 'A00000TESTLocalFinal',
    name: 'A00000TESTLocalFinal TestLocal Final',
    code: 'A00000TESTLocalFinal',
    parent: {
      id: '469a7b76-6d97-5048-9247-478336598453',
      name: 'La Caleta',
      code: '469a7b76-6d97-5048-9247-478336598453',
      parent: null,
      parents: [],
      parentIds: ''
    },
    parents: [],
    parentIds: '469a7b76-6d97-5048-9247-478336598453'
  }
];

export const apiSearchTD = {
  charterPackages: [
    {
      id: 'DFDCEBA9-D9F0-4765-BA42-DCC578677611_W22_NETHERLANDS',
      roomTypeId: 'RT70',
      sourceMarketId: 'TUI_NL',
      sourceMarket: 'TUI Netherlands',
      country: 'Turkey',
      destination: 'Antalya',
      resort: 'Alanya',
      accommodationContractCode: 'A0363797',
      contractCode: 'DO-01',
      sourceId: 'b342246c-76b1-42ce-8c08-44dfebda9540',
      accommodationSourceId: 'DFDCEBA9-D9F0-4765-BA42-DCC578677611_W22_NETHERLANDS',
      chainName: 'A-ROSA',
      accommodationName: 'Kleopatra Atlas',
      concepts: '',
      facilities: '',
      commitmentLevel: 0,
      roomTypeCategory: 'X',
      basicBoardCode: 'breakfast',
      classification: '3',
      productType: 'FLY_AND_STAY',
      sourceReferenceCode: 'A0363797',
      contractStartDate: '2022-12-01T00:00:00',
      contractEndDate: '2022-12-31T00:00:00',
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
          id: 102,
          name: '9053 accom',
          ruleType: 'Accommodation component'
        }
      ],
      isBaseRoom: false,
      hasDynamicFlightCost: false,
      contractLevel: 'Optional',
      warnings: [],
      changes: [],
      hasUnpublishedChanges: false,
      description: 'Double Bedroom, Significant Position, Balcony, Pool View, Garden View',
      ancillaries: [],
      unacknowledged: false,
      keyAccom: 'False',
      keyDuration: '9,8,6,17,20,7,15,13,18,3,14,2,19,16,11,21,5,10,4,12',
      destinationId: 'c6b99bb4-fb69-5d40-9529-9e455b21ed3d',
      countryId: 'dde153fa-23cd-5752-9329-415419ee3e1a',
      seasonId: 'W22',
      season: 'Winter 2223'
    }
  ],
  numberOfAccommodationsMissingReferenceFlights: 0,
  numberOfAccommodationsMissingPackageRule: 0,
  numberOfAccommodationsMissingBrandProductCombinationConfigurationRule: 0
};

export const apiSearchPrevTD = {
  accommodationCount: 1,
  roomTypeCount: 1
};
