import { getNumber } from '../../../../../helpers/numberHelper';

const validateDurationGroup = (durationGroup, durationGroups) => {
  let isValid = true;
  for (let i = 0; i < durationGroups.length; i++) {
    if (durationGroup.key !== durationGroups[i].key && durationGroup.from === durationGroups[i].to) {
      isValid = false;
      break;
    }
    if (
      durationGroup.key !== durationGroups[i].key &&
      durationGroup.from <= durationGroups[i].to &&
      durationGroup.from >= durationGroups[i].from
    ) {
      isValid = false;
      break;
    }
  }

  if (!isValid) {
    return false;
  } else {
    return durationGroups.filter(x => x.from === durationGroup.from && x.to === durationGroup.to).length === 1;
  }
};

export const validateAllDurationGroups = durationGroups => {
  let valid = true;
  durationGroups.forEach(d => {
    valid = valid && validateDurationGroup(d, durationGroups);
  });
  return valid;
};

export const validateRow = data => {
  const fromAndToIsSet = data.from !== null && data.to !== null;
  const fromIsNotAfterTo = getNumber(data.from) <= getNumber(data.to);

  return fromAndToIsSet && fromIsNotAfterTo && true;
};

export const getData = (durationGroups, newDurationGroup) => {
  const sortedGroups = durationGroups.map(x => ({ ...x })).sort((a, b) => a.from - b.from);
  return [...sortedGroups, newDurationGroup];
};
