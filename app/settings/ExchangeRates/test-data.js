import { userStateTD } from 'appState/appState-testdata';

export const initialState = {
  appState: {
    selectedCurrency: 'AED',
    user: userStateTD
  }
};

export const exchangeRateByDatePeriodTD = [
  {
    fromDate: '2022-10-09T11:02:30.636',
    toDate: '2022-11-09T11:02:30.636',
    latestVersionNumber: 1,
    latestVersionId: 'db6a5c1f-24e8-46ab-97b7-210ebf6cc466'
  },
  {
    fromDate: '2023-10-09T11:02:30.636',
    toDate: '2023-11-09T11:02:30.636',
    latestVersionNumber: 1,
    latestVersionId: 'db6a5c1f-24e8-46ab-97b7-210ebf6cc466'
  },
  {
    fromDate: '2024-10-09T11:02:30.636',
    toDate: '2024-11-09T11:02:30.636',
    latestVersionNumber: 1,
    latestVersionId: 'db6a5c1f-24e8-46ab-97b7-210ebf6cc466'
  }
];

export const exchangeRateByDateTD =  {
    enabledCurrencies: [
      {
        name: 'United Arab Emirates Dirham',
        code: 'AED'
      },
      {
        name: 'Euro',
        code: 'EUR'
      },
      {
        name: 'British Pound Sterling',
        code: 'GBP'
      },
      {
        name: 'Thai Baht',
        code: 'THB'
      },
      {
        name: 'United States Dollar',
        code: 'USD'
      },
      {
        name: 'Danish Krone',
        code: 'DKK'
      },
      {
        name: 'Norwegian Krone',
        code: 'NOK'
      },
      {
        name: 'Swedish Krona',
        code: 'SEK'
      },
      {
        name: 'Moroccan Dirham',
        code: 'MAD'
      }
    ],
    exchangeRateVersions: [
      {
        versionNumber: 1,
        createdBy: 'Anshu Kumar Tiwari',
        createdDate: '2022-11-15T08:50:53.114105',
        rates: [
          {
            currency: 'AED',
            rate: 3.15,
            name: 'United Arab Emirates Dirham',
            baseCurrency: 'EUR',
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
                id: 'VIP_BE',
                name: 'VIP Selection'
              },
              {
                id: 'TUI_SE',
                name: 'TUI Sweden'
              },
              {
                id: 'TU_BE',
                name: 'TUI Belgium'
              },
              {
                id: 'TUI_DK',
                name: 'TUI Denmark'
              },
              {
                id: 'TUI_FI',
                name: 'TUI Finland'
              },
              {
                id: 'TUI_NO',
                name: 'TUI Norway'
              }
            ]
          },
          {
            currency: 'DKK',
            rate: 10.1,
            name: 'Danish Krone',
            baseCurrency: 'EUR',
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
                id: 'VIP_BE',
                name: 'VIP Selection'
              },
              {
                id: 'TUI_SE',
                name: 'TUI Sweden'
              },
              {
                id: 'TU_BE',
                name: 'TUI Belgium'
              },
              {
                id: 'TUI_DK',
                name: 'TUI Denmark'
              },
              {
                id: 'TUI_FI',
                name: 'TUI Finland'
              },
              {
                id: 'TUI_NO',
                name: 'TUI Norway'
              }
            ]
          },
          {
            currency: 'EUR',
            rate: 1,
            name: 'Euro',
            baseCurrency: 'EUR',
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
                id: 'VIP_BE',
                name: 'VIP Selection'
              },
              {
                id: 'TUI_SE',
                name: 'TUI Sweden'
              },
              {
                id: 'TU_BE',
                name: 'TUI Belgium'
              },
              {
                id: 'TUI_DK',
                name: 'TUI Denmark'
              },
              {
                id: 'TUI_FI',
                name: 'TUI Finland'
              },
              {
                id: 'TUI_NO',
                name: 'TUI Norway'
              }
            ]
          },
          {
            currency: 'GBP',
            rate: 0.8,
            name: 'British Pound Sterling',
            baseCurrency: 'EUR',
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
                id: 'VIP_BE',
                name: 'VIP Selection'
              },
              {
                id: 'TUI_SE',
                name: 'TUI Sweden'
              },
              {
                id: 'TU_BE',
                name: 'TUI Belgium'
              },
              {
                id: 'TUI_DK',
                name: 'TUI Denmark'
              },
              {
                id: 'TUI_FI',
                name: 'TUI Finland'
              },
              {
                id: 'TUI_NO',
                name: 'TUI Norway'
              }
            ]
          },
          {
            currency: 'MAD',
            rate: 1.3,
            name: 'Moroccan Dirham',
            baseCurrency: 'EUR',
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
                id: 'VIP_BE',
                name: 'VIP Selection'
              },
              {
                id: 'TUI_SE',
                name: 'TUI Sweden'
              },
              {
                id: 'TU_BE',
                name: 'TUI Belgium'
              },
              {
                id: 'TUI_DK',
                name: 'TUI Denmark'
              },
              {
                id: 'TUI_FI',
                name: 'TUI Finland'
              },
              {
                id: 'TUI_NO',
                name: 'TUI Norway'
              }
            ]
          },
          {
            currency: 'NOK',
            rate: 9.1,
            name: 'Norwegian Krone',
            baseCurrency: 'EUR',
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
                id: 'VIP_BE',
                name: 'VIP Selection'
              },
              {
                id: 'TUI_SE',
                name: 'TUI Sweden'
              },
              {
                id: 'TU_BE',
                name: 'TUI Belgium'
              },
              {
                id: 'TUI_DK',
                name: 'TUI Denmark'
              },
              {
                id: 'TUI_FI',
                name: 'TUI Finland'
              },
              {
                id: 'TUI_NO',
                name: 'TUI Norway'
              }
            ]
          },
          {
            currency: 'SEK',
            rate: 10.5,
            name: 'Swedish Krona',
            baseCurrency: 'EUR',
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
                id: 'VIP_BE',
                name: 'VIP Selection'
              },
              {
                id: 'TUI_SE',
                name: 'TUI Sweden'
              },
              {
                id: 'TU_BE',
                name: 'TUI Belgium'
              },
              {
                id: 'TUI_DK',
                name: 'TUI Denmark'
              },
              {
                id: 'TUI_FI',
                name: 'TUI Finland'
              },
              {
                id: 'TUI_NO',
                name: 'TUI Norway'
              }
            ]
          },
          {
            currency: 'THB',
            rate: 34.3,
            name: 'Thai Baht',
            baseCurrency: 'EUR',
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
                id: 'VIP_BE',
                name: 'VIP Selection'
              },
              {
                id: 'TUI_SE',
                name: 'TUI Sweden'
              },
              {
                id: 'TU_BE',
                name: 'TUI Belgium'
              },
              {
                id: 'TUI_DK',
                name: 'TUI Denmark'
              },
              {
                id: 'TUI_FI',
                name: 'TUI Finland'
              },
              {
                id: 'TUI_NO',
                name: 'TUI Norway'
              }
            ]
          },
          {
            currency: 'USD',
            rate: 1.1,
            name: 'United States Dollar',
            baseCurrency: 'EUR',
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
                id: 'VIP_BE',
                name: 'VIP Selection'
              },
              {
                id: 'TUI_SE',
                name: 'TUI Sweden'
              },
              {
                id: 'TU_BE',
                name: 'TUI Belgium'
              },
              {
                id: 'TUI_DK',
                name: 'TUI Denmark'
              },
              {
                id: 'TUI_FI',
                name: 'TUI Finland'
              },
              {
                id: 'TUI_NO',
                name: 'TUI Norway'
              }
            ]
          }
        ]
      }
    ],
    baseCurrency: 'EUR',
    defaultSourceMarkets: [
      {
        id: 'TUI_BE',
        name: 'TUI Belgium'
      },
      {
        id: 'TUI_NL',
        name: 'TUI Netherlands'
      },
      {
        id: 'VIP_BE',
        name: 'VIP Selection'
      },
      {
        id: 'TUI_SE',
        name: 'TUI Sweden'
      },
      {
        id: 'TU_BE',
        name: 'TUI Belgium'
      },
      {
        id: 'TUI_DK',
        name: 'TUI Denmark'
      },
      {
        id: 'TUI_FI',
        name: 'TUI Finland'
      },
      {
        id: 'TUI_NO',
        name: 'TUI Norway'
      }
    ]
  }
