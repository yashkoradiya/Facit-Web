import { getShortDateFormat } from '../../../helpers/dateHelper';
import { format, parseISO, isValid } from 'date-fns';

export default params => [
  'copy',
  'copyWithHeaders',
  {
    name: 'Export to excel',
    action: () => {
      params.api.exportDataAsExcel({
        processCellCallback: p => {
          const valueTransformer = p.column.colDef.exportValueGetter ?? (val => val);
          let val = valueTransformer(p.value);

          if (!Number.isInteger(val) || val < 0 || val > 9) {
            const dateParsedValue = parseISO(val);

            if (typeof val === 'string' && isValid(dateParsedValue)) {
              val = format(dateParsedValue, getShortDateFormat());
            }
          }

          if (Array.isArray(val)) {
            return val.join(', ');
          }

          return val;
        },
      });
    },
  },
];
