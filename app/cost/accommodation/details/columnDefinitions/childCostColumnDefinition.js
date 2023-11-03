import moment from 'moment';
import { getDateFormat } from 'helpers/dateHelper';
import ToolTipRenderer from 'components/AgGrid/renderers/ToolTipRenderer';

export const getChildCostColumnDefinitions = options => {
  const periodColumns = options.data
    .flatMap(d => d.costPeriod) // Get all costPeriods
    .filter((periodCost, idx, arr) => arr.findIndex(p => p.from === periodCost.from && p.to === periodCost.to) === idx) // Only unique
    .map(periodCost => {
      // to column defs
      const fromDateStr = moment(periodCost.from).format(getDateFormat());
      const toDateStr = moment(periodCost.to).format(getDateFormat());
      const {daysOfWeek,from, to}=periodCost;
    
      return {      
        headerName: `${fromDateStr} ${toDateStr}`,
        children: daysOfWeek.map((item) => ({
          headerName: item,
          field: `${from}-${to}-${item}`,
          width: 136,
          cellStyle: { textAlign: 'center'}  
        })),
      };
    });

  return [
    { field: 'roomCode', headerName: 'Room code', width: 90 },
    { field: 'roomName', tooltipField: 'roomName', headerName: 'Room description', width: 150 },
    { field: 'childNumber', headerName: 'Child no.', width: 80, type: 'numericColumn',cellStyle: { textAlign: 'center'}  },
    { field: 'bedNumber', headerName: 'Bed no.', width: 70, type: 'numericColumn',cellStyle: { textAlign: 'center'}  },
    { field: 'ageFrom', headerName: 'Age from', width: 80, type: 'numericColumn',cellStyle: { textAlign: 'center'}  },
    { field: 'ageTo', headerName: 'Age to', width: 70, type: 'numericColumn',cellStyle: { textAlign: 'center'}  },
    {
      field: 'costType',
      headerName: 'Type',
      width: 60,
      cellRenderer: ToolTipRenderer,
      cellRendererParams: {
        displayValueGetter: params => params.value.code,
        tooltipValueGetter: params => params.value.description
      },
      cellStyle: { textAlign: 'center'} 
    },
    ...periodColumns
  ];
};
