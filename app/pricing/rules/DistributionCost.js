import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RuleTab from './RuleTab';
import { ApplicabilityComparator, CriteriaKeyComparator } from 'components/AgGrid/comparators';
import LinkCellRenderer from 'components/AgGrid/renderers/LinkCellRenderer';
import DateCellRenderer from 'components/AgGrid/renderers/DateCellRenderer';
import IconCellRenderer from 'components/AgGrid/renderers/IconCellRenderer';
import getPropertyValue from 'components/AgGrid/renderers/getPropertyValue';

class DistributionCost extends Component {
  render() {
    const { data, onFilterChanged, initialData, searchBoxData, filteredSearchBoxData, selectedSecondaryFilters } =
      this.props;
    const filterCriterias = [
      'classification',
      'concept',
      'label',
      'accommodationcode',
      'commissionmarker',
      'destinationairport',
      'departureairport',
      'product_type_for_distcost'
    ];
    return (
      initialData && (
        <RuleTab
          onFilterChanged={onFilterChanged}
          searchBoxData={searchBoxData.filter(criteria => filterCriterias.some(x => x === criteria.criteriaKey))}
          filteredSearchBoxData={filterCriterias.flatMap(criteria =>
            filteredSearchBoxData.filter(data => data.criteriaKey === criteria)
          )}
          columnDefinition={this.getColumnDefinition()}
          initialData={initialData}
          data={data}
          agGridKey={'distCostOverview'}
          createButtons={[
            {
              label: 'Accom-Dist cost',
              createUrl: '/pricing/rules/templates/create/distribution-cost',
              roles: ['componenttemplates.distributioncost.write']
            },
            {
              label: 'Flight-Dist cost',
              createUrl: '/pricing/rules/templates/Create/flight-distribution-cost',
              roles: ['componenttemplates.flightdistributioncost.write']
            },
            {
              label: 'Transfers-Dist cost',
              createUrl: '/pricing/rules/templates/Create/transfer-distribution-cost',
              roles: ['componenttemplates.transferdistributioncost.write']
            }
          ]}
          selectedFilterIds={selectedSecondaryFilters}
        />
      )
    );
  }

  getColumnDefinition = () => {
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

          const values = d.data.criterias.filter(x => x.criteriaKey === 'accommodationcode').map(y => y.valueCode);

          return Array.from(new Set(values)).join(', ');
        },
        tooltipValueGetter: d => {
          if (!d.data || !d.data.criterias) {
            return null;
          }

          const values = d.data.criterias.filter(x => x.criteriaKey === 'accommodationcode').map(y => y.valueCode);

          return Array.from(new Set(values)).join(', ');
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

          const values = d.data.criterias.filter(x => x.criteriaKey === 'accommodationcode').map(y => y.valueTitle);

          return Array.from(new Set(values)).join(', ');
        },
        tooltipValueGetter: d => {
          if (!d.data || !d.data.criterias) {
            return null;
          }

          const values = d.data.criterias.filter(x => x.criteriaKey === 'accommodationcode').map(y => y.valueTitle);

          return Array.from(new Set(values)).join(', ');
        },
        comparator: CriteriaKeyComparator('accommodationcode')
      },
      {
        field: 'sourceMarkets',
        headerName: 'Source markets',
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
        tooltipValueGetter: d => {
          if (!d.data || !d.data.criterias) {
            return null;
          }
          return d.data.criterias
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
        tooltipValueGetter: d => {
          if (!d.data || !d.data.criterias) {
            return null;
          }
          return d.data.criterias
            .filter(x => x.criteriaKey === 'departureairport')
            .map(y => y.valueTitle)
            .join(', ');
        },
        comparator: CriteriaKeyComparator('departureairport')
      },
      {
        field: 'ruleType',
        headerName: 'Product type',
        width: 120,
        valueGetter: d => {
          if (d.data.ruleType === 'distribution_cost') {
            return 'Accommodation';
          } else if (d.data.ruleType === 'charter_flight_distcostcomponent') {
            return 'Flight';
          }
        }
      },
      {
        field: 'commissionmarker',
        width: 118,
        headerName: 'Commission Marker',
        valueGetter: d => {
          if (!d.data || !d.data.criterias) {
            return null;
          }

          const values = d.data.criterias.filter(x => x.criteriaKey === 'commissionmarker').map(y => y.valueTitle).sort((a, b) => a.localeCompare(b));

          return Array.from(new Set(values)).join(', ');
        },
        tooltipValueGetter: d => {
          if (!d.data || !d.data.criterias) {
            return null;
          }

          const values = d.data.criterias.filter(x => x.criteriaKey === 'commissionmarker').map(y => y.valueTitle).sort((a, b) => a.localeCompare(b));

          return Array.from(new Set(values)).join(', ');
        },
        comparator: CriteriaKeyComparator('commissionmarker')
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

DistributionCost.propTypes = {
  data: PropTypes.shape({
    data: PropTypes.array,
    dataSetKey: PropTypes.string
  }),
  initialData: PropTypes.shape({
    data: PropTypes.array,
    dataSetKey: PropTypes.string
  })
};

export default DistributionCost;
