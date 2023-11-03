import { getSelectedMatchingCriteriaDefinitions } from './marginTemplateDefinitions';
import MatchingCriteriaValue from './MatchingCriteriaValue';
import { fromJS } from 'immutable';

export const getMatchingCriteriaDefinitionValues = (matchingCriterias, definitionId, marginTemplateDefinitions) => {
  let matchingCriterasWithValues = [];
  matchingCriterias.forEach(mc => {
    const key = mc.key;
    const values = mc.values.map(value => {
      return new MatchingCriteriaValue({
        id: value.id,
        name: value.name,
        code: value.code,
        parentId: value.parentId
      });
    });

    const matchingCriteriaDefinitions = getSelectedMatchingCriteriaDefinitions(marginTemplateDefinitions, definitionId);
    let matchingCriteriaDefinition = matchingCriteriaDefinitions.find(o => o.get('criteriaKey') === key);
    matchingCriteriaDefinition = matchingCriteriaDefinition.set('values', values);
    matchingCriterasWithValues.push(matchingCriteriaDefinition);
  });
  const templateIndex = marginTemplateDefinitions.findIndex(mtd => mtd.get('id') === definitionId);
  return { templateIndex, matchingCriterasWithValues };
};

export const updateMatchingCriterias = (updatedMatchingCriteria, criterias) => {
  let matchingCriteria = criterias.find(c => c.get('criteriaKey') === updatedMatchingCriteria.criteriaDefinitionKey);
  let index = criterias.findIndex(c => c.get('criteriaKey') === updatedMatchingCriteria.criteriaDefinitionKey);
  if (matchingCriteria) {
    if (updatedMatchingCriteria.isSelected) {
      matchingCriteria = matchingCriteria.set(
        'values',
        matchingCriteria.get('values').push(updatedMatchingCriteria.criteriaValue)
      );
    } else {
      const valueIndex = matchingCriteria.get('values').findIndex(x => x === updatedMatchingCriteria.criteriaValue);
      matchingCriteria = matchingCriteria.removeIn(['values', valueIndex]);
    }
    return criterias.setIn([index], matchingCriteria);
  }

  if (!matchingCriteria && updatedMatchingCriteria.isSelected) {
    matchingCriteria = {
      criteriaKey: updatedMatchingCriteria.criteriaDefinitionKey,
      values: [updatedMatchingCriteria.criteriaValue]
    };
    return criterias.update(arr => arr.push(fromJS(matchingCriteria)));
  }
};

export const getCriteriasForSearchBox = (data, criteriaKey) => {
  const criteriaList = [];

  data
    .filter(item => item.criterias.some(criteria => criteria.criteriaKey === criteriaKey))
    .forEach(rule => {
      rule.criterias
        .filter(criteria => criteria.criteriaKey === criteriaKey)
        .forEach(criteria => {
          if (!criteriaList.find(x => x.id === criteria.value)) {
            criteriaList.push({
              id: criteria.value,
              name: criteria.valueTitle
            });
          }
        });
    });

  return fromJS(criteriaList);
};
