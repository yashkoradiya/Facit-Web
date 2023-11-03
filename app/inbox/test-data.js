import { userStateTD } from 'appState/appState-testdata';
import { Record, Map } from 'immutable';

const appState = new (Record({ user: userStateTD, resortsList: [], dynamicAccommodation: Map() }))();

export const initialState = {
  appState
};

export const matchingCriteriaTD = [
  {
    key: 'season',
    values: [
      {
        id: '001',
        name: 'season 01',
        code: 'S01'
      }
    ]
  },
  {
    key: 'country',
    values: [
      {
        id: '001',
        name: 'test',
        code: 'C01'
      }
    ]
  },
  {
    key: 'destination',
    values: [
      {
        id: '001',
        name: 'test',
        code: 'D01'
      }
    ]
  },
  {
    key: 'airport',
    values: [
      {
        id: '001',
        name: 'test',
        code: 'A01'
      }
    ]
  }
];

export const sourceMarketsTD = [
  {
    id: '001',
    name: 'England'
  }
];

export const resortTD = {
  totalRowCount: 1,
  geographyViewModel: [
    {
      id: 'R001',
      name: 'Adrasan',
      code: 'somecode',
      parent: {
        id: 'RP01',
        name: 'Antalya',
        code: 'P101',
        parents: [],
        parentIds: ''
      },
      parents: [],
      parentIds: 'PID01'
    }
  ]
};

export const unpublishedTD = [
  {
    timestamp: '2023-04-12T07:24:37.254437',
    code: '001',
    name: 'Grand Bahia Principe Jamaica',
    id: '234SDS-SOMECODE',
    resort: 'Negril',
    season: 'Winter 2223',
    packageType: 'FLY_AND_STAY',
    sourceMarkets: 'TUI Belgium',
    contractVersion: 3,
    contractVersionDate: '2023-03-27T14:42:33.297'
  }
];

export const rejectedProductsTD = [
  {
    date: '2023-04-12T07:23:20.42199',
    type: 'APC',
    id: '234SDS-SOMECODE',
    description: 'Grand Bahia Principe Jamaica',
    reason: 'Some failure reason',
    sourceId: '6879dc75'
  }
];

export const failedExportsTD = [
  {
    timestamp: '2023-04-05T15:45:06.061119+00:00',
    id: 'MF575',
    description: 'ACE - RTM Th',
    sourceMarket: 'TUI Netherlands',
    sourceMarketId: 'TUI_NL',
    reason: 'Some error message',
    packageType: 'Charter flight supplement',
    packageTypeCode: 'charter_flight_supplement',
    republishAvailable: false,
    roomCount: 0,
    hasChanges: false,
    publishedBy: 'User A'
  }
];

export const changedOfferings = [
  {
    timestamp: '2023-04-03T09:51:23.381247',
    changes: ['Change 1', 'Change 2', 'Change 3'],
    changesCount: 3,
    sourceMarket: 'TUI Netherlands',
    season: 'Winter 2324-Summer 24',
    id: '43C0CE34',
    description: 'Max Stay Validation Accom',
    packageType: 'ACCOMMODATION_ONLY',
    code: 'A012345',
    contractVersion: 2,
    contractVersionDate: '2023-03-08T18:09:33.48'
  }
];
