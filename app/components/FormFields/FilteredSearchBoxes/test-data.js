import { fromJS, Record,Map } from 'immutable';

/**
 * Initial state for redux
 */
export const initialState = {
  appState: new (Record({
    resortsList: [],
    dynamicAccommodation: Map()
  }))()
};

export const productTypeFilters = [
  {
    criteriaKey: 'package_type',
    title: 'Product type',
    values: fromJS([
      {
        id: 'accommodation_only',
        name: 'ACCOMMODATION_ONLY'
      },
      {
        id: 'charter_package',
        name: 'FLY_AND_STAY'
      }
    ])
  }
];

export const countryFilterItems = [
  {
    id: 327,
    criteriaKey: 'country',
    title: 'Country',
    values: fromJS([
      {
        id: '214c7361-352e-5111-931d-e5285c78a2c7',
        name: 'Aruba (AW)',
        code: 'AW'
      }
    ])
  },
  {
    id: 281,
    criteriaKey: 'destination',
    title: 'Destination',
    values: fromJS([
      {
        id: '0107048f-55cf-577a-b416-0a5213358823',
        name: 'Aruba',
        code: '0107048f-55cf-577a-b416-0a5213358823',
        parentIds: '214c7361-352e-5111-931d-e5285c78a2c7'
      }
    ])
  }
];

export const accomTestFilterItems = [
  {
    id: 327,
    criteriaKey: 'country',
    title: 'Country',
    values: fromJS([
      {
        id: '214c7361-352e-5111-931d-e5285c78a2c7',
        name: 'Aruba (AW)',
        code: 'AW'
      }
    ])
  },
  {
    id: 281,
    criteriaKey: 'destination',
    title: 'Destination',
    values: fromJS([
      {
        id: '0107048f-55cf-577a-b416-0a5213358823',
        name: 'Aruba',
        code: '0107048f-55cf-577a-b416-0a5213358823',
        parentIds: '214c7361-352e-5111-931d-e5285c78a2c7'
      }
    ])
  },
  {
    id: 301,
    criteriaKey: 'resort',
    title: 'Resort',
    values: fromJS([
      {
        id: '5a15e2e1-e34b-5977-ae64-2ec6bffdc419',
        name: 'Aachen',
        code: '5a15e2e1-e34b-5977-ae64-2ec6bffdc419',
        parentIds: '2440a828-6c90-5538-9d37-293e56b2e4ec'
      },
      {
        id: '25c1bbc3-6c72-5ff9-bc54-7ca5687a2c5d',
        name: 'Basiruti',
        code: '25c1bbc3-6c72-5ff9-bc54-7ca5687a2c5d',
        parentIds: '0107048f-55cf-577a-b416-0a5213358823'
      }
    ])
  },
  {
    id: 294,
    criteriaKey: 'accommodationcode',
    title: 'Accommodation',
    values: fromJS([
      {
        id: 'A0004403',
        name: 'A0004403 Caribbean Village Agador Hotel',
        code: 'A0004403',
        parentIds: '0107048f-55cf-577a-b416-0a5213358823'
      }
    ])
  }
];

export const accomTestSelectedItemIds = fromJS([
  {
    criteriaKey: 'country',
    values: ['214c7361-352e-5111-931d-e5285c78a2c7']
  }
]);

export const selectedSourceMarkets = [
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
