import { getDynamicMinLengthInPx } from '../utils';

describe('Global-utils/getBorderRadiusForImageRenderer', () => {
  it('when maxSideLength is null and sideLength = 100 < defaultMinLength = 200, return min(200px, 100px).', () => {
    let sideLength: string | number = 100;
    const maxSideLength: string | null = null;
    const defaultMinLength = '200px';
    expect(getDynamicMinLengthInPx(sideLength, maxSideLength, defaultMinLength)).toBe('min(200px, 100px)');
    sideLength = '100px';
    expect(getDynamicMinLengthInPx(sideLength, maxSideLength, defaultMinLength)).toBe('min(200px, 100px)');
  });
  it('when maxSideLength is null and sideLength = 200 > defaultMinLength = 100, return min(100px, 200px).', () => {
    const sideLength: string | number = 200;
    const maxSideLength: string | null = null;
    const defaultMinLength = '100px';
    expect(getDynamicMinLengthInPx(sideLength, maxSideLength, defaultMinLength)).toBe('min(100px, 200px)');
  });
  it('when sideLength = 100 < maxSideLength = 200 and defaultMinLength = 300, return min(100px, 200px).', () => {
    const sideLength: string | number = '100px';
    const maxSideLength: string | null = '200px';
    const defaultMinLength = '300px';
    expect(getDynamicMinLengthInPx(sideLength, maxSideLength, defaultMinLength)).toBe('min(200px, 100px)');
  });
  it('when sideLength = 200 > maxSideLength = 100 and defaultMinLength = 300, return min(100px, 200px).', () => {
    const sideLength: string | number = '200px';
    const maxSideLength: string | null = '100px';
    const defaultMinLength = '300px';
    expect(getDynamicMinLengthInPx(sideLength, maxSideLength, defaultMinLength)).toBe('min(100px, 200px)');
  });
});
