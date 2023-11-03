import { SET_DYNAMIC_ACCOMMODATION, SET_RESORTS_LIST, SET_USER_STATE, UPDATE_RESORTS_LIST } from './appStateConstants';

export const setUserState = userData => {
  return { type: SET_USER_STATE, payload: userData };
};

export const changeCurrency = currency => {
  return { type: 'CURRENCY_CHANGED', payload: { currency } };
};

export const setResortsList = resorts => {
  return { type: SET_RESORTS_LIST, payload: { resorts } };
};

export const updateResortsList = resorts => {
  return { type: UPDATE_RESORTS_LIST, payload: { resorts } };
};

export const setDynamicAccommodation = status => {
  return { type: SET_DYNAMIC_ACCOMMODATION, payload: status };
};
