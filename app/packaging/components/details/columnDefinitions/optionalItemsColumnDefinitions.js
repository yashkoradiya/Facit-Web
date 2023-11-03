import DateCellRenderer from 'components/AgGrid/renderers/DateCellRenderer';
import MoneyCellRenderer from 'components/AgGrid/renderers/MoneyCellRenderer';
import contextCurrencyValueGetter from 'components/AgGrid/renderers/contextCurrencyValueGetter';

export const optionalItemsPriceColDefs = [
  {
    headerName: 'SM',
    field: 'sourceMarketName',
    width: 50
  },
  {
    headerName: 'Accommodation',
    field: 'accommodationName',
    tooltipField: 'accommodationName',
    width: 130
  },
  {
    headerName: 'Room code',
    field: 'roomCode',
    width: 91
  },
  {
    headerName: 'Room description',
    field: 'roomDescription',
    tooltipField: 'roomDescription',
    width: 130
  },
  {
    headerName: 'Contracted acc. ancillary',
    field: 'name',
    width: 91
  },
  {
    headerName: 'From',
    field: 'from',
    cellRenderer: DateCellRenderer,
    width: 91
  },
  {
    headerName: 'To',
    field: 'to',
    cellRenderer: DateCellRenderer,
    width: 91
  },
  {
    headerName: 'Rate',
    field: 'rate',
    width: 60
  },
  {
    headerName: 'Age from',
    field: 'ageFrom',
    width: 80,
    type: 'numericColumn'
  },
  {
    headerName: 'Age to',
    field: 'ageTo',
    width: 75,
    type: 'numericColumn'
  },
  {
    headerName: 'Child no.',
    field: 'childNumber',
    width: 90,
    type: 'numericColumn'
  },
  {
    headerName: 'Bed no.',
    field: 'bedNumber',
    width: 90,
    type: 'numericColumn'
  },
  {
    headerName: 'Cost',
    field: 'ancillaryCost',
    width: 91,
    type: 'numericColumn',
    cellRenderer: MoneyCellRenderer,
    valueGetter: contextCurrencyValueGetter
  },
  {
    headerName: 'Margin',
    field: 'margin',
    width: 91,
    type: 'numericColumn',
    cellRenderer: MoneyCellRenderer,
    valueGetter: contextCurrencyValueGetter
  },
  {
    headerName: 'Distr. cost',
    field: 'distributionCost',
    width: 91,
    type: 'numericColumn',
    cellRenderer: MoneyCellRenderer,
    valueGetter: contextCurrencyValueGetter
  },
  {
    headerName: 'VAT',
    field: 'vat',
    width: 91,
    type: 'numericColumn',
    cellRenderer: MoneyCellRenderer,
    valueGetter: contextCurrencyValueGetter
  },
  {
    headerName: 'Price',
    field: 'price',
    width: 91,
    type: 'numericColumn',
    cellRenderer: MoneyCellRenderer,
    cellRendererParams: {
      noOfDecimals: 0
    },
    valueGetter: contextCurrencyValueGetter
  }
];
