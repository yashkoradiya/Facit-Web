import React, { useState, useEffect } from 'react';
import PackagePriceDetails from '../../components/details/PackagePriceDetails';
import PriceDetailToolTipRenderer from 'components/AgGrid/renderers/PriceDetailTooltipRenderer';
import * as api from './api';
import MoneyCellRenderer from 'components/AgGrid/renderers/MoneyCellRenderer';
import currencyValueGetter from 'components/AgGrid/renderers/currencyValueGetter';
import contextCurrencyValueGetter from 'components/AgGrid/renderers/contextCurrencyValueGetter';
import DateCellRenderer from 'components/AgGrid/renderers/DateCellRenderer';
import SellingPriceCellRenderer, { getBackgroundColor } from 'components/AgGrid/renderers/SellingPriceCellRenderer';
import NumericCellEditor from 'components/AgGrid/editors/NumericCellEditor';
import { MoneyComparator } from 'components/AgGrid/comparators';
import sellingPriceValueSetter from 'components/AgGrid/renderers/sellingPriceValueSetter';

export default function AccommodationOnlyDetailedPricing() {
  const [changes, setChanges] = useState(false);

  useEffect(() => {
    if (changes == true) {
      window.addEventListener('beforeunload', handleUnload);
    }
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [changes]);

  const resetChanges = () => {
    setChanges(false);
  };

  return (
    <PackagePriceDetails
      titleText="Accommodation only details"
      gridKey={'accommodationOnlyDetailedPricing'}
      getPriceDetailsColDefs={options => getColumnDefinitions({ ...options, changes, setChanges })}
      getBoardUpgradePriceDetailsColDefs={options => getBoardUpgradePriceColDefs({ ...options, changes, setChanges })}
      onGetPrices={api.getPrices}
      packageType={'accommodation_only'}
      onSaveSellingPrice={api.saveSellingPrice}
      hasChanges={changes}
      onResetChanges={resetChanges}
    />
  );
}

const handleUnload = event => {
  const confirmationMessage = 'You have unsaved changes. Are you sure you want to leave this page?';
  event.returnValue = confirmationMessage;
  return confirmationMessage;
};

const getColumnDefinitions = (options = {}) => {
  return [
    {
      field: 'sourceMarketName',
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
      width: 120
    },
    {
      headerName: 'Selling price',
      field: 'sellingPrice',
      cellRendererFramework: SellingPriceCellRenderer,
      cellEditorFramework: NumericCellEditor,
      cellStyle: params => {
        if (!params.data) return;
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
      cellRendererFramework: MoneyCellRenderer,
      valueGetter: row => currencyValueGetter(row, options.currency, 'calcPrice'),
      cellRendererParams: {
        noOfDecimals: 0
      },
      type: 'numericColumn',
      width: 85,
      comparator: MoneyComparator('calcPrice', options.currency)
    },
    {
      headerName: 'Acc. cost',
      field: 'accommodationCost',
      type: 'numericColumn',
      width: 91,
      cellRendererFramework: PriceDetailToolTipRenderer,
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
      cellRendererFramework: PriceDetailToolTipRenderer,
      valueGetter: row => currencyValueGetter(row, options.currency, 'totalMiscCost'),
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
      cellRendererFramework: PriceDetailToolTipRenderer,
      valueGetter: row => currencyValueGetter(row, options.currency, 'distributionCost'),
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
      cellRendererFramework: PriceDetailToolTipRenderer,
      valueGetter: row => currencyValueGetter(row, options.currency, 'vat'),
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
      cellRendererFramework: PriceDetailToolTipRenderer,
      valueGetter: row => currencyValueGetter(row, options.currency, 'totalMargin'),
      cellRendererParams: {
        displayValueGetter: params => params.value,
        priceComponentTypes: ['package_margin', 'component_margin', 'bulk_adjustment', 'min_max'],
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
      cellRendererFramework: PriceDetailToolTipRenderer,
      valueGetter: row => currencyValueGetter(row, options.currency, 'roomUpgrade'),
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
      width: 120,
      cellRendererFramework: PriceDetailToolTipRenderer,
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
      headerName: 'Commission',
      field: 'commission',
      cellRendererFramework: MoneyCellRenderer,
      valueGetter: row => currencyValueGetter(row, options.currency, 'commission'),
      cellRendererParams: {
        noOfDecimals: 2
      },
      type: 'numericColumn',
      width: 100,
      comparator: MoneyComparator('commission', options.currency)
    }
  ];
};

const getBoardUpgradePriceColDefs = () => [
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
    cellRendererFramework: DateCellRenderer,
    width: 91
  },
  {
    headerName: 'To',
    field: 'to',
    cellRendererFramework: DateCellRenderer,
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
    cellRendererFramework: MoneyCellRenderer,
    valueGetter: contextCurrencyValueGetter
  },
  {
    headerName: 'Margin',
    field: 'margin',
    width: 91,
    type: 'numericColumn',
    cellRendererFramework: MoneyCellRenderer,
    valueGetter: contextCurrencyValueGetter
  },
  {
    headerName: 'Distr. cost',
    field: 'distributionCost',
    width: 91,
    type: 'numericColumn',
    cellRendererFramework: MoneyCellRenderer,
    valueGetter: contextCurrencyValueGetter
  },
  {
    headerName: 'VAT',
    field: 'vat',
    width: 91,
    type: 'numericColumn',
    cellRendererFramework: MoneyCellRenderer,
    valueGetter: contextCurrencyValueGetter
  },
  {
    headerName: 'Calc. price',
    field: 'calcPrice',
    width: 91,
    type: 'numericColumn',
    cellRendererFramework: MoneyCellRenderer,
    cellRendererParams: {
      noOfDecimals: 0
    },
    valueGetter: contextCurrencyValueGetter
  }
];
