import LinkCellRenderer from 'components/AgGrid/renderers/LinkCellRenderer';
import PercentageCellRenderer from 'components/AgGrid/renderers/PercentageCellRenderer';
import DateCellRenderer from 'components/AgGrid/renderers/DateCellRenderer';
import IconCellRenderer from 'components/AgGrid/renderers/IconCellRenderer';
import MoneyCellRenderer from 'components/AgGrid/renderers/MoneyCellRenderer';
import getPropertyValue from 'components/AgGrid/renderers/getPropertyValue';
import contextCurrencyValueGetter from 'components/AgGrid/renderers/contextCurrencyValueGetter';
import WarningCellRenderer from 'components/AgGrid/renderers/WarningCellRenderer';
import ChangesCellRenderer from 'components/AgGrid/renderers/ChangesCellRenderer';
import { MoneyComparator, ListLengthComparator } from 'components/AgGrid/comparators';
import ChangesHeader from 'components/AgGrid/ChangesHeader';
import WarningsHeader from 'components/AgGrid/WarningsHeader';
import moment from 'moment';
import { getDateFormat } from 'helpers/dateHelper';
import ToolTipRenderer from 'components/AgGrid/renderers/ToolTipRenderer';

export const getColumnDefinition = options => {
  return [
    {
      field: 'warnings',
      headerName: 'Warnings',
      cellClass: 'no-border',
      width: 24,
      headerComponent: WarningsHeader,
      cellRenderer: WarningCellRenderer,
      exportValueGetter: value => value.map(v => v.message)
    },
    {
      field: 'changes',
      headerName: 'Changes',
      width: 24,
      headerComponent: ChangesHeader,
      cellRenderer: ChangesCellRenderer,
      exportValueGetter: changes => {
        const allChanges = changes.flatMap(x => x.changes);
        const allUniqueChanges = new Set(allChanges);
        return [...allUniqueChanges].join(', ');
      }
    },
    {
      field: 'id',
      headerName: 'Prod. config. ID',
      width: 120,
      cellClass: 'no-border'
    },
    {
      field: 'productType',
      headerName: 'Product Type',
      cellClass: 'no-border',
      width: 108
    },
    {
      field: 'contractName',
      tooltipField: 'contractName',
      headerName: 'Contr. acc name',
      width: 130,
      cellClass: 'no-border'
    },
    {
      field: 'sourceReferenceCode',
      headerName: 'Contr. acc. code',
      cellClass: 'no-border',
      width: 130
    },
    {
      field: 'sourceMarketName',
      tooltipField: 'sourceMarketName',
      headerName: 'Source market',
      width: 190,
      cellClass: 'no-border'
    },
    {
      field: 'seasonName',
      headerName: 'Planning Period',
      cellClass: 'no-border',
      width: 130
    },
    {
      field: 'countryName',
      tooltipField: 'countryName',
      headerName: 'Country',
      width: 85,
      cellClass: 'no-border'
    },
    {
      field: 'destinationName',
      tooltipField: 'destinationName',
      headerName: 'Destination',
      width: 91,
      cellClass: 'no-border'
    },
    {
      field: 'resortName',
      tooltipField: 'resortName',
      headerName: 'Resort',
      width: 85,
      cellClass: 'no-border'
    },
    {
      field: 'accommodationName',
      headerName: 'Accommodation',
      cellClass: 'no-border',
      cellRenderer: LinkCellRenderer,
      valueGetter: d => {
        if (!d.data) return null;
        if (d.data.warnings.length > 0) {
          return {
            name: d.data.accommodationName
          };
        }
        return {
          url: `/cost/accommodation/details/${getPropertyValue(d.data, 'id')}`,
          name: getPropertyValue(d.data, 'accommodationName'),
          toString: () => {
            return getPropertyValue(d.data, 'accommodationName');
          }
        };
      }
    },
    {
      field: 'concepts',
      headerName: 'Concept',
      width: 85,
      cellClass: 'no-border'
    },
    {
      field: 'classification',
      headerName: 'Classification',
      width: 85,
      cellClass: 'no-border'
    },
    {
      field: 'ancillaries',
      headerName: 'No of ancillary',
      width: 85,
      cellClass: 'no-border',
      type: 'numericColumn',
      cellRenderer: ToolTipRenderer,
      cellRendererParams: {
        displayValueGetter: params => params.data?.ancillaries?.length ?? 0,
        tooltipValueGetter: params => params.data?.ancillaries?.join('<br/>'),
        showTooltip: params => params.data?.ancillaries?.length > 0,
        displayAsAnchor: true
      },
      comparator: ListLengthComparator('ancillaries')
    },
    {
      field: 'basicBoardCodes',
      headerName: 'Board basis',
      width: 85,
      cellClass: 'no-border'
    },
    {
      field: 'contractStatus',
      headerName: 'Status',
      width: 85,
      cellClass: 'no-border'
    },
    {
      field: 'currentVersion',
      headerName: 'Version',
      width: 100,
      cellClass: 'no-border',
      valueGetter: d => {
        if (!d.data || (!d.data.currentVersion && !d.data.currentVersionDate)) {
          return null;
        }
        const currentVersion = `(${d.data.currentVersion}) ${moment(d.data.currentVersionDate).format(
          getDateFormat()
        )}`;
        return {
          toString: () => {
            return currentVersion;
          }
        };
      }
    },
    {
      field: 'commitmentLevel',
      headerName: 'Committed',
      width: 90,
      cellRenderer: PercentageCellRenderer,
      cellClass: 'no-border'
    },
    {
      field: 'phasingReferenceName',
      headerName: 'Reference curve',
      width: 117,
      cellClass: 'no-border',
      cellRenderer: LinkCellRenderer,
      valueGetter: d => {
        if (!d.data || !d.data.phasingReferenceId) {
          return { name: 'N/A' };
        }
        return {
          url: `/cost/rules/templates/edit/${getPropertyValue(d.data, 'phasingReferenceId')}`,
          name: getPropertyValue(d.data, 'phasingReferenceName'),
          toString: () => {
            return getPropertyValue(d.data, 'phasingReferenceName');
          }
        };
      }
    },
    {
      field: 'commissionMarker',
      headerName: 'Commission marker',
      width: 85,
      cellClass: 'no-border'
    },
    {
      field: 'deviation',
      headerName: 'Deviation',
      cellRenderer: MoneyCellRenderer,
      valueGetter: contextCurrencyValueGetter,
      width: 101,
      type: 'numericColumn',
      cellClass: 'no-border',
      comparator: MoneyComparator('deviation', options.currency)
    },
    {
      field: 'contractStart',
      headerName: 'Start date',
      cellRenderer: DateCellRenderer,
      width: 85,
      type: 'numericColumn'
    },
    {
      field: 'contractEnd',
      headerName: 'End date',
      cellRenderer: DateCellRenderer,
      width: 85,
      type: 'numericColumn'
    },
    {
      field: 'isAllYear',
      headerName: 'All year',
      width: 73,
      cellClass: 'no-border',
      cellRenderer: IconCellRenderer,
      cellRendererParams: { iconSize: 16 },
      valueGetter: d => {
        if (!d.data) {
          return null;
        }
        if (d.data.isAllYear) {
          return 'check';
        }
        return 'empty';
      }
    }
  ];
};
