export function setItem(key, value) {
  let serializedValue = JSON.stringify(value);
  sessionStorage.setItem(key, serializedValue);
}

export function getItem(key) {
  let storedItem = sessionStorage.getItem(key);
  return JSON.parse(storedItem);
}

export function removeItem(key) {
  sessionStorage.removeItem(key);
}

export function clear() {
  sessionStorage.clear();
}
