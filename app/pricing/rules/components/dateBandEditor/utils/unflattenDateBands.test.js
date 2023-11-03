import unflattenDateBands from './unflattenDateBands';

const flatdateBandsWithoutDuration = [
  {
    from: '2019-01-01',
    key: 'key',
    to: '2020-01-01',
    '37': 7,
    '33': 5,
    isNewDateBand: false
  }
];

describe('unflatten date bands without duration', () => {
  let actual;
  beforeEach(() => {
    actual = unflattenDateBands(flatdateBandsWithoutDuration);
  });

  it('should generate one row per dateband', () => {
    expect(actual.length).toBe(1);
  });

  it('should set key, from and to', () => {
    expect(actual[0]['key']).toBe('key');
    expect(actual[0]['from']).toBe('2019-01-01');
    expect(actual[0]['to']).toBe('2020-01-01');
  });

  it('should generate one value object for each value definition id property', () => {
    expect(actual[0].values.length).toBe(2);

    const a = actual[0].values[0];
    expect(a.valueDefinitionId).toBe(33);
    expect(a.value).toBe(5);

    const b = actual[0].values[1];
    expect(b.valueDefinitionId).toBe(37);
    expect(b.value).toBe(7);
  });
});

const durationGroups = [{ key: 'key1-3', from: 1, to: 3 }, { key: 'key4-6', from: 4, to: 6 }];

const flatdateBandsWithDuration = [
  {
    from: '2019-01-01',
    key: 'key',
    to: '2020-01-01',
    'key1-3_37': 7,
    'key4-6_37': 10
  }
];
describe('unflatten date bands with duration', () => {
  let actual;
  beforeEach(() => {
    actual = unflattenDateBands(flatdateBandsWithDuration, durationGroups);
  });

  it('should generate one row per dateband', () => {
    expect(actual.length).toBe(1);
  });

  it('should set key, from and to', () => {
    expect(actual[0]['key']).toBe('key');
    expect(actual[0]['from']).toBe('2019-01-01');
    expect(actual[0]['to']).toBe('2020-01-01');
  });

  it('should generate one value object for each unique valueDefinitionId and durationGroup', () => {
    const a = actual[0].values.find(x => x.durationGroup.key == 'key1-3');

    expect(a.value).toBe(7);
    expect(a.valueDefinitionId).toBe(37);

    const b = actual[0].values.find(x => x.durationGroup.key == 'key4-6');
    expect(b.value).toBe(10);
    expect(b.valueDefinitionId).toBe(37);
  });
});
