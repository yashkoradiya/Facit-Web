import DateCellRenderer from 'components/AgGrid/renderers/DateCellRenderer';
import MoneyCellRenderer from 'components/AgGrid/renderers/MoneyCellRenderer';

export const getDiscountColumnDefinitions = () => {
  return [
    { field: 'roomCode', headerName: 'Room Code', width: 120 },
    { field: 'description', headerName: 'Description', width: 90 },
    { field: 'arrivalFrom', headerName: 'Arrival from', width: 130, cellRenderer: DateCellRenderer },
    { field: 'arrivalTo', headerName: 'Arrival to', width: 130, cellRenderer: DateCellRenderer },
    { field: 'repeatable', headerName: 'Repeatable', width: 100 },
    { field: 'prolongable', headerName: 'Prolongable', width: 100 },
    { field: 'applyMethod', headerName: 'Apply Method', width: 130 },
    { field: 'offerMethod', headerName: 'Free Night Combinable', width: 130 },
    { field: 'sourceMarketIds', headerName: 'Source Market', width: 130 },
    { field: 'arrivalDays', headerName: 'Arrival Days', width: 100 },
    { field: 'stayDays', headerName: 'Stay Days', width: 100 },
    { field: 'contractedSource', headerName: 'Contracted Source', width: 130 },
    {
      field: 'bookingFrom',
      headerName: 'Booking from',
      width: 110,
      cellRenderer: DateCellRenderer,
      headerClass: `ag-header-color--1`
    },
    {
      field: 'bookingTo',
      headerName: 'Booking to',
      width: 110,
      cellRenderer: DateCellRenderer,
      headerClass: `ag-header-color--1`
    },
    {
      field: 'bookFromDay',
      headerName: 'Book From Days',
      type: 'numericColumn',
      width: 110,
      headerClass: `ag-header-color--1 ag-numeric-header`
    },
    {
      field: 'bookToDay',
      headerName: 'Book To Days',
      type: 'numericColumn',
      width: 110,
      headerClass: `ag-header-color--1 ag-numeric-header`
    },
    {
      field: 'passengerType',
      headerName: 'Passenger Type',
      width: 120
    },
    { field: 'ageFrom', headerName: 'Age from', type: 'numericColumn', width: 110 },
    { field: 'ageTo', headerName: 'Age to', type: 'numericColumn', width: 110 },
    {
      field: 'minStay',
      headerName: 'Min night',
      type: 'numericColumn',
      width: 110,
      headerClass: `ag-header-color--1 ag-numeric-header`
    },
    {
      field: 'maxStay',
      headerName: 'Max night',
      type: 'numericColumn',
      width: 110,
      headerClass: `ag-header-color--1 ag-numeric-header`
    },
    {
      field: 'noOfFreeNights',
      headerName: 'Night free',
      type: 'numericColumn',
      width: 110,
      headerClass: `ag-header-color--1 ag-numeric-header`
    },
    { field: 'valueType', headerName: 'Type', width: 110 },
    {
      field: 'value',
      headerName: 'Value',
      width: 110,
      type: 'numericColumn',
      cellRenderer: MoneyCellRenderer
    },
    { field: 'rateType', headerName: 'Unit', width: 110 },
    {
      field: 'defaultBoard',
      headerName: 'Book x board',
      width: 110,
      headerClass: `ag-header-color--1`
    },
    {
      field: 'overrideBoard',
      headerName: 'Pay x board',
      width: 110,
      headerClass: `ag-header-color--1`
    },
    {
      field: 'stayCondition',
      headerName: 'Stay Condition',
      width: 110
    },
    {
      field: 'stayApplicability',
      headerName: 'Stay Applicability',
      width: 110
    },
    {
      field: 'applicableToNamedDayOfStay',
      headerName: 'Type of free night',
      width: 110
    }
  ];
};
