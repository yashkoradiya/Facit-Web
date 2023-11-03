import { BaseRoomComparator } from 'components/AgGrid/comparators';
import IconOrTextCellRenderer from 'components/AgGrid/renderers/IconOrTextCellRenderer';
import settings from '../../../../core/settings/settings';

export const getOccupancyColumnDefinitions = () => {
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
    { field: 'basicBoard', headerName: 'Basic Board', width: 110 },
    ...(settings.SHOW_BASEROOMS ? [baseRoomColDef] : []),
    {
      field: 'min',
      headerName: 'Min',
      width: 70,
      type: 'numericColumn'
    },
    {
      field: 'nom',
      headerName: 'Nom',
      width: 70,
      type: 'numericColumn'
    },
    {
      field: 'max',
      headerName: 'Max',
      width: 70,
      type: 'numericColumn'
    },
    {
      field: 'minOverride',
      headerName: 'Min Ovr',
      width: 80,
      type: 'numericColumn'
    },
    {
      field: 'nomOverride',
      headerName: 'Nom Ovr',
      width: 80,
      type: 'numericColumn'
    },
    {
      field: 'maxOverride',
      headerName: 'Max Ovr',
      width: 80,
      type: 'numericColumn'
    },
    {
      field: 'fullFarePayingPax',
      headerName: 'Min FP',
      width: 86,
      type: 'numericColumn'
    },
    {
      field: 'minAdult',
      headerName: 'Min Adult',
      width: 86,
      type: 'numericColumn'
    },
    {
      field: 'maxAdult',
      headerName: 'Max Adult',
      width: 86,
      type: 'numericColumn'
    },
    {
      field: 'minChild',
      headerName: 'Min Child',
      width: 86,
      type: 'numericColumn'
    },
    {
      field: 'maxChild',
      headerName: 'Max Child',
      width: 86,
      type: 'numericColumn'
    },
    {
      field: 'infantRule',
      headerName: 'Infant rule',
      width: 101
    },
    {
      field: 'restrictions',
      headerName: 'Restrictions',
      width: 101
    }
  ];
};
