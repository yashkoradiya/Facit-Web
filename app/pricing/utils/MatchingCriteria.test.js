import { fromJS, List } from 'immutable';
import {
  getCriteriasForSearchBox,
  getMatchingCriteriaDefinitionValues,
  updateMatchingCriterias
} from './matchingCriterias';

const mockMarginTemplateDefinitions = fromJS([
  { id: 1, matchingCriteriaDefinitions: [{ criteriaKey: 'key1' }] },
  { id: 2, matchingCriteriaDefinitions: [{ criteriaKey: 'key2' }] }
]);

const mockMatchingCriterias = List([
  { key: 'key1', values: [{ id: 1, name: 'Value 1', code: 'CODE1', parentId: null }] }
]);

const mockCriterias = fromJS([{ criteriaKey: 'key1', values: [1, 2, 3] }]);

const searchBoxMockData = List([
  {
    criterias: [
      { criteriaKey: 'key1', value: 1, valueTitle: 'Value 1' },
      { criteriaKey: 'key2', value: 2, valueTitle: 'Value 2' }
    ]
  },
  {
    criterias: [{ criteriaKey: 'key1', value: 3, valueTitle: 'Value 3' }]
  }
]);

describe('Matching Criterias', () => {
  it('Should return matching criteria definition values', () => {
    const definitionId = 1;
    const criteriaDefinitions = getMatchingCriteriaDefinitionValues(
      mockMatchingCriterias,
      definitionId,
      mockMarginTemplateDefinitions
    );

    expect(criteriaDefinitions).not.toBeNull();
  });

  it('Should add a new value to existing matchingCriteria', () => {
    const updatedMatchingCriteria = {
      criteriaDefinitionKey: 'key1',
      criteriaValue: 4,
      isSelected: true
    };
    const updatedCriterias = updateMatchingCriterias(updatedMatchingCriteria, mockCriterias);
    expect(updatedCriterias).toEqual(fromJS([{ criteriaKey: 'key1', values: [1, 2, 3, 4] }]));
  });

  it('Should remove a value from existing matchingCriteria', () => {
    const updatedMatchingCriteria = {
      criteriaDefinitionKey: 'key1',
      criteriaValue: 2,
      isSelected: false
    };
    const updatedCriterias = updateMatchingCriterias(updatedMatchingCriteria, mockCriterias);
    expect(updatedCriterias).toEqual(fromJS([{ criteriaKey: 'key1', values: [1, 3] }]));
  });

  it('Should add new matchingCriteria if not found and isSelected is true', () => {
    const updatedMatchingCriteria = {
      criteriaDefinitionKey: 'key2',
      criteriaValue: 10,
      isSelected: true
    };
    const updatedCriterias = updateMatchingCriterias(updatedMatchingCriteria, mockCriterias);
    expect(updatedCriterias).toEqual(
      fromJS([
        { criteriaKey: 'key1', values: [1, 2, 3] },
        { criteriaKey: 'key2', values: [10] }
      ])
    );
  });

  it('Should return criteriaList for given criteriaKey', () => {
    const criteriaKey = 'key1';
    const criteriaList = getCriteriasForSearchBox(searchBoxMockData, criteriaKey);
    expect(criteriaList).toEqual(
      fromJS([
        { id: 1, name: 'Value 1' },
        { id: 3, name: 'Value 3' }
      ])
    );
  });

  it('Should return empty list for non-existing criteriaKey', () => {
    const criteriaKey = 'key3';
    const criteriaList = getCriteriasForSearchBox(searchBoxMockData, criteriaKey);
    expect(criteriaList).toEqual(fromJS([]));
  });
});
