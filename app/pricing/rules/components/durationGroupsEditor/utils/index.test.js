import { validateRow, validateAllDurationGroups } from './';
describe('DurationGroupEditor utils', () => {
  describe('validateAllDurationGroups', () => {
    it('should return true when groups are adjacent', () => {
      const durationGroups = [
        { from: 1, to: 7, key: 'key-1' },
        { from: 8, to: 14, key: 'key-2' },
        { from: 15, to: 21, key: 'key-3', isNew: true }
      ];
      let actual = validateAllDurationGroups(durationGroups);

      expect(actual).toBe(true);
    });

    it('should return false when from and to are overlapping', () => {
      const durationGroups = [
        { from: 1, to: 7, key: 'key-1' },
        { from: 8, to: 14, key: 'key-2' },
        { from: 14, to: 21, key: 'key-3', isNew: true }
      ];
      let actual = validateAllDurationGroups(durationGroups);
      expect(actual).toBe(false);
    });

    it('should return false when groups are completely overlapping', () => {
      const durationGroups = [
        { from: 1, to: 7, key: 'key-1' },
        { from: 8, to: 10, key: 'key-2' },
        { from: 8, to: 14, key: 'key-3', isNew: true }
      ];
      let actual = validateAllDurationGroups(durationGroups);
      expect(actual).toBe(false);
    });

    it('should return false when groups are partially overlapping', () => {
      const durationGroups = [
        { from: 1, to: 7, key: 'key-1' },
        { from: 8, to: 10, key: 'key-2' },
        { from: 9, to: 14, key: 'key-3', isNew: true }
      ];
      let actual = validateAllDurationGroups(durationGroups);
      expect(actual).toBe(false);
    });

    it('should return false when groups cover the same values', () => {
      const durationGroups = [{ from: 1, to: 7, key: 'key-1' }, { from: 1, to: 7, key: 'key-2', isNew: true }];
      let actual = validateAllDurationGroups(durationGroups);
      expect(actual).toBe(false);
    });

    it('should return true when groups are adjacent and duration is a single day', () => {
      const durationGroups = [
        { id: 1, from: 1, to: 1, key: '1eeb90c2-e37e-953f-de35-7cedabe19e65' },
        { from: 2, to: 2, key: 'dc6bebf-4563-1509-b407-c68353c38650', isNew: true, valid: true }
      ];
      let actual = validateAllDurationGroups(durationGroups);
      expect(actual).toBe(true);
    });
  });

  describe('validateRow', () => {
    it('should return false when from is bigger than to', () => {
      const durationGroup = { from: 2, to: 1, key: 'key-1' };
      let actual = validateRow(durationGroup);
      expect(actual).toBe(false);
    });

    it('should return true when to is bigger than from', () => {
      const durationGroup = { from: 1, to: 2, key: 'key-1' };
      let actual = validateRow(durationGroup);
      expect(actual).toBe(true);
    });

    it('should return false when to is not set', () => {
      const durationGroup = { from: 1, key: 'key-1' };
      let actual = validateRow(durationGroup);
      expect(actual).toBe(false);
    });

    it('should return true when from is not set but to is', () => {
      const durationGroup = { to: 1, key: 'key-1' };
      let actual = validateRow(durationGroup);
      expect(actual).toBe(true);
    });
  });
});
