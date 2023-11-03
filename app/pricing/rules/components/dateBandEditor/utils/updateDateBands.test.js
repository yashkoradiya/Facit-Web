import moment from 'moment';
import { updateDateBandValue, updateDateBandsWithDuration } from './updateDateBands';

describe('updateDateBands', () => {
  describe('updateDateBandValue', () => {
    it('should update provided datebands with correct value ', () => {
      const dateBandKey = 'dateBandKey-1';
      const propertyName = 'durationGroupKey-1_valueDefinitionId-1';
      const value = 1;
      let flatDateBands = [
        {
          'durationGroupKey-1_valueDefinitionId-1': null,
          'durationGroupKey-1_valueDefinitionId-2': null,
          from: null,
          isNewDateBand: true,
          key: 'dateBandKey-1',
          to: null
        }
      ];

      const actual = updateDateBandValue(dateBandKey, propertyName, value, flatDateBands);
      expect(actual[0]['from']).toBe(null);
      expect(actual[0]['to']).toBe(null);
      expect(actual[0]['durationGroupKey-1_valueDefinitionId-1']).toBe(1);
      expect(actual[0]['durationGroupKey-1_valueDefinitionId-2']).toBe(null);
    });
  });

  describe('updateDateBandsWithDuration', () => {
    it('should remove duration group from datebands', () => {
      let flatDateBands = [
        {
          'durationGroupKey-1_valueDefinitionId-1': 1,
          'durationGroupKey-1_valueDefinitionId-2': 2,
          'durationGroupKey-2_valueDefinitionId-1': 3,
          'durationGroupKey-2_valueDefinitionId-2': 4,
          from: null,
          isNewDateBand: true,
          key: 'dateBandKey-1',
          to: null
        }
      ];

      const durationGroups = [{ from: 4, to: 6, key: 'durationGroupKey-2' }];

      const actual = updateDateBandsWithDuration(flatDateBands, durationGroups);
      expect(Object.keys(actual[0]).length).toBe(6);
      expect(actual[0]['durationGroupKey-2_valueDefinitionId-1']).toBe(3);
      expect(actual[0]['durationGroupKey-2_valueDefinitionId-2']).toBe(4);
    });

    it('should add duration group with null value to datebands', () => {
      let flatDateBands = [
        {
          'durationGroupKey-1_valueDefinitionId-1': 1,
          'durationGroupKey-1_valueDefinitionId-2': 2,
          from: null,
          isNewDateBand: true,
          key: 'dateBandKey-1',
          to: null
        }
      ];

      const durationGroups = [
        { from: 4, to: 6, key: 'durationGroupKey-1' },
        { from: 4, to: 6, key: 'durationGroupKey-2' }
      ];

      const actual = updateDateBandsWithDuration(flatDateBands, durationGroups);
      expect(Object.keys(actual[0]).length).toBe(8);
      expect(actual[0]['durationGroupKey-2_valueDefinitionId-1']).toBe(null);
      expect(actual[0]['durationGroupKey-2_valueDefinitionId-2']).toBe(null);
    });

    it('should do nothing when durationGroups are empty', () => {
      const flatDateBands = [
        {
          'durationGroupKey-1_valueDefinitionId-1': 1,
          'durationGroupKey-1_valueDefinitionId-2': 2,
          from: null,
          isNewDateBand: true,
          key: 'key',
          to: null
        }
      ];
      const durationGroups = [];

      const actual = updateDateBandsWithDuration(flatDateBands, durationGroups);
      expect(actual).toStrictEqual(flatDateBands);
    });

    it('should do nothing when durationGroups is undefined', () => {
      const flatDateBands = [
        {
          'durationGroupKey-1_valueDefinitionId-1': 1,
          'durationGroupKey-1_valueDefinitionId-2': 2,
          from: null,
          isNewDateBand: true,
          key: 'key',
          to: null
        }
      ];

      const actual = updateDateBandsWithDuration(flatDateBands);
      expect(actual).toStrictEqual(flatDateBands);
    });
  });
});
