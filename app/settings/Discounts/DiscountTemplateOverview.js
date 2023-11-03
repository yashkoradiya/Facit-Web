import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { List, fromJS } from 'immutable';
import useLocalStorage from 'core/localStorage/useLocalStorage';
import AgGridInfinite from 'components/AgGrid/AgGridInfinite';
import { Flexbox } from 'components/styled/Layout';
import { PrimaryButton, Button } from 'components/styled/Button';
import * as rulesApi from 'apis/rulesApi';
import LinkCellRenderer from 'components/AgGrid/renderers/LinkCellRenderer';
import getPropertyValue from 'components/AgGrid/renderers/getPropertyValue';
import FilteredSearchBoxes, {
  createValueItem,
  createCriteriaItem
} from 'components/FormFields/FilteredSearchBoxes/FilteredSearchBoxes';
import * as matchingCriteriasApi from 'apis/matchingCriteriasApi';
import * as sourceMarketsApi from 'apis/sourceMarketsApi';
import DateTimeCellRenderer from 'components/AgGrid/renderers/DateTimeCellRenderer';
import styled from 'styled-components';
import { ruleTypes } from 'pricing/rules/ruleConstants';

export default function DiscountTemplateOverview({ readOnly }) {
  const history = useHistory();
  const [templates, setTemplates] = useState(null);
  const [filters, setFilters] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItemIds, setSelectedItemIds] = useLocalStorage('discount_filters', List(), state => fromJS(state));
  const [totalHits, setTotalHits] = useState(null);

  useEffect(() => {
    initializeFilters().then(initializedFilters => {
      setFilters(initializedFilters);
      setFilteredItems(initializedFilters);
    });
  }, []);

  useEffect(() => {
    const mappedSelectedItemIds = selectedItemIds
      .toJS()
      .filter(s => s.values.length)
      .map(s => ({ key: s.criteriaKey, values: s.values }));

    const criteriaIds = mappedSelectedItemIds.filter(x => x.key !== 'sourcemarket' && x.key !== 'discount_type');
    const sourceMarketIds = mappedSelectedItemIds.find(x => x.key === 'sourcemarket')?.values ?? [];
    const propertyIds = mappedSelectedItemIds.filter(x => x.key === 'discount_type');

    rulesApi.search('', ['discount'], criteriaIds, propertyIds, sourceMarketIds).then(_templates => {
      setTemplates(mapTemplates(_templates.data.results));
      setTotalHits(_templates.data.totalHits);
    });
  }, [selectedItemIds]);

  const handleFilterChange = (itemdIds, selectedFilterItems) => {
    setFilteredItems(selectedFilterItems);
    setSelectedItemIds(itemdIds);
  };

  const handleClearFilters = () => {
    setSelectedItemIds(List());
  };

  const createDiscountTemplate = url => {
    history.push(url);
  };

  return (
    <Flexbox direction="column" width="100%" alignItems="flex-start" marginRight="20px">
      <Flexbox alignItems="flex-start" justifyContent="space-between">
        <Flexbox data-testid="filters-container" marginBottom="20px" marginRight="8px" alignItems="flex-end" wrap="wrap">
          <FilteredSearchBoxes
            key={`FilteredSearchBoxes_${filters.map(x => x.id).join('_')}`}
            items={filters}
            filteredItems={filteredItems}
            selectedItemIds={selectedItemIds}
            onChange={handleFilterChange}
          />
          <Button onClick={handleClearFilters}>Clear filters</Button>
        </Flexbox>
        {!readOnly && (
          <PrimaryButton
            onClick={() => createDiscountTemplate('/settings/discounts/create')}
            style={{ marginTop: '18px' }}
          >
            New discount template
          </PrimaryButton>
        )}
      </Flexbox>

      {totalHits === 0 ? (
        <DiscountWarning>
          <span>No discounts are passed through.</span>
          <span>In order to pass through discounts, please create a discount template.</span>
        </DiscountWarning>
      ) : (
        <AgGridInfinite
          testId={'discount-template-overview'}
          columnDefinitions={getColumnDefinitions()}
          dataSet={{ data: templates, dataSetKey: uuidv4() }}
          agGridKey={'discountTemplateOverview'}
        />
      )}
    </Flexbox>
  );
}

const mapTemplates = templates => {
  const filterCriterias = (criterias, criteriaKey) => {
    if (!criterias) {
      return null;
    }

    const values = criterias.filter(x => x.criteriaKey === criteriaKey).map(x => x.valueTitle);

    return Array.from(new Set(values)).join(', ');
  };

  return templates.map(t => {
    return {
      id: t.id,
      name: t.name,
      sourceMarkets: t.sourceMarkets,
      marginBandStart: t.marginBandStart,
      marginBandEnd: t.marginBandEnd,
      discountType: t.properties
        .filter(x => x.key === 'discount_type')
        .map(x => x.displayName)
        .join(', '),
      country: filterCriterias(t.criterias, 'country'),
      destination: filterCriterias(t.criterias, 'destination'),
      resort: filterCriterias(t.criterias, 'resort'),
      accommodation: filterCriterias(t.criterias, 'accommodationcode'),
      lastModifiedAt: t.lastModifiedAt,
      lastModifiedByUserName: t.lastModifiedByUserName
    };
  });
};

const initializeFilters = () => {
  const promises = [
    matchingCriteriasApi.get(['season', 'country', 'destination', 'resort', 'accommodationcode']),
    sourceMarketsApi.getSourceMarkets(),
    rulesApi.getSelectableItems(ruleTypes.discount)
  ];

  return Promise.all(promises).then(responses => {
    const criterias = responses[0].data;
    const sourceMarkets = responses[1].data;
    const discountTypes = responses[2].data.properties;

    const allItems = [];
    criterias.forEach(mc => {
      const criteriaKey = mc.key;
      const values = mc.values.map(value => {
        return createValueItem(value.id, value.name, value.code, value.parentId);
      });

      const item = createCriteriaItem(criteriaKey, values);
      allItems.push(item);
    });

    discountTypes.forEach(pt => {
      const values = pt.values.map(ptv => {
        return createValueItem(ptv.value, ptv.displayName, null, null);
      });
      const item = createCriteriaItem(pt.key, values);
      allItems.push(item);
    });

    const sourceMarketKey = 'sourcemarket';
    const sourceMarketValues = sourceMarkets.map(sm => {
      return createValueItem(sm.id, sm.name, null, null);
    });
    const sourceMarketItem = createCriteriaItem(sourceMarketKey, sourceMarketValues);

    allItems.push(sourceMarketItem);
    return allItems;
  });
};

const getColumnDefinitions = () => {
  return [
    {
      field: 'name',
      headerName: 'Template name ',
      width: 150,
      cellRenderer: LinkCellRenderer,
      valueGetter: d => {
        if (!d.data) {
          return null;
        }
        return {
          url: `/settings/discounts/edit/${getPropertyValue(d.data, 'id')}`,
          name: getPropertyValue(d.data, 'name'),
          toString: () => {
            return getPropertyValue(d.data, 'name');
          }
        };
      },
      tooltipValueGetter: d => {
        return d.data && d.data.name ? d.data.name : null;
      }
    },
    {
      field: 'sourceMarkets',
      headerName: 'Source Markets',
      width: 150
    },
    {
      field: 'marginBandStart',
      headerName: 'Start date',
      cellRenderer: DateTimeCellRenderer,
      width: 150
    },
    {
      field: 'marginBandEnd',
      headerName: 'End Date',
      cellRenderer: DateTimeCellRenderer,
      width: 150
    },
    {
      field: 'discountType',
      headerName: 'Type of discount',
      width: 150
    },
    {
      field: 'country',
      headerName: 'Country',
      width: 150
    },
    {
      field: 'destination',
      headerName: 'Destination',
      width: 150
    },
    {
      field: 'resort',
      headerName: 'Resort',
      width: 150
    },
    {
      field: 'accommodation',
      headerName: 'Accommodation',
      width: 150
    },
    {
      field: 'lastModifiedAt',
      headerName: 'Last saved',
      cellRenderer: DateTimeCellRenderer,
      width: 150
    },
    {
      field: 'lastModifiedByUserName',
      headerName: 'Last saved by',
      width: 150
    }
  ];
};

const DiscountWarning = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 80px;
  border: 1px solid grey;
`;
