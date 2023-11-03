import { formatMoney } from '../../../helpers/numberHelper';
import MoneyCellRenderer from '../../../components/AgGrid/renderers/MoneyCellRenderer';
import DateCellRenderer from '../../../components/AgGrid/renderers/DateCellRenderer';
import contextCurrencyValueGetter from '../../../components/AgGrid/renderers/contextCurrencyValueGetter';

export const getColumnDefinitions = (options = {}) => {
  const seatClassGroups = options.seatClasses.flatMap((sc, index) => {
    return {
      headerName: sc.name,
      headerClass: `ag-header-group ag-header-color--${index}`,
      children: [
        {
          colId: `${sc.id}_allotment`,
          field: `${sc.id}_allotment`,
          headerName: 'Allotment',
          type: 'numericColumn',
          headerClass: `ag-header-color--${index}`,
          width: 85
        },

        {
          colId: `${sc.id}_calculatedCost`,
          field: `${sc.id}_calculatedCost`,
          headerName: 'Calc. cost',
          cellRendererFramework: MoneyCellRenderer,
          valueGetter: contextCurrencyValueGetter,
          type: 'numericColumn',
          headerClass: `ag-header-color--${index}`,
          width: 85
        },

        {
          colId: `${sc.id}_distributionCost`,
          field: `${sc.id}_distributionCost`,
          headerName: 'Distribution Cost',
          cellRendererFramework: MoneyCellRenderer,
          valueGetter: contextCurrencyValueGetter,
          type: 'numericColumn',
          headerClass: `ag-header-color--${index}`,
          width: 122
        },
        {
          colId: `${sc.id}_vat`,
          field: `${sc.id}_vat`,
          headerName: 'VAT',
          cellRendererFramework: MoneyCellRenderer,
          valueGetter: contextCurrencyValueGetter,
          type: 'numericColumn',
          headerClass: `ag-header-color--${index}`,
          width: 50
        },

        {
          colId: `${sc.id}_taxCost`,
          field: `${sc.id}_taxCost`,
          headerName: 'Tax',
          cellRendererFramework: MoneyCellRenderer,
          valueGetter: contextCurrencyValueGetter,
          type: 'numericColumn',
          headerClass: `ag-header-color--${index}`,
          width: 50
        },

        {
          colId: `${sc.id}_margin`,
          field: `${sc.id}_margin`,
          headerName: 'Margin',
          cellRendererFramework: MoneyCellRenderer,
          valueGetter: contextCurrencyValueGetter,
          type: 'numericColumn',
          headerClass: `ag-header-color--${index}`,
          width: 69
        },

        {
          colId: `${sc.id}_totalPrice`,
          field: `${sc.id}_totalPrice`,
          headerName: 'Price',
          cellRendererFramework: MoneyCellRenderer,
          valueGetter: contextCurrencyValueGetter,
          type: 'numericColumn',
          headerClass: `ag-header-color--${index}`,
          width: 58
        }
      ]
    };
  });

  return [
    {
      field: 'departureDate',
      headerName: 'Date',
      cellRendererFramework: DateCellRenderer,
      cellRendererParams: {
        utcOffset: 0
      },
      width: 100
    },
    {
      field: 'departureDate',
      headerName: 'Time (UTC)',
      cellRendererFramework: DateCellRenderer,
      cellRendererParams: {
        format: 'HH:mm',
        useLocal: true
      },
      width: 90
    },
    {
      field: 'direction',
      headerName: 'Direction',
      width: 60
    },
    {
      field: 'totalAllotment',
      headerName: 'Tot. Allot.',
      type: 'numericColumn',
      width: 90
    },
    {
      field: 'emptyLegFactor',
      headerName: 'Empty leg factor',
      type: 'numericColumn',
      width: 135
    },
    ...seatClassGroups
  ];
};

export const getFooterColumnDefinitions = (options = {}) => {
  const seatClassGroups = options.seatClasses.flatMap(sc => ({
    headerName: sc.name,
    children: [
      {
        field: `${sc.id}_allotment`,
        width: 100
      },
      {
        field: `${sc.id}_contractCost`,
        width: 80,
        valueGetter: cell => {
          if (!cell.data) {
            return null;
          }

          return formatMoney(cell.data[cell.colDef.field], '', null, 0, { thousand: ' ' });
        },
        cellStyle: { overflow: 'visible' },
        type: 'numericColumn'
      },
      {
        field: `${sc.id}_calculatedCost`,
        width: 100
      },

      {
        field: `${sc.id}_vat`,
        width: 100
      },
      {
        field: `${sc.id}_taxCost`,
        width: 100
      },
      {
        field: `${sc.id}_distributionCost`,
        width: 185
      },

      {
        field: `${sc.id}_margin`,
        width: 100
      },
      {
        field: `${sc.id}_totalPrice`,
        width: 100
      }
    ]
  }));

  return [
    {
      field: 'departureDate',
      width: 100,
      cellStyle: { overflow: 'visible' }
    },
    {
      field: 'direction',
      width: 60
    },
    {
      field: 'totalAllotment',
      width: 98
    },
    {
      field: 'emptyLegFactor',
      width: 135
    },
    ...seatClassGroups
  ];
};