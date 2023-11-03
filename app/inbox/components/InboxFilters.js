import React, { useEffect, useState, useCallback } from 'react';
import * as matchingCriteriasApi from 'apis/matchingCriteriasApi';
import * as sourceMarketApi from 'apis/sourceMarketsApi';
import * as localStorage from 'core/localStorage';
import FilteredSearchBoxes, {
  createCriteriaItem,
  createValueItem
} from 'components/FormFields/FilteredSearchBoxes/FilteredSearchBoxes';
import { Flexbox } from 'components/styled/Layout';
import { List, fromJS } from 'immutable';
import { parsePaginatedResortCriteria, reorderCriteriaItems } from 'components/FormFields/form-fields-utils';
import { useSelector } from 'react-redux';

const localStorageKey = 'inbox_filters';

export default function InboxFilters({ onChange }) {
  const [allItems, setAllItems] = useState([]);
  const [filters, setFilters] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState(List());
  const resortsList = useSelector(state => state.appState.resortsList);

  useEffect(() => {
    const promises = [
      matchingCriteriasApi.get(['season', 'country', 'destination', 'airport']),
      sourceMarketApi.getSourceMarkets()
    ];

    Promise.all(promises)
      .then(responses => {
        const criterias = responses[0].data.map(mc => {
          const key = mc.key;
          const values = mc.values.map(val => createValueItem(val.id, val.name, val.code, val.parentId));

          return createCriteriaItem(key, values);
        });

        // Check if Destination exists in criteria, if exists, then get the criteria index
        const destIdx = criterias.findIndex(criteria => criteria.criteriaKey === 'destination');
        if (destIdx > -1) {
          // Add placeholder value for the Resort, since it's a paginated filter.
          criterias.push(createCriteriaItem('resort', []));
        }

        if (responses[1].data.length) {
          const sourceMarketCriteria = createSourceMarketCriteria(responses[1].data);
          criterias.push(sourceMarketCriteria);
        }

        /**
         * Package type values have been refactored to Product type values.
         */
        const productTypeValues = [
          createValueItem('accommodation_only', 'ACCOMMODATION_ONLY'),
          createValueItem('charter_package', 'FLY_AND_STAY')
        ];
        const productTypeCriteria = createCriteriaItem('package_type', productTypeValues);
        criterias.push(productTypeCriteria);

        const reorderedCriterias = reorderCriteriaItems(criterias, [
          'season',
          'sourcemarket',
          'country',
          'destination',
          'resort',
          'airport',
          'package_type'
        ]);

        setAllItems(reorderedCriterias);
        setFilters(reorderedCriterias);
        updateFiltersFromLocalStorage();
      })
      .catch(err => console.log('Unable to load filters, Error: ', err));
  }, [updateFiltersFromLocalStorage]);

  useEffect(() => {
    const newAllItems = parsePaginatedResortCriteria(resortsList, allItems);
    if (newAllItems) {
      setAllItems(newAllItems);
    }
  }, [allItems, resortsList]);

  const handleFilterChange = (selectedItemIds, filteredItems) => {
    setFilters(filteredItems);
    setSelectedFilters(selectedItemIds);
    onChange(getFiltersObject(selectedItemIds.toJS()));
    saveFiltersToLocalStorage(selectedItemIds);
  };

  const updateFiltersFromLocalStorage = useCallback(() => {
    const savedFilters = localStorage.getItem(localStorageKey) || [];

    setSelectedFilters(fromJS(savedFilters));
    onChange(getFiltersObject(savedFilters));
  }, [onChange]);

  const saveFiltersToLocalStorage = filters => {
    localStorage.setItem(localStorageKey, filters);
  };

  return (
    <Flexbox data-testid="filter-criteria" wrap={'wrap'} marginRight={'15px'} childrenMarginRight={'10px'}>
      <FilteredSearchBoxes
        items={allItems}
        filteredItems={filters}
        selectedItemIds={selectedFilters}
        onChange={handleFilterChange}
      />
    </Flexbox>
  );
}

const createSourceMarketCriteria = sourceMarkets => {
  const sourceMarketKey = 'sourcemarket';
  const sourceMarketValues = sourceMarkets.map(sm => createValueItem(sm.id, sm.name, null, null));
  return createCriteriaItem(sourceMarketKey, sourceMarketValues);
};

const getFiltersObject = filters => {
  return filters.reduce((acc, curr) => {
    acc[curr.criteriaKey] = curr.values;
    return acc;
  }, {});
};
