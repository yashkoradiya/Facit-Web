import CharterFlightTooltipRenderer from 'components/AgGrid/renderers/CharterFlightTooltipRenderer';
import DateCellRenderer from 'components/AgGrid/renderers/DateCellRenderer';
import WarningCellRenderer from 'components/AgGrid/renderers/WarningCellRenderer';
import { getDateFormat } from 'helpers/dateHelper';
import ChangesHeader from 'components/AgGrid/ChangesHeader';
import WarningsHeader from 'components/AgGrid/WarningsHeader';

const getColumnDefinitions = () => {
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
      field: 'hasUnpublishedChanges',
      headerName: 'Unpublished Changes',
      width: 36,
      cellClass: 'no-border',
      headerComponent: ChangesHeader,
      cellRenderer: CharterFlightTooltipRenderer
    },
    {
      field: 'sourceId',
      headerName: 'Id',
      width: 116,
      cellClass: 'no-border'
    },
    {
      field: 'transportCode',
      headerName: 'Transport Code',
      width: 115,
      cellClass: 'no-border'
    },
    {
      field: 'sourceMarket',
      headerName: 'Source market',
      cellClass: 'no-border',
      width: 108
    },
    {
      field: 'productType',
      headerName: 'Product type',
      cellClass: 'no-border',
      width: 120
    },
    {
      field: 'departureAirport',
      tooltipField: 'deaprtureAirport',
      headerName: 'Dep.',
      headerTooltip: 'Departure airport',
      cellClass: 'no-border',
      width: 60
    },
    {
      field: 'arrivalAirport',
      tooltipField: 'arrivalAirport',
      headerName: 'Dest.',
      headerTooltip: 'Destination airport',
      cellClass: 'no-border',
      width: 60
    },
    {
      field: 'airline',
      tooltipField: 'airline',
      headerName: 'Airline',
      cellClass: 'no-border',
      width: 90
    },
    {
      field: 'seatClasses',
      tooltipField: 'seatClasses',
      headerName: 'Seat classes',
      cellClass: 'no-border',
      width: 100
    },
    {
      field: 'frequency',
      headerName: 'Frequency',
      type: 'numericColumn',
      width: 91
    },
    {
      field: 'firstOutboundDate',
      headerName: 'First out',
      type: 'numericColumn',
      cellRenderer: DateCellRenderer,
      width: 100
    },
    {
      field: 'lastHomeboundDate',
      headerName: 'Last home',
      type: 'numericColumn',
      cellRenderer: DateCellRenderer,
      width: 100
    },
    {
      field: 'weekday',
      headerName: 'Day',
      cellClass: 'no-border',
      width: 60
    },
    {
      field: 'flightNumber',
      headerName: 'Flight no.',
      cellClass: 'no-border',
      width: 80
    },
    {
      field: 'slot',
      headerName: 'Slot',
      type: 'numericColumn',
      width: 60
    },
    {
      field: 'season',
      headerName: 'Planning Period',
      cellClass: 'no-border',
      width: 130
    },
    {
      field: 'departureCount',
      headerName: 'RT',
      headerTooltip: 'Roundtrip',
      type: 'numericColumn',
      width: 50
    },
    {
      field: 'status',
      headerName: 'Status',
      cellClass: 'no-border',
      width: 80
    },
    {
      field: 'lastPublished',
      headerName: 'Last published',
      cellClass: 'no-border',
      width: 116,
      cellRenderer: DateCellRenderer,
      cellRendererParams: { format: getDateFormat(3), useLocal: true }
    },
    {
      field: 'publishedBy',
      headerName: 'Published by',
      cellClass: 'no-border',
      width: 116
    }
  ];
};

export default getColumnDefinitions;
