import { getMimeTypesUIKitAccepts, SUPPORTED_MIMES } from '../index';

describe('Global-utils/getMimeTypesUIKitAccepts', () => {
  it('when no input, should return all SUPPORTED_MIMES.', () => {
    const allMimeTypes: string[] = Object.values(SUPPORTED_MIMES)
      .reduce((accumulator: string[], mimes: string[]): string[] => {
        return accumulator.concat(mimes);
      });
    expect(getMimeTypesUIKitAccepts()).toBe(allMimeTypes.join());
  });
  it('when given [image], should return IMAGE mime types.', () => {
    expect(getMimeTypesUIKitAccepts(['image'])).toBe(SUPPORTED_MIMES.IMAGE.join());
  });
  it('when given [image, video], should return IMAGE and VIDEO mime types.', () => {
    expect(getMimeTypesUIKitAccepts(['image', 'video']))
      .toBe([SUPPORTED_MIMES.IMAGE.join(), SUPPORTED_MIMES.VIDEO.join()].join());
  });
  it('when given empty array, should return all SUPPORTED_MIMES.', () => {
    const allMimeTypes: string[] = Object.values(SUPPORTED_MIMES)
      .reduce((accumulator: string[], mimes: string[]): string[] => {
        return accumulator.concat(mimes);
      });
    expect(getMimeTypesUIKitAccepts([])).toBe(allMimeTypes.join());
  });
});
