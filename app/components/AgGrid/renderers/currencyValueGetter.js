const currencyValueGetter = (row, currency, field) => {
  if (!row) return null;

  if (!row.data) {
    return null;
  }

  const cell = row.data[field];
  if (!cell) {
    return null;
  }

  if (!cell.values) return null;

  return cell.values[currency];
};

export default currencyValueGetter;
