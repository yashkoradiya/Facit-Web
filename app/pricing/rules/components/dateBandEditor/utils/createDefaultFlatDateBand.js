import { v4 as uuidv4 } from 'uuid';
import { flatDateBand } from './flattenDateBands';
export default function(durationGroups, valueDefinitions, defaultFromDate) {
  let values = [];

  if (durationGroups && durationGroups.length > 0) {
    durationGroups.forEach(durationGroup => {
      values = [...values, ...valueDefinitions.map(item => createValue(item, durationGroup))];
    });
  } else {
    values = valueDefinitions.map(item => createValue(item));
  }
  return flatDateBand({
    key: uuidv4(),
    isNewDateBand: true,
    from: defaultFromDate ? defaultFromDate.clone() : null,
    to: null,
    values: values
  });
}

const createValue = (valueDefinition, durationGroup) => {
  return {
    valueDefinitionId: valueDefinition.id,
    value: null,
    title: valueDefinition.title,
    type: valueDefinition.valueType,
    durationGroup: durationGroup,
    ageCategoryType: valueDefinition.ageCategoryType,
    ageCategoryIndex: valueDefinition.ageCategoryIndex,
    sortOrder: valueDefinition.sortOrder
  };
};
