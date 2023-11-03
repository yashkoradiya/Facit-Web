import { userStateTD } from 'appState/appState-testdata';
import { Record, Map, List } from 'immutable';

export const initialState = {
  appState: new (Record({
    user: userStateTD,
    selectedCurrency: 'USD',
    resortsList: [],
    dynamicAccommodation: Map()
  }))()
};

export const sourceMarketsTD = [
  {
    id: 'TUI_NL',
    name: 'TUI Netherlands'
  }
];

export const criteriasTD = [
  {
    criteriaKey: 'season',
    title: 'Planning period',
    values: List([
      Map({
        id: 'W23-S24',
        name: 'Winter 2324-Summer 24',
        code: 'W23-S24'
      })
    ])
  },
  {
    criteriaKey: 'country',
    title: 'Country',
    values: List([
      Map({
        id: '61eb9550-6fe5-5c28-9af8-0cfa4fe702cd',
        name: 'Åland Islands',
        code: 'AX'
      })
    ])
  },
  {
    criteriaKey: 'destination',
    title: 'Destination',
    values: List([
      Map({
        id: '178d55bd-b096-596e-a4d3-bfad3414b79a',
        name: 'Aakar',
        code: '178d55bd-b096-596e-a4d3-bfad3414b79a',
        parentIds: '6603097e-05a6-5b8c-a884-5828641848ea'
      })
    ])
  },
  {
    criteriaKey: 'accommodationcode',
    title: 'accommodationcode',
    values: List([
      Map({
        id: 'A0001759',
        name: 'A0001759 Rixos Premium Dubai',
        code: 'A0001759',
        parentIds: '67986b25-0e6a-5679-94ce-8d35594e9908'
      })
    ])
  },
  {
    criteriaKey: 'classification',
    title: 'Classification',
    values: List([
      Map({
        id: 'aea6cc04-ee94-40b6-a005-0fdc868a9012',
        name: '1',
        parentIds: '0F545732-C448-4C0E-9A11-116F1DA4EA92'
      })
    ])
  },
  {
    criteriaKey: 'concept',
    title: 'Concept',
    values: List([
      Map({
        id: '0effaaa2-7715-433d-8b11-35f211e40584',
        name: 'BestFamily',
        parentIds: '4FC31D36-8FC7-4DA0-91AF-B05CC252160E'
      })
    ])
  },
  {
    criteriaKey: 'label',
    title: 'Label',
    values: List([
      Map({
        id: '9f83805c-8180-42ce-8d40-7c42ebbed123',
        name: 'Family_1',
        parentIds: '11AD0D78-DC10-4FEC-AB51-DA03335F130E'
      })
    ])
  },
  {
    criteriaKey: 'contractlevel',
    title: 'Contract level',
    values: List([
      Map({
        id: 'committed',
        name: 'Committed',
        parentIds: '7B44A786-8D4D-4B43-88EA-A0232336376C_W22-S23_SWITZERLAND'
      })
    ])
  }
];

export const destinationTD = [
  {
    id: '19cfed27-ac78-5c19-870d-db250c9809a9',
    name: 'Aargau',
    code: '19cfed27-ac78-5c19-870d-db250c9809a9',
    parent: {
      id: '135b9a7b-c5bf-5cdb-af4f-36474ef0ff0b',
      name: 'Switzerland',
      code: 'CH',
      parent: null,
      parents: [],
      parentIds: ''
    },
    parents: [],
    parentIds: '135b9a7b-c5bf-5cdb-af4f-36474ef0ff0b'
  }
];

export const accomTD = [
  {
    id: 'A00000TESTLocalFinal',
    name: 'A00000TESTLocalFinal TestLocal Final',
    code: 'A00000TESTLocalFinal',
    parent: {
      id: '469a7b76-6d97-5048-9247-478336598453',
      name: 'La Caleta',
      code: '469a7b76-6d97-5048-9247-478336598453',
      parent: null,
      parents: [],
      parentIds: ''
    },
    parents: [],
    parentIds: '469a7b76-6d97-5048-9247-478336598453'
  }
];

export const countriesTD = [
  {
    id: '61eb9550-6fe5-5c28-9af8-0cfa4fe702cd',
    name: 'Åland Islands',
    code: 'AX',
    parent: null,
    parents: [],
    parentIds: ''
  }
];

export const resortsTD = [
  {
    id: '00ec6005-3015-5a2c-b01b-121d762b92ab',
    name: '100 Mile House',
    code: '00ec6005-3015-5a2c-b01b-121d762b92ab',
    parent: {
      id: '2943caab-e938-5363-9c71-6feb1af42fc9',
      name: 'British Columbia',
      code: '2943caab-e938-5363-9c71-6feb1af42fc9',
      parent: null,
      parents: [],
      parentIds: ''
    },
    parents: [],
    parentIds: '2943caab-e938-5363-9c71-6feb1af42fc9'
  }
];

export const paginatedResortTD = {
  totalRowCount: 1,
  geographyViewModel: [
    {
      id: '02c7eecd-f8fe-5ce1-92bf-6f31cec12482',
      name: 'Adrasan',
      code: '02c7eecd-f8fe-5ce1-92bf-6f31cec12482',
      parent: {
        id: 'c6b99bb4-fb69-5d40-9529-9e455b21ed3d',
        name: 'Antalya',
        code: 'c6b99bb4-fb69-5d40-9529-9e455b21ed3d',
        parents: [],
        parentIds: ''
      },
      parents: [],
      parentIds: 'c6b99bb4-fb69-5d40-9529-9e455b21ed3d'
    }
  ]
};
