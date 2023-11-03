import { userStateTD } from 'appState/appState-testdata';
import { Map, Record } from 'immutable';

export const initialState = {
  appState: new (Record({
    selectedCurrency: 'AED',
    user: userStateTD,
    resortsList: [],
    dynamicAccommodation: Map()
  }))()
};

export const userRolesTD = [
  {
    id: 2,
    name: 'Read only',
    claims: [
      'publishpackages.transfer.read',
      'componenttemplates.flightsupplements.read',
      'componenttemplates.distributioncost.read',
      'componenttemplates.mandatorysupplement.read',
      'referenceflights.referenceflights.read',
      'componenttemplates.overoccupancy.read',
      'componenttemplates.roomupgrade.read',
      'componenttemplates.underoccupancy.read',
      'packagetemplates.minmax.read',
      'componenttemplates.flightdistributioncost.read',
      'componenttemplates.flightvat.read',
      'componenttemplates.guaranteefundaccom.read',
      'componenttemplates.guaranteefundflight.read',
      'componenttemplates.transferdistributioncost.read',
      'componenttemplates.transfermargincomponent.read',
      'componenttemplates.transfervat.read',
      'packagetemplates.transfer.read',
      'componenttemplates.boardupgrade.read',
      'componenttemplates.reversecharge.read',
      'componenttemplates.ancillary.read',
      'settings.templatesettings.read',
      'componenttemplates.dynamiccruise.read',
      'packagetemplates.bulkadjustment.read',
      'packagetemplates.accommodationonly.read',
      'packagetemplates.charterpackage.read',
      'publishpackages.accommodationonly.read',
      'publishpackages.charterpackage.read',
      'publishpackages.dynamiccruise.read',
      'componenttemplates.vat.read',
      'contracts.accommodations.read',
      'phasing.templates.read',
      'publishcomponents.flightsupplements.read',
      'componenttemplates.misccost.read',
      'settings.userroles.read',
      'settings.exchangerates.read',
      'settings.discounts.read',
      'componenttemplates.accommodationcomponents.read'
    ],
    categories: [
      {
        subcategories: [
          {
            access: 'Read',
            category: 'userroles',
            name: 'User roles'
          },
          {
            access: 'Read',
            category: 'exchangerates',
            name: 'Exchange rates'
          },
          {
            access: 'Read',
            category: 'discounts',
            name: 'Discounts'
          },
          {
            access: 'Read',
            category: 'templatesettings',
            name: 'Template settings'
          }
        ],
        category: 'settings',
        name: 'Settings'
      },
      {
        subcategories: [
          {
            access: 'Read',
            category: 'accommodationcomponents',
            name: 'Accommodation components'
          },
          {
            access: 'Read',
            category: 'underoccupancy',
            name: 'Under occupancy'
          },
          {
            access: 'Read',
            category: 'overoccupancy',
            name: 'Over occupancy'
          },
          {
            access: 'Read',
            category: 'boardupgrade',
            name: 'Board upgrade'
          },
          {
            access: 'Read',
            category: 'mandatorysupplement',
            name: 'Mandatory supplement'
          },
          {
            access: 'Read',
            category: 'ancillary',
            name: 'Ancillary'
          },
          {
            access: 'Read',
            category: 'roomupgrade',
            name: 'Room upgrade'
          },
          {
            access: 'Read',
            category: 'flightsupplements',
            name: 'Flight supplements'
          },
          {
            access: 'Read',
            category: 'dynamiccruise',
            name: 'Dynamic cruise'
          },
          {
            access: 'Read',
            category: 'distributioncost',
            name: 'Distribution cost'
          },
          {
            access: 'Read',
            category: 'misccost',
            name: 'Misc cost'
          },
          {
            access: 'Read',
            category: 'vat',
            name: 'VAT'
          },
          {
            access: 'Read',
            category: 'flightdistributioncost',
            name: 'Flight Distribution Cost'
          },
          {
            access: 'Read',
            category: 'flightvat',
            name: 'Flight Vat'
          },
          {
            access: 'Read',
            category: 'guaranteefundaccom',
            name: 'guaranteefundaccom'
          },
          {
            access: 'Read',
            category: 'guaranteefundflight',
            name: 'guaranteefundflight'
          },
          {
            access: 'Read',
            category: 'transferdistributioncost',
            name: 'Transfer Distribution Cost'
          },
          {
            access: 'Read',
            category: 'transfermargincomponent',
            name: 'Transfermargin Component'
          },
          {
            access: 'Read',
            category: 'transfervat',
            name: 'Transfer Vat'
          },
          {
            access: 'Read',
            category: 'reversecharge',
            name: 'Reverse Charge'
          }
        ],
        category: 'componenttemplates',
        name: 'Component templates'
      },
      {
        subcategories: [
          {
            access: 'Read',
            category: 'accommodationonly',
            name: 'Accommodation only'
          },
          {
            access: 'Read',
            category: 'charterpackage',
            name: 'Charter package'
          },
          {
            access: 'Read',
            category: 'bulkadjustment',
            name: 'Bulk adjustment'
          },
          {
            access: 'Read',
            category: 'minmax',
            name: 'Min/Max'
          },
          {
            access: 'Read',
            category: 'transfer',
            name: 'Transfer'
          }
        ],
        category: 'packagetemplates',
        name: 'Package templates'
      },
      {
        subcategories: [
          {
            access: 'Read',
            category: 'flightsupplements',
            name: 'Flight supplements'
          }
        ],
        category: 'publishcomponents',
        name: 'Publish components'
      },
      {
        subcategories: [
          {
            access: 'Read',
            category: 'accommodationonly',
            name: 'Accommodation only'
          },
          {
            access: 'Read',
            category: 'charterpackage',
            name: 'Charter package'
          },
          {
            access: 'Read',
            category: 'dynamiccruise',
            name: 'Dynamic cruise'
          },
          {
            access: 'Read',
            category: 'transfer',
            name: 'Transfer'
          }
        ],
        category: 'publishpackages',
        name: 'Publish packages'
      },
      {
        subcategories: [
          {
            access: 'Read',
            category: 'accommodations',
            name: 'Accommodations'
          }
        ],
        category: 'contracts',
        name: 'Contracts'
      },
      {
        subcategories: [
          {
            access: 'Read',
            category: 'templates',
            name: 'Templates'
          }
        ],
        category: 'phasing',
        name: 'Phasing'
      },
      {
        subcategories: [
          {
            access: 'Read',
            category: 'referenceflights',
            name: 'Reference flights'
          }
        ],
        category: 'referenceflights',
        name: 'Reference flights'
      }
    ],
    settingsAccess: 'Read',
    componentTemplatesAccess: 'Read',
    packageTemplatesAccess: 'Read',
    publishComponentsAccess: 'Read',
    publishPackagesAccess: 'Read',
    contractsAccess: 'Read',
    phasingTemplatesAccess: 'Read',
    referenceFlightsAccess: 'Read',
    users: [
      {
        subjectId: 'c21d214e-240f-4269-b990-cd60aed0a2f9',
        name: 'testsyn'
      }
    ],
    lastSaved: '0001-01-01T00:00:00'
  }
];

export const userRegionsTD = [
  {
    id: 3,
    name: 'Region One',
    users: [
      {
        subjectId: 'aad_somerandomvalue',
        name: 'User A'
      }
    ],
    lastSaved: '2023-05-18T11:17:26.617857Z'
  },
  {
    id: 4,
    name: 'Region Two',
    users: [
      {
        subjectId: 'aad_somerandomvalue',
        name: 'User A'
      }
    ],
    lastSaved: '2023-05-18T11:17:26.617858Z'
  }
];

export const datePeriodsTD = [
  {
    fromDate: '2020-01-01T00:00:00',
    toDate: '2022-09-30T00:00:00',
    latestVersionNumber: 1,
    latestVersionId: 'e503b522-e814-49da-9777-2277f84451b0'
  }
];

export const ratesByDateTD = {
  enabledCurrencies: [
    {
      name: 'Euro',
      code: 'EUR'
    }
  ],
  exchangeRateVersions: [],
  baseCurrency: 'EUR',
  defaultSourceMarkets: [
    {
      id: 'TUI_NL',
      name: 'TUI Netherlands'
    }
  ]
};

export const planningPeriodsTD = [
  {
    id: 'PERIOD-000000021',
    name: 'Winter 2122'
  }
];

export const discountMatchingCriteriaTD = [
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
        id: '178d55bd-b096-596e-a4d3-bfad3414b79a',
        name: 'Aakar',
        code: '178d55bd-b096-596e-a4d3-bfad3414b79a',
        parentId: '6603097e-05a6-5b8c-a884-5828641848ea',
        node: 'destination',
        parent: {
          id: '6603097e-05a6-5b8c-a884-5828641848ea',
          name: 'Lebanon',
          code: 'LB',
          node: 'country',
          parent: null
        }
      }
    ]
  },
  {
    key: 'resort',
    values: [
      {
        id: '5a15e2e1-e34b-5977-ae64-2ec6bffdc419',
        name: 'Aachen',
        code: '5a15e2e1-e34b-5977-ae64-2ec6bffdc419',
        parentId: '2440a828-6c90-5538-9d37-293e56b2e4ec',
        node: 'resort',
        parent: {
          id: '2440a828-6c90-5538-9d37-293e56b2e4ec',
          name: 'Nordrhein-Westfalen',
          code: '2440a828-6c90-5538-9d37-293e56b2e4ec',
          node: 'destination',
          parent: null
        }
      }
    ]
  },
  {
    key: 'accommodationcode',
    values: [
      {
        id: 'A0054812',
        name: 'A0054812 TRS Coral Hotel',
        code: 'A0054812',
        parentId: 'dcbc7be5-2046-539c-a19b-ec0100df5352',
        node: 'accommodationcode',
        parent: {
          id: 'dcbc7be5-2046-539c-a19b-ec0100df5352',
          name: 'Cancun',
          code: 'dcbc7be5-2046-539c-a19b-ec0100df5352',
          node: 'resort',
          parent: null
        }
      }
    ]
  }
];

export const sourcemarketTD = [
  {
    id: 'TUI_NL',
    name: 'TUI Netherlands'
  }
];

export const discountRuleTD = {
  sourceMarkets: [
    {
      id: 'TUI_NL',
      name: 'TUI Netherlands'
    },
    {
      id: 'TUI_BE',
      name: 'TUI Belgium'
    }
  ],
  durationGroups: [],
  properties: [
    {
      key: 'discount_type',
      label: 'Discount Type',
      values: [
        {
          value: 'ADC',
          displayName: 'Amount Discount'
        },
        {
          value: 'EB',
          displayName: 'Early Bird Discount'
        },
        {
          value: 'FNO',
          displayName: 'Free Night Discount'
        },
        {
          value: 'REB',
          displayName: 'Rolling Early Bird Discount'
        },
        {
          value: 'SDC',
          displayName: 'Senior Discount'
        },
        {
          value: 'PDC',
          displayName: 'Percentage Discount'
        },
        {
          value: 'YF',
          displayName: 'Young Family Discount'
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
        },
        {
          value: 'contracted',
          displayName: 'CONTRACTED'
        },
        {
          value: 'both',
          displayName: 'BOTH'
        }
      ]
    }
  ],
  templateType: []
};

export const searchTD = {
  results: [],
  totalHits: 5,
  currentPage: 0,
  pageSize: 0
};

export const resortTD = {
  totalRowCount: 1,
  geographyViewModel: [
    {
      id: '4eb24c2d-7a9d-57fe-8a9a-8b70b88594df',
      name: 'Aarlen',
      code: '4eb24c2d-7a9d-57fe-8a9a-8b70b88594df',
      parent: {
        id: 'f8d98342-e530-5c49-8a00-e8343bcf0dbc',
        name: 'Luxembourg',
        code: 'f8d98342-e530-5c49-8a00-e8343bcf0dbc',
        parents: [],
        parentIds: ''
      },
      parents: [],
      parentIds: 'f8d98342-e530-5c49-8a00-e8343bcf0dbc'
    }
  ]
};
