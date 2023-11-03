import { MoneyComparator } from 'components/AgGrid/comparators';
import NumericCellEditor from 'components/AgGrid/editors/NumericCellEditor';
import contextCurrencyValueGetter from 'components/AgGrid/renderers/contextCurrencyValueGetter';
import currencyValueGetter from 'components/AgGrid/renderers/currencyValueGetter';
import DateCellRenderer from 'components/AgGrid/renderers/DateCellRenderer';
import MoneyCellRenderer from 'components/AgGrid/renderers/MoneyCellRenderer';
import PriceDetailToolTipRenderer from 'components/AgGrid/renderers/PriceDetailTooltipRenderer';
import SellingPriceCellRenderer, { getBackgroundColor } from 'components/AgGrid/renderers/SellingPriceCellRenderer';
import sellingPriceValueSetter from 'components/AgGrid/renderers/sellingPriceValueSetter';

export const getPriceDetailsColDefs = (options = {}) => {
  return [
    {
      field: 'sourceMarketName',
      tooltipField: 'sourceMarketName',
      headerName: 'SM',
      width: 50,
      cellClass: 'no-border'
    },
    {
      headerName: 'Date',
      field: 'date',
      cellRenderer: DateCellRenderer,
      width: 91
    },
    {
      headerName: 'Day',
      field: 'weekday',
      width: 60
    },
    {
      headerName: 'Accommodation',
      field: 'accommodationName',
      tooltipField: 'accommodationName',
      width: 130
    },
    {
      headerName: 'Room Code',
      field: 'roomType',
      width: 94
    },
    {
      headerName: 'Age Category',
      field: 'ageCategoryType',
      width: 105
    },
    {
      headerName: 'Departure Airport',
      field: 'departureAirport',
      width: 105
    },
    {
      headerName: 'Departure Time',
      field: 'departureTime',
      width: 105
    },
    {
      headerName: 'Return Time',
      field: 'returnTime',
      width: 105
    },
    {
      headerName: 'Flight Number',
      field: 'flightNumber',
      width: 105
    },
    {
      headerName: 'Selling price',
      field: 'sellingPrice',
      cellRenderer: SellingPriceCellRenderer,
      cellEditorFramework: NumericCellEditor,
      cellStyle: params => {
        if (!params.data) return null;

        const { calcPrice, sellingPrice, hasChanges, accommodationCost } = params.data;
        return {
          backgroundColor: getBackgroundColor(
            calcPrice.values[options.currency],
            sellingPrice.values[options.currency],
            hasChanges,
            accommodationCost.values[options.currency]
          )
        };
      },
      cellRendererParams: {
        noOfDecimals: 0,
        currency: options.currency
      },
      valueGetter: row => currencyValueGetter(row, options.currency, 'sellingPrice'),
      valueSetter: params => sellingPriceValueSetter(params, options),
      type: 'numericColumn',
      editable: !options.disableSellingPriceEdit,
      singleClickEdit: true,
      stopEditingWhenGridLosesFocus: true,
      width: 105,
      comparator: MoneyComparator('sellingPrice', options.currency)
    },
    {
      headerName: 'Calc. price',
      field: 'calcPrice',
      type: 'numericColumn',
      cellRenderer: MoneyCellRenderer,
      cellRendererParams: {
        noOfDecimals: 0
      },
      valueGetter: contextCurrencyValueGetter,
      width: 85,
      comparator: MoneyComparator('calcPrice', options.currency)
    },

    {
      headerName: 'Acc. cost',
      field: 'accommodationCost',
      type: 'numericColumn',
      width: 91,
      cellRenderer: PriceDetailToolTipRenderer,
      valueGetter: contextCurrencyValueGetter,
      cellRendererParams: {
        displayValueGetter: params => params.value,
        priceComponentTypes: ['cost', 'mandatory_supplement_cost', 'discount_adjustment'],
        forceKeepOpen: true,
        currency: options.currency
      },
      comparator: MoneyComparator('accommodationCost', options.currency)
    },
    {
      headerName: 'Misc. cost',
      field: 'totalMiscCost',
      type: 'numericColumn',
      width: 91,
      cellRenderer: PriceDetailToolTipRenderer,
      valueGetter: contextCurrencyValueGetter,
      cellRendererParams: {
        displayValueGetter: params => params.value,
        priceComponentTypes: ['miscellaneous_cost', 'guaranteefund_accom_misccostcomponent'],
        forceKeepOpen: true,
        currency: options.currency
      },
      comparator: MoneyComparator('totalMiscCost', options.currency)
    },
    {
      headerName: 'Distr. cost',
      field: 'distributionCost',
      type: 'numericColumn',
      width: 91,
      cellRenderer: PriceDetailToolTipRenderer,
      valueGetter: contextCurrencyValueGetter,
      cellRendererParams: {
        displayValueGetter: params => params.value,
        priceComponentTypes: ['distribution_cost'],
        forceKeepOpen: true,
        currency: options.currency
      },
      comparator: MoneyComparator('distributionCost', options.currency)
    },
    {
      headerName: 'VAT',
      field: 'vat',
      type: 'numericColumn',
      width: 50,
      cellRenderer: PriceDetailToolTipRenderer,
      valueGetter: contextCurrencyValueGetter,
      cellRendererParams: {
        displayValueGetter: params => params.value,
        priceComponentTypes: ['vat'],
        forceKeepOpen: true,
        currency: options.currency
      },
      comparator: MoneyComparator('vat', options.currency)
    },
    {
      headerName: 'Margin',
      field: 'totalMargin',
      type: 'numericColumn',
      width: 91,
      cellRenderer: PriceDetailToolTipRenderer,
      valueGetter: contextCurrencyValueGetter,
      cellRendererParams: {
        displayValueGetter: params => params.value,
        priceComponentTypes: [
          'package_margin',
          'component_margin',
          'mandatory_supplement_margin',
          'bulk_adjustment',
          'min_max'
        ],
        forceKeepOpen: true,
        currency: options.currency
      },
      comparator: MoneyComparator('totalMargin', options.currency)
    },
    {
      headerName: 'Upgr. margin',
      field: 'roomUpgrade',
      type: 'numericColumn',
      width: 120,
      cellRenderer: PriceDetailToolTipRenderer,
      valueGetter: contextCurrencyValueGetter,
      cellRendererParams: {
        displayValueGetter: params => params.value,
        priceComponentTypes: ['upgrade_margin'],
        forceKeepOpen: true,
        currency: options.currency
      },
      comparator: MoneyComparator('roomUpgrade', options.currency)
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
      headerName: 'Flight price',
      field: 'flightPrice',
      type: 'numericColumn',
      width: 105,
      valueGetter: contextCurrencyValueGetter,
      cellRendererParams: {
        displayValueGetter: params => params.value,
        priceComponentTypes: ['flightPrice'],
        forceKeepOpen: true,
        currency: options.currency
      },
      comparator: MoneyComparator('flightPrice', options.currency)
    },
    {
      headerName: 'Flight Calc. cost',
      field: 'calculatedCost',
      type: 'numericColumn',
      width: 91,
      valueGetter: contextCurrencyValueGetter,
      cellRendererParams: {
        displayValueGetter: params => params.value,
        forceKeepOpen: true,
        currency: options.currency
      },
      comparator: MoneyComparator('distributionCost', options.currency)
    },
    {
      headerName: 'Flight Distr. cost',
      field: 'flightDistributionCost',
      type: 'numericColumn',
      width: 91,
      cellRenderer: PriceDetailToolTipRenderer,
      valueGetter: row => currencyValueGetter(row, options.currency, 'flightDistributionCost'),
      cellRendererParams: {
        displayValueGetter: params => params.value,
        priceComponentTypes: ['charter_flight_distcostcomponent'],
        forceKeepOpen: true,
        currency: options.currency
      },
      comparator: MoneyComparator('distributionCost', options.currency)
    },
    {
      field: 'flightVat',
      headerName: 'Flight VAT',
      type: 'numericColumn',
      width: 135,
      cellRenderer: PriceDetailToolTipRenderer,
      valueGetter: row => currencyValueGetter(row, options.currency, 'flightVat'),
      cellRendererParams: {
        displayValueGetter: params => params.value,
        priceComponentTypes: ['charter_flight_vat'],
        forceKeepOpen: true,
        currency: options.currency
      },
      comparator: MoneyComparator('vat', options.currency)
    },
    {
      field: 'taxCost',
      headerName: 'Flight Tax',
      type: 'numericColumn',
      width: 135,
      valueGetter: contextCurrencyValueGetter,
      cellRendererParams: {
        displayValueGetter: params => params.value,
        forceKeepOpen: true,
        currency: options.currency
      },
      comparator: MoneyComparator('taxCost', options.currency)
    },
    {
      field: 'flightMargin',
      headerName: 'Flight Margin',
      type: 'numericColumn',
      width: 135,
      cellRenderer: PriceDetailToolTipRenderer,
      valueGetter: row => currencyValueGetter(row, options.currency, 'flightMargin'),
      cellRendererParams: {
        displayValueGetter: params => params.value,
        priceComponentTypes: ['flight_component_margin'],
        forceKeepOpen: true,
        currency: options.currency
      },
      comparator: MoneyComparator('margin', options.currency)
    },
    {
      field: 'guaranteeFundFlightCost',
      headerName: 'Flight Guarantee Fund',
      type: 'numericColumn',
      width: 130,
      cellRenderer: PriceDetailToolTipRenderer,
      valueGetter: row => currencyValueGetter(row, options.currency, 'guaranteeFundFlightCost'),
      cellRendererParams: {
        displayValueGetter: params => params.value,
        priceComponentTypes: ['guaranteefund_flight_misccostcomponent'],
        forceKeepOpen: true,
        currency: options.currency
      },
      comparator: MoneyComparator('guaranteeFundFlightCost', options.currency)
    },
    {
      field: 'fuelSurchargeCost',
      headerName: 'Flight Fuel Surcharge',
      type: 'numericColumn',
      width: 130,
      valueGetter: contextCurrencyValueGetter,
      cellRendererParams: {
        displayValueGetter: params => params.value,
        forceKeepOpen: true,
        currency: options.currency
      },
      comparator: MoneyComparator('fuelSurchargeCost', options.currency)
    }
  ];
};

export const getBoardUpgradePriceColDefs = () => [
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
    headerName: 'Board',
    field: 'board',
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
    field: 'boardUpgradeCost',
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
    headerName: 'Calc. price',
    field: 'calcPrice',
    width: 91,
    type: 'numericColumn',
    cellRenderer: MoneyCellRenderer,
    cellRendererParams: {
      noOfDecimals: 0
    },
    valueGetter: contextCurrencyValueGetter
  }
];
