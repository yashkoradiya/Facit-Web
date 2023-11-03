import flattenDateBands from './flattenDateBands';

const dateBandWithDurationGroups = [
  {
    from: '2019-01-01',
    key: 'key',
    to: '2020-01-01',
    values: [
      {
        id: 450,
        value: 7,
        valueDefinitionId: 37,
        durationGroup: { from: 1, to: 3, key: 'key_1-3' }
      },
      {
        id: 451,
        value: 10,
        valueDefinitionId: 37,
        durationGroup: { from: 4, to: 6, key: 'key_4-6' }
      },
      {
        id: 45,
        value: 4,
        valueDefinitionId: 33,
        durationGroup: { from: 1, to: 3, key: 'key_1-3' }
      },
      {
        id: 46,
        value: 5,
        valueDefinitionId: 33,
        durationGroup: { from: 4, to: 6, key: 'key_4-6' }
      }
    ]
  }
];

const dateBandWithOutDurationGroups = [
  {
    from: '2019-01-01',
    key: 'key',
    to: '2020-01-01',
    values: [
      {
        id: 450,
        value: 7,
        valueDefinitionId: 37
      },
      {
        id: 45,
        value: 4,
        valueDefinitionId: 33
      }
    ]
  }
];

describe('flatten date bands without duration', () => {
  let actual;
  beforeEach(() => {
    actual = flattenDateBands(dateBandWithOutDurationGroups);
  });

  it('should generate one row per dateband', () => {
    expect(actual.length).toBe(1);
  });

  it('should set key, from and to', () => {
    expect(actual[0]['key']).toBe('key');
    expect(actual[0]['from']).toBe('2019-01-01');
    expect(actual[0]['to']).toBe('2020-01-01');
  });

  it('should generate one property for each value definition id', () => {
    expect(actual[0]['37']).toBe(7);
    expect(actual[0]['33']).toBe(4);
  });
});

describe('flatten date bands with duration', () => {
  let actual;
  beforeEach(() => {
    actual = flattenDateBands(dateBandWithDurationGroups);
  });

  it('should generate one row per dateband', () => {
    expect(actual.length).toBe(1);
  });

  it('should set key, from and to', () => {
    expect(actual[0]['key']).toBe('key');
    expect(actual[0]['from']).toBe('2019-01-01');
    expect(actual[0]['to']).toBe('2020-01-01');
  });

  it('should generate one property for each unique duration and value definition id', () => {
    expect(actual[0]['key_1-3_37']).toBe(7);
    expect(actual[0]['key_1-3_33']).toBe(4);

    expect(actual[0]['key_4-6_37']).toBe(10);
    expect(actual[0]['key_4-6_33']).toBe(5);
  });
});
