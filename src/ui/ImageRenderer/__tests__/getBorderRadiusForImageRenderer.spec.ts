import {getBorderRadiusForImageRenderer} from "../index";

describe('Global-utils/getBorderRadiusForImageRenderer', () => {
  it('when given nothing, return null', () => {
    expect(getBorderRadiusForImageRenderer(undefined, undefined)).toBeNull();
  });
  it('when given borderRadius=12 only, return 12px', () => {
    expect(getBorderRadiusForImageRenderer(undefined, 12)).toBe('12px');
  });
  it('when given borderRadius=12px only, return 12px', () => {
    expect(getBorderRadiusForImageRenderer(undefined, '12px')).toBe('12px');
  });
  it('when given circle=false only, return null', () => {
    expect(getBorderRadiusForImageRenderer(false, undefined)).toBeNull();
  });
  it('when given circle=false and borderRadius=12, return 12px', () => {
    expect(getBorderRadiusForImageRenderer(false, 12)).toBe('12px');
  });
  it('when given circle=false and borderRadius=12px, return 12px', () => {
    expect(getBorderRadiusForImageRenderer(false, '12px')).toBe('12px');
  });
  it('when given circle=true only, return 50%', () => {
    expect(getBorderRadiusForImageRenderer(true, undefined)).toBe('50%');
  });
  it('when given circle=true and borderRadius=12, return 50%', () => {
    expect(getBorderRadiusForImageRenderer(true, 12)).toBe('50%');
  });
  it('when given circle=true and borderRadius=12px, return 50%', () => {
    expect(getBorderRadiusForImageRenderer(true, '12px')).toBe('50%');
  });
});
