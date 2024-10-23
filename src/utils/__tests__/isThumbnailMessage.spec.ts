import { FileMessage } from '@sendbird/chat/message';
import { isThumbnailMessage } from '../index';

const mockBmpFileMessage = {
  message: null,
  messageType: 'file',
  createdAt: 1,
  type: 'image/bmp',
  name: 'test_image.bmp',
  file: new File([], 'test_image.bmp'),
  metaArrays: [
    { key: 'KEY_INTERNAL_MESSAGE_TYPE', value: ['image/bmp'] },
  ],
} as unknown as FileMessage;

const mockHeicFileMessage = {
  message: null,
  messageType: 'file',
  createdAt: 1,
  type: 'image/heic',
  name: 'test_image.heic',
  file: new File([], 'test_image.heic'),
  metaArrays: [
    { key: 'KEY_INTERNAL_MESSAGE_TYPE', value: ['image/heic'] },
  ],
} as unknown as FileMessage;

describe('Global-utils/isThumbnailMessage', () => {

  it('should return ture for .bmp extension', () => {
    expect(isThumbnailMessage(mockBmpFileMessage)).toBe(true);
  });

  it('should return false for .heic extension', () => {
    expect(isThumbnailMessage(mockHeicFileMessage)).toBe(false);
  });

});
