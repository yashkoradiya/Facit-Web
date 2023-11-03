import userEvent from '@testing-library/user-event';
import { getColumnDefinitions, getFooterColumnDefinitions } from './columnDefinitions';

let user;

jest.mock('@testing-library/user-event', () => ({
  __esModule: true,
  default: {
    setup: jest.fn()
  }
}));

describe('getColumnDefinitions', () => {
  beforeEach(() => {
    user = userEvent.setup();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return the column definitions correctly', async () => {
    const options = {
      seatClasses: [
        { id: 1, name: 'Seat Class 1' },
        { id: 2, name: 'Seat Class 2' }
      ]
    };

    const columnDefinitions = getColumnDefinitions(options);

    expect(columnDefinitions).toHaveLength(7);

    expect(columnDefinitions[0]).toEqual(expect.objectContaining({ field: 'departureDate', width: 100 }));
    expect(columnDefinitions[1]).toEqual(expect.objectContaining({ field: 'departureDate', width: 90 }));
    expect(columnDefinitions[2]).toEqual(expect.objectContaining({ field: 'direction', width: 60 }));
    expect(columnDefinitions[3]).toEqual(expect.objectContaining({ field: 'totalAllotment', width: 90 }));
    expect(columnDefinitions[4]).toEqual(expect.objectContaining({ field: 'emptyLegFactor', width: 135 }));

    expect(columnDefinitions[5]).toEqual(
      expect.objectContaining({
        headerName: 'Seat Class 1',
        headerClass: 'ag-header-group ag-header-color--0',
        children: expect.any(Array)
      })
    );

    expect(columnDefinitions[5].children).toHaveLength(7);
    expect(columnDefinitions[5].children[0]).toEqual(
      expect.objectContaining({
        colId: '1_allotment',
        field: '1_allotment',
        headerName: 'Allotment',
        type: 'numericColumn',
        headerClass: 'ag-header-color--0',
        width: 85
      })
    );
    // Add assertions for other properties of child column definitions

    expect(columnDefinitions[6]).toEqual(
      expect.objectContaining({
        headerName: 'Seat Class 2',
        headerClass: 'ag-header-group ag-header-color--1',
        children: expect.any(Array)
      })
    );
  });
});

describe('getFooterColumnDefinitions', () => {
  beforeEach(() => {
    user = userEvent.setup();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return the footer column definitions correctly', async () => {
    const options = {
      seatClasses: [
        { id: 1, name: 'Seat Class 1' },
        { id: 2, name: 'Seat Class 2' }
      ]
    };

    const footerColumnDefinitions = getFooterColumnDefinitions(options);

    expect(footerColumnDefinitions).toHaveLength(6);

    expect(footerColumnDefinitions[0]).toEqual(expect.objectContaining({ field: 'departureDate', width: 100 }));
    expect(footerColumnDefinitions[1]).toEqual(expect.objectContaining({ field: 'direction', width: 60 }));
    expect(footerColumnDefinitions[2]).toEqual(expect.objectContaining({ field: 'totalAllotment', width: 98 }));
    expect(footerColumnDefinitions[3]).toEqual(expect.objectContaining({ field: 'emptyLegFactor', width: 135 }));

    expect(footerColumnDefinitions[4]).toEqual(
      expect.objectContaining({
        headerName: 'Seat Class 1',
        children: expect.any(Array)
      })
    );

    expect(footerColumnDefinitions[4].children).toHaveLength(8);
    expect(footerColumnDefinitions[4].children[0]).toEqual(expect.objectContaining({ field: '1_allotment', width: 100 }));
    // Add assertions for other properties of child column definitions

    expect(footerColumnDefinitions[5]).toEqual(
      expect.objectContaining({
        headerName: 'Seat Class 2',
        children: expect.any(Array)
      })
    );
  });
});
