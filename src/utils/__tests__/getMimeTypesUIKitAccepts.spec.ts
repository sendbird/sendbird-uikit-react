import { getMimeTypesUIKitAccepts, SUPPORTED_MIMES, SUPPORTED_FILE_EXTENSIONS } from '../index';

describe('Global-utils/getMimeTypesUIKitAccepts', () => {
  const allTypesAndExtensions = [
    ...Object.values(SUPPORTED_MIMES).flat(),
    ...Object.values(SUPPORTED_FILE_EXTENSIONS).flat(),
  ].join();

  it('should return all supported MIME types and file extensions when no input is provided', () => {
    expect(getMimeTypesUIKitAccepts()).toBe(allTypesAndExtensions);
  });

  it('should return all supported MIME types and file extensions when an empty array is provided', () => {
    expect(getMimeTypesUIKitAccepts([])).toBe(allTypesAndExtensions);
  });

  it('should return IMAGE mime types and extensions when [image] is provided', () => {
    const expected = [...SUPPORTED_MIMES.IMAGE, ...SUPPORTED_FILE_EXTENSIONS.IMAGE].join();
    expect(getMimeTypesUIKitAccepts(['image'])).toBe(expected);
  });

  it('should return VIDEO mime types and extensions when [video] is provided', () => {
    const expected = [...SUPPORTED_MIMES.VIDEO, ...SUPPORTED_FILE_EXTENSIONS.VIDEO].join();
    expect(getMimeTypesUIKitAccepts(['video'])).toBe(expected);
  });

  it('should return AUDIO mime types and extensions when [audio] is provided', () => {
    const expected = [...SUPPORTED_MIMES.AUDIO, ...SUPPORTED_FILE_EXTENSIONS.AUDIO].join();
    expect(getMimeTypesUIKitAccepts(['audio'])).toBe(expected);
  });

  it('should return combined IMAGE and VIDEO mime types and extensions when [image, video] is provided', () => {
    const expected = [
      ...SUPPORTED_MIMES.IMAGE,
      ...SUPPORTED_FILE_EXTENSIONS.IMAGE,
      ...SUPPORTED_MIMES.VIDEO,
      ...SUPPORTED_FILE_EXTENSIONS.VIDEO,
    ].join();
    expect(getMimeTypesUIKitAccepts(['image', 'video'])).toBe(expected);
  });

  it('should return exact mime types or extensions when specific ones are provided', () => {
    const input = ['image/png', '.pdf', 'audio/mp3'];
    expect(getMimeTypesUIKitAccepts(input)).toBe(input.join(','));
  });

  it('should handle a mix of category names, specific mime types, and file extensions', () => {
    const input = ['image', 'application/pdf', '.txt'];
    const expected = [
      ...SUPPORTED_MIMES.IMAGE,
      ...SUPPORTED_FILE_EXTENSIONS.IMAGE,
      'application/pdf',
      '.txt',
    ].join();
    expect(getMimeTypesUIKitAccepts(input)).toBe(expected);
  });

  it('should ignore unsupported category names', () => {
    const input = ['image', 'video', 'unsupported'];
    const expected = [
      ...SUPPORTED_MIMES.IMAGE,
      ...SUPPORTED_FILE_EXTENSIONS.IMAGE,
      ...SUPPORTED_MIMES.VIDEO,
      ...SUPPORTED_FILE_EXTENSIONS.VIDEO,
      'unsupported',
    ].join();
    expect(getMimeTypesUIKitAccepts(input)).toBe(expected);
  });

  it('should handle duplicate inputs', () => {
    const input = ['image', 'image', 'video', 'image/png', '.jpg', '.jpg'];
    const expected = [
      ...SUPPORTED_MIMES.IMAGE,
      ...SUPPORTED_FILE_EXTENSIONS.IMAGE,
      ...SUPPORTED_MIMES.VIDEO,
      ...SUPPORTED_FILE_EXTENSIONS.VIDEO,
    ].join();
    expect(getMimeTypesUIKitAccepts(input)).toBe(expected);
  });

  it('should return all supported types and extensions for null input', () => {
    expect(getMimeTypesUIKitAccepts(null as any)).toBe(allTypesAndExtensions);
  });

  it('should return all supported types and extensions for undefined input', () => {
    expect(getMimeTypesUIKitAccepts(undefined as any)).toBe(allTypesAndExtensions);
  });

  it('should handle case-insensitive category names', () => {
    const result = getMimeTypesUIKitAccepts(['IMAGE', 'Video', 'AuDiO']);

    // 각 카테고리의 MIME 타입과 확장자가 포함되어 있는지 확인
    SUPPORTED_MIMES.IMAGE.forEach(mime => expect(result).toContain(mime));
    SUPPORTED_FILE_EXTENSIONS.IMAGE.forEach(ext => expect(result).toContain(ext));

    SUPPORTED_MIMES.VIDEO.forEach(mime => expect(result).toContain(mime));
    SUPPORTED_FILE_EXTENSIONS.VIDEO.forEach(ext => expect(result).toContain(ext));

    SUPPORTED_MIMES.AUDIO.forEach(mime => expect(result).toContain(mime));
    SUPPORTED_FILE_EXTENSIONS.AUDIO.forEach(ext => expect(result).toContain(ext));

    // 결과에 중복이 없는지 확인
    const uniqueResult = new Set(result.split(','));
    expect(uniqueResult.size).toBe(result.split(',').length);

    // 대소문자 구분 없이 처리되었는지 확인
    expect(result).not.toContain('IMAGE');
    expect(result).not.toContain('Video');
    expect(result).not.toContain('AuDiO');
  });
});
