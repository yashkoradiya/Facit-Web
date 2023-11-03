import * as stringHelper from './stringHelper';

describe("isEmpty", () => {
  it("should return true for empty strings", () => {
    expect(stringHelper.isEmpty("")).toBe(true);
    expect(stringHelper.isEmpty(" ")).toBe(true);
  });

  it("should return true for empty values", () => {
    expect(stringHelper.isEmpty()).toBe(true);
    expect(stringHelper.isEmpty(null)).toBe(true);
    expect(stringHelper.isEmpty([])).toBe(true);
  });

  it("should return false for strings", () => {
    expect(stringHelper.isEmpty("t")).toBe(false);
  });

  it("should return false for objects", () => {
    expect(stringHelper.isEmpty({})).toBe(false);
  });
});

describe("isString", () => {
  it("should return true for string values", () => {
    expect(stringHelper.isString("")).toBe(true);
    expect(stringHelper.isString(" ")).toBe(true);
    expect(stringHelper.isString(String())).toBe(true);
    expect(stringHelper.isString(String("test"))).toBe(true);
  });

  it("should return false for non string values", () => {
    expect(stringHelper.isString([])).toBe(false);
    expect(stringHelper.isString(null)).toBe(false);
    expect(stringHelper.isString({})).toBe(false);
  });
});