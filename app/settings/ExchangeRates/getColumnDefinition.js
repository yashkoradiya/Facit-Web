import { getNumber } from 'helpers/numberHelper';

export const getColumnDefinition = (editable, baseCurrency) => {
  return [
    {
      field: 'currency',
      headerName: 'Currency',
      width: 80
    },
    { field: 'name', headerName: 'Name', width: 230 },
    {
      field: 'sourceMarkets',
      headerName: 'Source market',
      width: 200,
      hide: editable,
      valueGetter: d => {
        if (!d.data || !d.data.sourceMarkets) {
          return null;
        }
        return d.data.sourceMarkets
          .map(sm => sm.name)
          .sort()
          .join(', ');
      }
    },
    {
      field: 'rate',
      headerName: baseCurrency ? `Rate in ${baseCurrency}` : 'Rate unknown',
      width: 130,
      editable: params => editable && params.data.currency !== baseCurrency,
      type: 'numericColumn',
      valueParser: valueParser
    }
  ];
};

const valueParser = params => {
  return getNumber(params.newValue);
};
