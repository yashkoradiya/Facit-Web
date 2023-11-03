import React, { Component } from 'react';
import { Map, List } from 'immutable';
import PropTypes from 'prop-types';
import RuleTab from './RuleTab';
import { ApplicabilityComparator, CriteriaKeyComparator, PropertiesComparator } from 'components/AgGrid/comparators';
import LinkCellRenderer from 'components/AgGrid/renderers/LinkCellRenderer';
import DateCellRenderer from 'components/AgGrid/renderers/DateCellRenderer';
import IconCellRenderer from 'components/AgGrid/renderers/IconCellRenderer';
import getPropertyValue from 'components/AgGrid/renderers/getPropertyValue';
import MoneyCellRenderer from 'components/AgGrid/renderers/MoneyCellRenderer';

class MiscCost extends Component {
  handleOnFilterChanged = (selectedCriterias, filteredItems) => {
    const selectedCostLabels = selectedCriterias.find(x => x.get('criteriaKey') === 'cost_label');
    let costLabels = List();
    if (selectedCostLabels) {
      costLabels = costLabels.push(
        Map({
          key: 'cost_label',
          values: selectedCostLabels.get('values')
        })
      );
    }
    this.props.onFilterChanged(
      selectedCriterias.filter(x => x.get('criteriaKey') !== 'cost_label'),
      filteredItems,
      costLabels
    );
  };

  render() {
    const { data, initialData, searchBoxData, filteredSearchBoxData, selectedSecondaryFilters, selectedProperties } =
      this.props;
    const selectedFilters = selectedProperties
      .map(x => Map({ criteriaKey: x.get('key'), values: x.get('values') }))
      .concat(selectedSecondaryFilters);
    const filterCriterias = ['classification', 'concept', 'label', 'accommodationcode', 'cost_label'];

    return (
      initialData && (
        <RuleTab
          onFilterChanged={this.handleOnFilterChanged}
          searchBoxData={searchBoxData}
          filteredSearchBoxData={filterCriterias.flatMap(criteria =>
            filteredSearchBoxData.filter(data => data.criteriaKey === criteria)
          )}
          columnDefinition={this.getColumnDefinition()}
          initialData={initialData}
          data={data}
          agGridKey={'miscCostOverview'}
          createButtons={[
            {
              label: 'Misc cost',
              createUrl: '/pricing/rules/templates/create/miscellaneous-cost',
              roles: ['componenttemplates.misccost.write']
            },
            {
              label: 'Guarantee Fund - Accom',
              createUrl: '/pricing/rules/templates/create/guaranteefund-accom-misccostcomponent',
              roles: ['componenttemplates.guaranteefundaccom.write']
            },
            {
              label: 'Guarantee Fund - Flight',
              createUrl: '/pricing/rules/templates/create/guaranteefund-flight-misccostcomponent',
              roles: ['componenttemplates.guaranteefundflight.write']
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
        field: 'rateType',
        width: 91,
        headerName: 'Rate Type',
        valueGetter: d => {
          if (!d.data) {
            return null;
          }
          const costLabel = d.data.properties.find(x => x.key === 'rate_type');
          return costLabel ? costLabel.value : '';
        },
        comparator: PropertiesComparator('rate_type')
      },
      {
        field: 'costLabel',
        width: 91,
        headerName: 'Cost label',
        valueGetter: d => {
          if (!d.data) {
            return null;
          }
          const costLabel = d.data.properties.find(x => x.key === 'cost_label');
          return costLabel ? costLabel.value : '';
        },
        comparator: PropertiesComparator('cost_label')
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
        field: 'destination',
        width: 91,
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

          const values = d.data.criterias
            .filter(x => x.criteriaKey === 'accommodationcode')
            .map(y => y.valueCode)

            return Array.from(new Set(values))
              .join(', ');

        },
        tooltipValueGetter: d => {

          if (!d.data || !d.data.criterias) {
            return null;
          }

          const values = d.data.criterias
                .filter(x => x.criteriaKey === 'accommodationcode')
                .map(y => y.valueCode);

            return Array.from(new Set(values))
              .join(', ');

        },
        comparator: CriteriaKeyComparator('source_reference_value')
      },
      {
        field: 'firstMargin',
        headerName: 'Value',
        width: 110,
        type: 'numericColumn',
        cellRenderer: MoneyCellRenderer
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

          if (!d.data || !d.data.criterias) {
            return null;
          }

          const values = d.data.criterias
                .filter(x => x.criteriaKey === 'accommodationcode')
                .map(y => y.valueTitle);

            return Array.from(new Set(values))
            .join(', ');

        },
        comparator: CriteriaKeyComparator('accommodationcode')
      },
      {
        field: 'sourceMarkets',
        headerName: 'Source markets',
        width: 110
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
      },
      {
        field: 'currency',
        headerName: 'Currency',
        width: 80
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
MiscCost.propTypes = {
  data: PropTypes.shape({
    data: PropTypes.array,
    dataSetKey: PropTypes.string
  }),
  initialData: PropTypes.shape({
    data: PropTypes.array,
    dataSetKey: PropTypes.string
  })
};

export default MiscCost;
