import accounting from 'accounting';
import numeral from 'numeral';

export const isNumber = value => {
  value = cleanNumberString(value);
  return !isNaN(parseFloat(value)) && isFinite(value);
};

const cleanNumberString = value => {
  return typeof value === 'string' ? value.replace(',', '.').replace(/\s/g, '') : value;
};

export const getNumber = value => {
  if (isNumber(value)) {
    value = cleanNumberString(value);
    const parsedFloat = parseFloat(value);
    return parsedFloat;
  }
  return null;
};

export const formatDecimal = (value, numberOfDecimals) => {
  if (isNumber(value)) {
    return getNumber(value).toFixed(numberOfDecimals);
  }
  return value;
};

export const formatMoney = (valueToRender, symbol, format, precision, accountingFormatMoneyParams) => {
  let formatted;
  if (!format) {
    format = '%v';
  }
  if (!precision) {
    precision = 0;
  }

  if (valueToRender != null && !isNaN(valueToRender)) {
    formatted = accounting.formatMoney(valueToRender, {
      symbol,
      format,
      precision,
      ...accountingFormatMoneyParams
    });
  } else {
    formatted = '';
  }
  return formatted;
};

export const convertToPercentage = value => {
  return numeral(getNumber(value)).format('0.0%');
};
export const convertFromPercentage = value => {
  const number = getNumber(value);
  return number === null ? null : number / 100;
};
