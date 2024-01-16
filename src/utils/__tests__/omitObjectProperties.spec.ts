import { omitObjectProperties } from '../omitObjectProperty';

const mockObject = {
  a: 'a',
  b: 'b',
  c: 'c',
  one: 1,
  two: 2,
  null: null,
  undefined: undefined,
};

describe('Global-utils/omitObjectProperties', () => {
  it('should omit the existing properties from object', () => {
    expect(omitObjectProperties(mockObject, ['a', 'two', 'null', 'undefined']))
      .toEqual({
        b: 'b',
        c: 'c',
        one: 1,
      });
  });

  it('should not omit not-existing properties', () => {
    expect(omitObjectProperties(mockObject, ['d', 'three', 'NaN']))
      .toEqual(mockObject);
  });

  it('should not affect to the original object', () => {
    const clone = { ...mockObject };
    expect(omitObjectProperties(mockObject, ['a', 'two', 'null', 'undefined']))
      .toEqual({
        b: 'b',
        c: 'c',
        one: 1,
      });
    expect(mockObject).toEqual(clone);
  });
});
