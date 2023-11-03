export const getNumberOfProperties = obj => (
  Object.keys(obj).length
);

export const isNullOrUndefined = obj => (
  obj === undefined || obj === null
);