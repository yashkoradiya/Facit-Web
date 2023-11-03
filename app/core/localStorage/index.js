export function setItem(key, value) {
  try {
    let serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (err) {
    console.error(err);
  }
}

export function getItem(key) {
  try {
    let storedItem = localStorage.getItem(key);

    if (storedItem == null) return undefined;

    return JSON.parse(storedItem);
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

export function removeItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error(err);
  }
}

export function clear() {
  try {
    localStorage.clear();
  } catch (err) {
    console.error(err);
  }
}
