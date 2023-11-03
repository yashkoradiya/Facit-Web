export const initialState = {
  appState: {
    selectedCurrency: 'AED',
    user: {
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
    }
  }
};

export const sourceMarketsAPIData = [
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
  }
];

export const matchingCriteriaAPIData = [
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
    key: 'season',
    values: [
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
    key: 'departureairport',
    values: [
      {
        id: '6706738a',
        name: 'Agadir',
        parentId: 'MF572',
        parent: {
          id: 'MF572',
          parent: null
        }
      },
      {
        id: '6706738b',
        name: 'Agadir',
        parentId: 'MF345',
        parent: {
          id: 'MF345',
          parent: null
        }
      }
    ]
  },
  {
    key: 'destinationairport',
    values: [
      {
        id: '6706738a',
        name: 'Agadir',
        parentId: 'MF319',
        parent: {
          id: 'MF319',
          parent: null
        }
      },
      {
        id: '6706738b',
        name: 'Agadir',
        parentId: 'MF119',
        parent: {
          id: 'MF119',
          parent: null
        }
      }
    ]
  },
  {
    key: 'airline',
    values: [
      {
        id: 'OR',
        name: ' (OR)',
        parentId: 'MF1015',
        parent: {
          id: 'MF1015',
          parent: null
        }
      },
      {
        id: 'OR',
        name: ' (OR)',
        parentId: 'MF318',
        parent: {
          id: 'MF318',
          parent: null
        }
      }
    ]
  },
  {
    key: 'weekday',
    values: [
      {
        id: 'WD1',
        name: 'Monday',
        parent: null
      },
      {
        id: 'WD1',
        name: 'Monday',
        parent: null
      }
    ]
  }
];

export const searchFlightAPIData = [
  {
    id: 'MF241',
    sourceId: 'OR 363 AMSCUR 7',
    sourceMarketId: 'TUI_BE',
    seasonId: 'S22',
    sourceMarket: 'TUI Belgium',
    departureAirport: 'AMS',
    arrivalAirport: 'CUR',
    airline: 'OR',
    isReferenceFlight: false,
    seatClasses: 'EC',
    frequency: 7,
    firstOutboundDate: '2022-03-27T11:50:00',
    lastHomeboundDate: '2022-10-23T11:50:00',
    weekday: 'Su',
    flightNumber: '363',
    slot: '1',
    departureCount: 31,
    transportCode: 'CURAMS0 363',
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
    averageMargin: 0,
    averagePrice: 0,
    lastPublished: '2021-07-26T19:33:17.950415+05:30',
    isPublished: false,
    hasUnpublishedChanges: false,
    publishedBy: 'Maynard, James',
    durations: '0, 7, 14, 21, 28',
    warnings: [],
    rebaseReferenceFlightAvailable: false,
    unacknowledged: false
  }
];
