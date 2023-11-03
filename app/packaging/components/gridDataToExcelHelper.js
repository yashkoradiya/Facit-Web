import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { getShortDateFormat } from '../../helpers/dateHelper';
import { format } from 'date-fns';

export function exportData({ data, fileName }) {
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blobData = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(blobData, fileName + fileExtension);
}

export function mapData(data, columndefinitions, currency) {
  const result = [];
  const keys = [];
  columndefinitions.forEach(x => {
    keys.push(x.field);
  });

  data.forEach(item => {
    const dataItem = {};
    for (let i = 0; i < keys.length; i++) {
      const definition = columndefinitions.find(x => x.field === keys[i]);

      if (!definition) continue;

      let value = item[keys[i]];
      
      if (value instanceof Array && definition.headerName === "Product type") {
        value = value.join();
      }
      else if(definition.headerName === "Room Code" || definition.headerName === "Total allotment" || definition.headerName === "Empty leg factor" || definition.headerName === "Flight Number"  )
      {
        // Do nothing
      }
      else if (typeof value === 'object' && value.values !== undefined) {
        value = value.values[currency];
      }
      else if (!(Number.isInteger(value) && value !== undefined)) {
          const dateParsedValue = Date.parse(value);

          if (!(value instanceof Number) && !isNaN(dateParsedValue)) {
            value = format(dateParsedValue, getShortDateFormat());
          }
        }
      dataItem[definition.headerName] = value;
    }

    result.push(dataItem);
  });

  return result;
}
