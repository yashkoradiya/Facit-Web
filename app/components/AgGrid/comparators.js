import { isNullOrUndefined } from '../../helpers/objectHelper';
import { isString } from '../../helpers/stringHelper';

export const MoneyComparator = (columnName, currency) => (dataA, dataB, sortModel) => {
  const valueA = dataA[columnName] ? dataA[columnName].values[currency] : null;
  const valueB = dataB[columnName] ? dataB[columnName].values[currency] : null;
  return sort(valueA, valueB, sortModel.sort);
};

export const ApplicabilityComparator = (dataA, dataB, sortModel) => {
  const valueA = dataA.criterias[0].score;
  const valueB = dataB.criterias[0].score;
  return sort(valueA, valueB, sortModel.sort);
};

export const PropertiesComparator = propertyName => (dataA, dataB, sortModel) => {
  const valueA = dataA.properties.find(x => x.key === propertyName);
  const valueB = dataB.properties.find(x => x.key === propertyName);
  return sort(valueA, valueB, sortModel.sort);
};

export const SortByOtherFieldComparator = columnName => (dataA, dataB, sortModel) => {
  const valueA = isNullOrUndefined(dataA[columnName]) ? '' : dataA[columnName];
  const valueB = isNullOrUndefined(dataB[columnName]) ? '' : dataB[columnName];

  return sort(valueA, valueB, sortModel.sort);
};

export const SortByMultipleFieldsComparator = (columnName1, columnName2) => (dataA, dataB, sortModel) => {
  const value1A = isNullOrUndefined(dataA[columnName1]) ? '' : dataA[columnName1];
  const value1B = isNullOrUndefined(dataB[columnName1]) ? '' : dataB[columnName1];
  const value2A = isNullOrUndefined(dataA[columnName2]) ? '' : dataA[columnName2];
  const value2B = isNullOrUndefined(dataB[columnName2]) ? '' : dataB[columnName2];

  if (value1A === value1B) return sort(value2A, value2B, sortModel.sort);

  return sort(value1A, value1B, sortModel.sort);
};

export const CriteriaKeyComparator = (...keys) => (dataA, dataB, sortModel) => {
  const valueA = keys.map(key => getCriteriaValue(dataA, key)).join(',');
  const valueB = keys.map(key => getCriteriaValue(dataB, key)).join(',');

  return sort(valueA, valueB, sortModel.sort);
};

export const ListLengthComparator = property => (dataA, dataB, sortModel) => {
  return sort(dataA[property].length, dataB[property].length, sortModel.sort);
};

export const BaseRoomComparator = (valueA, valueB, nodeA, nodeB, inverted) => {
  const value1A = getBaseRoom(nodeA.data);
  const value1B = getBaseRoom(nodeB.data);
  const value2A = isBaseRoom(nodeA.data);
  const value2B = isBaseRoom(nodeB.data);
  const value3A = getRoomCode(nodeA.data);
  const value3B = getRoomCode(nodeB.data);
  const sortDirection = 'desc'; //use descending, since values are already inverted in params

  if (value1A === value1B) {
    if (value2A === value2B) {
      return sort(value3A, value3B, inverted ? 'desc' : 'asc');
    }
    return sort(value2A, value2B, inverted ? 'asc' : 'desc');
  }
  return sort(value1A, value1B, sortDirection);
};

const getBaseRoom = data => (isNullOrUndefined(data.baseRoomTypeId) ? '' : data.baseRoomTypeId);

const getRoomCode = data => (isNullOrUndefined(data.roomCode) ? '' : data.roomCode);

const isBaseRoom = data => (isNullOrUndefined(data.isBaseRoom) ? false : data.isBaseRoom);

const getCriteriaValue = (data, key) => {
  const criteria = data && data.criterias ? data.criterias.find(criteria => criteria.criteriaKey === key) : null;
  return isNullOrUndefined(criteria) ? '' : isNullOrUndefined(criteria.valueTitle) ? '' : criteria.valueTitle;
};

const sort = (valueA, valueB, direction) => {
  valueA = isString(valueA) ? valueA.toLowerCase() : valueA;
  valueB = isString(valueB) ? valueB.toLowerCase() : valueB;

  if (valueA === valueB) return 0;

  const sortDirection = direction === 'asc' ? 1 : -1;
  if (valueA === '') return sortDirection;
  if (valueB === '') return sortDirection * -1;
  return valueA > valueB ? sortDirection : sortDirection * -1;
};
