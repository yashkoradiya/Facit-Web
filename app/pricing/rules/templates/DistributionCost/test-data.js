import { userStateTD } from 'appState/appState-testdata';

export const initialState = {
  appState: {
    selectedCurrency: 'AED',
    user: userStateTD
  }
};

export const ruleDefinitionsTD = [
  {
    id: 30,
    name: 'Distribution Cost',
    description: 'Percentage',
    validForAssociatedProductType: {},
    type: {
      ruleType: 'distribution_cost',
      displayName: 'Distribution cost'
    },
    matchingCriteriaDefinitions: [
      {
        id: 236,
        title: 'Product Type',
        criteriaKey: 'producttype',
        sortOrder: 0,
        score: 1
      },
      {
        id: 235,
        title: 'Planning period',
        criteriaKey: 'season',
        sortOrder: 1,
        score: 2
      },
      {
        id: 234,
        title: 'Country',
        criteriaKey: 'country',
        sortOrder: 2,
        score: 3
      },
      {
        id: 233,
        title: 'Destination',
        criteriaKey: 'destination',
        sortOrder: 3,
        score: 4
      },
      {
        id: 232,
        title: 'Resort',
        criteriaKey: 'resort',
        sortOrder: 4,
        score: 5
      },
      {
        id: 231,
        title: 'Classification',
        criteriaKey: 'classification',
        sortOrder: 5,
        score: 6
      },
      {
        id: 230,
        title: 'Concept',
        criteriaKey: 'concept',
        sortOrder: 6,
        score: 7
      },
      {
        id: 399,
        title: 'Accommodation',
        criteriaKey: 'accommodationcode',
        sortOrder: 8,
        score: 9
      },
      {
        id: 229,
        title: 'Label',
        criteriaKey: 'label',
        sortOrder: 9,
        score: 8
      },
      {
        id: 239,
        title: 'Accommodation',
        criteriaKey: 'accommodationcode',
        sortOrder: 10,
        score: 9
      }
    ],
    valueDefinitions: [
      {
        id: 123,
        title: 'Value',
        ageCategoryType: 'All',
        ageCategoryIndex: 0,
        sortOrder: 0,
        valueType: 'Percentage'
      },
      {
        id: 119,
        title: 'Min',
        ageCategoryType: 'All',
        ageCategoryIndex: 0,
        sortOrder: 1,
        valueType: 'MinThreshold'
      },
      {
        id: 118,
        title: 'Max',
        ageCategoryType: 'All',
        ageCategoryIndex: 0,
        sortOrder: 2,
        valueType: 'MaxThreshold'
      }
    ],
    showCurrency: true
  }
];

export const selectableItemsTD = {
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
      id: 'VIP',
      name: 'VIP'
    },
    {
      id: 'VIP_BE',
      name: 'VIP Selection'
    },
    {
      id: 'TU_BE',
      name: 'TU_BE'
    }
  ],
  durationGroups: [],
  properties: [],
  templateType: []
};

export const dynamicResortTD = { totalRowCount: 0, geographyViewModel: [] };

export const dynamicAccomTD = {
  totalRowCount: 43,
  geographyAccommodationViewModel: []
};
