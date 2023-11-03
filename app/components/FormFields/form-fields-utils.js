import { List, Map } from 'immutable';
import { getMatchingCriteriaTitle } from 'pricing/rules/ruleConstants';

export const createFilterItem = (item, selectedItemIds) => {
  const parent = item.get('parent');
  const parentId = parent ? parent.get('id') : item.get('parentIds');

  return {
    value: item.get('id'),
    label: item.get('name'),
    code: item.get('code'),
    parentId,
    isSelected: selectedItemIds.find(id => id === item.get('id'))
  };
};

export const createValueItem = (id, name, code, parentIds, sourceMarketIds, parentCountryIds, parentDestinationIds) => {
  return Map({
    id,
    name,
    code,
    parentIds,
    sourceMarketIds,
    parentCountryIds,
    parentDestinationIds
  });
};

export const createCriteriaItem = (criteriaKey, values) => {
  return {
    criteriaKey,
    title: getMatchingCriteriaTitle(criteriaKey),
    values: List(values)
  };
};

/**
 * Compares two primitive arrays and returns boolean
 */
export function areArraysEqual(arr = [], arr2 = []) {
  if (arr.length === arr2.length) {
    return arr.every(outerItem => arr2.some(innerItem => outerItem === innerItem));
  }
  return false;
}

/**
 * A helper function for determining changes to Paginated Resorts list and returning the updated criteria items
 * @param {Array} resortsList
 * @param {Array} criteriaItems
 * @returns Array
 */
export const parsePaginatedResortCriteria = (resortsList, criteriaItems) => {
  if (!criteriaItems || !resortsList) return;

  const resortOptionsIdx = criteriaItems.findIndex(item => item.criteriaKey === 'resort');

  if (resortsList.length && criteriaItems[resortOptionsIdx]?.values.size !== resortsList.length) {
    const valueItems = resortsList.map(item =>
      createValueItem(
        item.id,
        item.name,
        item.code,
        item.parentIds,
        item.sourceMarketIds,
        item.parentCountryIds,
        item.parentDestinationIds
      )
    );

    criteriaItems.splice(resortOptionsIdx, 1, createCriteriaItem('resort', valueItems));
    return criteriaItems;
  }
};

/**
 * A helper function to reorder criteria items based on the criteriakey reference array.
 * @param {Array} criterias
 * @param {Array} orderRef
 * @returns
 */
export function reorderCriteriaItems(criterias = [], criteriaKeyRefs = []) {
  return criterias.map((item, idx, arr) => {
    if (item.criteriaKey === criteriaKeyRefs[idx]) {
      return item;
    } else {
      // Find the intended item to be in the order
      const correctItemIdx = arr.findIndex(i => i.criteriaKey === criteriaKeyRefs[idx]);

      // If the item exists, then return it.
      if (correctItemIdx > -1) {
        return arr[correctItemIdx];
      } else {
        // Else return the default item in the criteria
        return item;
      }
    }
  });
}

/**
 * Convert criteria key to payload key.
 * @param {String} key
 * @returns
 */
export const getKeyForProperties = key => {
  switch (key) {
    case 'season':
      return 'selectedSeasonIds';
    case 'country':
      return 'selectedCountryIds';
    case 'destination':
      return 'selectedDestinationIds';
    case 'resort':
      return 'selectedResortIds';
    case 'accommodationcode':
      return 'selectedAccommodationIds';
    case 'classification':
      return 'selectedClassificationIds';
    case 'concept':
      return 'selectedConceptIds';
    case 'label':
      return 'selectedLabelIds';
    case 'contractlevel':
      return 'selectedContractLevelIds';
  }
};

/**
 * Convert property key to criteria key.
 * @param {String} key
 * @returns
 */
export const getKeyForFilters = key => {
  switch (key) {
    case 'selectedSeasonIds':
      return 'season';
    case 'selectedCountryIds':
      return 'country';
    case 'selectedDestinationIds':
      return 'destination';
    case 'selectedResortIds':
      return 'resort';
    case 'selectedAccommodationIds':
      return 'accommodationcode';
    case 'selectedClassificationIds':
      return 'classification';
    case 'selectedConceptIds':
      return 'concept';
    case 'selectedLabelIds':
      return 'label';
    case 'selectedContractLevelIds':
      return 'contractlevel';
  }
};

/**
 * This method verifies the immutable property equality of the values of accommodationCode criteria key and returns the boolean
 * @param {Array} prevFilteredItems
 * @param {Array} currentFilteredItems
 * @returns Boolean
 */
export const accommodationDiffCheck = (prevFilteredItems, currentFilteredItems) => {
  const predicate = i => i.criteriaKey === 'accommodationcode';
  const prevAccom = prevFilteredItems.find(predicate);
  const currAccom = currentFilteredItems.find(predicate);

  return prevAccom?.values === currAccom?.values;
};

/**
 * This method mutates the original criterias list values based on specific conditions related to accommodation codes.
 *
 * This function performs the following steps:
 * 1. Extracts the keys from the provided criteria objects.
 * 2. Checks if the 'accommodationcode' key is present in the criteria keys.
 * 3. If 'accommodationcode' is present:
 *    - a. Retrieves the IDs of available accommodation codes.
 *    - b. Filters out criteria cases with keys 'classification' or 'roomcode'.
 *    - c. For each of these specific criteria cases:
 *       - i. Finds the index of the criteria object.
 *       - ii. Filters the values based on available accommodation code IDs.
 *
 * @param {Array} criterias - An array of criteria objects.
 * @returns {Array}
 */
export const filterCriteriasBasedOnAccommodations = criterias => {
  const criteriaKeys = criterias.map(criteria => criteria.key);

  if (criteriaKeys.includes('accommodationcode')) {
    const availableAccommCodes = criterias
      .find(criteria => criteria.key === 'accommodationcode')
      .values.map(accomm => accomm.id);

    const specificCriteriaCases = criterias.filter(criteria => ['classification', 'roomcode'].includes(criteria.key));

    specificCriteriaCases.forEach(specificCriteria => {
      const criteriaIdx = criterias.findIndex(criteria => criteria.key === specificCriteria.key);

      const filteredValues = criterias[criteriaIdx].values.filter(item => availableAccommCodes.includes(item.parentId));
      criterias[criteriaIdx].values = filteredValues;
    });
  }
};
