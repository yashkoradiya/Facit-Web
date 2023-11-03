export const keys = {
  enter: 13,
  escape: 27,
  backspace: 8,
  tab: 9,
  ctrl: 17,
  arrowLeft: 37,
  arrowUp: 38,
  arrowRight: 39,
  arrowDown: 40,
  f5: 116
};

export const isEnterKey = keycode => {
  return keycode === keys.enter;
};

export const isBackspaceKey = keycode => {
  return keycode === keys.backspace;
};

export const isEscapeKey = keycode => {
  return keycode === keys.escape;
};

export const isTabKey = keycode => {
  return keycode === keys.tab;
};

export const isCtrlKey = keycode => {
  return keycode === keys.ctrl;
};

export const isLeftKey = keycode => {
  return keycode === keys.arrowLeft;
};

export const isUpKey = keycode => {
  return keycode === keys.arrowUp;
};

export const isRightKey = keycode => {
  return keycode === keys.arrowRight;
};

export const isDownKey = keycode => {
  return keycode === keys.arrowDown;
};

export const isF5Key = keycode => {
  return keycode === keys.f5;
};
