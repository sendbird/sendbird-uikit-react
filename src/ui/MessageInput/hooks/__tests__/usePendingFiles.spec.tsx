import { act, renderHook } from '@testing-library/react';

import { usePendingFiles } from '../usePendingFiles';
import type { StringSet } from '../../../Label/stringSet';
import type { Mock } from 'vitest';

const ONE_MIB = 1024 * 1024;

const makeFile = (name: string, sizeBytes: number, type = 'text/plain'): File => {
  const file = new File([new Uint8Array(sizeBytes)], name, { type });
  return file;
};

const baseStringSet = {
  FILE_UPLOAD_NOTIFICATION__COUNT_LIMIT: 'Up to %d files can be attached.',
  FILE_UPLOAD_NOTIFICATION__SIZE_LIMIT: 'The maximum size per file is %d MB.',
  FILE_UPLOAD_NOTIFICATION__UNSUPPORTED_FILE_TYPE: 'The attachment failed because the file is in an unsupported format.',
  BUTTON__OK: 'OK',
} as unknown as StringSet;

const expectModalTitle = (openModal: Mock, title: string) => {
  expect(openModal).toHaveBeenCalledWith(expect.objectContaining({
    modalProps: expect.objectContaining({ titleText: title }),
  }));
};

const renderUsePendingFiles = (overrides: Partial<Parameters<typeof usePendingFiles>[0]> = {}) => {
  const openModal = vi.fn();
  const logger = {
    info: vi.fn(),
    warning: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  };
  const utils = renderHook(() => usePendingFiles({
    uikitUploadSizeLimit: 25 * ONE_MIB,
    uikitMultipleFilesMessageLimit: 10,
    openModal,
    stringSet: baseStringSet,
    logger: logger as any,
    ...overrides,
  }));
  return { ...utils, openModal, logger };
};

describe('usePendingFiles', () => {
  beforeEach(() => {
    (URL.createObjectURL as unknown) = vi.fn(() => 'blob:mock-url');
    (URL.revokeObjectURL as unknown) = vi.fn();
  });

  it('starts with empty pendingFiles and hasPendingFiles=false', () => {
    const { result } = renderUsePendingFiles();
    expect(result.current.pendingFiles).toEqual([]);
    expect(result.current.hasPendingFiles).toBe(false);
  });

  it('addFiles appends new entries and flips hasPendingFiles', () => {
    const { result } = renderUsePendingFiles();
    const file = makeFile('a.txt', 100);
    act(() => result.current.addFiles([file]));
    expect(result.current.pendingFiles).toHaveLength(1);
    expect(result.current.pendingFiles[0].file).toBe(file);
    expect(result.current.hasPendingFiles).toBe(true);
  });

  it('addFiles assigns previewUrl for images and undefined for non-images', () => {
    const { result } = renderUsePendingFiles();
    const image = makeFile('a.png', 100, 'image/png');
    const doc = makeFile('a.txt', 100, 'text/plain');
    act(() => result.current.addFiles([image, doc]));
    const [imageEntry, docEntry] = result.current.pendingFiles;
    expect(imageEntry.isImage).toBe(true);
    expect(imageEntry.previewUrl).toBe('blob:mock-url');
    expect(docEntry.isImage).toBe(false);
    expect(docEntry.previewUrl).toBeUndefined();
  });

  it('addFiles rejects the whole batch when count would exceed the limit', () => {
    const { result, openModal } = renderUsePendingFiles({ uikitMultipleFilesMessageLimit: 2 });
    const files = [makeFile('a.txt', 1), makeFile('b.txt', 1), makeFile('c.txt', 1)];
    act(() => result.current.addFiles(files));
    expect(result.current.pendingFiles).toEqual([]);
    expect(openModal).toHaveBeenCalledTimes(1);
    expectModalTitle(openModal, 'Up to 2 files can be attached.');
  });

  it('addFiles rejects the whole batch when any file exceeds the size limit', () => {
    const { result, openModal } = renderUsePendingFiles({ uikitUploadSizeLimit: ONE_MIB });
    const small = makeFile('a.txt', 100);
    const tooLarge = makeFile('b.txt', 2 * ONE_MIB);
    act(() => result.current.addFiles([small, tooLarge]));
    expect(result.current.pendingFiles).toEqual([]);
    expect(openModal).toHaveBeenCalledTimes(1);
    expectModalTitle(openModal, 'The maximum size per file is 1 MB.');
  });

  it('addFiles counts the existing staged files when checking the limit', () => {
    const { result, openModal } = renderUsePendingFiles({ uikitMultipleFilesMessageLimit: 2 });
    act(() => result.current.addFiles([makeFile('a.txt', 1), makeFile('b.txt', 1)]));
    expect(result.current.pendingFiles).toHaveLength(2);
    act(() => result.current.addFiles([makeFile('c.txt', 1)]));
    expect(result.current.pendingFiles).toHaveLength(2);
    expect(openModal).toHaveBeenCalledTimes(1);
    expectModalTitle(openModal, 'Up to 2 files can be attached.');
  });

  it('removeFile removes the targeted entry and revokes its object URL', () => {
    const { result } = renderUsePendingFiles();
    const image = makeFile('a.png', 100, 'image/png');
    act(() => result.current.addFiles([image]));
    const { id, previewUrl } = result.current.pendingFiles[0];
    act(() => result.current.removeFile(id));
    expect(result.current.pendingFiles).toEqual([]);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith(previewUrl);
  });

  it('clear empties the list and revokes every image preview URL', () => {
    const { result } = renderUsePendingFiles();
    const a = makeFile('a.png', 100, 'image/png');
    const b = makeFile('b.png', 100, 'image/png');
    const c = makeFile('c.txt', 100, 'text/plain');
    act(() => result.current.addFiles([a, b, c]));
    expect(result.current.pendingFiles).toHaveLength(3);
    act(() => result.current.clear());
    expect(result.current.pendingFiles).toEqual([]);
    // Two image previewUrls revoked; the non-image entry has no URL.
    expect(URL.revokeObjectURL).toHaveBeenCalledTimes(2);
  });

  it('revokes all remaining image preview URLs on unmount', () => {
    const { result, unmount } = renderUsePendingFiles();
    act(() => result.current.addFiles([
      makeFile('a.png', 100, 'image/png'),
      makeFile('b.png', 100, 'image/png'),
    ]));
    expect(result.current.pendingFiles).toHaveLength(2);
    unmount();
    expect(URL.revokeObjectURL).toHaveBeenCalledTimes(2);
  });

  it('addFiles with empty array is a no-op', () => {
    const { result, openModal } = renderUsePendingFiles();
    act(() => result.current.addFiles([]));
    expect(result.current.pendingFiles).toEqual([]);
    expect(openModal).not.toHaveBeenCalled();
  });

  it('rejects the whole batch and opens the unsupported-type modal when any file fails the MIME filter', () => {
    const { result, openModal } = renderUsePendingFiles({ acceptableMimeTypes: ['image'] });
    const png = makeFile('a.png', 100, 'image/png');
    const pdf = makeFile('b.pdf', 100, 'application/pdf');
    act(() => result.current.addFiles([png, pdf]));
    expect(result.current.pendingFiles).toEqual([]);
    expect(openModal).toHaveBeenCalledTimes(1);
    expectModalTitle(openModal, 'The attachment failed because the file is in an unsupported format.');
  });

  it('rejects extension-less files when acceptableMimeTypes is restricted', () => {
    const { result, openModal } = renderUsePendingFiles({ acceptableMimeTypes: ['image'] });
    const readme = makeFile('README', 1, '');
    act(() => result.current.addFiles([readme]));
    expect(result.current.pendingFiles).toEqual([]);
    expect(openModal).toHaveBeenCalledTimes(1);
    expectModalTitle(openModal, 'The attachment failed because the file is in an unsupported format.');
  });
});
