import React, { Component } from 'react';
import { Map } from 'immutable';
import RuleTab from './RuleTab';
import { getRuleTypeDisplayName } from './ruleConstants';
import {
  ApplicabilityComparator,
  SortByOtherFieldComparator,
  CriteriaKeyComparator
} from '../../components/AgGrid/comparators';
import LinkCellRenderer from '../../components/AgGrid/renderers/LinkCellRenderer';
import DateCellRenderer from '../../components/AgGrid/renderers/DateCellRenderer';
import IconCellRenderer from '../../components/AgGrid/renderers/IconCellRenderer';
import getPropertyValue from '../../components/AgGrid/renderers/getPropertyValue';

class Accommodation extends Component {
  render() {
    const {
      data,
      initialData,
      searchBoxData,
      filteredSearchBoxData,
      selectedSecondaryFilters,
      selectedRuleTypes,
      selectedSourceMarkets
    } = this.props;
    let selectedFilters = selectedSecondaryFilters;
    if (selectedRuleTypes.size > 0) {
      selectedFilters = selectedFilters.push(Map({ criteriaKey: 'rule_type', values: selectedRuleTypes }));
    }
    selectedFilters = selectedSourceMarkets
      .map(x => Map({ criteriaKey: x.get('key'), values: x.get('values') }))
      .concat(selectedFilters);

    const filterCriterias = ['classification', 'concept', 'label', 'accommodationcode', 'rule_type'];

    return (
      initialData && (
        <RuleTab
          onFilterChanged={this.props.onFilterChanged}
          searchBoxData={searchBoxData.filter(criteria => filterCriterias.some(x => x === criteria.criteriaKey))}
          filteredSearchBoxData={filterCriterias.flatMap(criteria =>
            filteredSearchBoxData.filter(data => data.criteriaKey === criteria)
          )}
          columnDefinition={this.getColumnDefinitions()}
          initialData={initialData}
          data={data}
          agGridKey={'accommodationOverview'}
          createButtons={[
              {
                label: 'Acc. component',
                createUrl: '/pricing/rules/templates/create/accommodation-component',
                roles: ['componenttemplates.accommodationcomponents.write']
              },
              {
                label: 'Under occupancy',
                createUrl: '/pricing/rules/templates/create/under-occupancy',
                roles: ['componenttemplates.underoccupancy.write']
              },
              {
                label: 'Over occupancy',
                createUrl: '/pricing/rules/templates/create/over-occupancy',
                roles: ['componenttemplates.overoccupancy.write']
              },
              {
                label: 'Board upgrade',
                createUrl: '/pricing/rules/templates/create/board-upgrade',
                roles: ['componenttemplates.boardupgrade.write'],
                offerings: ['offering.accommoationOnly', 'offering.charterPackage']
              },
              {
                label: 'Mandatory supplement',
                createUrl: '/pricing/rules/templates/create/mandatory-supplement',
                roles: ['componenttemplates.mandatorysupplement.write']
              },
              {
                label: 'Ancillary',
                createUrl: '/pricing/rules/templates/create/ancillary',
                roles: ['componenttemplates.ancillary.write']
              }
            ]}
          selectedFilterIds={selectedFilters}
        />
      )
    );
  }

  getColumnDefinitions = () => {
    return [
      {
        field: 'ruleType',
        headerName: ' ',
        width: 40,
        cellRenderer: IconCellRenderer,
        cellRendererParams: {
          iconSize: 16
        },
        valueGetter: d => {
          if (!d.data || !d.data.criterias) {
            return null;
          }
          if (d.data.criterias[0].criteriaKey === 'accommodationcode') {
            return 'accommodation_geography';
          }
          return d.data.criterias[0].criteriaKey;
        },
        comparator: ApplicabilityComparator
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
        field: 'sourceMarkets',
        headerName: 'Source markets',
        width: 120
      },
      {
        headerName: 'Product type',
        width: 120,
        valueGetter: d => {
          if (!d.data || !d.data.criterias) {
            return null;
          }

          const productTypeCriterias = d.data.criterias
            .filter(x => x.criteriaKey === 'producttype')
            .map(y => y.valueTitle);

          return productTypeCriterias.filter((item, index) => index === productTypeCriterias.indexOf(item));
        }
      },
      {
        field: 'ruleTypeKey',
        headerName: 'Rule Type',
        width: 83,
        valueGetter: d => {
          if (!d.data) {
            return null;
          }
          return d.data.ruleType ? getRuleTypeDisplayName(d.data.ruleType) : '';
        },
        tooltipValueGetter: d => {
          return d.data && d.data.ruleType ? getRuleTypeDisplayName(d.data.ruleType) : null;
        },
        comparator: SortByOtherFieldComparator('ruleType')
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
        field: 'country',
        width: 91,
        headerName: 'Country',
        valueGetter: d => {
          if (!d.data || !d.data.criterias) {
            return null;
          }
          return d.data.criterias
            .filter(x => x.criteriaKey === 'country')
            .map(y => y.valueTitle)
            .join(', ');
        },
        tooltipValueGetter: d => {
          return d.data && d.data.criterias
            ? d.data.criterias
              .filter(x => x.criteriaKey === 'country')
              .map(y => y.valueTitle)
              .join(', ')
            : null;
        },
        comparator: CriteriaKeyComparator('country')
      },
      {
        field: 'destination',
        width: 120,
        headerName: 'Destination',
        valueGetter: d => {
          if (!d.data || !d.data.criterias) {
            return null;
          }
          return d.data.criterias
            .filter(x => x.criteriaKey === 'destination')
            .map(y => y.valueTitle)
            .join(', ');
        },
        tooltipValueGetter: d => {
          return d.data && d.data.criterias
            ? d.data.criterias
              .filter(x => x.criteriaKey === 'destination')
              .map(y => y.valueTitle)
              .join(', ')
            : null;
        },
        comparator: CriteriaKeyComparator('destination')
      },
      {
        field: 'resort',
        width: 91,
        headerName: 'Resort',
        valueGetter: d => {
          if (!d.data || !d.data.criterias) {
            return null;
          }
          return d.data.criterias
            .filter(x => x.criteriaKey === 'resort')
            .map(y => y.valueTitle)
            .join(', ');
        },
        tooltipValueGetter: d => {
          return d.data && d.data.criterias
            ? d.data.criterias
              .filter(x => x.criteriaKey === 'resort')
              .map(y => y.valueTitle)
              .join(', ')
            : null;
        },
        comparator: CriteriaKeyComparator('resort')
      },
      {
        field: 'classification',
        width: 101,
        headerName: 'Classification',
        valueGetter: d => {
          if (!d.data || !d.data.criterias) {
            return null;
          }
          return d.data.criterias
            .filter(x => x.criteriaKey === 'classification')
            .map(y => y.valueTitle)
            .join(', ');
        },
        tooltipValueGetter: d => {
          return d.data && d.data.criterias
            ? d.data.criterias
              .filter(x => x.criteriaKey === 'classification')
              .map(y => y.valueTitle)
              .join(', ')
            : null;
        },
        comparator: CriteriaKeyComparator('classification')
      },
      {
        field: 'concept_label',
        width: 109,
        headerName: 'Concept/Label',
        valueGetter: d => {
          if (!d.data || !d.data.criterias) {
            return null;
          }
          return d.data.criterias
            .filter(x => x.criteriaKey === 'concept' || x.criteriaKey === 'label')
            .map(y => y.valueTitle)
            .join(', ');
        },
        tooltipValueGetter: d => {
          return d.data && d.data.criterias
            ? d.data.criterias
              .filter(x => x.criteriaKey === 'concept' || x.criteriaKey === 'label')
              .map(y => y.valueTitle)
              .join(', ')
            : null;
        },
        comparator: CriteriaKeyComparator('concept', 'label')
      },
      {
        field: 'source_reference_value',
        width: 118,
        headerName: 'Contr. acc. code',
        valueGetter: d => {

          if (!d.data || !d.data.criterias) {
            return null;
          }

          const values =  d.data.criterias
            .filter(x => x.criteriaKey === 'accommodationcode')
            .map(y => y.valueCode);

            return Array.from(new Set(values))
            .join(', ');

        },
        tooltipValueGetter: d => {

          if (!d.data || !d.data.criterias)
            return null;

            const values = d.data.criterias
              .filter(x => x.criteriaKey === 'accommodationcode')
              .map(y => y.valueCode);

            return Array.from(new Set(values))
            .join(', ');
        },
        comparator: CriteriaKeyComparator('source_reference_value')
      },
      {
        field: 'accommodationcode',
        width: 118,
        headerName: 'Accommodation',
        valueGetter: d => {

          if (!d.data || !d.data.criterias) {
            return null;
          }

          const values = d.data.criterias
            .filter(x => x.criteriaKey === 'accommodationcode')
            .map(y => y.valueTitle);

            return Array.from(new Set(values))
            .join(', ');
        },
        tooltipValueGetter: d => {

          if (!d.data || !d.data.criterias)
          return null;

          const values = d.data.criterias
              .filter(x => x.criteriaKey === 'accommodationcode')
              .map(y => y.valueTitle);

            return Array.from(new Set(values))
              .join(', ');
        },
        comparator: CriteriaKeyComparator('accommodationcode')
      },
      {
        field: 'valueType',
        width: 90,
        headerName: 'Value Type',
        tooltipValueGetter: d => {
          if (!d.data) {
            return null;
          }
          return this.convertToVerboseValueType(d.data.valueType);
        },
        valueGetter: d => {
          if (!d.data) {
            return null;
          }
          return this.convertValueType(d.data.valueType);
        }
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

  convertValueType = valueType => {
    if (valueType.toLowerCase().indexOf('percentage') !== -1) {
      return '%';
    }
    return 'A';
  };

  convertToVerboseValueType = valueType => {
    if (valueType.toLowerCase().indexOf('percentage') !== -1) {
      return 'Percentage';
    }
    return 'Absolute';
  };
}

export default Accommodation;
