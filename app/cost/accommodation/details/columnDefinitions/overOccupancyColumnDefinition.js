import moment from 'moment';
import { getDateFormat } from 'helpers/dateHelper';
import ToolTipRenderer from 'components/AgGrid/renderers/ToolTipRenderer';
import IconOrTextCellRenderer from 'components/AgGrid/renderers/IconOrTextCellRenderer';
import { BaseRoomComparator } from 'components/AgGrid/comparators';
import settings from '../../../../core/settings/settings';

export const getOverOccupancyCostColumnDefinitions = options => {
  const periodColumns = options.data
    .flatMap(d => d.costPeriod) // Get all costPeriods
    .filter((periodCost, idx, arr) => arr.findIndex(p => p.from === periodCost.from && p.to === periodCost.to) === idx) // Only unique
    .map(periodCost => {
      // to column defs
      const fromStr = moment(periodCost.from).format(getDateFormat());
      const toStr = moment(periodCost.to).format(getDateFormat());
      const {daysOfWeek,from, to}=periodCost;

      return {      
        headerName: `${fromStr} ${toStr}`,
        children: daysOfWeek.map((item) => ({
          headerName: item,
          field: `${from}-${to}-${item}`,
          width: 136,
          cellStyle: { textAlign: 'center'}  
        })),
      };
    });

  const baseRoomColDef = {
    field: 'baseRoom',
    headerName: 'Base room',
    width: 116,
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
  };

  return [
    { field: 'roomCode', headerName: 'Room code', width: 90 },
    { field: 'roomName', tooltipField: 'roomName', headerName: 'Room description', width: 150 },
    { field: 'basicBoard', headerName: 'Basic board', width: 110 },
    ...(settings.SHOW_BASEROOMS ? [baseRoomColDef] : []),
    { field: 'bedNumber', headerName: 'Bed no.', width: 70, type: 'numericColumn' },
    {
      field: 'costType',
      headerName: 'Type',
      width: 60,
      cellRenderer: ToolTipRenderer,
      cellRendererParams: {
        displayValueGetter: params => params.value.code,
        tooltipValueGetter: params => params.value.description
      }
    },
    ...periodColumns
  ];
};
