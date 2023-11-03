import { Record, List } from 'immutable';

/**
 * Common user state data that is used for accessing components that require redux user state.
 */
export const userStateTD = new (Record({
  name: 'User A',
  roles: List([
    'componenttemplates.transfermargincomponent.write',
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
  sourcemarkets: 'some-source-market',
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
      transfermargincomponent: {
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
      },
      transfer: {
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
}))();
