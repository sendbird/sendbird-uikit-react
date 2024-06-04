import { isSafari } from '../../utils/browser';
import {
  VOICE_MESSAGE_MIME_TYPE,
  VOICE_MESSAGE_MIME_TYPE__M4A,
} from '../../utils/consts';

export type GroupKey = string;
export const generateGroupKey = (channelUrl = '', key = ''): GroupKey => (`${channelUrl}-${key}`);

/**
 * Parses and returns the correct MIME type based on the browser.
 * If the browser is Safari and the file type is m4a, use 'audio/x-m4a' for the audio player.
 * Safari doesn't support 'audio/mp3' well.
 * Also, 'audio/m4a' should be converted to 'audio/x-m4a' to be correctly played in Safari.
 * @link: https://sendbird.atlassian.net/browse/CLNP-2997
 *
 * @param mimeType - The original MIME type.
 * @returns The parsed MIME type.
 */
export const getParsedMimeType = (mimeType: string): string => {
  if (isSafari(navigator.userAgent) && mimeType.includes('m4a')) {
    return VOICE_MESSAGE_MIME_TYPE__M4A;
  }
  return VOICE_MESSAGE_MIME_TYPE;
};
