import { userStateTD } from 'appState/appState-testdata';
import { Record } from 'immutable';

export const initialState = {
  appState: new (Record({
    user: userStateTD,
    selectedCurrency: 'USD'
  }))()
};



export const datasetsTD = [
  {
    key: 'a6a59a6f-3c5d-d0cf-72b4-c22d6aef2173',
    masterId: 1326,
    id: 'Test record',
    label: 'Test record',
    data: [
      {
        date: '04/01/2022 00:00:00',
        transferPrice: {
          values: {
            USD: 115,
            SEK: 1023,
            NOK: 723,
            MAD: 110,
            GBP: 85,
            EUR: 100,
            DKK: 901,
            AED: 404,
            THB: 3244
          }
        },
        transferCost: {
          values: {
            USD: 57.5,
            SEK: 511.5,
            NOK: 361.5,
            MAD: 55,
            GBP: 42.5,
            EUR: 50,
            DKK: 450.5,
            AED: 202,
            THB: 1622
          }
        }
      }
    ],
    selected: true,
    metadata: {
      ageCategoryType: 'Adult',
      sourceMarketName: 'TUI Netherlands',
      sourceMarketId: 'TUI_NL'
    }
  }
];

export const priceDetailsTD = [
  {
    key: '1326',
    masterId: 1326,
    productType: 'ACCOMMODATION_ONLY',
    sourceMarket: 'TUI Netherlands',
    unitType: 'Per Person',
    date: '2022-04-01T00:00:00',
    weekday: 'Fr',
    ageCategoryType: 'Adult',
    transferCost: {
      values: {
        USD: 57.5,
        SEK: 511.5,
        NOK: 361.5,
        MAD: 55,
        GBP: 42.5,
        EUR: 50,
        DKK: 450.5,
        AED: 202,
        THB: 1622
      }
    },
    transferPrice: {
      values: {
        USD: 115,
        SEK: 1023,
        NOK: 723,
        MAD: 110,
        GBP: 85,
        EUR: 100,
        DKK: 901,
        AED: 404,
        THB: 3244
      }
    },
    margin: {
      values: {
        USD: 57.5,
        SEK: 511.5,
        NOK: 361.5,
        MAD: 55,
        GBP: 42.5,
        EUR: 50,
        DKK: 450.5,
        AED: 202,
        THB: 1622
      }
    },
    distributionCost: {
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
    vat: {
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
    tooltips: [
      {
        priceComponentType: 'transfer_margin_component',
        amount: {
          values: {
            USD: 57.5,
            SEK: 511.5,
            NOK: 361.5,
            MAD: 55,
            GBP: 42.5,
            EUR: 50,
            DKK: 450.5,
            AED: 202,
            THB: 1622
          }
        },
        id: 2491,
        name: 'transfer margin 8980',
        sortOrder: 1
      }
    ]
  }
];
