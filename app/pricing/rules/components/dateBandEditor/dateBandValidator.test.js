import { validateEverything, validateDate } from './dateBandValidator';
import moment from 'moment';

describe('dateBandValidator', () => {
  describe('validateEverything', () => {
    it('should validate absolute null values', () => {
      const dateBands = [
        {
          from: moment('20010101'),
          to: moment('20010102'),
          key: 'key-1',
          'duration-1_1': 1,
          'duration-1_2': 2,
          'duration-2_1': 1,
          'duration-2_2': null,

          isNewDateBand: undefined
        }
      ];
      let validationMessages = {};
      const valueDefinitions = [
        {
          id: 1,
          ageCategoryType: 'Adult',
          valueType: 'Absolute'
        },
        {
          id: 2,
          ageCategoryType: 'Child',
          valueType: 'Absolute'
        }
      ];
      validationMessages = validateEverything(dateBands, validationMessages, valueDefinitions);
      expect(validationMessages).toStrictEqual({ 'key-1_duration-2_2': 'Not a valid number' });
    });
  });
  describe('validateDate', () => {
    it('should allow from and to being the same date', () => {
      const dateBand = {
        key: 'key',
        from: moment('20010101'),
        to: moment('20010101')
      };
      let validationMessages = {};
      validationMessages = validateDate('from', dateBand, validationMessages);
      expect(validationMessages).toStrictEqual({});
    });
  });
});
