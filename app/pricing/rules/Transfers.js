import React from 'react';
import RuleTab from './RuleTab';
import DateCellRenderer from 'components/AgGrid/renderers/DateCellRenderer';
import LinkCellRenderer from 'components/AgGrid/renderers/LinkCellRenderer';
import getPropertyValue from 'components/AgGrid/renderers/getPropertyValue';
import {  List, Map } from 'immutable';

export default function Transfers(props) {
  const { data, onFilterChanged, initialData, searchBoxData, filteredSearchBoxData, selectedSecondaryFilters, selectedProperties } = props;
  const filterCriterias = ['area', 'airport', 'transfer_type', 'transfer_direction'];   //'value_type' ; CFD-1807 should also include valueType filter

  const handleOnFilterChanged = (selectedCriterias, filteredItems) => {
    const selectedTransferTypes = selectedCriterias.find(x => x.get('criteriaKey') === 'transfer_type')  ;
    const selectedDirection = selectedCriterias.find(x => x.get('criteriaKey') === 'transfer_direction')  ;
    
    let mutatedProperties = List();

    if (selectedTransferTypes) {
      mutatedProperties = mutatedProperties.push(
        Map({
          key: 'transfer_type',
          values: selectedTransferTypes.get('values')
        })
      );
    }
    if (selectedDirection) {
      mutatedProperties = mutatedProperties.push(
        Map({
          key: 'transfer_direction',
          values: selectedDirection.get('values')
        })
      );
    }
    
    
    onFilterChanged(
      selectedCriterias.filter(x => !['transfer_type', 'transfer_direction'].includes(x.get('criteriaKey')) ),//'value_type'
      filteredItems,
      mutatedProperties,
    );
  };

  const selectedFilters = selectedProperties
      .map(x => Map({ criteriaKey: x.get('key'), values: x.get('values') }))
      .concat(selectedSecondaryFilters);
  
  return (
    initialData && (
    <RuleTab
      onFilterChanged={handleOnFilterChanged}
      searchBoxData={searchBoxData}
      filteredSearchBoxData={filterCriterias.flatMap(criteria =>
        filteredSearchBoxData.filter(item => item.criteriaKey === criteria)
      )}
      columnDefinition={getColumnDefinitions()}
      initialData={initialData} 
      data={data} 
      agGridKey={'transfersOverview'}
      createButtons={[
        {
          label: 'Transfers margin',
          createUrl: '/pricing/rules/templates/create/transfers-margin',
          roles: ['componenttemplates.flightsupplements.write'] // Include the access role transfers margin template.
        }
      ]}
      selectedFilterIds={selectedFilters}
    />)
  );
}

function getColumnDefinitions() {
  return [
    {
      field: 'name',
      headerName: 'Template name',
      width: 113,
      cellRenderer: LinkCellRenderer,
      valueGetter: d => {
        if (!d.data) {
          return null;
        }
        return {
          url: `/pricing/rules/templates/edit/${getPropertyValue(d.data, 'id')}`,
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
      headerName: 'Source markets',
      width: 110
    },
    {
      headerName: 'Airport',
      width: 110,
      valueGetter: srcData => {
        if (!srcData.data || !srcData.data.criterias) {
          return null;
        }
        return srcData.data.criterias
          .filter(x => x.criteriaKey === 'airport')
          .map(y => y.valueTitle)
          .join(', ');
      }
    },
    {
      headerName: 'Area',
      width: 110,
      valueGetter: srcData => {
        if (!srcData.data || !srcData.data.criterias) {
          return null;
        }
        return srcData.data.criterias
          .filter(x => x.criteriaKey === 'area')
          .map(y => y.valueTitle)
          .join(', ');
      }
    },
    {
      headerName: 'Planning period',
      width: 110,
      valueGetter: srcData => {
        if (!srcData.data || !srcData.data.criterias) {
          return null;
        }
        return srcData.data.criterias
          .filter(x => x.criteriaKey === 'season')
          .map(y => y.valueTitle)
          .join(', ');
      }
    },
    {
      headerName: 'Product type',
      width: 120,
      valueGetter: srcData => {
        if (!srcData.data || !srcData.data.criterias) {
          return null;
        }
        return srcData.data.criterias
          .filter(x => x.criteriaKey === 'producttype')
          .map(y => y.valueTitle)
          .join(', ');
      }
    },
    {
      headerName: 'Direction',
      width: 120,
      valueGetter: srcData => {
        if (!srcData.data || !srcData.data.properties) {
          return null;
        }
        return srcData.data.properties
          .filter(x => x.key === 'transfer_direction')
          .map(y => y.displayName)
          .join(', ');
      }
    },
    {
      headerName: 'Transfer type',
      width: 120,
      valueGetter: srcData => {
        if (!srcData.data || !srcData.data.properties) {
          return null;
        }
        return srcData.data.properties
          .filter(x => x.key === 'transfer_type')
          .map(y => y.displayName)
          .join(', ');
      }
    },
    {
      headerName: 'Unit type',
      width: 120,
      valueGetter: srcData => {
        if (!srcData.data || !srcData.data.properties) {
          return null;
        }
        return srcData.data.properties
          .filter(x => x.key === 'unit_type')
          .map(y => y.displayName)
          .join(', ');
      }
    },
    {
      field: 'marginBandStart',
      width: 82,
      headerName: 'Start date',
      type: 'numericColumn',
      cellRenderer: DateCellRenderer
    },
    {
      field: 'marginBandEnd',
      width: 82,
      headerName: 'End date',
      type: 'numericColumn',
      cellRenderer: DateCellRenderer
    },
    {
      field: 'lastModifiedAt',
      width: 90,
      headerName: 'Last Saved',
      type: 'numericColumn',
      cellRenderer: DateCellRenderer
    },
    {
      field: 'lastModifiedByUserName',
      width: 200,
      headerName: 'Saved By'
    }
  
  ];
}
