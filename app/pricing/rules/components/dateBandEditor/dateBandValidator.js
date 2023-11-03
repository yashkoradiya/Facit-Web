import * as numberHelper from '../../../../helpers/numberHelper';
import * as dateBandHelper from '../dateBandHelper';

export const validateValue = (flatDateBand, validationMessages, valueDefinitions, propertyName, value) => {
  const valueKey = flatDateBand.key + '_' + propertyName;
  let valueDefinitionId = 0;
  let currentDuration = null;
  if (propertyName.includes('_')) {
    const [duration, valDefId] = propertyName.split('_');
    valueDefinitionId = parseInt(valDefId);
    currentDuration = duration;
  } else {
    valueDefinitionId = parseInt(propertyName);
  }

  const currentValueDefinition = valueDefinitions.find(x => x.id === valueDefinitionId);
  switch (currentValueDefinition.valueType) {
    case 'MinThreshold': {
      const msg = 'Min value must be less than max value';
      const sortOrderToBeCompared = currentValueDefinition.sortOrder + 1;
      const [compareValue, compareValueKey] = getMinMaxValue(
        valueDefinitions,
        flatDateBand,
        currentDuration,
        currentValueDefinition.ageCategoryType,
        'MaxThreshold',
        sortOrderToBeCompared
      );
      return validateMinMax(validationMessages, valueKey, value, compareValueKey, compareValue, msg, false);
    }
    case 'MaxThreshold': {
      const msg = 'Max value must be larger than min value';
      const sortOrderToBeCompared = currentValueDefinition.sortOrder - 1;

      const [compareValue, compareValueKey] = getMinMaxValue(
        valueDefinitions,
        flatDateBand,
        currentDuration,
        currentValueDefinition.ageCategoryType,
        'MinThreshold',
        sortOrderToBeCompared
      );
      return validateMinMax(validationMessages, valueKey, value, compareValueKey, compareValue, msg, true);
    }
    case 'MinRelativity': {
      const msg = 'Min value must be less than max value';
      const [compareValue, compareValueKey] = getMinMaxValue(
        valueDefinitions,
        flatDateBand,
        currentDuration,
        currentValueDefinition.ageCategoryType,
        'MaxRelativity'
      );
      return validateMinMax(validationMessages, valueKey, value, compareValueKey, compareValue, msg, false);
    }
    case 'MaxRelativity': {
      const msg = 'Max value must be larger than min value';
      const [compareValue, compareValueKey] = getMinMaxValue(
        valueDefinitions,
        flatDateBand,
        currentDuration,
        currentValueDefinition.ageCategoryType,
        'MinRelativity'
      );
      return validateMinMax(validationMessages, valueKey, value, compareValueKey, compareValue, msg, true);
    }
    case 'Absolute':
    case 'Percentage': {
      return validateValidNumber(validationMessages, valueKey, value);
    }
    default:
      break;
  }

  return validationMessages;
};

export const validateDate = (propertyName, flatDateBand, validationMessages) => {
  if (!flatDateBand[propertyName]) {
    validationMessages[`${flatDateBand.key}_${propertyName}`] = 'Date must be set';
  } else {
    delete validationMessages[`${flatDateBand.key}_${propertyName}`];
  }

  const fromDate = flatDateBand['from'];
  const toDate = flatDateBand['to'];
  if (fromDate && !toDate) return;

  if (dateBandHelper.isValidDateRange(fromDate, toDate)) {
    delete validationMessages[`${flatDateBand.key}_from`];
    delete validationMessages[`${flatDateBand.key}_to`];
  } else {
    validationMessages[`${flatDateBand.key}_${propertyName}`] = 'From date must be before to date';
  }

  return { ...validationMessages };
};

export const validateDateBandGaps = (dateBand, dateBands, backwards, validationMessages) => {
  const idx = dateBands.findIndex(x => x.key === dateBand.key);
  const nextIndex = backwards ? idx - 1 : idx + 1;

  if (idx === -1) {
    if (backwards) {
      delete validationMessages[`${dateBands[dateBands.length - 1].key}_from`];
    } else {
      delete validationMessages[`${dateBands[0].key}_to`];
    }

    return validationMessages;
  }

  if (nextIndex > dateBands.length - 1) {
    delete validationMessages[`${dateBand.key}_to`];

    return validationMessages;
  }

  if (nextIndex < 0) {
    delete validationMessages[`${dateBand.key}_from`];

    return validationMessages;
  }
  const comparisonDateBand = dateBands[nextIndex];

  let fromDate = null;
  let toDate = null;
  let validationKey1 = null;
  let validationKey2 = null;
  if (comparisonDateBand.isNewDateBand) {
    return validationMessages;
  }
  if (backwards) {
    if (!dateBand.from) return validationMessages;

    validationKey1 = `${dateBand.key}_from`;
    validationKey2 = `${comparisonDateBand.key}_to`;

    fromDate = dateBand.from.clone();
    toDate = comparisonDateBand.to.clone();
  } else {
    if (!dateBand.to) return validationMessages;

    validationKey1 = `${comparisonDateBand.key}_from`;
    validationKey2 = `${dateBand.key}_to`;

    fromDate = comparisonDateBand.from.clone();
    toDate = dateBand.to.clone();
  }

  if (!toDate.add(1, 'days').isSame(fromDate, 'day')) {
    validationMessages[validationKey1] = 'There are gaps between date bands, please correct the dates.';
    validationMessages[validationKey2] = 'There are gaps between date bands, please correct the dates.';
  } else {
    delete validationMessages[validationKey1];
    delete validationMessages[validationKey2];
  }

  return validationMessages;
};

export const validateAllDateBandGaps = (dateBands, validationMessages) => {
  dateBands.forEach((db, idx) => {
    if (!db.isNewDateBand) {
      validationMessages = validateDateBandGaps(db, dateBands, false, validationMessages);
      if (idx === 0) validationMessages = validateDateBandGaps(db, dateBands, true, validationMessages);
    }
  });
  return validationMessages;
};

export const validateEverything = (dateBands, validationMessages, valueDefinitions) => {
  dateBands.forEach((flatDateBand, idx) => {
    if (flatDateBand.isNewDateBand) return;
    Object.keys(flatDateBand).forEach(propertyName => {
      if (propertyName === 'id' || propertyName === 'key' || propertyName === 'isNewDateBand') return;

      if (propertyName === 'from' || propertyName === 'to') {
        validationMessages = validateDate(propertyName, flatDateBand, validationMessages);

        if (!validationMessages[`${flatDateBand.key}_from`])
          validationMessages = validateDateBandGaps(flatDateBand, dateBands, false, validationMessages);

        if (idx === 0 && !validationMessages[`${flatDateBand.key}_to`])
          validationMessages = validateDateBandGaps(flatDateBand, dateBands, true, validationMessages);
      } else {
        validationMessages = validateValue(
          flatDateBand,
          validationMessages,
          valueDefinitions,
          propertyName,
          flatDateBand[propertyName]
        );
      }
    });
  });

  return validationMessages;
};

const validateValidNumber = (validationMessages, valueKey, value) => {
  if (value === undefined || !numberHelper.isNumber(value)) {
    validationMessages[valueKey] = 'Not a valid number';
  } else {
    delete validationMessages[valueKey];
  }
  return { ...validationMessages };
};

const validateMinMax = (validationMessages, valueKey, value, compareValueKey, compareValue, msg, reverseDirection) => {
  if (value === undefined || value === null || value === '') {
    delete validationMessages[valueKey];
    delete validationMessages[compareValueKey];
  } else {
    validationMessages = validateValidNumber(validationMessages, valueKey, value);
  }

  if (numberHelper.isNumber(value) && compareValue !== undefined && numberHelper.isNumber(compareValue)) {
    const firstNumber = numberHelper.getNumber(value);
    const secondNumber = numberHelper.getNumber(compareValue);
    if (reverseDirection ? firstNumber < secondNumber : firstNumber > secondNumber) {
      validationMessages[valueKey] = msg;
    } else {
      delete validationMessages[valueKey];
      delete validationMessages[compareValueKey];
    }
  }
  return { ...validationMessages };
};

const getMinMaxValue = (valueDefinitions, flatDateBand, duration, ageCategoryType, valueType, sortOrderToBeCompared) => {
  const valueDef = sortOrderToBeCompared != undefined ? valueDefinitions.find(x => x.valueType === valueType && x.ageCategoryType === ageCategoryType && x.sortOrder === sortOrderToBeCompared) : valueDefinitions.find(x => x.valueType === valueType && x.ageCategoryType === ageCategoryType);
  const propertyName = duration ? `${duration}_${valueDef.id}` : valueDef.id;

  const value = flatDateBand[propertyName];
  const valueKey = flatDateBand.key + '_' + propertyName;
  return [value, valueKey];
};
