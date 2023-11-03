import { userStateTD } from 'appState/appState-testdata';

export const initialState = {
  appState: {
    selectedCurrency: 'AED',
    user: userStateTD
  }
};

export const userRolesTD = [
  {
    id: 1,
    name: 'Admin',
    claims: [
      'componenttemplates.reversecharge.write',
      'packagetemplates.transfer.write',
      'phasing.templates.write',
      'contracts.accommodations.write',
      'publishpackages.dynamiccruise.write',
      'publishpackages.charterpackage.write',
      'publishpackages.accommodationonly.write',
      'publishcomponents.flightsupplements.write',
      'componenttemplates.roomupgrade.write',
      'packagetemplates.charterpackage.write',
      'packagetemplates.bulkadjustment.write',
      'componenttemplates.dynamiccruise.write',
      'componenttemplates.flightsupplements.write',
      'componenttemplates.vat.write',
      'componenttemplates.underoccupancy.write',
      'settings.userroles.write',
      'packagetemplates.accommodationonly.write',
      'referenceflights.referenceflights.write',
      'settings.exchangerates.write',
      'settings.discounts.write',
      'componenttemplates.transfervat.write',
      'componenttemplates.transfermargincomponent.write',
      'componenttemplates.transferdistributioncost.write',
      'componenttemplates.overoccupancy.write',
      'componenttemplates.misccost.write',
      'componenttemplates.mandatorysupplement.write',
      'componenttemplates.guaranteefundflight.write',
      'componenttemplates.guaranteefundaccom.write',
      'componenttemplates.flightvat.write',
      'componenttemplates.flightdistributioncost.write',
      'componenttemplates.distributioncost.write',
      'componenttemplates.boardupgrade.write',
      'componenttemplates.ancillary.write',
      'componenttemplates.accommodationcomponents.write',
      'settings.templatesettings.write',
      'publishpackages.transfer.write',
      'packagetemplates.minmax.write'
    ],
    categories: [
      {
        subcategories: [
          {
            access: 'Edit',
            category: 'userroles',
            name: 'User roles'
          },
          {
            access: 'Edit',
            category: 'exchangerates',
            name: 'Exchange rates'
          },
          {
            access: 'Edit',
            category: 'discounts',
            name: 'Discounts'
          },
          {
            access: 'Edit',
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
            access: 'Edit',
            category: 'accommodationcomponents',
            name: 'Accommodation components'
          },
          {
            access: 'Edit',
            category: 'underoccupancy',
            name: 'Under occupancy'
          },
          {
            access: 'Edit',
            category: 'overoccupancy',
            name: 'Over occupancy'
          },
          {
            access: 'Edit',
            category: 'boardupgrade',
            name: 'Board upgrade'
          },
          {
            access: 'Edit',
            category: 'mandatorysupplement',
            name: 'Mandatory supplement'
          },
          {
            access: 'Edit',
            category: 'ancillary',
            name: 'Ancillary'
          },
          {
            access: 'Edit',
            category: 'roomupgrade',
            name: 'Room upgrade'
          },
          {
            access: 'Edit',
            category: 'flightsupplements',
            name: 'Flight supplements'
          },
          {
            access: 'Edit',
            category: 'dynamiccruise',
            name: 'Dynamic cruise'
          },
          {
            access: 'Edit',
            category: 'distributioncost',
            name: 'Distribution cost'
          },
          {
            access: 'Edit',
            category: 'misccost',
            name: 'Misc cost'
          },
          {
            access: 'Edit',
            category: 'vat',
            name: 'VAT'
          },
          {
            access: 'Edit',
            category: 'flightdistributioncost',
            name: 'Flight Distribution Cost'
          },
          {
            access: 'Edit',
            category: 'flightvat',
            name: 'Flight Vat'
          },
          {
            access: 'Edit',
            category: 'guaranteefundaccom',
            name: 'guaranteefundaccom'
          },
          {
            access: 'Edit',
            category: 'guaranteefundflight',
            name: 'guaranteefundflight'
          },
          {
            access: 'Edit',
            category: 'transferdistributioncost',
            name: 'Transfer Distribution Cost'
          },
          {
            access: 'Edit',
            category: 'transfermargincomponent',
            name: 'Transfermargin Component'
          },
          {
            access: 'Edit',
            category: 'transfervat',
            name: 'Transfer Vat'
          },
          {
            access: 'Edit',
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
            access: 'Edit',
            category: 'accommodationonly',
            name: 'Accommodation only'
          },
          {
            access: 'Edit',
            category: 'charterpackage',
            name: 'Charter package'
          },
          {
            access: 'Edit',
            category: 'bulkadjustment',
            name: 'Bulk adjustment'
          },
          {
            access: 'Edit',
            category: 'minmax',
            name: 'Min/Max'
          },
          {
            access: 'Edit',
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
            access: 'Edit',
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
            access: 'Edit',
            category: 'accommodationonly',
            name: 'Accommodation only'
          },
          {
            access: 'Edit',
            category: 'charterpackage',
            name: 'Charter package'
          },
          {
            access: 'Edit',
            category: 'dynamiccruise',
            name: 'Dynamic cruise'
          },
          {
            access: 'Edit',
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
            access: 'Edit',
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
            access: 'Edit',
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
            access: 'Edit',
            category: 'referenceflights',
            name: 'Reference flights'
          }
        ],
        category: 'referenceflights',
        name: 'Reference flights'
      }
    ],
    settingsAccess: 'Edit',
    componentTemplatesAccess: 'Edit',
    packageTemplatesAccess: 'Edit',
    publishComponentsAccess: 'Edit',
    publishPackagesAccess: 'Edit',
    contractsAccess: 'Edit',
    phasingTemplatesAccess: 'Edit',
    referenceFlightsAccess: 'Edit',
    users: [],
    lastSaved: '2022-11-26T14:41:18.063'
  },
  {
    id: 2,
    name: 'read only',
    claims: [
      'settings.userroles.read',
      'settings.exchangerates.read',
      'settings.discounts.read',
      'settings.templatesettings.read',
      'componenttemplates.accommodationcomponents.read',
      'componenttemplates.transfervat.read',
      'componenttemplates.transfermargincomponent.read',
      'componenttemplates.transferdistributioncost.read',
      'componenttemplates.guaranteefundflight.read',
      'componenttemplates.guaranteefundaccom.read',
      'componenttemplates.flightvat.read',
      'componenttemplates.flightdistributioncost.read',
      'componenttemplates.vat.read',
      'componenttemplates.reversecharge.read',
      'componenttemplates.misccost.read',
      'componenttemplates.dynamiccruise.read',
      'componenttemplates.flightsupplements.read',
      'componenttemplates.roomupgrade.read',
      'componenttemplates.ancillary.read',
      'componenttemplates.mandatorysupplement.read',
      'componenttemplates.boardupgrade.read',
      'componenttemplates.overoccupancy.read',
      'componenttemplates.underoccupancy.read',
      'componenttemplates.distributioncost.read',
      'packagetemplates.accommodationonly.read',
      'packagetemplates.charterpackage.read',
      'packagetemplates.bulkadjustment.read',
      'packagetemplates.minmax.read',
      'publishcomponents.flightsupplements.read',
      'publishpackages.accommodationonly.read',
      'publishpackages.charterpackage.read',
      'publishpackages.dynamiccruise.read',
      'publishpackages.transfer.read',
      'contracts.accommodations.read',
      'referenceflights.referenceflights.read'
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
            access: 'NoAccess',
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
            access: 'NoAccess',
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
    packageTemplatesAccess: 'Customized',
    publishComponentsAccess: 'Read',
    publishPackagesAccess: 'Read',
    contractsAccess: 'Read',
    phasingTemplatesAccess: 'NoAccess',
    referenceFlightsAccess: 'Read',
    users: [],
    lastSaved: '2022-12-01T05:52:01.614678',
    savedBy: 'User a'
  },
  {
    id: 3,
    name: 'Write Only',
    claims: [
      'settings.userroles.write',
      'settings.exchangerates.write',
      'settings.discounts.write',
      'settings.templatesettings.write',
      'componenttemplates.accommodationcomponents.write',
      'componenttemplates.transfervat.write',
      'componenttemplates.transfermargincomponent.write',
      'componenttemplates.transferdistributioncost.write',
      'componenttemplates.guaranteefundflight.write',
      'componenttemplates.guaranteefundaccom.write',
      'componenttemplates.flightvat.write',
      'componenttemplates.flightdistributioncost.write',
      'componenttemplates.vat.write',
      'componenttemplates.reversecharge.write',
      'componenttemplates.misccost.write',
      'componenttemplates.dynamiccruise.write',
      'componenttemplates.flightsupplements.write',
      'componenttemplates.roomupgrade.write',
      'componenttemplates.ancillary.write',
      'componenttemplates.mandatorysupplement.write',
      'componenttemplates.boardupgrade.write',
      'componenttemplates.overoccupancy.write',
      'componenttemplates.underoccupancy.write',
      'componenttemplates.distributioncost.write',
      'packagetemplates.accommodationonly.write',
      'packagetemplates.charterpackage.write',
      'packagetemplates.bulkadjustment.write',
      'packagetemplates.minmax.write',
      'publishcomponents.flightsupplements.write',
      'publishpackages.accommodationonly.write',
      'publishpackages.charterpackage.write',
      'publishpackages.dynamiccruise.write',
      'publishpackages.transfer.write',
      'referenceflights.referenceflights.write',
      'contracts.accommodations.write'
    ],
    categories: [
      {
        subcategories: [
          {
            access: 'Edit',
            category: 'userroles',
            name: 'User roles'
          },
          {
            access: 'Edit',
            category: 'exchangerates',
            name: 'Exchange rates'
          },
          {
            access: 'Edit',
            category: 'discounts',
            name: 'Discounts'
          },
          {
            access: 'Edit',
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
            access: 'Edit',
            category: 'accommodationcomponents',
            name: 'Accommodation components'
          },
          {
            access: 'Edit',
            category: 'underoccupancy',
            name: 'Under occupancy'
          },
          {
            access: 'Edit',
            category: 'overoccupancy',
            name: 'Over occupancy'
          },
          {
            access: 'Edit',
            category: 'boardupgrade',
            name: 'Board upgrade'
          },
          {
            access: 'Edit',
            category: 'mandatorysupplement',
            name: 'Mandatory supplement'
          },
          {
            access: 'Edit',
            category: 'ancillary',
            name: 'Ancillary'
          },
          {
            access: 'Edit',
            category: 'roomupgrade',
            name: 'Room upgrade'
          },
          {
            access: 'Edit',
            category: 'flightsupplements',
            name: 'Flight supplements'
          },
          {
            access: 'Edit',
            category: 'dynamiccruise',
            name: 'Dynamic cruise'
          },
          {
            access: 'Edit',
            category: 'distributioncost',
            name: 'Distribution cost'
          },
          {
            access: 'Edit',
            category: 'misccost',
            name: 'Misc cost'
          },
          {
            access: 'Edit',
            category: 'vat',
            name: 'VAT'
          },
          {
            access: 'Edit',
            category: 'flightdistributioncost',
            name: 'Flight Distribution Cost'
          },
          {
            access: 'Edit',
            category: 'flightvat',
            name: 'Flight Vat'
          },
          {
            access: 'Edit',
            category: 'guaranteefundaccom',
            name: 'guaranteefundaccom'
          },
          {
            access: 'Edit',
            category: 'guaranteefundflight',
            name: 'guaranteefundflight'
          },
          {
            access: 'Edit',
            category: 'transferdistributioncost',
            name: 'Transfer Distribution Cost'
          },
          {
            access: 'Edit',
            category: 'transfermargincomponent',
            name: 'Transfermargin Component'
          },
          {
            access: 'Edit',
            category: 'transfervat',
            name: 'Transfer Vat'
          },
          {
            access: 'Edit',
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
            access: 'Edit',
            category: 'accommodationonly',
            name: 'Accommodation only'
          },
          {
            access: 'Edit',
            category: 'charterpackage',
            name: 'Charter package'
          },
          {
            access: 'Edit',
            category: 'bulkadjustment',
            name: 'Bulk adjustment'
          },
          {
            access: 'Edit',
            category: 'minmax',
            name: 'Min/Max'
          },
          {
            access: 'NoAccess',
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
            access: 'Edit',
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
            access: 'Edit',
            category: 'accommodationonly',
            name: 'Accommodation only'
          },
          {
            access: 'Edit',
            category: 'charterpackage',
            name: 'Charter package'
          },
          {
            access: 'Edit',
            category: 'dynamiccruise',
            name: 'Dynamic cruise'
          },
          {
            access: 'Edit',
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
            access: 'Edit',
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
            access: 'NoAccess',
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
            access: 'Edit',
            category: 'referenceflights',
            name: 'Reference flights'
          }
        ],
        category: 'referenceflights',
        name: 'Reference flights'
      }
    ],
    settingsAccess: 'Edit',
    componentTemplatesAccess: 'Edit',
    packageTemplatesAccess: 'Customized',
    publishComponentsAccess: 'Edit',
    publishPackagesAccess: 'Edit',
    contractsAccess: 'Edit',
    phasingTemplatesAccess: 'NoAccess',
    referenceFlightsAccess: 'Edit',
    users: [
      {
        subjectId: 'aad_zy858dsfxxztcsvpu8xgeuhxru7d-gjmwooukjuqskg',
        name: 'Shah, Manan'
      },
      {
        subjectId: 'aad_adqp5u3iwfvag2fvlni7lk3ki9vm4dg3egoawl620vy',
        name: 'User A'
      }
    ],
    lastSaved: '2022-12-01T08:25:05.779765',
    savedBy: 'User A'
  }
];

export const usersTD = [
  {
    subjectId: 'aad_somerandomvalue',
    name: 'User A',
    dateAdded: '2022-12-01T05:57:38.635Z',
    userRoles: [
      {
        id: 2,
        name: 'Read Only'
      },
      {
        id: 3,
        name: 'Write Only'
      }
    ],
    userRegions: [],
    lastSaved: '2023-05-22T06:32:33.992Z',
    savedBy: 'User A'
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
