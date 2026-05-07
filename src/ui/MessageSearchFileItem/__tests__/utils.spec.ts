import type { FileMessage } from '@sendbird/chat/message';
import enUS from 'date-fns/locale/en-US';
import { getCreatedAt, getIconOfFileType, truncate } from '../utils';
import { IconTypes } from '../../Icon';

const stringSet = {
  DATE_FORMAT__LAST_MESSAGE_CREATED_AT__TODAY: 'p',
  MESSAGE_STATUS__YESTERDAY: 'Yesterday',
  DATE_FORMAT__LAST_MESSAGE_CREATED_AT__THIS_YEAR: 'MMM d',
  DATE_FORMAT__LAST_MESSAGE_CREATED_AT__PREVIOUS_YEAR: 'yyyy/M/dd',
};

describe('MessageSearchFileItem/utils.getCreatedAt', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-06-15T12:00:00Z'));
  });
  afterEach(() => jest.useRealTimers());

  it('returns empty string when createdAt is 0/falsy', () => {
    expect(getCreatedAt({ createdAt: 0, stringSet })).toBe('');
  });

  it('formats today with TODAY pattern', () => {
    const today = new Date('2024-06-15T03:30:00Z').getTime();
    expect(getCreatedAt({ createdAt: today, stringSet })).toMatch(/[AP]M$/i);
  });

  it('returns YESTERDAY label when createdAt is yesterday', () => {
    const yesterday = new Date('2024-06-14T08:00:00Z').getTime();
    expect(getCreatedAt({ createdAt: yesterday, stringSet })).toBe(stringSet.MESSAGE_STATUS__YESTERDAY);
  });

  it('uses THIS_YEAR pattern for non-today, non-yesterday but same year', () => {
    const earlierThisYear = new Date('2024-01-10T08:00:00Z').getTime();
    expect(getCreatedAt({ createdAt: earlierThisYear, stringSet })).toBe('Jan 10');
  });

  it('uses PREVIOUS_YEAR pattern for older dates', () => {
    const lastYear = new Date('2023-04-05T08:00:00Z').getTime();
    expect(getCreatedAt({ createdAt: lastYear, stringSet })).toBe('2023/4/05');
  });

  it('threads optional locale through to date-fns', () => {
    const earlierThisYear = new Date('2024-01-10T08:00:00Z').getTime();
    // exercise the locale-truthy code path
    expect(getCreatedAt({ createdAt: earlierThisYear, stringSet, locale: enUS })).toBe('Jan 10');
  });
});

describe('MessageSearchFileItem/utils.getIconOfFileType', () => {
  const fileMsgWithUrl = (url: string) => ({
    messageType: 'file',
    url,
    type: '',
    metaArrays: [],
  }) as unknown as FileMessage;

  it('returns PHOTO for jpg/jpeg/png', () => {
    expect(getIconOfFileType(fileMsgWithUrl('a.jpg'))).toBe(IconTypes.PHOTO);
    expect(getIconOfFileType(fileMsgWithUrl('b.jpeg?x=1'))).toBe(IconTypes.PHOTO);
    expect(getIconOfFileType(fileMsgWithUrl('c.PNG#frag'))).toBe(IconTypes.PHOTO);
  });

  it('returns PLAY for mp4', () => {
    expect(getIconOfFileType(fileMsgWithUrl('clip.mp4'))).toBe(IconTypes.PLAY);
  });

  it('returns PLAY for voice messages even without mp4 extension', () => {
    const voiceMsg = {
      messageType: 'file',
      url: 'voice.bin',
      // audio mime + sbu_type=voice marks this as a voice message
      type: 'audio/m4a;sbu_type=voice',
      metaArrays: [{ key: 'KEY_INTERNAL_MESSAGE_TYPE', value: ['voice/m4a'] }],
    } as unknown as FileMessage;
    expect(getIconOfFileType(voiceMsg)).toBe(IconTypes.PLAY);
  });

  it('returns FILE_AUDIO for mp3', () => {
    expect(getIconOfFileType(fileMsgWithUrl('song.mp3'))).toBe(IconTypes.FILE_AUDIO);
  });

  it('returns GIF for .gif', () => {
    expect(getIconOfFileType(fileMsgWithUrl('anim.gif'))).toBe(IconTypes.GIF);
  });

  it('returns FILE_DOCUMENT for unknown / no extension', () => {
    expect(getIconOfFileType(fileMsgWithUrl('readme.pdf'))).toBe(IconTypes.FILE_DOCUMENT);
    expect(getIconOfFileType(fileMsgWithUrl(''))).toBe(IconTypes.FILE_DOCUMENT);
  });

  it('returns FILE_DOCUMENT when message has neither url nor recognizable extension', () => {
    // no url at all → getMessageFirstFileUrl returns '', regex match → '', falls to default branch
    expect(getIconOfFileType({ messageType: 'file' } as unknown as FileMessage)).toBe(IconTypes.FILE_DOCUMENT);
  });
});

describe('MessageSearchFileItem/utils.truncate', () => {
  it('returns the string unchanged when length <= limit', () => {
    expect(truncate('hello', 10)).toBe('hello');
    expect(truncate('exactlength', 11)).toBe('exactlength');
  });

  it('truncates the middle with ... separator preserving front and back', () => {
    expect(truncate('abcdefghij', 8)).toBe('abc...ij');
  });

  it('handles odd char allocation (front gets the extra char via Math.ceil)', () => {
    // limit 7, separator 3 → 4 chars to show, front=2 back=2 → "ab...ij"
    const out = truncate('abcdefghij', 7);
    expect(out.startsWith('ab')).toBe(true);
    expect(out.endsWith('ij')).toBe(true);
    expect(out).toContain('...');
  });
});
