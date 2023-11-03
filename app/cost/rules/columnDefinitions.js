import { ApplicabilityComparator, CriteriaKeyComparator } from 'components/AgGrid/comparators';
import LinkCellRenderer from 'components/AgGrid/renderers/LinkCellRenderer';
import DateCellRenderer from 'components/AgGrid/renderers/DateCellRenderer';
import IconCellRenderer from 'components/AgGrid/renderers/IconCellRenderer';
import getPropertyValue from 'components/AgGrid/renderers/getPropertyValue';
import LinkWithClickHandlerCellRenderer from './LinkWithClickHandlerCellRenderer';

export const getColumnDefinition = options => {
  return [
    {
      field: 'ruleType',
      headerName: ' ',
      width: 50,
      cellRenderer: IconCellRenderer,
      cellRendererParams: {
        iconSize: 16
      },
      valueGetter: d => {
        if (!d.data || !d.data.criterias) {
          return null;
        }
        if (d.data.criterias[0].criteriaKey === 'accommodation') {
          return 'accommodation_geography';
        }
        return d.data.criterias[0].criteriaKey;
      },
      comparator: ApplicabilityComparator
    },
    {
      field: 'name',
      tooltipField: 'name',
      headerName: 'Phasing reference name',
      width: 184,
      cellRenderer: LinkCellRenderer,
      valueGetter: d => {
        if (!d.data) {
          return null;
        }
        return {
          url: `/cost/rules/templates/edit/${getPropertyValue(d.data, 'id')}`,
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
      tooltipField: 'sourceMarkets',
      headerName: 'Source markets',
      width: 110
    },
    {
      field: 'marginBandStart',
      width: 82,
      headerName: 'First date',
      cellRenderer: DateCellRenderer
    },
    {
      field: 'marginBandEnd',
      width: 82,
      headerName: 'Last date',
      cellRenderer: DateCellRenderer
    },
    {
      field: 'country',
      tooltipField: 'country',
      width: 99,
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
      comparator: CriteriaKeyComparator('country')
    },
    {
      field: 'destination',
      tooltipField: 'destination',
      width: 99,
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
      tooltipField: 'resort',
      width: 66,
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
      field: 'accommodation',
      tooltipField: 'accommodation',
      width: 118,
      headerName: 'Accommodation',
      valueGetter: d => {
        if (!d.data || !d.data.criterias) {
          return null;
        }
        return d.data.criterias
          .filter(x => x.criteriaKey === 'accommodation')
          .map(y => y.valueTitle)
          .join(', ');
      },
      tooltipValueGetter: d => {
        return d.data && d.data.criterias
          ? d.data.criterias
              .filter(x => x.criteriaKey === 'accommodation')
              .map(y => y.valueTitle)
              .join(', ')
          : null;
      },
      comparator: CriteriaKeyComparator('accommodation')
    },
    {
      field: 'system',
      headerName: 'System/Manual',
      width: 118
    },
    {
      field: 'assignedProducts',
      headerName: 'Phased accommodations',
      cellRenderer: LinkWithClickHandlerCellRenderer,
      valueGetter: params => {
        if (!params.data) {
          return null;
        }
        return {
          handler: options.handlePhasedAccommodationsClick,
          name: params.data.assignedProducts
        };
      },
      width: 172
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
