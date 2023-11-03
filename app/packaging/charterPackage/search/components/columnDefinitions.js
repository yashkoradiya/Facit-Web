import WarningCellRenderer from 'components/AgGrid/renderers/WarningCellRenderer';
import RuleToolTipRenderer from 'components/AgGrid/renderers/RuleToolTipRenderer';
import ToolTipRenderer from 'components/AgGrid/renderers/ToolTipRenderer';
import ClassificationsHeader from 'components/AgGrid/ClassificationsHeader';
import { MoneyComparator } from 'components/AgGrid/comparators';
import MoneyCellRenderer from 'components/AgGrid/renderers/MoneyCellRenderer';
import PercentageCellRenderer from 'components/AgGrid/renderers/PercentageCellRenderer';
import DateCellRenderer from 'components/AgGrid/renderers/DateCellRenderer';
import contextCurrencyValueGetter from 'components/AgGrid/renderers/contextCurrencyValueGetter';
import getPropertyValue from 'components/AgGrid/renderers/getPropertyValue';
import { getDateFormat } from '../../../../helpers/dateHelper';
import settings from '../../../../core/settings/settings';
import ChangesCellRenderer from 'components/AgGrid/renderers/ChangesCellRenderer';
import ChangesHeader from 'components/AgGrid/ChangesHeader';
import WarningsHeader from 'components/AgGrid/WarningsHeader';
import { sortKeyDurations } from 'packaging/packaging-utils';

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
        const charterPackageObj = changes.find(x => x.offeringType === 'charter-package');
        if (charterPackageObj && charterPackageObj.changes.length) {
          return charterPackageObj.changes;
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
      field: 'productType',
      headerName: 'Product Type',
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
      width: 91,
      tooltipValueGetter: d => {
        return d.data && d.data.resort ? d.data.resort : null;
      }
    },
    {
      headerName: 'Acc. name',
      field: 'accommodationName',
      tooltipField: 'accommodationName',
      cellClass: 'no-border',
      width: 90,
      tooltipValueGetter: d => {
        return d.data ? getPropertyValue(d.data, 'accommodationName') : null;
      }
    },
    {
      field: 'keyAccom',
      headerName: 'Key Accom',
      cellClass: 'no-border',
      width: 90
    },
    {
      headerName: 'Key Duration',
      cellClass: 'no-border',
      width: 90,
      valueGetter: cell => cell.data && sortKeyDurations(cell.data.keyDuration)
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
      field: 'season',
      headerName: 'Planning Period',
      cellClass: 'no-border',
      width: 130
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
      tooltipField: 'concepts',
      headerName: 'Concept/label',
      cellClass: 'no-border',
      width: 106
    },
    {
      field: 'appliedRules',
      headerTooltip: 'Number of applied charter package rules',
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
        displayValueGetter: params => params.data?.ancillaries?.length ?? 0,
        tooltipValueGetter: params => params.data?.ancillaries?.join('<br/>'),
        showTooltip: params => params.data?.ancillaries?.length > 0,
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
      headerName: `Avg. margin ${options.currency ? `(${options.currency})` : ''}`,
      width: 150,
      field: 'averageMargin',
      cellClass: 'no-border',
      cellRenderer: MoneyCellRenderer,
      valueGetter: contextCurrencyValueGetter,
      type: 'numericColumn',
      comparator: MoneyComparator('averageMargin', options.currency)
    },
    {
      headerName: `Avg. price ${options.currency ? `(${options.currency})` : ''}`,
      width: 140,
      field: 'averagePrice',
      cellClass: 'no-border',
      cellRenderer: MoneyCellRenderer,
      valueGetter: contextCurrencyValueGetter,
      type: 'numericColumn',
      comparator: MoneyComparator('averagePrice', options.currency)
    },
    {
      field: 'contractLevel',
      headerName: 'Contract level',
      cellClass: 'no-border',
      width: 110
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
