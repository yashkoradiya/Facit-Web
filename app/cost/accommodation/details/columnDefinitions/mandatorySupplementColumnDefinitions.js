import moment from 'moment';
import { getDateFormat } from 'helpers/dateHelper';
import MoneyCellRenderer from 'components/AgGrid/renderers/MoneyCellRenderer';

export const getMandatorySupplementCostColumnDefinitions = options => {
  const periodColumns = options.data
    .flatMap(d => d.costPeriods) // Get all costPeriods
    .filter((periodCost, idx, arr) => arr.findIndex(p => p.from === periodCost.from && p.to === periodCost.to) === idx) // Only unique
    .map(periodCost => {
      // to column defs
      const from = moment(periodCost.from).format(getDateFormat());
      const to = moment(periodCost.to).format(getDateFormat());
      const key = `${from}_${to}`;

      return {
        field: key,
        headerName: `${from} ${to}`,
        type: 'numericColumn',
        width: 94,
        cellRenderer: MoneyCellRenderer
      };
    });

  return [
    { field: 'roomCode', headerName: 'Room code', width: 90 },
    { field: 'roomName', tooltipField: 'roomName', headerName: 'Room description', width: 150 },
    { field: 'childNumber', headerName: 'Child no.', width: 60, type: 'numericColumn' },
    { field: 'bedNumber', headerName: 'Bed no.', width: 60, type: 'numericColumn' },
    { field: 'ageFrom', headerName: 'Age from', width: 60, type: 'numericColumn' },
    { field: 'ageTo', headerName: 'Age to', width: 60, type: 'numericColumn' },
    { field: 'description', tooltipField: 'description', headerName: 'Supplement description', width: 150 },
    { field: 'valueType', headerName: 'Value Type', width: 90 },
    {field: 'applicability', headerName: 'Applicability', width: 100 },
    ...periodColumns
  ];
};
