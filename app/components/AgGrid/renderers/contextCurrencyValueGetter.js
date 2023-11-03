const contextCurrencyValueGetter = (cell, customFieldDef) => {
  if (!cell.data) {
    return null;
  }

  let selectedCurrency = cell.context.currency.selected;

  let field = customFieldDef ? customFieldDef : cell.colDef.field;

  return !cell.data[field] ? null : cell.data[field].values[selectedCurrency.toUpperCase()];
};

export default contextCurrencyValueGetter;
