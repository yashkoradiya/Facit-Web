import * as objectHelper from './objectHelper';

describe("getNumberOfProperties", () => {
  
  it("should return the number of properties in an object", () => {
    const obj = {
      1: "a",
      2: "b"
    };
    expect(objectHelper.getNumberOfProperties(obj)).toBe(2);
  });

  it("should return 0 if object has no properties", () => {
    expect(objectHelper.getNumberOfProperties({})).toBe(0);
  });

});

describe("isNullOrUndefined", () => {

  it("should return true if object is undefined", () => {
    let a;
    expect(objectHelper.isNullOrUndefined(a)).toBe(true);
  });

  it("should return true if object is null", () => {
    const a = null;
    expect(objectHelper.isNullOrUndefined(a)).toBe(true);
  });

  it("should return false if object is empty string", () => {
    expect(objectHelper.isNullOrUndefined("")).toBe(false);
  });

  it("should return false if object is empty object", () => {
    expect(objectHelper.isNullOrUndefined({})).toBe(false);
  });

  it("should return false if object is empty array", () => {
    expect(objectHelper.isNullOrUndefined([])).toBe(false);
  });

  it("should return false if object is boolean false", () => {
    expect(objectHelper.isNullOrUndefined(false)).toBe(false);
  });

  it("should return false if object is 0", () => {
    expect(objectHelper.isNullOrUndefined(0)).toBe(false);
  });


});