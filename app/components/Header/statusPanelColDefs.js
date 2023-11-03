//import ToolTipRenderer from 'components/AgGrid/renderers/ToolTipRenderer';

const statusValueGetter = (params, type) => {
  if (type?.includes('evaluate')) {
    switch (params.data.status) {
      case 'PENDING':
        return 'Evaluating..';
      case 'FAILED':
        return 'Evaluate failed!';
      case 'PUBLISHED':
        return 'Evaluated';
    }
  }
  switch (params.data.status) {
    case 'PENDING':
      return 'Publishing..';
    case 'FAILED':
      return 'Publish failed!';
    case 'PUBLISHED':
      return 'Published';
  }
};

const statusCellStyle = params => {
  switch (params.data.status) {
    case 'PENDING':
      return { backgroundColor: 'white' };
    case 'FAILED':
      return { backgroundColor: '#F9999B' };
    case 'PUBLISHED':
      return { backgroundColor: '#A5E2CF' };
  }
};

const offeringColDefs = [
  {
    field: 'sourceMarketName',
    width: 180,
    headerName: 'Source market'
  },
  {
    field: 'accommodation',
    width: 180,
    headerName: 'Accommodation'
  },
  {
    field: 'packageType',
    width: 180,
    headerName: 'Package type'
  },
  {
    field: 'roomCount',
    width: 100,
    headerName: 'Room types',
    type: 'numericColumn'
  },
  {
    field: 'status',
    width: 180,
    headerName: 'Status',
    valueGetter: statusValueGetter,
    cellStyle: statusCellStyle
  }
];

const accommodationColDefs = type => [
  {
    field: 'sourceMarketName',
    width: 200,
    headerName: 'Source market'
  },
  {
    field: 'accommodationName',
    width: 200,
    headerName: 'Accommodation'
  },
  {
    field: 'packageType',
    width: 200,
    headerName: 'Package type'
  },
  {
    field: 'roomCount',
    width: 100,
    headerName: 'Room types',
    type: 'numericColumn'
  },
  {
    field: 'status',
    width: 200,
    headerName: 'Status',
    valueGetter: row => statusValueGetter(row, type),
    cellStyle: statusCellStyle
  }
];

const transferColDefs = type => [
  {
    field: 'saleableUnitId',
    width: 180,
    headerName: 'SaleableUnitId'
  },
  {
    field: 'sourceMarketId',
    width: 180,
    headerName: 'Source market'
  },
  {
    field: 'planningPeriod',
    width: 180,
    headerName: 'Season'
  },
  {
    field: 'status',
    width: 180,
    headerName: 'Status',
    valueGetter: row => statusValueGetter(row, type),
    cellStyle: statusCellStyle
  }
];

const charterFlightSupplementColDefs = type => [
  {
    field: 'flightid',
    width: 180,
    headerName: 'Id'
  },
  {
    field: 'flight',
    width: 180,
    headerName: 'Name'
  },
  {
    field: 'sourceMarketName',
    width: 180,
    headerName: 'Source market'
  },
  {
    field: 'packageType',
    width: 180,
    headerName: 'Package type'
  },
  {
    field: 'status',
    width: 180,
    headerName: 'Status',
    valueGetter: row => statusValueGetter(row, type),
    cellStyle: statusCellStyle
  }
];

const cruiseColDefs = [
  {
    field: 'sourceMarketName',
    width: 200,
    headerName: 'Source market'
  },
  {
    field: 'cruiseName',
    width: 200,
    headerName: 'Cruise'
  },
  {
    field: 'shipName',
    width: 200,
    headerName: 'Ship name'
  },
  {
    field: 'status',
    width: 200,
    headerName: 'Status',
    valueGetter: statusValueGetter,
    cellStyle: statusCellStyle
  }
];

export const getColumnDefinition = type => {
  switch (type) {
    case 'evaluate_accommodation_only':
    case 'evaluate_charter_package':
    case 'accommodation_only':
    case 'charter_package':
      return accommodationColDefs(type);
    case 'transfers':
    case 'evaluate_transfers':
      return transferColDefs(type);
    case 'offering':
      return offeringColDefs;
    case 'dynamic_cruise':
      return cruiseColDefs;
    case 'evaluate_charter_flight_supplement':
    case 'charter_flight_supplement':
      return charterFlightSupplementColDefs(type);
  }
};

export const EVALUATE_PACKAGE_TYPES = [
  'evaluate_accommodation_only',
  'evaluate_charter_package',
  'evaluate_charter_flight_supplement',
  'evaluate_transfers'
  
];
