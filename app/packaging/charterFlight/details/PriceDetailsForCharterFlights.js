import React, { useState, useEffect } from 'react';
import DateCellRenderer from 'components/AgGrid/renderers/DateCellRenderer';
import contextCurrencyValueGetter from 'components/AgGrid/renderers/contextCurrencyValueGetter';
import currencyValueGetter from 'components/AgGrid/renderers/currencyValueGetter';
import { MoneyComparator } from 'components/AgGrid/comparators';
import * as api from './api';
import PriceDetailToolTipRenderer from 'components/AgGrid/renderers/PriceDetailTooltipRenderer';
import CharterFlightPriceDetailsForSimulation from '../../components/details/CharterFlightPriceDetailsForSimulation';
export default function PriceDetailsForCharterFlights() {
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
    <CharterFlightPriceDetailsForSimulation
      titleText="Flight For Package details"
      gridKey={'CharterFlightDetailedPricing'}
      onFlightPriceDetails={api.getFlightPrices}
      getPriceDetailsColDefs={options => getColumnDefinitions({ ...options, changes, setChanges })}
      packageType={'charterflight_pricedetails'}
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
export const getColumnDefinitions = (options = {}) => {
  return [
    {
      field: 'sourceMarketName',
      tooltipField: 'sourceMarketName',
      headerName: 'SM',
      width: 50
    },
    {
      field: 'productType',
      headerName: 'Product type',
      width: 120,
      valueGetter: srcData => (srcData.data ? srcData.data.productType : null)
    },
    {
      field: 'seatClassName',
      headerName: 'Seat Class',
      width: 50,
      valueGetter: d => {
        if (!d.data) {
          return null;
        }
        if (d.data.seatClassName === 'economy') {
          return 'EC';
        } else if (d.data.seatClassName === 'comfort') {
          return 'CO';
        } else {
          return 'PR';
        }
      }
    },
    {
      field: 'date',
      headerName: 'Date',
      cellRenderer: DateCellRenderer,
      cellRendererParams: {
        utcOffset: 0
      },
      width: 100
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
      field: 'date',
      headerName: 'Time (UTC)',
      cellRenderer: DateCellRenderer,
      cellRendererParams: {
        format: 'HH:mm',
        useLocal: true
      },
      width: 90
    },
    {
      headerName: 'Direction',
      field: 'direction',
      width: 105
    },
    {
      headerName: 'Total allotment',
      field: 'allotment',
      type: 'numericColumn',
      width: 85
    },
    {
      field: 'emptyLegFactor',
      headerName: 'Empty leg factor',
      type: 'numericColumn',
      width: 135
    },
    {
      headerName: 'Calc. cost',
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
      headerName: 'Distr. cost',
      field: 'distributionCost',
      type: 'numericColumn',
      width: 91,
      cellRenderer: PriceDetailToolTipRenderer,
      valueGetter: row => currencyValueGetter(row, options.currency, 'distributionCost'),
      cellRendererParams: {
        displayValueGetter: params => params.value,
        priceComponentTypes: ['charter_flight_distcostcomponent'],
        forceKeepOpen: true,
        currency: options.currency
      },
      comparator: MoneyComparator('distributionCost', options.currency)
    },
    {
      field: 'vat',
      headerName: 'VAT',
      type: 'numericColumn',
      width: 135,
      cellRenderer: PriceDetailToolTipRenderer,
      valueGetter: row => currencyValueGetter(row, options.currency, 'vat'),
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
      headerName: 'Tax',
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
      field: 'margin',
      headerName: 'Margin',
      type: 'numericColumn',
      width: 135,
      cellRenderer: PriceDetailToolTipRenderer,
      valueGetter: row => currencyValueGetter(row, options.currency, 'margin'),
      cellRendererParams: {
        displayValueGetter: params => params.value,
        priceComponentTypes: ['component_margin'],
        forceKeepOpen: true,
        currency: options.currency
      },
      comparator: MoneyComparator('margin', options.currency)
    },
    {
      field: 'guaranteeFundFlightCost',
      headerName: 'Guarantee Fund',
      type: 'numericColumn',
      width: 130,
      valueGetter: contextCurrencyValueGetter,
      cellRendererParams: {
        displayValueGetter: params => params.value,
        forceKeepOpen: true,
        currency: options.currency
      },
      comparator: MoneyComparator('margin', options.currency)
    },
    {
      field: 'fuelSurchargeCost',
      headerName: 'Fuel surcharge',
      type: 'numericColumn',
      width: 130,
      valueGetter: contextCurrencyValueGetter,
      cellRendererParams: {
        displayValueGetter: params => params.value,
        forceKeepOpen: true,
        currency: options.currency
      },
      comparator: MoneyComparator('fuelSurchargeCost', options.currency)
    },
    {
      field: 'totalPrice',
      headerName: 'Price',
      type: 'numericColumn',
      width: 135,
      valueGetter: contextCurrencyValueGetter,
      cellRendererParams: {
        displayValueGetter: params => params.value,
        forceKeepOpen: true,
        currency: options.currency
      },
      comparator: MoneyComparator('price', options.currency)
    }
  ];
};
