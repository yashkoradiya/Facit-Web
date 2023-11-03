import { getSelectedMatchingCriteriaDefinitions } from './marginTemplateDefinitions';
import { fromJS,List } from 'immutable';

const mockMarginTemplateDefinitions = [
  { id: 1, matchingCriteriaDefinitions: ['criteria1', 'criteria2'] },
  { id: 2, matchingCriteriaDefinitions: ['criteria3', 'criteria4'] },
  { id: 3, matchingCriteriaDefinitions: ['criteria5', 'criteria6'] }
];

test('Should return matching criteria definitions for existing definitionId', () => {
  const definitionId = 2;
  const selectedMatchingCriteria = getSelectedMatchingCriteriaDefinitions(fromJS(mockMarginTemplateDefinitions), definitionId);
  expect(selectedMatchingCriteria).toEqual(List(['criteria3', 'criteria4']));
});
