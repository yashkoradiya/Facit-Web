import RuleToolTipRenderer from 'components/AgGrid/renderers/RuleToolTipRenderer';
import ToolTipRenderer from 'components/AgGrid/renderers/ToolTipRenderer';
import ClassificationsHeader from 'components/AgGrid/ClassificationsHeader';
import { MoneyComparator } from 'components/AgGrid/comparators';
import MoneyCellRenderer from 'components/AgGrid/renderers/MoneyCellRenderer';
import WarningCellRenderer from 'components/AgGrid/renderers/WarningCellRenderer';
import contextCurrencyValueGetter from 'components/AgGrid/renderers/contextCurrencyValueGetter';
import PercentageCellRenderer from 'components/AgGrid/renderers/PercentageCellRenderer';
import settings from 'core/settings/settings';
import DateCellRenderer from 'components/AgGrid/renderers/DateCellRenderer';
import { getDateFormat } from 'helpers/dateHelper';
import ChangesCellRenderer from 'components/AgGrid/renderers/ChangesCellRenderer';
import ChangesHeader from 'components/AgGrid/ChangesHeader';
import WarningsHeader from 'components/AgGrid/WarningsHeader';

const getColumnDefinitions = (options = {}) => {
  const baseRoomColDef = {
    field: 'isBaseRoom',
    headerName: 'Base room',
    cellClass: 'no-border',
    width: 86,
    valueGetter: d => {
      if (!d.data) {
        return null;
      }
      return d.data.isBaseRoom ? 'Y' : 'N';
    }
  };

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
        const accommodationOnly = changes.find(x => x.offeringType === 'accommodation-only');
        if (accommodationOnly && accommodationOnly.changes.length) {
          return accommodationOnly.changes.join(', ');
        }
        return '';
      }
    },
    {
      field: 'sourceMarket',
      headerName: 'Source market',
      cellClass: 'no-border',
      width: 108
    },

    {
      field: 'country',
      tooltipField: 'country',
      headerName: 'Country',
      cellClass: 'no-border',
      width: 91
    },
    {
      field: 'destination',
      tooltipField: 'destination',
      headerName: 'Destination',
      cellClass: 'no-border',
      width: 91
    },
    {
      field: 'resort',
      tooltipField: 'resort',
      headerName: 'Resort',
      cellClass: 'no-border',
      width: 64,
      tooltipValueGetter: d => {
        return d.data && d.data.resort ? d.data.resort : null;
      }
    },
    {
      headerName: 'Acc. name',
      field: 'accommodationName',
      tooltipField: 'accommodationName',
      cellClass: 'no-border',
      width: 90
    },
    {
      field: 'keyAccom',
      headerName: 'Key Accom',
      cellClass: 'no-border',
      width: 90
    },
    {
      field: 'keyDuration',
      headerName: 'Key Duration',
      cellClass: 'no-border',
      width: 90
    },
    {
      field: 'id',
      headerName: 'Prod. config. ID',
      cellClass: 'no-border',
      width: 130
    },
    {
      field: 'sourceReferenceCode',
      headerName: 'Contr. acc. code',
      cellClass: 'no-border',
      width: 130
    },
    {
      field: 'contractCode',
      headerName: 'Room code',
      cellClass: 'no-border',
      width: 91
    },
    {
      field: 'description',
      tooltipField: 'description',
      headerName: 'Room description',
      cellClass: 'no-border',
      width: 130
    },
    ...(settings.SHOW_BASEROOMS ? [baseRoomColDef] : []),
    {
      field: 'chainName',
      tooltipField: 'chainName',
      headerName: 'Hotel chain',
      cellClass: 'no-border',
      width: 92
    },
    {
      field: 'concepts',
      headerName: 'Concept/label',
      cellClass: 'no-border',
      width: 106
    },
    {
      field: 'appliedRules',
      headerTooltip: 'Number of applied accommodation only rules',
      headerName: 'Price rules',
      width: 93,
      type: 'numericColumn',
      cellRenderer: RuleToolTipRenderer
    },
    {
      field: 'commitmentLevel',
      headerName: 'Committed',
      type: 'numericColumn',
      width: 90,
      cellRenderer: PercentageCellRenderer
    },
    {
      field: 'basicBoardCode',
      headerName: 'Board',
      cellClass: 'no-border',
      width: 64
    },
    {
      field: 'ancillaries',
      headerName: 'Contr. acc. ancillaries',
      cellRenderer: ToolTipRenderer,
      cellRendererParams: {
        displayValueGetter: params => params.data ?.ancillaries ?.length ?? 0,
        tooltipValueGetter: params => params.data ?.ancillaries ?.join('<br/>'),
        showTooltip: params => params.data ?.ancillaries ?.length > 0,
        displayAsAnchor: true
      },
      width: 110
    },
    {
      field: 'classification',
      headerTooltip: 'Classification',
      headerName: 'Classification',
      headerComponent: ClassificationsHeader,
      type: 'numericColumn',
      width: 32
    },
    {
      headerName: `Avg. Cost ${options.currency ? `(${options.currency})` : ''}`,
      width: 140,
      field: 'averageCost',
      cellClass: 'no-border',
      cellRenderer: MoneyCellRenderer,
      valueGetter: contextCurrencyValueGetter,
      type: 'numericColumn',
      comparator: MoneyComparator('averageCost', options.currency)
    },
    {
      field: 'rateType',
      headerName: 'Rate Type',
      cellClass: 'no-border',
      width: 84
    },
    {
      field: 'lastPublished',
      headerName: 'Last published',
      cellClass: 'no-border',
      cellRenderer: DateCellRenderer,
      cellRendererParams: {
        format: getDateFormat(3),
        useLocal: true
      },
      width: 110
    },
    {
      field: 'publishedBy',
      headerName: 'Published by',
      cellClass: 'no-border',
      width: 100
    }
  ];
};

export default getColumnDefinitions;
