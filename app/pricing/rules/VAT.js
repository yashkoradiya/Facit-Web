import React, { Component } from 'react';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import RuleTab from './RuleTab';
import { ApplicabilityComparator, CriteriaKeyComparator } from 'components/AgGrid/comparators';
import LinkCellRenderer from 'components/AgGrid/renderers/LinkCellRenderer';
import DateCellRenderer from 'components/AgGrid/renderers/DateCellRenderer';
import IconCellRenderer from 'components/AgGrid/renderers/IconCellRenderer';
import getPropertyValue from 'components/AgGrid/renderers/getPropertyValue';

class VAT extends Component {
  render() {
    const {
      data,
      initialData,
      searchBoxData,
      filteredSearchBoxData,
      selectedSecondaryFilters,
      selectedSourceMarkets
    } = this.props;

    const selectedFilters = selectedSourceMarkets
      .map(x => Map({ criteriaKey: x.get('key'), values: x.get('values') }))
      .concat(selectedSecondaryFilters);

    const filterCriterias = [
      'destinationairport', 
      'departureairport', 
      'product_type_for_vat'
    ];
    return (
      initialData && (
        <RuleTab
          onFilterChanged={this.props.onFilterChanged}
          searchBoxData={searchBoxData.filter(criteria => filterCriterias.some(x => x === criteria.criteriaKey))}
          filteredSearchBoxData={filteredSearchBoxData.filter(criteria =>
            filterCriterias.some(x => x === criteria.criteriaKey)
          )}
          columnDefinition={this.getColumnDefinition()}
          initialData={initialData}
          data={data}
          agGridKey={'VATOverview'}
          createButtons={[
            {
              label: 'Accom-VAT',
              createUrl: '/pricing/rules/templates/create/vat',
              roles: ['componenttemplates.misccost.write']
            },
            {
              label: 'Accom-Reverse Charge',
              createUrl: '/pricing/rules/templates/create/reverse-charge',
              roles: ['componenttemplates.reversecharge.write'] 
            },
            {
              label: 'Flight-VAT',
              createUrl: '/pricing/rules/templates/Create/flight-vat',
              roles: ['componenttemplates.flightvat.write']
            },
            {
              label: 'Transfers - VAT',
              createUrl: '/pricing/rules/templates/Create/transfer-vat',
              roles: ['componenttemplates.transfervat.write']
            }
          ]}
          selectedFilterIds={selectedFilters}
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
        headerName: 'Start date',
        width: 82,
        type: 'numericColumn',
        cellRenderer: DateCellRenderer
      },
      {
        field: 'marginBandEnd',
        headerName: 'End date',
        width: 82,
        type: 'numericColumn',
        cellRenderer: DateCellRenderer
      },
      {
        field: 'country',
        headerName: 'Country',
        width: 91,
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
        headerName: 'Destination',
        width: 120,
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
        field: 'contracttype',
        width: 120,
        headerName: 'Contract type'
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
          if (d.data.ruleType === 'vat') {
            return 'Accommodation'
          }
          else if (d.data.ruleType === 'charter_flight_vat') {
            return 'Flight'
          }
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
}

VAT.propTypes = {
  data: PropTypes.shape({
    data: PropTypes.array,
    dataSetKey: PropTypes.string
  }),
  initialData: PropTypes.shape({
    data: PropTypes.array,
    dataSetKey: PropTypes.string
  }),
  selectedSourceMarkets: PropTypes.object
};

export default VAT;
