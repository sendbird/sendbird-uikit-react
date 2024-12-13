import {
  isAdminMessage,
  isFileMessage,
  isUrl,
  isUserMessage,
  isMultipleFilesMessage, isDefaultChannelName, DEFAULT_GROUP_CHANNEL_NAME, DEFAULT_AI_CHATBOT_CHANNEL_NAME,
} from '../index';
import { AdminMessage, FileMessage, MultipleFilesMessage, UserMessage } from '@sendbird/chat/message';
import { delay, deleteNullish } from '../utils';
import { isMobileIOS } from '../browser';
import { GroupChannel } from '@sendbird/chat/groupChannel';

describe('Global-utils: verify message type util functions', () => {
  it('should return true for each message', () => {
    const mockUserMessage = {
      messageId: 0,
      isUserMessage: () => true,
      isFileMessage: () => false,
      isAdminMessage: () => false,
      isMultipleFilesMessage: () => false,
      messageType: 'user',
    } as UserMessage;
    expect(isUserMessage(mockUserMessage)).toBe(true);
    expect(isFileMessage(mockUserMessage)).toBe(false);
    expect(isAdminMessage(mockUserMessage)).toBe(false);
    expect(isMultipleFilesMessage(mockUserMessage)).toBe(false);
    const mockFileMessage = {
      messageId: 1,
      isUserMessage: () => false,
      isFileMessage: () => true,
      isAdminMessage: () => false,
      isMultipleFilesMessage: () => false,
      messageType: 'file',
    } as FileMessage;
    expect(isUserMessage(mockFileMessage)).toBe(false);
    expect(isFileMessage(mockFileMessage)).toBe(true);
    expect(isAdminMessage(mockFileMessage)).toBe(false);
    expect(isMultipleFilesMessage(mockUserMessage)).toBe(false);
    const mockAdminMessage = {
      messageId: 2,
      isUserMessage: () => false,
      isFileMessage: () => false,
      isAdminMessage: () => true,
      isMultipleFilesMessage: () => false,
      messageType: 'admin',
    } as AdminMessage;
    expect(isUserMessage(mockAdminMessage)).toBe(false);
    expect(isFileMessage(mockAdminMessage)).toBe(false);
    expect(isAdminMessage(mockAdminMessage)).toBe(true);
    expect(isMultipleFilesMessage(mockUserMessage)).toBe(false);
    const mockMulipleFilesMessage = {
      messageId: 3,
      isUserMessage: () => false,
      isFileMessage: () => false,
      isAdminMessage: () => false,
      isMultipleFilesMessage: () => true,
      messageType: 'file',
    } as MultipleFilesMessage;
    expect(isUserMessage(mockMulipleFilesMessage)).toBe(false);
    expect(isFileMessage(mockMulipleFilesMessage)).toBe(false);
    expect(isAdminMessage(mockMulipleFilesMessage)).toBe(false);
    expect(isMultipleFilesMessage(mockMulipleFilesMessage)).toBe(true);
  });

  it('should return true with incomplete properties', () => {
    expect(isUserMessage({ isUserMessage: () => true } as UserMessage)).toBe(true);
    expect(isUserMessage({ messageType: 'user' } as UserMessage)).toBe(true);
    expect(isFileMessage({ isFileMessage: () => true } as FileMessage)).toBe(true);
    expect(isFileMessage({ messageType: 'file' } as FileMessage)).toBe(true);
    expect(isAdminMessage({ isAdminMessage: () => true } as AdminMessage)).toBe(true);
    expect(isAdminMessage({ messageType: 'admin' } as AdminMessage)).toBe(true);
    expect(isMultipleFilesMessage({ isMultipleFilesMessage: () => true } as MultipleFilesMessage)).toBe(true);
    expect(isMultipleFilesMessage({ messageType: 'file', fileInfoList: [] } as unknown as MultipleFilesMessage)).toBe(true);
  });

  it('should refer to the method first rather than messageType', () => {
    const mockUserMessage = {
      messageId: 0,
      isUserMessage: () => true,
      isFileMessage: () => false,
      isAdminMessage: () => false,
      isMultipleFilesMessage: () => false,
      messageType: 'file',
    } as UserMessage;
    expect(isUserMessage(mockUserMessage)).toBe(true);
    expect(isFileMessage(mockUserMessage)).toBe(false);
    expect(isAdminMessage(mockUserMessage)).toBe(false);
    expect(isMultipleFilesMessage(mockUserMessage)).toBe(false);
    expect(isUserMessage({ isUserMessage: () => false, messageType: 'user' } as UserMessage)).toBe(false);
    const mockFileMessage = {
      messageId: 1,
      isUserMessage: () => false,
      isFileMessage: () => true,
      isAdminMessage: () => false,
      isMultipleFilesMessage: () => false,
      messageType: 'admin',
    } as FileMessage;
    expect(isUserMessage(mockFileMessage)).toBe(false);
    expect(isFileMessage(mockFileMessage)).toBe(true);
    expect(isAdminMessage(mockFileMessage)).toBe(false);
    expect(isMultipleFilesMessage(mockFileMessage)).toBe(false);
    expect(isFileMessage({ isFileMessage: () => false, messageType: 'file' } as FileMessage)).toBe(false);
    const mockAdminMessage = {
      messageId: 2,
      isUserMessage: () => false,
      isFileMessage: () => false,
      isAdminMessage: () => true,
      isMultipleFilesMessage: () => false,
      messageType: 'user',
    } as AdminMessage;
    expect(isUserMessage(mockAdminMessage)).toBe(false);
    expect(isFileMessage(mockAdminMessage)).toBe(false);
    expect(isAdminMessage(mockAdminMessage)).toBe(true);
    expect(isMultipleFilesMessage(mockAdminMessage)).toBe(false);
    expect(isAdminMessage({ isAdminMessage: () => false, messageType: 'admin' } as AdminMessage)).toBe(false);
    const mockMultipleFilesMessage = {
      messageId: 2,
      isUserMessage: () => false,
      isFileMessage: () => false,
      isAdminMessage: () => false,
      isMultipleFilesMessage: () => true,
      messageType: 'file',
    } as MultipleFilesMessage;
    expect(isUserMessage(mockMultipleFilesMessage)).toBe(false);
    expect(isFileMessage(mockMultipleFilesMessage)).toBe(false);
    expect(isAdminMessage(mockMultipleFilesMessage)).toBe(false);
    expect(isMultipleFilesMessage(mockMultipleFilesMessage)).toBe(true);
    expect(isMultipleFilesMessage({ isMultipleFilesMessage: () => false, messageType: 'file' } as MultipleFilesMessage)).toBe(false);
  });
});

describe('isURL', () => {
  it('should return true for valid URLs', () => {
    const validURLs = [
      // with protocol
      'http://www.example.com',
      'https://www.example.com',
      'http://example.com',
      'https://example.com',
      // without protocol
      'www.example.com',
      'example.com',
      // with sub paths
      'http://www.example.com/path/to/page.html',
      'https://www.example.com/path/to/page.html',
      'http://example.com/path/to/page.html',
      'https://example.com/path/to/page.html',
      'www.example.com/path/to/page.html',
      'example.com/path/to/page.html',
      // with query strings
      'http://www.example.com/path/to/page.html?query=string',
      'https://www.example.com/path/to/page.html?query=string',
      'http://example.com/path/to/page.html?query=string',
      'https://example.com/path/to/page.html?query=string',
      'www.example.com/path/to/page.html?query=string',
      'example.com/path/to/page.html?query=string',
      'https://www.amazon.com/Hacker-Playbook-Practical-Penetration-Testing/dp/1494932636/ref=sr_1_5?crid=1IKVPDXYF5NQG&keywords=hacker+guide&qid=1681333238&sprefix=hacker+guid%2Caps%2C148&sr=8-5',
      // with the hash property
      'https://example.com/path/to/page.html?query=string#hash',
      'https://docs.google.com/document/d/19IccwdTIwNPJ_rGtsbi2Ft8dshaH4WiCXD5pder97VE/edit#heading=h.pve9ikkfqqzz',
      // A subdomain has a hyphen
      'https://send-bird.slack.com/archives/C065N4UQ77W/p1699931368643169?thread_ts=1699925671l395019&cid-Co65N4UQ77W',
      // with long top-level domain
      'https://send.bird.business/archives/C065N4UQ77W/p1699931368643169?thread_ts=1699925671l395019&cid-Co65N4UQ77W',
    ];
    validURLs.forEach((url) => {
      expect(isUrl(url)).toBe(true);
    });
  });
  it('should return false for invalid URLs', () => {
    const invalidURLs = [
      'aaa',
      '$123.123',
      'aaa@sendbird.com',
    ];
    invalidURLs.forEach((url) => {
      expect(isUrl(url)).toBe(false);
    });
  });
});

describe('isMobileIOS', () => {
  it('should return true for mobile webkit', () => {
    const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148';
    expect(isMobileIOS(userAgent)).toBe(true);
  });

  it('should return true for mobile safari', () => {
    const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1';
    expect(isMobileIOS(userAgent)).toBe(true);
  });

  it('should return true for ios mobile chrome', () => {
    const chromeIOS = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/120.0.6099.101 Mobile/15E148 Safari/604.1';
    expect(isMobileIOS(chromeIOS)).toBe(true);
  });

  it('should return false for android mobile chrome', () => {
    const chromeAndroid = 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36';
    expect(isMobileIOS(chromeAndroid)).toBe(false);
  });
});

describe('deleteNullish', () => {
  it('should delete nullish properties', () => {
    const actual = deleteNullish({
      a: 1,
      b: '2',
      c: null,
      d: undefined,
      e: [],
      f: {},
      g: NaN,
    });

    const expected = {
      a: 1,
      b: '2',
      e: [],
      f: {},
      g: NaN,
    };

    expect(actual).toEqual(expected);
  });

  it('should assign default values when null values are provided', () => {
    function component(props: any) {
      const { a = 1, b = '2', c = 3 } = deleteNullish(props);
      return { a, b, c };
    }

    expect(component({ a: null, b: undefined })).toEqual({ a: 1, b: '2', c: 3 });
    expect(component({ a: null, c: 4 })).toEqual({ a: 1, b: '2', c: 4 });
    expect(component({ a: null, b: '3', c: 4 })).toEqual({ a: 1, b: '3', c: 4 });
  });
});

describe('delay', () => {
  it('should resolve after the specified time', async () => {
    const start = Date.now();
    const delayTime = 100;

    await delay(delayTime);

    const end = Date.now();
    const elapsed = end - start;

    // Check if the elapsed time is at least the delay time
    expect(elapsed).toBeGreaterThanOrEqual(delayTime);
  });

  it('should resolve immediately for 0 milliseconds', async () => {
    const start = Date.now();

    await delay(0);

    const end = Date.now();
    const elapsed = end - start;

    // Check if the elapsed time is very small
    expect(elapsed).toBeLessThan(10);
  });
  it('should resolve immediately when no parameter is provided', async () => {
    const start = Date.now();

    await delay();

    const end = Date.now();
    const elapsed = end - start;

    expect(elapsed).toBeLessThan(10);
  });
});

describe('isDefaultChannelName', () => {
  it('return true if channel is undefined', () => {
    const result = isDefaultChannelName(undefined);

    expect(result).toBe(true);
  });

  it('return true if channel name is undefined', () => {
    const channel = {
      name: undefined,
    } as GroupChannel;

    const result = isDefaultChannelName(channel);

    expect(result).toBe(true);
  });

  it('return true if channel name is the default group channel name', () => {
    const channel = {
      name: DEFAULT_GROUP_CHANNEL_NAME,
    } as GroupChannel;

    const result = isDefaultChannelName(channel);

    expect(result).toBe(true);
  });

  it('return true if channel name is the default AI chatbot channel name', () => {
    const channel = {
      name: DEFAULT_AI_CHATBOT_CHANNEL_NAME,
    } as GroupChannel;

    const result = isDefaultChannelName(channel);

    expect(result).toBe(true);
  });

  it('return false if channel name is not default', () => {
    const channel = {
      name: 'test-channel-name',
    } as GroupChannel;

    const result = isDefaultChannelName(channel);

    expect(result).toBe(false);
  });
});
