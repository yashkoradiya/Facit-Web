import React, { useEffect, useState } from 'react';
import { Flexbox } from 'components/styled/Layout';
import FilteredSearchBoxes, {
  createCriteriaItem,
  createValueItem
} from 'components/FormFields/FilteredSearchBoxes/FilteredSearchBoxes';
import * as matchingCriteriasApi from 'apis/matchingCriteriasApi';
import * as sourceMarketsApi from 'apis/sourceMarketsApi';
import { List, fromJS } from 'immutable';
import useLocalStorage from 'core/localStorage/useLocalStorage';

export default function PublishStatusModalFilters({ onChange }) {
  const [filters, setFilters] = useState([]);
  const [selectedFilters, setSelectedFilters] = useLocalStorage('publish_status_modal_filters', List(), state =>
    fromJS(state)
  );

  useEffect(() => {
    (async () => {
      const promises = [
        matchingCriteriasApi.get(['season', 'destination', 'accommodationcode']),
        sourceMarketsApi.getSourceMarkets()
      ];
      const responses = await Promise.all(promises);
      const criterias = responses[0].data.map(mc => {
        const key = mc.key;
        const values = mc.values.map(val => createValueItem(val.id, val.name, val.code, val.parentId));

        return createCriteriaItem(key, values);
      });

      const sourceMarketCriteria = createSourceMarketCriteria(responses[1].data);
      criterias.push(sourceMarketCriteria);

      /**
       * Package type values have been refactored to Product type values.
       */
      const productTypeValues = [
        createValueItem('accommodation_only', 'ACCOMMODATION_ONLY'),
        createValueItem('charter_package', 'FLY_AND_STAY')
      ];
      const productTypeCriteria = createCriteriaItem('package_type', productTypeValues);
      criterias.push(productTypeCriteria);

      setFilters(criterias);
    })();
  }, []);

  const createSourceMarketCriteria = sourceMarkets => {
    const sourceMarketKey = 'sourcemarket';
    const sourceMarketValues = sourceMarkets.map(sm => createValueItem(sm.id, sm.name, null, null));
    return createCriteriaItem(sourceMarketKey, sourceMarketValues);
  };

  const handleFilterChange = selectedItemIds => {
    setSelectedFilters(selectedItemIds);
    onChange(getFiltersObject(selectedItemIds.toJS()));
  };

  const getFiltersObject = selectedItemIds => {
    return selectedItemIds.reduce((acc, curr) => {
      acc[curr.criteriaKey] = curr.values;
      return acc;
    }, {});
  };

  return (
    <Flexbox data-testid="status-modal-filters" wrap={'wrap'} marginRight={'15px'} childrenMarginRight={'10px'}>
      <FilteredSearchBoxes
        items={filters}
        filteredItems={filters}
        selectedItemIds={selectedFilters}
        onChange={handleFilterChange}
      />
    </Flexbox>
  );
}
