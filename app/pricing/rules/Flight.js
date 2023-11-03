import React, { Component } from 'react';
import RuleTab from './RuleTab';
import { CriteriaKeyComparator } from 'components/AgGrid/comparators';
import DateCellRenderer from 'components/AgGrid/renderers/DateCellRenderer';
import LinkCellRenderer from 'components/AgGrid/renderers/LinkCellRenderer';
import getPropertyValue from 'components/AgGrid/renderers/getPropertyValue';

class Flight extends Component {
  render() {
    const { data, onFilterChanged, initialData, searchBoxData, filteredSearchBoxData, selectedSecondaryFilters } =
      this.props;
    const filterCriterias = ['destinationairport', 'departureairport', 'airline', 'weekday', 'flight_template_type'];
    return (
      initialData && (
        <RuleTab
          onFilterChanged={onFilterChanged}
          searchBoxData={searchBoxData}
          filteredSearchBoxData={filterCriterias.flatMap(criteria =>
            filteredSearchBoxData.filter(item => item.criteriaKey === criteria)
          )}
          columnDefinition={this.getColumnDefinitions()}
          initialData={initialData}
          data={data}
          agGridKey={'flightOverview'}
          createButtons={[
            {
              label: 'Flight',
              createUrl: '/pricing/rules/templates/create/charter-flight-component',
              roles: ['componenttemplates.flightsupplements.write']
            }
          ]}
          selectedFilterIds={selectedSecondaryFilters}
        />
      )
    );
  }

  getColumnDefinitions = () => {
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
        field: 'flightTemplateType',
        headerName: 'Template type',
        width: 110
      },
      {
        field: 'destinationairport',
        width: 160,
        headerName: 'Destination airport',
        valueGetter: d => {
          if (!d.data || !d.data.criterias) {
            return null;
          }
          return d.data.criterias
            .filter(x => x.criteriaKey === 'destinationairport')
            .map(y => y.valueTitle)
            .join(', ');
        },
        tooltipValueGetter: srcData => {
          if (!srcData.data || !srcData.data.criterias) {
            return null;
          }
          return srcData.data.criterias
            .filter(x => x.criteriaKey === 'destinationairport')
            .map(y => y.valueTitle)
            .join(', ');
        },
        comparator: CriteriaKeyComparator('destinationairport')
      },
      {
        field: 'departureairport',
        width: 160,
        headerName: 'Departure airport',
        valueGetter: d => {
          if (!d.data || !d.data.criterias) {
            return null;
          }
          return d.data.criterias
            .filter(x => x.criteriaKey === 'departureairport')
            .map(y => y.valueTitle)
            .join(', ');
        },
        tooltipValueGetter: srcData => {
          if (!srcData.data || !srcData.data.criterias) {
            return null;
          }
          return srcData.data.criterias
            .filter(x => x.criteriaKey === 'departureairport')
            .map(y => y.valueTitle)
            .join(', ');
        },
        comparator: CriteriaKeyComparator('departureairport')
      },
      {
        field: 'airline',
        width: 160,
        headerName: 'Airline',
        valueGetter: d => {
          if (!d.data || !d.data.criterias) {
            return null;
          }
          return d.data.criterias
            .filter(x => x.criteriaKey === 'airline')
            .map(y => y.valueTitle)
            .join(', ');
        },
        tooltipValueGetter: srcData => {
          if (!srcData.data || !srcData.data.criterias) {
            return null;
          }
          return srcData.data.criterias
            .filter(x => x.criteriaKey === 'airline')
            .map(y => y.valueTitle)
            .join(', ');
        },
        comparator: CriteriaKeyComparator('airline')
      },
      {
        field: 'weekday',
        width: 160,
        headerName: 'Week Day',
        valueGetter: d => {
          if (!d.data || !d.data.criterias) {
            return null;
          }
          return d.data.criterias
            .filter(x => x.criteriaKey === 'weekday')
            .map(y => y.valueTitle)
            .join(', ');
        },
        tooltipValueGetter: srcData => {
          if (!srcData.data || !srcData.data.criterias) {
            return null;
          }
          return srcData.data.criterias
            .filter(x => x.criteriaKey === 'weekday')
            .map(y => y.valueTitle)
            .join(', ');
        },
        comparator: CriteriaKeyComparator('weekday')
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
  };
}
export default Flight;
