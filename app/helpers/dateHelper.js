import settings from '../core/settings/settings';

export function getDateFormat(length) {
  const locale = settings.LOCALE;
  switch (length) {
    case 0:
      return locale === 'nl' ? 'DDMMYY' : 'YYMMDD';
    case 1:
          return locale === 'nl' ? 'YY-MM-DD' : 'DD-MM-YY';
    case 2:
      return locale === 'nl' ? 'DDMMYYYY' : 'YYYYMMDD';
    case 3:
      return locale === 'nl' ? 'YYYY-MM-DD HH:mm' : 'DD-MM-YYYY HH:mm';
    case 4:
      return locale === 'nl' ? 'DD-MM-YYYY' : 'YYYY-MM-DD';
    default:
      return locale === 'nl' ? 'YYYY-MM-DD' : 'DD-MM-YYYY';
  }
}



export function getDateFormatForDateFns(length) {
  const locale = settings.LOCALE;
  switch (length) {
    case 0:
      return locale === 'nl' ? 'ddMMyy' : 'yyMMdd';
    case 1:
      return locale === 'nl' ? 'dd-MM-yy' : 'yy-MM-dd';
    case 2:
      return locale === 'nl' ? 'ddMMyyyy' : 'yyyyMMdd';
    case 3:
      return locale === 'nl' ? 'yyyy-MM-dd HH:mm' : 'dd-MM-yyyy HH:mm';
    default:
      return locale === 'nl' ? 'yyyy-MM-dd' : 'dd-MM-yyyy';
  }
}

export function getShortDateFormat() {
  const locale = settings.LOCALE;
  return locale === 'nl' ? 'yyyy-MM-dd' : 'dd-MM-yyyy';
}
