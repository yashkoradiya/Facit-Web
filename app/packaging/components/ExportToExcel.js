import React from 'react';
import { TextButton } from 'components/styled/Button';
import * as gridDataToExcelHelper from './gridDataToExcelHelper';

const ExportToExcel = ({ data, columnDefinitions, currency }) => {
  const handleExcelExport = () => {
    const excelData = gridDataToExcelHelper.mapData(data, columnDefinitions, currency);
    gridDataToExcelHelper.exportData({
      data: excelData,
      fileName: 'pricedetails'
    });
  };

  const buttonTextStyle = data.length > 0 ? 'normal' : 'italic';

  return (
    <TextButton disabled={data.length === 0} onClick={handleExcelExport}>
      <span style={{ fontStyle: buttonTextStyle }}>Export price details to Excel</span>
    </TextButton>
  );
};

export default ExportToExcel;
