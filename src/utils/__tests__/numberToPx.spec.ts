import numberToPx from '../numberToPx';

describe('Global-utils/numberToPx', () => {
  it('when given number, should return pixel string.', () => {
    expect(numberToPx(12)).toBe('12px');
  });
  it('when given pixel string, should return pixel string.', () => {
    expect(numberToPx('12px')).toBe('12px');
  });
  it('when given random string, should return random string.', () => {
    expect(numberToPx('wefwefwef323')).toBe('wefwefwef323');
  });
});
