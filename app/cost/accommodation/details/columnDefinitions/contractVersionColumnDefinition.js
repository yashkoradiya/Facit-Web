import MoneyCellRenderer from 'components/AgGrid/renderers/MoneyCellRenderer';
import DateCellRenderer from 'components/AgGrid/renderers/DateCellRenderer';
import PercentageCellRenderer from 'components/AgGrid/renderers/PercentageCellRenderer';
import LinkCellRenderer from 'components/AgGrid/renderers/LinkCellRenderer';
import getPropertyValue from 'components/AgGrid/renderers/getPropertyValue';

export const getContractVersionColumnDefinitions = () => {
  return [
    {
      field: 'contractVersionNumber',
      headerName: 'Version number',
      cellClass: 'no-border',
      width: 120,
      cellRenderer: LinkCellRenderer,
      valueGetter: d => {
        if (!d.data) return null;
        return {
          url: `/cost/accommodation/details/${getPropertyValue(d.data, 'accommodationId')}/${getPropertyValue(
            d.data,
            'accommodationDefinitionId'
          )}`,
          newTab: true,
          name: getPropertyValue(d.data, 'contractVersionNumber'),
          toString: () => {
            return getPropertyValue(d.data, 'contractVersionNumber');
          }
        };
      }
    },
    { field: 'importDate', headerName: 'Date', width: 90, cellRenderer: DateCellRenderer },
    {
      field: 'averageBedNightRate',
      headerName: 'Average bed night rate',
      width: 150,
      type: 'numericColumn',
      cellRenderer: MoneyCellRenderer
    },
    {
      field: 'commitmentLevel',
      headerName: 'Commitment %',
      type: 'numericColumn',
      width: 110,
      cellRenderer: PercentageCellRenderer
    },
    { field: 'contractStatus', headerName: 'Contract status', width: 130 }
  ];
};
