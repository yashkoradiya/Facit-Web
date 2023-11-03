import React, { Component } from 'react';
import RuleTab from './RuleTab';
import { CriteriaKeyComparator } from 'components/AgGrid/comparators';
import LinkCellRenderer from 'components/AgGrid/renderers/LinkCellRenderer';
import DateCellRenderer from 'components/AgGrid/renderers/DateCellRenderer';
import IconCellRenderer from 'components/AgGrid/renderers/IconCellRenderer';
import getPropertyValue from 'components/AgGrid/renderers/getPropertyValue';

class DynamicCruise extends Component {
  render() {
    const {
      data,
      onFilterChanged,
      initialData,
      searchBoxData,
      filteredSearchBoxData,
      selectedSecondaryFilters
    } = this.props;
    const filterCriterias = ['cruiseline', 'cruiseregion'];

    return (
      initialData && (
        <RuleTab
          onFilterChanged={onFilterChanged}
          searchBoxData={searchBoxData}
          filteredSearchBoxData={filteredSearchBoxData.filter(criteria =>
            filterCriterias.some(x => x === criteria.criteriaKey)
          )}
          columnDefinition={this.getColumnDefinitions()}
          initialData={initialData}
          data={data}
          agGridKey={'dynamicCruiseRulesOverview'}
          createButtons={[
            {
              label: 'Dynamic cruise',
              createUrl: '/pricing/rules/templates/create/dynamic-cruise',
              roles: ['componenttemplates.dynamiccruise.write']
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
        field: 'ruleType',
        headerName: ' ',
        width: 28,
        cellRenderer: IconCellRenderer,
        cellRendererParams: {
          iconSize: 16
        },
        valueGetter: d => {
          if (!d.data || !d.data.criterias) {
            return null;
          }
          return d.data.criterias[0].criteriaKey;
        }
      },
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
        field: 'cruiseline',
        width: 86,
        headerName: 'Cruise line',
        valueGetter: d => {
          if (!d.data || !d.data.criterias) {
            return null;
          }
          return d.data.criterias
            .filter(x => x.criteriaKey === 'cruiseline')
            .map(y => y.valueTitle)
            .join(', ');
        },
        tooltipValueGetter: d => {
          return d.data && d.data.criterias
            ? d.data.criterias
                .filter(x => x.criteriaKey === 'cruiseline')
                .map(y => y.valueTitle)
                .join(', ')
            : null;
        },
        comparator: CriteriaKeyComparator('cruiseline')
      },
      {
        field: 'cruiseregion',
        width: 110,
        headerName: 'Cruise region',
        valueGetter: d => {
          if (!d.data || !d.data.criterias) {
            return null;
          }
          return d.data.criterias
            .filter(x => x.criteriaKey === 'cruiseregion')
            .map(y => y.valueTitle)
            .join(', ');
        },
        tooltipValueGetter: d => {
          return d.data && d.data.criterias
            ? d.data.criterias
                .filter(x => x.criteriaKey === 'cruiseregion')
                .map(y => y.valueTitle)
                .join(', ')
            : null;
        },
        comparator: CriteriaKeyComparator('cruiseregion')
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
        width: 150,
        headerName: 'Saved By'
      }
    ];
  };
}

export default DynamicCruise;
