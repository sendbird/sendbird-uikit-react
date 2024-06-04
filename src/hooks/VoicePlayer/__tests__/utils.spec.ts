import {
  VOICE_MESSAGE_MIME_TYPE,
  VOICE_MESSAGE_MIME_TYPE__M4A,
} from '../../../utils/consts';
import { isSafari } from '../../../utils/browser';
import { getParsedMimeType } from '../utils';

describe('getParsedMimeType', () => {
  const originalUserAgent = navigator.userAgent;

  afterEach(() => {
    Object.defineProperty(navigator, 'userAgent', {
      value: originalUserAgent,
      writable: false,
    });
  });

  it('should return VOICE_MESSAGE_MIME_TYPE__M4A for Safari and m4a MIME type', () => {
    const safariUserAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15';

    Object.defineProperty(navigator, 'userAgent', {
      value: safariUserAgent,
      writable: true,
    });

    expect(isSafari(safariUserAgent)).toBe(true);
    expect(getParsedMimeType('audio/mp3')).toBe(VOICE_MESSAGE_MIME_TYPE);
    expect(getParsedMimeType('audio/m4a')).toBe(VOICE_MESSAGE_MIME_TYPE__M4A);
  });

  it('should return VOICE_MESSAGE_MIME_TYPE for non-Safari browser and m4a MIME type', () => {
    const chromeUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
    Object.defineProperty(navigator, 'userAgent', {
      value: chromeUserAgent,
      writable: true,
    });

    expect(isSafari(chromeUserAgent)).toBe(false);
    expect(getParsedMimeType('audio/mp3')).toBe(VOICE_MESSAGE_MIME_TYPE);
    expect(getParsedMimeType('audio/m4a')).toBe(VOICE_MESSAGE_MIME_TYPE);
  });
});
