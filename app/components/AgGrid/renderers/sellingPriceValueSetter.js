import { isNumber, getNumber } from 'helpers/numberHelper';

const sellingPriceValueSetter = (params, options) => {
  // cannot use if(!value) since it should allow 0 as a value
  if (params.newValue === null || params.newValue == undefined || params.newValue === '') {
    options.setChanges(true);
    return (params.data.sellingPrice.values = { ...params.data.calcPrice.values }), (params.data.hasChanges = true);
  }

  if (isNumber(params.newValue) && getNumber(params.newValue) !== params.oldValue) {
    params.data.hasChanges = true;
    params.data.originalSellingPrice = params.data.originalSellingPrice || params.oldValue;

    options.setChanges(true);

    return (params.data.sellingPrice.values[options.currency] = getNumber(params.newValue));
  }
  return false;
};

export default sellingPriceValueSetter;
