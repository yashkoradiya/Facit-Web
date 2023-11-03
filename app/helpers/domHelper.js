export const isWithinElement = (element, x, y, offsetLeft = 0) => {
  const elementLeft = element.getBoundingClientRect().left + offsetLeft;
  const elementTop = element.getBoundingClientRect().top;
  const elementRight = elementLeft + element.offsetWidth;
  const elementBottom = elementTop + element.offsetHeight;

  if (elementLeft <= x && elementRight >= x && elementTop <= y && elementBottom >= y) {
    return true;
  }

  return false;
};
