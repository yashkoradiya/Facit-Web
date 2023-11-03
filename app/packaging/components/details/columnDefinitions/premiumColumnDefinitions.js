import DateCellRenderer from 'components/AgGrid/renderers/DateCellRenderer';
import MoneyCellRenderer from 'components/AgGrid/renderers/MoneyCellRenderer';
import contextCurrencyValueGetter from 'components/AgGrid/renderers/contextCurrencyValueGetter';
import { MoneyComparator } from 'components/AgGrid/comparators';
export const premiumPriceColDefs = [
  {
    field: 'sourceMarketId',
    tooltipField: 'sourceMarketId',
    headerName: 'SM',
    width: 50,
    cellClass: 'no-border'
  },
  {
    headerName: 'Date',
    field: 'date',
    cellRendererFramework: DateCellRenderer,
    width: 91
  },
  {
    headerName: 'Day',
    field: 'weekday',
    width: 60
  },
  {
    headerName: 'Age Category',
    field: 'ageCategoryType',
    width: 105
  },
  {
    headerName: 'Time',
    field: 'ageCategoryType',
    width: 105
  },
  {
    headerName: 'Direction',
    field: 'ageCategoryType',
    width: 105
  },
  {
    headerName: 'total allotment',
    field: 'allotment',
    type: 'numericColumn',
    cellRendererFramework: MoneyCellRenderer,
    cellRendererParams: {
      noOfDecimals: 0
    },
    valueGetter: contextCurrencyValueGetter,
    width: 85,
    // comparator: MoneyComparator('calcPrice', options.currency)
  },
  {
    field: 'emptyLegFactor',
    headerName: 'Empty leg factor',
    type: 'numericColumn',
    width: 135
  },
  {
    headerName: 'Distr. cost',
    field: 'distributionCost',
    type: 'numericColumn',
    width: 91
  },
  {
    field: 'vat',
    headerName: 'VAT',
    type: 'numericColumn',
    width: 135
  },
  {
    field: 'tax',
    headerName: 'Tax',
    type: 'numericColumn',
    width: 135
  },
  {
    field: 'margin',
    headerName: 'Margin',
    type: 'numericColumn',
    width: 135
  },
  {
    field: 'price',
    headerName: 'Price',
    type: 'numericColumn',
    width: 135
  },
];

