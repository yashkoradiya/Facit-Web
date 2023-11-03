import { Record, List, fromJS, Map } from 'immutable';
import * as localStorage from 'core/localStorage';
import settings from '../core/settings/settings';
import { SET_DYNAMIC_ACCOMMODATION, SET_RESORTS_LIST, SET_USER_STATE, UPDATE_RESORTS_LIST } from './appStateConstants';

const initialState = new (Record({
  selectedCurrency: localStorage.getItem('selectedCurrency')
    ? localStorage.getItem('selectedCurrency')
    : settings.AVAILABLE_CURRENCIES[0],
  user: new (Record({ name: '', roles: List(), access: {}, sourcemarkets: '' }))(),
  version: new (Record({
    inventoryVersion: '',
    costVersion: '',
    pricingVersion: '',
    packagingVersion: '',
    number: ''
  }))(),
  resortsList: [],
  /**
   *Enables accommodation filter to be dynamic when contract type is selected.
   */
  dynamicAccommodation: Map({
    /**dynamicAccommodationEnabled is REQUIRED */
    dynamicAccommodationEnabled: false,
    selectedContractTypes: List(),
    dynamicAccomList: []
  })
}))();

const appStateReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CURRENCY_CHANGED':
      state = state.set('selectedCurrency', action.payload.currency);
      return state;
    case SET_USER_STATE:
      state = state.setIn(['user', 'name'], action.payload.name);
      state = state.setIn(['user', 'sourcemarkets'], action.payload.sourcemarkets);
      state = state.setIn(['user', 'roles'], getRolesFromPayload(action.payload.role));
      state = state.setIn(['user', 'access'], mapRolesToAccess(getRolesFromPayload(action.payload.role)));
      return state;
    case SET_RESORTS_LIST:
      state = state.set('resortsList', action.payload.resorts);
      return state;
    case UPDATE_RESORTS_LIST: {
      const listFromRedux = state.get('resortsList');
      const { resorts } = action.payload;
      const updatedList = resorts.filter(item => !listFromRedux.some(innerItem => innerItem.id === item.id));

      state = state.set('resortsList', [...listFromRedux, ...updatedList]);
      return state;
    }
    case SET_DYNAMIC_ACCOMMODATION: {
      const dynamicAccommState = state.get('dynamicAccommodation');

      const { dynamicAccommodationEnabled, selectedContractTypes, dynamicAccomList, resetDynamicAccomList } =
        action.payload;

      let mutatedDynamicAccomList = dynamicAccommState.get('dynamicAccomList') ?? [];

      if (resetDynamicAccomList) {
        mutatedDynamicAccomList = dynamicAccomList;
      } else if (mutatedDynamicAccomList.length && dynamicAccomList?.length) {
        const uniqueItems = dynamicAccomList.filter(
          item => !mutatedDynamicAccomList.some(innerItem => innerItem.id === item.id)
        );

        mutatedDynamicAccomList = mutatedDynamicAccomList.concat(uniqueItems);
      }

      const newState = {
        dynamicAccommodationEnabled: dynamicAccommodationEnabled,
        selectedContractTypes: selectedContractTypes
          ? selectedContractTypes
          : dynamicAccommState.get('selectedContractTypes'),
        dynamicAccomList: mutatedDynamicAccomList
      };

      state = state.set('dynamicAccommodation', Map(newState));
      return state;
    }
    default:
      return state;
  }
};

export default appStateReducer;

const getRolesFromPayload = roles => {
  let _roles = roles;
  if (!roles) {
    _roles = [];
  }
  if (typeof roles === 'string') {
    _roles = [roles];
  }
  return fromJS(_roles);
};

const mapRolesToAccess = roles => {
  const securityAreas = {
    settings: ['userroles', 'exchangerates', 'discounts', 'templatesettings'],
    componenttemplates: [
      'accommodationcomponents',
      'underoccupancy',
      'overoccupancy',
      'boardupgrade',
      'mandatorysupplement',
      'ancillary',
      'roomupgrade',
      'flightsupplements',
      'dynamiccruise',
      'distributioncost',
      'flightdistributioncost',
      'transferdistributioncost',
      'transfervat',
      'transfermargincomponent',
      'vat',
      'misccost',
      'flightvat',
      'guaranteefundaccom',
      'guaranteefundflight',
      'reversecharge'
    ],
    packagetemplates: ['accommodationonly', 'charterpackage', 'bulkadjustment', 'minmax'],
    publishcomponents: ['flightsupplements'],
    publishpackages: ['accommodationonly', 'charterpackage', 'dynamiccruise', 'transfer'],
    contracts: ['accommodations'],
    phasing: ['templates'],
    referenceflights: ['referenceflights']
  };
  return Object.keys(securityAreas).reduce((access, securityArea) => {
    const securityAreaRoles = securityAreas[securityArea].reduce((granularAccess, subcategory) => {
      const subcategoryRoles = roles?.filter(r => r.startsWith(`${securityArea}.${subcategory}`)) ?? [];
      granularAccess[subcategory] = {
        read: subcategoryRoles.some(r => r.endsWith('read') || r.endsWith('write')),
        write: subcategoryRoles.some(r => r.endsWith('write'))
        // read: true, //this is used for testing only
        // write: true
      };

      return granularAccess;
    }, {});

    access[securityArea] = {
      ...securityAreaRoles
    };

    return access;
  }, {});
};
