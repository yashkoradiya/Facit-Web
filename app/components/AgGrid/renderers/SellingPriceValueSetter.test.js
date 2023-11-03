import sellingPriceValueSetter from './sellingPriceValueSetter';

describe('sellingPriceValueSetter Function', () => {
  const mockOptions = {
    setChanges: jest.fn(),
    currency: 'USD'
  };

  const mockParams = {
    data: {
      sellingPrice: {
        values: {
          USD: 100,
          EUR: 80
        }
      },
      calcPrice: {
        values: {
          USD: 110,
          EUR: 90
        }
      },
      hasChanges: false,
      originalSellingPrice: null
    },
    oldValue: 100
  };

  it('sets changes when newValue is null, undefined, or empty', () => {
    const nullParams = { ...mockParams, newValue: null };
    const undefinedParams = { ...mockParams, newValue: undefined };
    const emptyParams = { ...mockParams, newValue: '' };

    const result1 = sellingPriceValueSetter(nullParams, mockOptions);
    const result2 = sellingPriceValueSetter(undefinedParams, mockOptions);
    const result3 = sellingPriceValueSetter(emptyParams, mockOptions);

    expect(result1).toBe(true);
    expect(result2).toBe(true);
    expect(result3).toBe(true);

    expect(mockParams.data.sellingPrice.values).toEqual(mockParams.data.calcPrice.values);
    expect(mockParams.data.hasChanges).toBe(true);
    expect(mockOptions.setChanges).toHaveBeenCalledWith(true);
  });

  it('updates data and sets changes when newValue is a valid number', () => {
    const newValue = 120;
    const validNumberParams = { ...mockParams, newValue };

    const result = sellingPriceValueSetter(validNumberParams, mockOptions);

    expect(result).toBe(120);

    expect(mockParams.data.hasChanges).toBe(true);
    expect(mockParams.data.originalSellingPrice).toBe(100);
    expect(mockParams.data.sellingPrice.values.USD).toBe(newValue);
    expect(mockOptions.setChanges).toHaveBeenCalledWith(true);
  });

  it('returns false when newValue is not a valid number', () => {
    const invalidNumberParams = { ...mockParams, newValue: 'invalid' };

    const result = sellingPriceValueSetter(invalidNumberParams, mockOptions);

    expect(result).toBe(false);

    expect(mockParams.data.hasChanges).toBe(true);
    expect(mockOptions.setChanges).toHaveBeenCalled();
  });
});
