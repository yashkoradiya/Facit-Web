import * as numberHelper from './numberHelper';

describe("isNumber", () => {
  it("should return false when value is empty", () => {
    expect(numberHelper.isNumber("")).toBe(false);
    expect(numberHelper.isNumber()).toBe(false);
  });

  it("should return false when value is not a number", () => {
    expect(numberHelper.isNumber("test")).toBe(false);
    expect(numberHelper.isNumber("1test")).toBe(false);
    expect(numberHelper.isNumber({})).toBe(false);
    expect(numberHelper.isNumber([])).toBe(false);
    expect(numberHelper.isNumber(null)).toBe(false);
  });

  it("should return true when value is integer number", () => {
    expect(numberHelper.isNumber(0)).toBe(true);
    expect(numberHelper.isNumber(Number(1))).toBe(true);
    expect(numberHelper.isNumber(Number())).toBe(true);
  });

  it("should return true when value is decimal number", () => {
    expect(numberHelper.isNumber(1.5)).toBe(true);
    expect(numberHelper.isNumber(Number(1.5))).toBe(true);
  });

  it("should return true when value is integer string", () => {
    expect(numberHelper.isNumber("1")).toBe(true);
    expect(numberHelper.isNumber(" 1 ")).toBe(true);
    expect(numberHelper.isNumber("1 000")).toBe(true);
  });

  it("should return true when value is decimal string using dot", () => {
    expect(numberHelper.isNumber("1.5")).toBe(true);
    expect(numberHelper.isNumber(" 1.5 ")).toBe(true);
    expect(numberHelper.isNumber("1 000.5")).toBe(true);
  });

  it("should return true when value is decimal string using comma", () => {
    expect(numberHelper.isNumber("1,5")).toBe(true);
    expect(numberHelper.isNumber(" 1,5 ")).toBe(true);
    expect(numberHelper.isNumber("1 000,5")).toBe(true);
  });

});

describe("getNumber", () => {
  it("should return null when value is not a number", () => {
    expect(numberHelper.getNumber()).toBe(null);
    expect(numberHelper.getNumber("")).toBe(null);
    expect(numberHelper.getNumber(" ")).toBe(null);
    expect(numberHelper.getNumber("test")).toBe(null);
    expect(numberHelper.getNumber("1test")).toBe(null);
    expect(numberHelper.getNumber({})).toBe(null);
    expect(numberHelper.getNumber([])).toBe(null);
    expect(numberHelper.getNumber(null)).toBe(null);
  });

  it("should return a number when value is integer number", () => {
    expect(numberHelper.getNumber(0)).toBe(0);
    expect(numberHelper.getNumber(Number(1))).toBe(1);
    expect(numberHelper.getNumber(Number())).toBe(0);
  });

  it("should return a number when value is decimal number", () => {
    expect(numberHelper.getNumber(1.5)).toBe(1.5);
    expect(numberHelper.getNumber(Number(1.5))).toBe(1.5);
  });

  it("should return a number when value is integer string", () => {
    expect(numberHelper.getNumber("1")).toBe(1);
    expect(numberHelper.getNumber(" 1 ")).toBe(1);
    expect(numberHelper.getNumber("1 000")).toBe(1000);
  });

  it("should return a number when value is decimal string using dot", () => {
    expect(numberHelper.getNumber("1.5")).toBe(1.5);
    expect(numberHelper.getNumber(" 1.5 ")).toBe(1.5);
    expect(numberHelper.getNumber("1 000.5")).toBe(1000.5);
  });

  it("should return a number when value is decimal string using comma", () => {
    expect(numberHelper.getNumber("1,5")).toBe(1.5);
    expect(numberHelper.getNumber(" 1,5 ")).toBe(1.5);
    expect(numberHelper.getNumber("1 000,5")).toBe(1000.5);
  });
});

describe("formatDecimal", () => {
  it("should return unmodified value when value is not a number", () => {
    expect(numberHelper.formatDecimal()).toBeUndefined();
    expect(numberHelper.formatDecimal("")).toBe("");
    expect(numberHelper.formatDecimal(" ")).toBe(" ");
    expect(numberHelper.formatDecimal("test")).toBe("test");
    expect(numberHelper.formatDecimal("1test")).toBe("1test");
    expect(numberHelper.formatDecimal({})).toEqual({});
    expect(numberHelper.formatDecimal([])).toEqual([]);
    expect(numberHelper.formatDecimal(null)).toBe(null);
  });

  it("should return formatted decimal string with given precision for integer numbers", () => {
    expect(numberHelper.formatDecimal(1, 2)).toBe("1.00");
    expect(numberHelper.formatDecimal(Number(1), 2)).toBe("1.00");
    expect(numberHelper.formatDecimal(Number(), 2)).toBe("0.00");
  });

  it("should return formatted decimal string with given precision for decimal numbers", () => {
    expect(numberHelper.formatDecimal(1.3, 2)).toBe("1.30");
    expect(numberHelper.formatDecimal(Number(1.3), 2)).toBe("1.30");
  });

  it("should return formatted decimal string with given precision for integer string", () => {
    expect(numberHelper.formatDecimal("1", 2)).toBe("1.00");
    expect(numberHelper.formatDecimal(" 1 ", 2)).toBe("1.00");
    expect(numberHelper.formatDecimal("1 000", 2)).toBe("1000.00");
  });

  it("should return formatted decimal string with given precision for decimal string using dot", () => {
    expect(numberHelper.formatDecimal("1.5", 2)).toBe("1.50");
    expect(numberHelper.formatDecimal(" 1.5 ", 2)).toBe("1.50");
    expect(numberHelper.formatDecimal("1 000.5", 2)).toBe("1000.50");
  });

  it("should return formatted decimal string with given precision for decimal string using comma", () => {
    expect(numberHelper.formatDecimal("1,5", 2)).toBe("1.50");
    expect(numberHelper.formatDecimal(" 1,5 ", 2)).toBe("1.50");
    expect(numberHelper.formatDecimal("1 000,5", 2)).toBe("1000.50");
  });

  it("should return rounded decimal string", () => {
    expect(numberHelper.formatDecimal(1.333, 2)).toBe("1.33");
    expect(numberHelper.formatDecimal(1.338, 2)).toBe("1.34");
    expect(numberHelper.formatDecimal(1.335, 2)).toBe("1.33");
  });
});