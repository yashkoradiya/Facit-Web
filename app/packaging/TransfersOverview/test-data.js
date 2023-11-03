import { userStateTD } from 'appState/appState-testdata';

export const initialState = {
  appState: {
    selectedCurrency: 'AED',
    user: userStateTD
  }
};

export const sourceMarketTD = [
  {
    id: 'TUI_BE',
    name: 'TUI Belgium'
  }
];

export const productTypeTD = {
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
};

export const seasonTD = {
  key: 'season',
  values: [
    {
      id: 'W22',
      name: 'Winter 2223',
      code: 'W22',
      node: 'season',
      parent: null
    }
  ]
};

export const weekdayTD = {
  key: 'weekday',
  values: [
    {
      id: 'WD4',
      name: 'Thursday',
      parent: null
    }
  ]
};

export const airportTD = {
  key: 'airport',
  values: [
    {
      id: '72d93c18-0253-5ff9-9f1d-a67cba8567bd',
      name: 'Aalborg Airport (AAL)',
      code: 'AAL',
      parentId: 'b35f1dc8-4010-5a0b-abe2-05d07ec26bf5',
      node: 'airport',
      parent: {
        id: 'b35f1dc8-4010-5a0b-abe2-05d07ec26bf5',
        name: 'Denmark',
        code: 'DK',
        node: 'country',
        parent: null
      }
    }
  ]
};

export const areaTD = {
  key: 'area',
  values: [
    {
      id: 'VIJ',
      name: 'Vijaynagar',
      code: 'VIJ',
      node: 'area',
      parent: null
    }
  ]
};

export const transferTypeTD = {
  key: 'transfertype',
  values: [
    {
      id: 'Coach',
      name: 'Coach',
      code: 'Coach',
      node: 'transfertype',
      parent: null
    }
  ]
};

export const unitTypeTD = {
  key: 'transferunittype',
  values: [
    {
      id: 'Per Person',
      name: 'Per Person',
      code: 'Per Person',
      node: 'transferunittype',
      parent: null
    }
  ]
};

export const matchingCriteriaApiTD = [
  productTypeTD,
  seasonTD,
  weekdayTD,
  airportTD,
  areaTD,
  transferTypeTD,
  unitTypeTD
];

export const reviewData = [
  {
    id: 2,
    productConfigurationId: 'productSaleableUnitId-SM_SEASON_10469_Dev_v1',
    sourceMarketId: 'TUI_NL',
    productType: ['ACCOMMODATION_ONLY'],
    seasonId: 'S22',
    category: 'Coach',
    transferFrom: 'Faro International Airport (FAO)',
    transferTo: 'Vijaynagar',
    lastPublished: {
      lastPublishedAO: '2022-08-17T12:09:54.233972+05:30',
      lastPublishedFS: '2022-08-17T12:09:54.233972+05:30'
    },
    publishedBy: 'System'
  }
];

export const transferSearchTD = {
  transfer: [{
    id: '826',
    productConfigurationId: 'productSaleableUnitId-SM_SEASON_PU_3',
    saleableUnitId: 'productSaleableUnitId_PU_3',
    productType: 'ACCOMMODATION_ONLY',
    season: 'Winter 2223',
    sourceMarket: 'TUI Belgium',
    sourceMarketId: 'TUI_BE',
    departure: 'Vijaynagar',
    arrival: 'Faro International Airport (FAO)',
    startDate: '2022-11-01T00:00:00',
    endDate: '2023-04-30T00:00:00',
    transferType: 'Taxi',
    unitType: 'Per Unit',
    appliedRules: [
      {
        id: 3117,
        name: '10337_ChnagedtoPerUnit',
        ruleType: 'transfer_margin_component'
      },
      {
        id: 4687,
        name: 'Transfer2',
        ruleType: 'transfer_margin_component'
      }
    ],
    warnings: [
      {
        message: 'Missing exchange rates for the period : 01/11/2022 - 30/04/2023',
        warningLevel: 'BlockViewAndPublish'
      }
    ]
  }],
  missingExchangeRates: true
};
