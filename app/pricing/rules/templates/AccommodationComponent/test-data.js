export const ruleDefinitionsTD = [
  {
    id: 25,
    name: 'Percentage',
    description: 'Values for adults and children with min/max thresholds',
    validForAssociatedProductType: {},
    type: {
      ruleType: 'accommodation_component',
      displayName: 'Accommodation component'
    },
    matchingCriteriaDefinitions: [
      {
        id: 288,
        title: 'Product Type',
        criteriaKey: 'producttype',
        sortOrder: 0,
        score: 1
      },
      {
        id: 287,
        title: 'Planning period',
        criteriaKey: 'season',
        sortOrder: 1,
        score: 2
      },
      {
        id: 286,
        title: 'Country',
        criteriaKey: 'country',
        sortOrder: 2,
        score: 3
      },
      {
        id: 285,
        title: 'Destination',
        criteriaKey: 'destination',
        sortOrder: 3,
        score: 4
      },
      {
        id: 284,
        title: 'Resort',
        criteriaKey: 'resort',
        sortOrder: 4,
        score: 5
      },
      {
        id: 283,
        title: 'Concept',
        criteriaKey: 'concept',
        sortOrder: 5,
        score: 6
      },
      {
        id: 282,
        title: 'Label',
        criteriaKey: 'label',
        sortOrder: 6,
        score: 7
      },
      {
        id: 291,
        title: 'Accommodation',
        criteriaKey: 'accommodationcode',
        sortOrder: 8,
        score: 9
      },
      {
        id: 280,
        title: 'Room category',
        criteriaKey: 'roomtypecategory',
        sortOrder: 9,
        score: 10
      },
      {
        id: 281,
        title: 'Classification',
        criteriaKey: 'classification',
        sortOrder: 9,
        score: 8
      },
      {
        id: 278,
        title: 'Room code',
        criteriaKey: 'roomcode',
        sortOrder: 10,
        score: 11
      }
    ],
    valueDefinitions: [
      {
        id: 16,
        title: 'Adult',
        ageCategoryType: 'Adult',
        ageCategoryIndex: 0,
        sortOrder: 0,
        valueType: 'Percentage'
      },
      {
        id: 11,
        title: 'Min',
        ageCategoryType: 'Adult',
        ageCategoryIndex: 0,
        sortOrder: 1,
        valueType: 'MinThreshold'
      },
      {
        id: 10,
        title: 'Max',
        ageCategoryType: 'Adult',
        ageCategoryIndex: 0,
        sortOrder: 2,
        valueType: 'MaxThreshold'
      },
      {
        id: 8,
        title: 'Child1',
        ageCategoryType: 'Child',
        ageCategoryIndex: 0,
        sortOrder: 3,
        valueType: 'Percentage'
      },
      {
        id: 2,
        title: 'Min',
        ageCategoryType: 'Child',
        ageCategoryIndex: 0,
        sortOrder: 4,
        valueType: 'MinThreshold'
      },
      {
        id: 26,
        title: 'Max',
        ageCategoryType: 'Child',
        ageCategoryIndex: 0,
        sortOrder: 5,
        valueType: 'MaxThreshold'
      },
      {
        id: 46,
        title: 'Child2',
        ageCategoryType: 'Child',
        ageCategoryIndex: 0,
        sortOrder: 6,
        valueType: 'Percentage'
      },
      {
        id: 39,
        title: 'Min',
        ageCategoryType: 'Child',
        ageCategoryIndex: 0,
        sortOrder: 7,
        valueType: 'MinThreshold'
      },
      {
        id: 38,
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
    id: 26,
    name: 'Absolute',
    description: 'Values for adults and children',
    validForAssociatedProductType: {},
    type: {
      ruleType: 'accommodation_component',
      displayName: 'Accommodation component'
    },
    matchingCriteriaDefinitions: [
      {
        id: 277,
        title: 'Product Type',
        criteriaKey: 'producttype',
        sortOrder: 0,
        score: 1
      },
      {
        id: 276,
        title: 'Planning period',
        criteriaKey: 'season',
        sortOrder: 1,
        score: 2
      },
      {
        id: 275,
        title: 'Country',
        criteriaKey: 'country',
        sortOrder: 2,
        score: 3
      },
      {
        id: 274,
        title: 'Destination',
        criteriaKey: 'destination',
        sortOrder: 3,
        score: 4
      },
      {
        id: 273,
        title: 'Resort',
        criteriaKey: 'resort',
        sortOrder: 4,
        score: 5
      },
      {
        id: 272,
        title: 'Concept',
        criteriaKey: 'concept',
        sortOrder: 5,
        score: 6
      },
      {
        id: 271,
        title: 'Label',
        criteriaKey: 'label',
        sortOrder: 6,
        score: 7
      },
      {
        id: 270,
        title: 'Classification',
        criteriaKey: 'classification',
        sortOrder: 7,
        score: 8
      },
      {
        id: 269,
        title: 'Accommodation',
        criteriaKey: 'accommodationcode',
        sortOrder: 8,
        score: 9
      },
      {
        id: 279,
        title: 'Room category',
        criteriaKey: 'roomtypecategory',
        sortOrder: 9,
        score: 10
      },
      {
        id: 293,
        title: 'Room code',
        criteriaKey: 'roomcode',
        sortOrder: 10,
        score: 11
      }
    ],
    valueDefinitions: [
      {
        id: 45,
        title: 'Adult',
        ageCategoryType: 'Adult',
        ageCategoryIndex: 0,
        sortOrder: 0,
        valueType: 'Absolute'
      },
      {
        id: 57,
        title: 'Child1',
        ageCategoryType: 'Child',
        ageCategoryIndex: 0,
        sortOrder: 1,
        valueType: 'Absolute'
      },
      {
        id: 47,
        title: 'Child2',
        ageCategoryType: 'Child',
        ageCategoryIndex: 0,
        sortOrder: 2,
        valueType: 'Absolute'
      }
    ],
    showCurrency: true
  }
];

export const sourceMarketsTD = {
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

export const matchingCriteriaDefTD = [
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
        id: 'W22',
        name: 'Winter 2223',
        code: 'W22',
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
    key: 'label',
    values: [
      {
        id: 'Label_id',
        parentId: '31376CB0-49BA-4884-AB05-DB7FE783B2',
        parent: {
          id: '31376CB0-49BA-4884-AB05-DB7FE783B2',
          parent: null
        }
      }
    ]
  },
  {
    key: 'accommodationcode',
    values: [
      {
        id: 'A00000TESTLocalFinal',
        name: 'A00000TESTLocalFinal TestLocal Final',
        code: 'A00000TESTLocalFinal',
        parentId: '469a7b76-6d97-5048-9247-478336598453',
        node: 'accommodationcode',
        parent: {
          id: '469a7b76-6d97-5048-9247-478336598453',
          name: 'La Caleta',
          code: '469a7b76-6d97-5048-9247-478336598453',
          node: 'resort',
          parent: null
        }
      }
    ]
  },
  {
    key: 'roomtypecategory',
    values: [
      {
        id: 'X',
        name: 'X',
        parentId: '31376CB0-49BA-4884-AB05-DB7FE783B2_W21',
        parent: {
          id: '31376CB0-49BA-4884-AB05-DB7FE783B2_W21',
          parent: null
        }
      }
    ]
  },
  {
    key: 'classification',
    values: [
      {
        id: '9f83805c-8180-42ce-8d40-7c42ebbede95',
        name: '3',
        parentId: 'DFDCEBA9-D9F0-4765-BA42-DCC578677611_W22_NETHERLANDS',
        parent: {
          id: 'DFDCEBA9-D9F0-4765-BA42-DCC578677611_W22_NETHERLANDS',
          parent: null
        }
      }
    ]
  },
  {
    key: 'roomcode',
    values: [
      {
        id: 'JS-03',
        name: 'JS-03',
        parentId: '31376CB0-49BA-4884-AB05-DB7FE783B2_W21',
        parent: {
          id: '31376CB0-49BA-4884-AB05-DB7FE783B2_W21',
          parent: null
        }
      }
    ]
  }
];

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
