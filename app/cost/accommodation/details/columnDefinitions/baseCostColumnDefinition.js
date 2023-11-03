import moment from 'moment';
import { getDateFormat } from 'helpers/dateHelper';
import MoneyCellRenderer from 'components/AgGrid/renderers/MoneyCellRenderer';
import IconOrTextCellRenderer from 'components/AgGrid/renderers/IconOrTextCellRenderer';
import { BaseRoomComparator } from 'components/AgGrid/comparators';
import contextCurrencyValueGetter from '../../../../components/AgGrid/renderers/contextCurrencyValueGetter';
import settings from '../../../../core/settings/settings';

export const getBaseCostColumnDefinitions = options => {
  const periodColumns = options.costData
    .flatMap(d => d.costPeriod) // Get all costPeriods
    .filter((periodCost, idx, arr) => arr.findIndex(p => p.from === periodCost.from && p.to === periodCost.to) === idx) // Only unique
    .map(periodCost => {
      const fromStr = moment(periodCost.from).format(getDateFormat());
      const toStr = moment(periodCost.to).format(getDateFormat());
      const { daysOfWeek, from, to } = periodCost;

      return {
        headerName: `${fromStr} ${toStr}`,
        children: daysOfWeek.map(item => ({
          headerName: item,
          field: `${from}-${to}-${item}`,
          width: 137,
          cellStyle: { textAlign: 'center' }
        }))
      };
    });

  const baseRoomColDef = [
    {
      field: 'baseRoom',
      headerName: 'Selected base room',
      width: 136,
      cellClass: 'no-border',
      cellRenderer: IconOrTextCellRenderer,
      cellRendererParams: { iconSize: 16, altText: 'Is base room' },
      valueGetter: d => {
        if (!d.data) {
          return { text: '' };
        }
        if (d.data.isBaseRoom) {
          return { icon: 'base_room' };
        }
        return { text: d.data.baseRoom || '' };
      },
      comparator: BaseRoomComparator,
      cellStyle: { textAlign: 'center' }
    }
  ];

  return [
    { field: 'roomCode', headerName: 'Room code', width: 90 },
    { field: 'roomName', tooltipField: 'roomName', headerName: 'Room description', width: 150 },
    { field: 'basicBoard', headerName: 'Basic Board', width: 110 },
    ...(settings.SHOW_BASEROOMS ? baseRoomColDef : []),
    { field: 'unit', headerName: 'Unit', width: 52 },
    {
      field: 'totalCost',
      headerName: 'Room contract value',
      cellRenderer: MoneyCellRenderer,
      valueGetter: contextCurrencyValueGetter,
      width: 160,
      type: 'numericColumn'
    },
    ...periodColumns
  ];
};
