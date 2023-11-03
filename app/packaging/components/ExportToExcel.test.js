import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExportToExcel from './ExportToExcel';
import * as gridDataToExcelHelper from './gridDataToExcelHelper';
 let user;
jest.mock('./gridDataToExcelHelper', () => ({
  mapData: jest.fn(),
  exportData: jest.fn(),
}));
 describe('ExportToExcel', () => {
  beforeEach(() => {
    user = userEvent.setup();
    jest.resetAllMocks();
  });
   it('should call gridDataToExcelHelper functions on button click', async () => {
    const data = [
      { id: 1, name: 'Product 1', price: 10 },
      { id: 2, name: 'Product 2', price: 20 },
    ];
    const columnDefinitions = [
      { header: 'ID', accessor: 'id' },
      { header: 'Name', accessor: 'name' },
      { header: 'Price', accessor: 'price' },
    ];
    const currency = 'USD';
    const { getByText } = render(
      <ExportToExcel
        data={data}
        columnDefinitions={columnDefinitions}
        currency={currency}
      />
    );
     // Mock the mapData function
    gridDataToExcelHelper.mapData.mockReturnValueOnce(data);
    await user.click(getByText('Export price details to Excel'));
    expect(gridDataToExcelHelper.mapData).toHaveBeenCalledWith(
      data,
      columnDefinitions,
      currency
    );
    expect(gridDataToExcelHelper.exportData).toHaveBeenCalledWith({
      data: data,
      fileName: 'pricedetails',
    });
  });
   it('should disable the button if data is empty', async () => {
    const data = [];
    const columnDefinitions = [
      { header: 'ID', accessor: 'id' },
      { header: 'Name', accessor: 'name' },
      { header: 'Price', accessor: 'price' },
    ];
    const currency = 'USD';
    const { getByText } = render(
      <ExportToExcel
        data={data}
        columnDefinitions={columnDefinitions}
        currency={currency}
      />
    );
     // Get the button element
    const button = getByText('Export price details to Excel');
    expect(button).toBeEnabled();
  });
});