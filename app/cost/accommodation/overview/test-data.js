import { userStateTD } from 'appState/appState-testdata';
import { Record, Map } from 'immutable';

export const initialState = {
  appState: new (Record({
    user: userStateTD,
    selectedCurrency: 'USD',
    resortsList: [],
    dynamicAccommodation: Map()
  }))()
};

export const resortTD = {
  totalRowCount: 1,
  geographyViewModel: [
    {
      id: '653e5264-21e4-5e6a-a05e-f8c337bc6506',
      name: 'Aabenraa',
      code: '653e5264-21e4-5e6a-a05e-f8c337bc6506',
      parent: {
        id: '12c7bb72-da63-5493-a7a8-dcd73292e26c',
        name: 'South Denmark',
        code: '12c7bb72-da63-5493-a7a8-dcd73292e26c',
        parents: [],
        parentIds: ''
      },
      parents: [],
      parentIds: '12c7bb72-da63-5493-a7a8-dcd73292e26c'
    }
  ]
};

export const matchingCriteriaApiTD = [
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
        id: '19cfed27-ac78-5c19-870d-db250c9809a9',
        name: 'Aargau',
        code: '19cfed27-ac78-5c19-870d-db250c9809a9',
        parentId: '135b9a7b-c5bf-5cdb-af4f-36474ef0ff0b',
        node: 'destination',
        parent: {
          id: '135b9a7b-c5bf-5cdb-af4f-36474ef0ff0b',
          name: 'Switzerland',
          code: 'CH',
          node: 'country',
          parent: null
        }
      }
    ]
  },
  {
    key: 'classification',
    values: [
      {
        id: '2a55498f-ac84-407b-af7f-5148d9e05477',
        name: '2',
        parentId: '888BBCAA-8AC7-4EDB-B6A4-A7040CAC00F2_S23_NETHERLANDS',
        parent: {
          id: '888BBCAA-8AC7-4EDB-B6A4-A7040CAC00F2_S23_NETHERLANDS',
          parent: null
        }
      }
    ]
  },
  {
    key: 'accommodationcode',
    values: [
      {
        id: '10641test2',
        name: '10641test2 test210641',
        code: '10641test2',
        parentId: 'a3ed6486-a191-592a-a801-0f8a1554c507',
        node: 'accommodationcode',
        parent: {
          id: 'a3ed6486-a191-592a-a801-0f8a1554c507',
          name: 'Naama Bay',
          code: 'a3ed6486-a191-592a-a801-0f8a1554c507',
          node: 'resort',
          parent: null
        }
      }
    ]
  }
];

export const sourceMarketTD = [
  {
    id: 'TUI_BE',
    name: 'TUI Belgium'
  }
];

export const searchTD = [
  {
    id: 'TEST210641',
    contractName: 'test210641',
    sourceMarketName: 'TUI Belgium',
    countryName: 'Egypt',
    destinationName: "Janub Sina'",
    resortName: 'Naama Bay',
    resortCode: 'a3ed6486-a191-592a-a801-0f8a1554c507',
    seasonName: 'Winter 2223',
    seasonCode: 'W22',
    accommodationName: 'test210641',
    accommodationCode: '10641test2',
    contractStatus: 'Signed',
    currentVersion: 1,
    currentVersionDate: '2022-05-05T15:24:18.647',
    commitmentLevel: 0,
    deviation: {
      values: {
        USD: 0,
        DKK: 0,
        THB: 0,
        SEK: 0,
        NOK: 0,
        MAD: 0,
        GBP: 0,
        AED: 0,
        EUR: 0
      }
    },
    contractStart: '2022-11-01T00:00:00',
    contractEnd: '2023-03-31T00:00:00',
    isAllYear: false,
    warnings: [],
    changes: [],
    hasUnpublishedChanges: true,
    sourceReferenceCode: '10641test2',
    concepts: '',
    classification: '5',
    basicBoardCodes: '',
    ancillaries: [],
    productType: ['FLY_AND_STAY']
  }
];

export const contractStatusTD = [{ id: 'Signed', name: 'Signed', category: 'contractstatus' }];

export const commissionMarkerTD = [
  {
    key: 'commissionmarker',
    values: [
      {
        id: 'commissionmarker_A',
        name: 'A',
        parentId: '53E94526-B736-451E-8D13-CBC60C33D59C_W22-S23_NETHERLANDS',
        parent: {
          id: '53E94526-B736-451E-8D13-CBC60C33D59C_W22-S23_NETHERLANDS',
          parent: null
        }
      }
    ]
  }
];
