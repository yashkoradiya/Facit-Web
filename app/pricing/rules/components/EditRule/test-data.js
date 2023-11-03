import { Record, List, Map } from 'immutable';
import { userStateTD } from 'appState/appState-testdata';

export const filteredItemIds = List();

export const userState = {
  appState: new (Record({ user: userStateTD, resortsList: [], dynamicAccommodation: Map({}) }))()
};

export const testData = {
  ruleDefinitionId: 75,
  rule: {
    currency: 'EUR',
    properties: [
      {
        key: 'transfer_direction',
        value: 'both',
        displayName: 'Both'
      },
      {
        key: 'transfer_type',
        value: 'All',
        displayName: 'All'
      }
    ],
    configurations: [
      {
        sourceMarkets: [],
        durationGroups: [],
        dateBands: []
      }
    ],
    valueDefinitions: List([
      {
        id: 168,
        title: 'Adult',
        ageCategoryType: 'Adult',
        ageCategoryIndex: 0,
        sortOrder: 0,
        valueType: 'Percentage'
      },
      {
        id: 169,
        title: 'Min',
        ageCategoryType: 'Adult',
        ageCategoryIndex: 0,
        sortOrder: 1,
        valueType: 'MinThreshold'
      },
      {
        id: 179,
        title: 'Max',
        ageCategoryType: 'Adult',
        ageCategoryIndex: 0,
        sortOrder: 2,
        valueType: 'MaxThreshold'
      },
      {
        id: 170,
        title: 'Child1',
        ageCategoryType: 'Child',
        ageCategoryIndex: 0,
        sortOrder: 3,
        valueType: 'Percentage'
      },
      {
        id: 171,
        title: 'Min',
        ageCategoryType: 'Child',
        ageCategoryIndex: 0,
        sortOrder: 4,
        valueType: 'MinThreshold'
      },
      {
        id: 172,
        title: 'Max',
        ageCategoryType: 'Child',
        ageCategoryIndex: 0,
        sortOrder: 5,
        valueType: 'MaxThreshold'
      },
      {
        id: 176,
        title: 'Child2',
        ageCategoryType: 'Child',
        ageCategoryIndex: 0,
        sortOrder: 6,
        valueType: 'Percentage'
      },
      {
        id: 177,
        title: 'Min',
        ageCategoryType: 'Child',
        ageCategoryIndex: 0,
        sortOrder: 7,
        valueType: 'MinThreshold'
      },
      {
        id: 178,
        title: 'Max',
        ageCategoryType: 'Child',
        ageCategoryIndex: 0,
        sortOrder: 8,
        valueType: 'MaxThreshold'
      }
    ]),
    selectedMargin: List(),
    selectedDefinition: {
      id: 75,
      name: 'Percentage',
      description: 'Per Person-Percentage',
      validForAssociatedProductType: {},
      type: {
        ruleType: 'transfer_distribution_cost',
        displayName: 'transfer_distribution_cost'
      },
      matchingCriteriaDefinitions: [
        {
          id: 478,
          title: 'Product Type',
          criteriaKey: 'producttype',
          sortOrder: 0,
          score: 1
        },
        {
          id: 496,
          title: 'Planning period',
          criteriaKey: 'season',
          sortOrder: 1,
          score: 2
        },
        {
          id: 497,
          title: 'Airport',
          criteriaKey: 'airport',
          sortOrder: 2,
          score: 3
        },
        {
          id: 498,
          title: 'Area',
          criteriaKey: 'area',
          sortOrder: 3,
          score: 4
        },
        {
          id: 499,
          title: 'Time From',
          criteriaKey: 'departuretime',
          sortOrder: 4,
          score: 5
        },
        {
          id: 500,
          title: 'Time To',
          criteriaKey: 'departuretime',
          sortOrder: 5,
          score: 6
        }
      ],
      valueDefinitions: [
        {
          id: 168,
          title: 'Adult',
          ageCategoryType: 'Adult',
          ageCategoryIndex: 0,
          sortOrder: 0,
          valueType: 'Percentage'
        },
        {
          id: 169,
          title: 'Min',
          ageCategoryType: 'Adult',
          ageCategoryIndex: 0,
          sortOrder: 1,
          valueType: 'MinThreshold'
        },
        {
          id: 179,
          title: 'Max',
          ageCategoryType: 'Adult',
          ageCategoryIndex: 0,
          sortOrder: 2,
          valueType: 'MaxThreshold'
        },
        {
          id: 170,
          title: 'Child1',
          ageCategoryType: 'Child',
          ageCategoryIndex: 0,
          sortOrder: 3,
          valueType: 'Percentage'
        },
        {
          id: 171,
          title: 'Min',
          ageCategoryType: 'Child',
          ageCategoryIndex: 0,
          sortOrder: 4,
          valueType: 'MinThreshold'
        },
        {
          id: 172,
          title: 'Max',
          ageCategoryType: 'Child',
          ageCategoryIndex: 0,
          sortOrder: 5,
          valueType: 'MaxThreshold'
        },
        {
          id: 176,
          title: 'Child2',
          ageCategoryType: 'Child',
          ageCategoryIndex: 0,
          sortOrder: 6,
          valueType: 'Percentage'
        },
        {
          id: 177,
          title: 'Min',
          ageCategoryType: 'Child',
          ageCategoryIndex: 0,
          sortOrder: 7,
          valueType: 'MinThreshold'
        },
        {
          id: 178,
          title: 'Max',
          ageCategoryType: 'Child',
          ageCategoryIndex: 0,
          sortOrder: 8,
          valueType: 'MaxThreshold'
        }
      ],
      showCurrency: true
    },
    selectedTemplate: List(),
    flightTemplateType: '',
    distSelected: true,
    vatSelected: false,
    marginSelected: false,
    guaranteedSelected: false
  },
  selectableSourceMarkets: [
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
  selectableProperties: [
    {
      key: 'transfer_direction',
      label: 'Direction',
      values: [
        {
          label: 'Both',
          value: 'bothtransfer',
          code: 'bothtransfer'
        },
        {
          label: 'Airport-Area',
          value: 'Airport-Area',
          code: 'Airport-Area'
        },
        {
          label: 'Area-Airport',
          value: 'Area-Airport',
          code: 'Area-Airport'
        }
      ]
    },
    {
      key: 'transfer_type',
      label: 'Transfer Type',
      values: [
        {
          label: 'ALL',
          value: 'ALL',
          code: 'ALL'
        },
        {
          label: 'Coach',
          value: 'Coach',
          code: 'Coach'
        },
        {
          label: 'Taxi',
          value: 'Taxi',
          code: 'Taxi'
        }
      ]
    }
  ],
  selectableAssociatedProducts: {},
  applicability: List([
    Map({
      id: 478,
      title: 'Product Type',
      criteriaKey: 'producttype',
      sortOrder: 0,
      score: 1,
      values: [
        {
          id: '1',
          name: 'ACCOMMODATION_ONLY',
          code: 'AO'
        },
        {
          id: '0',
          name: 'FLY_AND_STAY',
          code: 'FS'
        }
      ]
    }),
    Map({
      id: 496,
      title: 'Planning period',
      criteriaKey: 'season',
      sortOrder: 1,
      score: 2,
      values: [
        {
          id: 'W22',
          name: 'Winter 2223',
          code: 'W22'
        },
        {
          id: 'S22',
          name: 'Summer 22',
          code: 'S22'
        },
        {
          id: 'PERIOD-000000021',
          name: 'Winter 2122',
          code: 'W21'
        }
      ]
    }),
    Map({
      id: 497,
      title: 'Airport',
      criteriaKey: 'airport',
      sortOrder: 2,
      score: 3,
      values: [
        {
          id: '72d93c18-0253-5ff9-9f1d-a67cba8567bd',
          name: 'Aalborg Airport (AAL)',
          code: 'AAL',
          parentIds: 'b35f1dc8-4010-5a0b-abe2-05d07ec26bf5'
        }
      ]
    }),
    Map({
      id: 498,
      title: 'Area',
      criteriaKey: 'area',
      sortOrder: 3,
      score: 4,
      values: [
        {
          id: 'VIJ',
          name: 'Vijaynagar',
          code: 'VIJ'
        }
      ]
    }),
    Map({
      id: 499,
      title: 'Time From',
      criteriaKey: 'departuretime',
      sortOrder: 4,
      score: 5,
      values: [
        {
          id: '00:00',
          name: '00:00'
        },
        {
          id: '01:00',
          name: '01:00'
        }
      ]
    })
  ]),
  showCurrency: true,
  ruleType: 'transfer_distribution_cost',
  ruleDefinitions: [
    {
      id: 75,
      name: 'Percentage',
      description: 'Per Person-Percentage',
      validForAssociatedProductType: {},
      type: {
        ruleType: 'transfer_distribution_cost',
        displayName: 'transfer_distribution_cost'
      },
      matchingCriteriaDefinitions: [
        {
          id: 478,
          title: 'Product Type',
          criteriaKey: 'producttype',
          sortOrder: 0,
          score: 1
        },
        {
          id: 496,
          title: 'Planning period',
          criteriaKey: 'season',
          sortOrder: 1,
          score: 2
        },
        {
          id: 497,
          title: 'Airport',
          criteriaKey: 'airport',
          sortOrder: 2,
          score: 3
        },
        {
          id: 498,
          title: 'Area',
          criteriaKey: 'area',
          sortOrder: 3,
          score: 4
        },
        {
          id: 499,
          title: 'Time From',
          criteriaKey: 'departuretime',
          sortOrder: 4,
          score: 5
        },
        {
          id: 500,
          title: 'Time To',
          criteriaKey: 'departuretime',
          sortOrder: 5,
          score: 6
        }
      ],
      valueDefinitions: [
        {
          id: 168,
          title: 'Adult',
          ageCategoryType: 'Adult',
          ageCategoryIndex: 0,
          sortOrder: 0,
          valueType: 'Percentage'
        },
        {
          id: 169,
          title: 'Min',
          ageCategoryType: 'Adult',
          ageCategoryIndex: 0,
          sortOrder: 1,
          valueType: 'MinThreshold'
        },
        {
          id: 179,
          title: 'Max',
          ageCategoryType: 'Adult',
          ageCategoryIndex: 0,
          sortOrder: 2,
          valueType: 'MaxThreshold'
        },
        {
          id: 170,
          title: 'Child1',
          ageCategoryType: 'Child',
          ageCategoryIndex: 0,
          sortOrder: 3,
          valueType: 'Percentage'
        },
        {
          id: 171,
          title: 'Min',
          ageCategoryType: 'Child',
          ageCategoryIndex: 0,
          sortOrder: 4,
          valueType: 'MinThreshold'
        },
        {
          id: 172,
          title: 'Max',
          ageCategoryType: 'Child',
          ageCategoryIndex: 0,
          sortOrder: 5,
          valueType: 'MaxThreshold'
        },
        {
          id: 176,
          title: 'Child2',
          ageCategoryType: 'Child',
          ageCategoryIndex: 0,
          sortOrder: 6,
          valueType: 'Percentage'
        },
        {
          id: 177,
          title: 'Min',
          ageCategoryType: 'Child',
          ageCategoryIndex: 0,
          sortOrder: 7,
          valueType: 'MinThreshold'
        },
        {
          id: 178,
          title: 'Max',
          ageCategoryType: 'Child',
          ageCategoryIndex: 0,
          sortOrder: 8,
          valueType: 'MaxThreshold'
        }
      ],
      showCurrency: true
    },
    {
      id: 76,
      name: 'Absolute',
      description: 'Per Person-Absolute',
      validForAssociatedProductType: {},
      type: {
        ruleType: 'transfer_distribution_cost',
        displayName: 'transfer_distribution_cost'
      },
      matchingCriteriaDefinitions: [
        {
          id: 495,
          title: 'Product Type',
          criteriaKey: 'producttype',
          sortOrder: 0,
          score: 1
        },
        {
          id: 501,
          title: 'Planning period',
          criteriaKey: 'season',
          sortOrder: 1,
          score: 2
        },
        {
          id: 493,
          title: 'Airport',
          criteriaKey: 'airport',
          sortOrder: 2,
          score: 3
        },
        {
          id: 492,
          title: 'Area',
          criteriaKey: 'area',
          sortOrder: 3,
          score: 4
        },
        {
          id: 494,
          title: 'Time From',
          criteriaKey: 'departuretime',
          sortOrder: 4,
          score: 5
        },
        {
          id: 490,
          title: 'Time To',
          criteriaKey: 'departuretime',
          sortOrder: 5,
          score: 6
        }
      ],
      valueDefinitions: [
        {
          id: 175,
          title: 'Adult',
          ageCategoryType: 'Adult',
          ageCategoryIndex: 0,
          sortOrder: 0,
          valueType: 'Absolute'
        },
        {
          id: 174,
          title: 'Child1',
          ageCategoryType: 'Child',
          ageCategoryIndex: 0,
          sortOrder: 1,
          valueType: 'Absolute'
        },
        {
          id: 173,
          title: 'Child2',
          ageCategoryType: 'Child',
          ageCategoryIndex: 0,
          sortOrder: 2,
          valueType: 'Absolute'
        }
      ],
      showCurrency: true
    }
  ],
  templateMargins: [],
  selectedRuleDefinition: {
    id: 75,
    name: 'Percentage',
    description: 'Per Person-Percentage',
    validForAssociatedProductType: {},
    type: {
      ruleType: 'transfer_distribution_cost',
      displayName: 'transfer_distribution_cost'
    },
    matchingCriteriaDefinitions: [
      {
        id: 478,
        title: 'Product Type',
        criteriaKey: 'producttype',
        sortOrder: 0,
        score: 1
      },
      {
        id: 496,
        title: 'Planning period',
        criteriaKey: 'season',
        sortOrder: 1,
        score: 2
      },
      {
        id: 497,
        title: 'Airport',
        criteriaKey: 'airport',
        sortOrder: 2,
        score: 3
      },
      {
        id: 498,
        title: 'Area',
        criteriaKey: 'area',
        sortOrder: 3,
        score: 4
      },
      {
        id: 499,
        title: 'Time From',
        criteriaKey: 'departuretime',
        sortOrder: 4,
        score: 5
      },
      {
        id: 500,
        title: 'Time To',
        criteriaKey: 'departuretime',
        sortOrder: 5,
        score: 6
      }
    ],
    valueDefinitions: [
      {
        id: 168,
        title: 'Adult',
        ageCategoryType: 'Adult',
        ageCategoryIndex: 0,
        sortOrder: 0,
        valueType: 'Percentage'
      },
      {
        id: 169,
        title: 'Min',
        ageCategoryType: 'Adult',
        ageCategoryIndex: 0,
        sortOrder: 1,
        valueType: 'MinThreshold'
      },
      {
        id: 179,
        title: 'Max',
        ageCategoryType: 'Adult',
        ageCategoryIndex: 0,
        sortOrder: 2,
        valueType: 'MaxThreshold'
      },
      {
        id: 170,
        title: 'Child1',
        ageCategoryType: 'Child',
        ageCategoryIndex: 0,
        sortOrder: 3,
        valueType: 'Percentage'
      },
      {
        id: 171,
        title: 'Min',
        ageCategoryType: 'Child',
        ageCategoryIndex: 0,
        sortOrder: 4,
        valueType: 'MinThreshold'
      },
      {
        id: 172,
        title: 'Max',
        ageCategoryType: 'Child',
        ageCategoryIndex: 0,
        sortOrder: 5,
        valueType: 'MaxThreshold'
      },
      {
        id: 176,
        title: 'Child2',
        ageCategoryType: 'Child',
        ageCategoryIndex: 0,
        sortOrder: 6,
        valueType: 'Percentage'
      },
      {
        id: 177,
        title: 'Min',
        ageCategoryType: 'Child',
        ageCategoryIndex: 0,
        sortOrder: 7,
        valueType: 'MinThreshold'
      },
      {
        id: 178,
        title: 'Max',
        ageCategoryType: 'Child',
        ageCategoryIndex: 0,
        sortOrder: 8,
        valueType: 'MaxThreshold'
      }
    ],
    showCurrency: true
  },
  filteredDefinitions: null,
  deleteButton: null,
  filteredDefinition: [],
  distributionChecked: true,
  marginChecked: false,
  vatChecked: false
};
