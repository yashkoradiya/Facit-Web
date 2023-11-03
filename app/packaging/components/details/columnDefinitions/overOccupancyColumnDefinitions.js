import DateCellRenderer from 'components/AgGrid/renderers/DateCellRenderer';
import MoneyCellRenderer from 'components/AgGrid/renderers/MoneyCellRenderer';
import contextCurrencyValueGetter from 'components/AgGrid/renderers/contextCurrencyValueGetter';
import PriceDetailToolTipRenderer from './../../../../components/AgGrid/renderers/PriceDetailTooltipRenderer';
import { MoneyComparator } from 'components/AgGrid/comparators';
import currencyValueGetter from 'components/AgGrid/renderers/currencyValueGetter';

export const overOccupancyPriceColDefs = currency => [
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
    headerName: 'Base cost std bed',
    field: 'roomCost',
    width: 110,
    type: 'numericColumn',
    cellRenderer: PriceDetailToolTipRenderer,
    valueGetter: row => currencyValueGetter(row, currency, 'roomCost'),
    cellRendererParams: {
      displayValueGetter: params => params.value,
      priceComponentTypes: ['discount_adjustment_for_standard_bed_cost','standard_bed_cost'],
      forceKeepOpen: true,
      currency: currency
    },
    comparator: MoneyComparator('roomCost', currency)
  },
  {
    headerName: 'Age from',
    field: 'ageFrom',
    width: 100,
    type: 'numericColumn'
  },
  {
    headerName: 'Age to',
    field: 'ageTo',
    width: 75,
    type: 'numericColumn'
  },
  {
    headerName: 'Bed no.',
    field: 'bedNumber',
    width: 90,
    type: 'numericColumn'
  },
  {
    headerName: 'Cost for Over Occ',
    field: 'overOccupancyCost',
    width: 91,
    type: 'numericColumn',
    valueGetter: (cell, colDef) => {
      const res = contextCurrencyValueGetter(cell, colDef);
      if (typeof res === 'number') {
        return Math.ceil(res * 100) / 100;
      }
      return res;
    },
    cellRenderer: PriceDetailToolTipRenderer,
    cellRendererParams: {
      displayValueGetter: params => params.value,
      priceComponentTypes: ['discount_adjustment','over_occupancy_cost', 'mandatory_supplement_cost'],
      forceKeepOpen: true,
      currency: currency
    },
    comparator: MoneyComparator('overOccupancyCost', currency)
  },
  
  {
    headerName: 'Discount',
    field: 'discount',
    width: 80,
    type: 'numericColumn',
    valueGetter: row => currencyValueGetter(row, currency, 'discount'),
    cellRenderer: PriceDetailToolTipRenderer,
    cellRendererParams: {
      displayValueGetter: params => params.value,
      priceComponentTypes: ['discount_adjustment'],
      forceKeepOpen: true,
      currency: currency
    },
    comparator: MoneyComparator('discounts', currency)
  },
  {
    headerName: 'Difference',
    field: 'difference',
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
    width: 50,
    type: 'numericColumn',
    cellRenderer: MoneyCellRenderer,
    valueGetter: contextCurrencyValueGetter
  },
  {
    headerName: 'Reduction',
    field: 'reduction',
    width: 91,
    type: 'numericColumn',
    cellRenderer: MoneyCellRenderer,
    valueGetter: contextCurrencyValueGetter
  },
  {
    headerName: 'Selling Price',
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
