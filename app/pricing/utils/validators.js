export const isValidTextInput = (text, label) => {
  if (text && text !== '') {
    if (text.length < 3) {
      return 'At least 3 characters required';
    }
  } else {
    return `Template ${label} required`;
  }
  return '';
};

export const isApplicabilityValid = applicability => {
  const missingValues = applicability.filter(x => {
    return x.get('values').size === 0;
  });

  if (applicability.size === 0 || missingValues.size === applicability.size) {
    return 'Select at least one applicability';
  }
  return '';
};

export const isMarginBandValid = (dateBands, valueDefinitions) => {
  if (dateBands.size > 0) {
    const missingFromDate = dateBands.filter(x => {
      return !x.get('from');
    });
    const missingToDate = dateBands.filter(x => {
      return !x.get('to');
    });

    const manditoryDefinitions = valueDefinitions.filter(
      definition => definition.get('valueType') === 'Percentage' || definition.get('valueType') === 'Absolute'
    );

    for (let i = 0; i < dateBands.size; i++) {
      const values = dateBands.getIn([i, 'values']);
      if (values.size === 0) {
        return 'Missing values';
      }

      for (let j = 0; j < manditoryDefinitions.size; j++) {
        const val = values.find(x => x.get('valueDefinitionId') === manditoryDefinitions.getIn([j, 'id']));
        if (!val || !val.get('value') === null || !val.get('value') === undefined) {
          return `Invalid value for ${manditoryDefinitions.getIn([j, 'title'])}`;
        }
      }
    }

    if (missingFromDate.size > 0) {
      return 'A valid from date is required';
    } else if (missingToDate.size > 0) {
      return 'A valid to date is required';
    } else {
      return '';
    }
  } else {
    return 'At least one margin band is required';
  }
};

export const isSourceMarketMarginValid = (sourceMarketMargin, valueDefinitions) => {
  if (sourceMarketMargin.size > 0) {
    let errorText = '';
    sourceMarketMargin.forEach(smm => {
      errorText = isMarginBandValid(smm.get('dateBands'), valueDefinitions);
    });
    return errorText;
  } else {
    return 'At least one margin band is required';
  }
};

const ruleValidations = {
  vat: {
    Percentage: (validationMessages, datebandValue, key) => {
      negativePercentageValidation(validationMessages, datebandValue, key);
    }
  },
  distribution_cost: {
    Percentage: (validationMessages, datebandValue, key) => {
      negativePercentageValidation(validationMessages, datebandValue, key);
    }
  }
};

const negativePercentageValidation = (validationMessages, datebandValue, key) => {
  if (datebandValue.value < 0) {
    validationMessages[key] = 'Negative percentage not allowed';
  }
};

export const addSpecificValidationToValueDefinition = (ruleType, valueDefinitions) => {
  const valueDefinitionsWithSpecificValidation = valueDefinitions.map(definition => {
    const ruleTypeValidation = ruleValidations[ruleType];
    if (!ruleTypeValidation) {
      return {
        ...definition,
        validate: () => {
          return true;
        }
      };
    }
    const ruleTypeValueTypeValidation = ruleTypeValidation[definition.valueType];

    if (!ruleTypeValueTypeValidation) {
      return {
        ...definition,
        validate: () => {
          return true;
        }
      };
    }

    return {
      ...definition,
      validate: ruleTypeValueTypeValidation
    };
  });
  return valueDefinitionsWithSpecificValidation;
};
