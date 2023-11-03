import DateCellRenderer from 'components/AgGrid/renderers/DateCellRenderer';
import MoneyCellRenderer from 'components/AgGrid/renderers/MoneyCellRenderer';
import contextCurrencyValueGetter from 'components/AgGrid/renderers/contextCurrencyValueGetter';
import PriceDetailToolTipRenderer from 'components/AgGrid/renderers/PriceDetailTooltipRenderer';
import currencyValueGetter from 'components/AgGrid/renderers/currencyValueGetter';
import { MoneyComparator } from 'components/AgGrid/comparators';

export const underOccupancyPriceColDefs = options =>  [
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
    headerName: 'Bed no.',
    field: 'bedNumber',
    width: 90,
    type: 'numericColumn'
  },
  {
    headerName: 'Base cost std bed',
    field: 'baseCost',
    width: 130,
    type: 'numericColumn',
    cellRenderer: PriceDetailToolTipRenderer,
    valueGetter: row => currencyValueGetter(row, options.currency, 'baseCost'),
    cellRendererParams: {
      displayValueGetter: params => params.value,
      priceComponentTypes: ['discount_adjustment_for_standard_bed_cost','standard_bed_cost'],
      forceKeepOpen: true,
      currency: options.currency
    },
    comparator: MoneyComparator('baseCost', options.currency)
  },
  {
    headerName: 'Cost for under occ',
    field: 'underOccupancyCost',
    width: 130,
    type: 'numericColumn',
    cellRenderer: PriceDetailToolTipRenderer,
    valueGetter: row => currencyValueGetter(row, options.currency, 'underOccupancyCost'),
    cellRendererParams: {
      displayValueGetter: params => params.value,
      priceComponentTypes: ['discount_adjustment','under_occupancy_cost'],
      forceKeepOpen: true,
      currency: options.currency
    },
    comparator: MoneyComparator('underOccupancyCost', options.currency)
  },
  {
    headerName: 'Discount',
    field: 'discount',
    type: 'numericColumn',
    width: 80,
    cellRenderer: PriceDetailToolTipRenderer,
    valueGetter: row => currencyValueGetter(row, options.currency, 'discount'),
    cellRendererParams: {
      displayValueGetter: params => params.value,
      priceComponentTypes: ['discount_adjustment'],
      forceKeepOpen: true,
      currency: options.currency
    },
    comparator: MoneyComparator('discount', options.currency)
  },
  {
    headerName: 'Supplement',
    field: 'supplement',
    width: 120,
    type: 'numericColumn',
    cellRenderer: PriceDetailToolTipRenderer,
    valueGetter: row => currencyValueGetter(row, options.currency, 'supplement'),
    cellRendererParams: {
      displayValueGetter: params => params.value,
      priceComponentTypes: ['mandatory_supplement_cost'],
      forceKeepOpen: true,
      currency: options.currency
    },
    comparator: MoneyComparator('supplement', options.currency)
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
    width: 50,
    type: 'numericColumn',
    cellRenderer: MoneyCellRenderer,
    valueGetter: contextCurrencyValueGetter
  },
  {
    headerName: 'Under Occ. Price',
    field: 'price',
    width: 91,
    type: 'numericColumn',
    cellRenderer: MoneyCellRenderer,
    cellRendererParams: {
      noOfDecimals: 0
    },
    valueGetter: contextCurrencyValueGetter
  },
  {
    headerName: 'Selling Price',
    field: 'totalPrice',
    width: 91,
    type: 'numericColumn',
    cellRenderer: MoneyCellRenderer,
    cellRendererParams: {
      noOfDecimals: 0
    },
    valueGetter: contextCurrencyValueGetter
  },
  {
    headerName: 'Standard Price',
    field: 'standardPrice',
    width: 91,
    type: 'numericColumn',
    cellRenderer: MoneyCellRenderer,
    cellRendererParams: {
      noOfDecimals: 0
    },
    valueGetter: contextCurrencyValueGetter
  }
];
