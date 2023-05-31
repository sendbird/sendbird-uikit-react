import { isSameType } from '../types';

describe('isSameType', () => {
  it('should return true if both values have the same type', () => {
    expect(isSameType(10, 20)).toBe(true);
    expect(isSameType('hello', 'world')).toBe(true);
    expect(isSameType(true, false)).toBe(true);
    expect(isSameType({}, {})).toBe(true);
    expect(isSameType([], [])).toBe(true);
  });

  it('should return false if the values have different types', () => {
    expect(isSameType(10, 'hello')).toBe(false);
    expect(isSameType(true, 0)).toBe(false);
    expect(isSameType({}, [])).toBe(false);
    expect(isSameType(null, undefined)).toBe(false);
  });

  it('should handle null values correctly', () => {
    expect(isSameType(null, null)).toBe(true);
    expect(isSameType(null, 10)).toBe(false);
    expect(isSameType(20, null)).toBe(false);
  });

  it('should handle arrays correctly', () => {
    expect(isSameType([], [])).toBe(true);
    expect(isSameType([1, 2, 3], [4, 5, 6])).toBe(true);
    expect(isSameType([], {})).toBe(false);
  });
});
