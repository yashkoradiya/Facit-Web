const getPropertyValue = (data, property) => {
  let value;
  if (typeof data.get === 'function') {
    value = data.get(property);
  } else {
    value = data[property];
  }
  return value;
};

export default getPropertyValue;