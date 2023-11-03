import React from 'react';
import { render, screen } from 'test-utils';
import { ruleValidationFunctions } from './ruleValidationFunctions';

jest.mock('apis/rulesApi', () => ({
  validateRule: jest.fn().mockImplementation((ruleType, rule) => {
    if (ruleType === 'accommodation_component') {
      return Promise.resolve({
        data: {
          isValid: false,
          conflictingRuleId: 'conflictingRule123',
          conflictingRuleName: 'Conflicting Rule',
          conflictingRuleProperties: {
            datePeriod: [{ from: '2023-07-31', to: '2023-08-15' }],
            sourceMarket: 'Source Market 1'
          }
        }
      });
    } else {
      return Promise.resolve({
        data: {
          isValid: true
        }
      });
    }
  })
}));

const rule = {
  id: 232,
  name: 'Test',
  ruleDefinitionId: 12,
  currency: 'EUR',
  ruleType: 'over_occupancy',
  distSelected: false,
  marginSelected: false,
  vatSelected: false,
  guaranteedSelected: false,
  matchingCriterias: [
    {
      criteriaKey: 'producttype',
      values: [
        {
          id: '1',
          name: 'ACCOMMODATION_ONLY',
          code: 'AO'
        }
      ]
    },
    {
      criteriaKey: 'accommodationcode',
      values: [
        {
          id: 'A0323215',
          name: 'A0323215 Ali Bey Resort',
          code: 'A0323215'
        }
      ]
    }
  ],
  configurations: [
    {
      dateBands: [
        {
          key: 'c8d88e69-e3d7-444a-a2fc-0b526b34bdf5',
          from: '2023-10-31T18:30:00.000Z',
          to: '2023-10-31T18:30:00.000Z',
          values: [
            {
              valueDefinitionId: 36,
              value: 0.1
            }
          ]
        }
      ],
      durationGroups: [],
      sourceMarkets: [
        {
          id: 'TUI_NL',
          name: 'TUI Netherlands'
        }
      ]
    }
  ],
  properties: [],
  criteriaDefinitions: [
    {
      id: 96,
      title: 'Product Type',
      criteriaKey: 'producttype',
      sortOrder: 0,
      score: 1
    },
    {
      id: 97,
      title: 'Planning period',
      criteriaKey: 'season',
      sortOrder: 1,
      score: 2
    },
    {
      id: 98,
      title: 'Country',
      criteriaKey: 'country',
      sortOrder: 2,
      score: 3
    },
    {
      id: 99,
      title: 'Destination',
      criteriaKey: 'destination',
      sortOrder: 3,
      score: 4
    },
    {
      id: 100,
      title: 'Resort',
      criteriaKey: 'resort',
      sortOrder: 4,
      score: 5
    },
    {
      id: 101,
      title: 'Classification',
      criteriaKey: 'classification',
      sortOrder: 5,
      score: 6
    },
    {
      id: 102,
      title: 'Room category',
      criteriaKey: 'roomtypecategory',
      sortOrder: 6,
      score: 7
    },
    {
      id: 103,
      title: 'Concept',
      criteriaKey: 'concept',
      sortOrder: 7,
      score: 8
    },
    {
      id: 104,
      title: 'Label',
      criteriaKey: 'label',
      sortOrder: 8,
      score: 9
    },
    {
      id: 105,
      title: 'Accommodation',
      criteriaKey: 'accommodationcode',
      sortOrder: 9,
      score: 10
    },
    {
      id: 106,
      title: 'Room code',
      criteriaKey: 'roomcode',
      sortOrder: 10,
      score: 11
    }
  ],
  valueDefinitions: [
    {
      id: 36,
      title: 'Value',
      ageCategoryType: 'All',
      ageCategoryIndex: 0,
      sortOrder: 0,
      valueType: 'Percentage'
    },
    {
      id: 37,
      title: 'Min',
      ageCategoryType: 'All',
      ageCategoryIndex: 0,
      sortOrder: 1,
      valueType: 'MinThreshold'
    },
    {
      id: 38,
      title: 'Max',
      ageCategoryType: 'All',
      ageCategoryIndex: 0,
      sortOrder: 2,
      valueType: 'MaxThreshold'
    }
  ],
  associatedProductIds: [],
  showCurrency: true,
  flightTemplateType: ''
};

describe('ruleValidationFunctions', () => {
  it('accommodation_component should return the correct message when the rule is invalid', async () => {
    const result = await ruleValidationFunctions.accommodation_component(rule);

    expect(result.isValid).toBe(false);
    expect(result.message).not.toBeNull();

    render(result.message);
    const validationMessageText = screen.getByText(/Conflicting date period:/i);
    expect(validationMessageText).toBeInTheDocument();
  });
});
