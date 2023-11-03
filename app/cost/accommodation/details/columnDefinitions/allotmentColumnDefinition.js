import moment from 'moment';
import { getDateFormat } from 'helpers/dateHelper';

export const getAllotmentColumnDefinitions = options => {
  if (!options.data) return [];

  const periodColumns = options.data
    .flatMap(d => d.allotmentPeriods)
    .filter((period, idx, arr) => arr.findIndex(p => p.from === period.from && p.to === period.to) === idx) // Only unique
    .map(period => {
      const from = moment(period.from).format(getDateFormat());
      const to = moment(period.to).format(getDateFormat());
      const key = `${from}_${to}`;

      return {
        field: key,
        headerName: `${from} ${to}`,
        type: 'numericColumn',
        width: 94
      };
    });

  return [
    { field: 'roomCode', headerName: 'Room code', width: 90 },
    { field: 'roomName', tooltipField: 'roomName', headerName: 'Room description', width: 150 },
    ...periodColumns
  ];
};
