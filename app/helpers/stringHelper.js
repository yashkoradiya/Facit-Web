export const isEmpty = value => {
  if (typeof value === "string")
    value = value.trim();
  return !value || value.length === 0;
};

export const isString = value => {
  return typeof value === "string";
};
