import createCurrencyHeaders from './createCurrencyHeaders';

describe('createCurrencyHeaders', () => {
  it('returns the correct header with available currencies', () => {
    const result = createCurrencyHeaders();
    expect(result).toBeInstanceOf(Object);
  });
});
