import RuleToolTipRenderer from 'components/AgGrid/renderers/RuleToolTipRenderer';
import DateCellRenderer from 'components/AgGrid/renderers/DateCellRenderer';
import ChangesCellRenderer from 'components/AgGrid/renderers/ChangesCellRenderer';
import ChangesHeader from 'components/AgGrid/ChangesHeader';
import { getDateFormat } from 'helpers/dateHelper';

const getColumnDefinitions = () => {
  return [
    {
      field: 'changes',
      headerName: 'Changes',
      width: 24,
      headerComponent: ChangesHeader,
      cellRenderer: ChangesCellRenderer,
      exportValueGetter: changes => {
        const cruiseObj = changes.find(x => x.offeringType === 'dynamic-cruise');
        if (cruiseObj && cruiseObj.changes.length) {
          return cruiseObj.changes.join(', ');
        }
        return '';
      }
    },
    {
      field: 'id',
      headerName: 'Prod. config. ID',
      width: 116,
      cellClass: 'no-border'
    },
    {
      field: 'cruiseName',
      tooltipField: 'cruiseName',
      headerName: 'Cruise Name',
      cellClass: 'no-border',
      width: 220
    },
    {
      field: 'sourceMarketName',
      headerName: 'Source market',
      cellClass: 'no-border',
      width: 108
    },
    {
      field: 'shipName',
      tooltipField: 'shipName',
      headerName: 'Ship Name',
      cellClass: 'no-border',
      width: 130
    },
    {
      field: 'cruiseRegion',
      tooltipField: 'cruiseRegion',
      headerName: 'Cruise Region',
      cellClass: 'no-border',
      width: 105
    },
    {
      field: 'cruiseLine',
      tooltipField: 'cruiseLine',
      headerName: 'Cruise Line',
      cellClass: 'no-border',
      width: 91
    },
    {
      field: 'firstDeparture',
      headerName: 'First Departure',
      cellRenderer: DateCellRenderer,
      width: 130,
      type: 'numericColumn'
    },
    {
      field: 'lastDeparture',
      headerName: 'Last Departure',
      cellRenderer: DateCellRenderer,
      width: 130,
      type: 'numericColumn'
    },
    {
      field: 'appliedRules',
      headerTooltip: 'Number of applied dynamic cruise rules',
      headerName: 'Price rules',
      type: 'numericColumn',
      width: 93,
      cellRenderer: RuleToolTipRenderer
    },
    {
      field: 'lastPublished',
      headerName: 'Last published',
      cellClass: 'no-border',
      cellRenderer: DateCellRenderer,
      cellRendererParams: {
        format: getDateFormat(3),
        useLocal: true
      },
      width: 110
    },
    {
      field: 'publishedBy',
      headerName: 'Published by',
      cellClass: 'no-border',
      width: 100
    }
  ];
};

export default getColumnDefinitions;
