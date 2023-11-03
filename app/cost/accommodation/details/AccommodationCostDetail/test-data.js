/**
 * Initial state for redux
 */
export const initialState = {
  appState: {
    selectedCurrency: 'USD',
    user: {
      roles: [
        'componenttemplates.overoccupancy.write',
        'componenttemplates.underoccupancy.write',
        'componenttemplates.vat.write',
        'componenttemplates.flightsupplements.write',
        'componenttemplates.dynamiccruise.write',
        'packagetemplates.bulkadjustment.write',
        'packagetemplates.accommodationonly.write',
        'packagetemplates.charterpackage.write'
      ],
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

export const accommCostDetailsAPIData = {
  details: {
    name: 'Sandos Playacar Beach Resort Spa',
    code: 'A1016',
    sourceReferenceCode: 'A1016',
    resortName: 'Playa del Carmen',
    resortCode: 'acd7f1c2',
    destinationName: 'Quintana Roo',
    destinationCode: 'b86f08bc',
    countryName: 'Mexico',
    concept: '',
    classification: '5',
    currentVersion: 8,
    contractVersion: '8',
    currentVersionDate: '2021-07-29T15:53:23.139064',
    commission: 0,
    averageBedNightRate: {
      values: {
        AED: 189.1945568627451,
        DKK: 349.40849673202615,
        EUR: 45.08496732026144,
        GBP: 40.88304836601307,
        MAD: 476.99895424836603,
        NOK: 450.8496732026144,
        SEK: 455.3581699346405,
        THB: 1554.6559111111112,
        USD: 27.050980392156863
      }
    },
    averageUnderOccupancy: 0,
    contractStatus: 'Signed',
    contractCurrency: 'EUR',
    contractStart: '2021-11-01T00:00:00',
    contractEnd: '2022-04-02T00:00:00',
    contractSourceIds: ['Contract-KE3z12b2q3vM'],
    differential: {
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
    totalCalculationValue: {
      values: {
        AED: 2015102.8872,
        DKK: 3721534.5,
        EUR: 480198,
        GBP: 435443.5464,
        MAD: 5080494.84,
        NOK: 4801980,
        SEK: 4849999.8,
        THB: 16558571.5944,
        USD: 288118.8
      }
    },
    totalCalculationValueWithoutRisk: {
      values: {
        AED: 2015102.8872,
        DKK: 3721534.5,
        EUR: 480198,
        GBP: 435443.5464,
        MAD: 5080494.84,
        NOK: 4801980,
        SEK: 4849999.8,
        THB: 16558571.5944,
        USD: 288118.8
      }
    },
    totalRisk: {
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
    totalContractsValue: {
      values: {
        AED: 2015102.8872,
        DKK: 3721534.5,
        EUR: 480198,
        GBP: 435443.5464,
        MAD: 5080494.84,
        NOK: 4801980,
        SEK: 4849999.8,
        THB: 16558571.5944,
        USD: 288118.8
      }
    },
    totalCommittedValue: {
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
    commitmentLevel: 0,
    shouldApplyPhasing: false,
    costPhasingOverrideSetting: 0,
    calculationMethod: 'None',
    keyAccom: false,
    keyDuration: '20,14,10,17,12,8,4,3,2,16,15,13,5,18,7,21,9,19,11,6,1',
    isGrossContract: false
  },
  calculatedCosts: [
    {
      id: 'RT911',
      roomCode: 'DO-01',
      calculatedCostPeriods: [
        {
          from: '2021-11-01T00:00:00',
          to: '2021-12-17T00:00:00',
          value: {
            values: {
              AED: 155.2668,
              DKK: 286.75,
              EUR: 37,
              GBP: 33.5516,
              MAD: 391.46,
              NOK: 370,
              SEK: 373.7,
              THB: 1275.8636,
              USD: 22.2
            }
          }
        }
      ]
    }
  ]
};

export const discountAPIData = {
  costs: [
    {
      type: 'FreeNights-TEST',
      description: '2) FN 2+1',
      arrivalFrom: '2021-11-01T00:00:00',
      arrivalTo: '2022-04-02T00:00:00',
      bookingFrom: '2021-05-19T00:00:00',
      bookingTo: '2022-04-01T00:00:00',
      bookToDay: 50,
      bookFromDay: 15,
      noOfFreeNights: 1,
      valueType: 'Percentage',
      value: 100,
      rateType: 'PPPN',
      repeatable: 'false',
      prolongable: 'false',
      applyMethod: 'ALL',
      offerMethod: 'NA',
      arrivalDays: 'MTWTFXX',
      stayDays: 'MTWTFSS',
      roomCode: 'DO-01',
      contractedSource: 'CONTRACTED'
    }
  ],
  combinabilityGroups: [
    {
      id: 'DCG39',
      accommodationDefinitionId: 289,
      combinations: [
        {
          id: 78,
          discountName: 'Discount',
          discountGroupId: 11,
          enabled: false
        }
      ]
    }
  ],
  noCombinationsEnabled: true
};
