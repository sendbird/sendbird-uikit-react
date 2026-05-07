import jsdom from 'jsdom';
import {
  extractTextAndMentions,
  isChannelTypeSupportsMultipleFilesMessage,
  nodeListToArray,
  sanitizeString,
  stripZeroWidthSpace,
} from '../utils';

describe('MessageInputUtils/nodeListToArray', () => {
  it('should convert node list to array', () => {
    const P_COUNT = 4;
    const dom = new jsdom.JSDOM(`
      <div>${Array(P_COUNT).fill(0).map(() => '<p></p>').join('')}
      </div>
    `);
    const nodes = nodeListToArray(dom.window.document.querySelectorAll('p'));
    expect(nodes.length).toEqual(4);
  });

  it('should return empty array if nodelist is null', () => {
    const nodes = nodeListToArray(null);
    expect(nodes.length).toBe(0);
  });

  it('should return empty array if nodelist is undefined', () => {
    const nodes = nodeListToArray(undefined);
    expect(nodes.length).toBe(0);
  });
});

describe('Utils/sanitizeString', () => {
  it('should encode special HTML characters', () => {
    const input = '<div>Hello & "world"!</div>';
    const expectedOutput = '&#60;div&#62;Hello & \"world\"!&#60;/div&#62;';
    expect(sanitizeString(input)).toBe(expectedOutput);
  });

  it('should encode non-English characters correctly', () => {
    const input = '안녕하세요';
    const expectedOutput = '안녕하세요';
    expect(sanitizeString(input)).toBe(expectedOutput);
  });

  it('should encode emojis as HTML entities', () => {
    const input = '🙂';
    const expectedOutput = '🙂';
    expect(sanitizeString(input)).toBe(expectedOutput);
  });

  it('should handle mixed content with HTML tags and non-English characters', () => {
    const input = '<p>안녕 & Hello 🙂</p>';
    const expectedOutput = '&#60;p&#62;안녕 & Hello 🙂&#60;/p&#62;';
    expect(sanitizeString(input)).toBe(expectedOutput);
  });

  it('should return an empty string if input is undefined', () => {
    expect(sanitizeString(undefined)).toBe('');
  });

  it('should return an empty string if input is null', () => {
    expect(sanitizeString(null as any)).toBe('');
  });

  it('should return an empty string if input is empty', () => {
    expect(sanitizeString('')).toBe('');
  });

  it('should encode spaces as non-breaking spaces', () => {
    const input = 'Hello world!'; // Note: The space here is a non-breaking space (U+00A0)
    const expectedOutput = 'Hello world!';
    expect(sanitizeString(input)).toBe(expectedOutput);
  });

  it('should not double encode already encoded HTML entities', () => {
    const input = '&#60;div&#62;Hello&#60;/div&#62;';
    const expectedOutput = '&#60;div&#62;Hello&#60;/div&#62;';
    expect(sanitizeString(input)).toBe(expectedOutput);
  });

  it('should handle long strings without performance issues', () => {
    const input = '<div>'.repeat(1000);
    const expectedOutput = '&#60;div&#62;'.repeat(1000);
    expect(sanitizeString(input)).toBe(expectedOutput);
  });

  it('should handle mixed types of spaces', () => {
    const input = 'Hello\u0020world\u00A0!';
    const expectedOutput = 'Hello world !';
    expect(sanitizeString(input)).toBe(expectedOutput);
  });

  it('should handle special Unicode control characters', () => {
    const input = 'Hello\u200BWorld'; // Zero-width space (U+200B)
    const expectedOutput = 'Hello\u200BWorld';
    expect(sanitizeString(input)).toBe(expectedOutput);
  });
});

describe('Utils/stripZeroWidthSpace', () => {
  it('should remove zero-width spaces', () => {
    const input = 'Hello\u200BWorld\u200B';
    expect(stripZeroWidthSpace(input)).toBe('HelloWorld');
  });

  it('should return an empty string if input is undefined', () => {
    expect(stripZeroWidthSpace(undefined)).toBe('');
  });
});

describe('Utils/extractTextAndMentions', () => {
  it('should remove zero-width spaces from extracted text', () => {
    const dom = new jsdom.JSDOM('<div id="root">Hello\u200BWorld\u200B</div>');
    const root = dom.window.document.getElementById('root');
    if (!root) throw new Error('root element not found');

    const result = extractTextAndMentions(root.childNodes);

    expect(result).toEqual({
      isMentionedMessage: false,
      mentionTemplate: 'HelloWorld',
      messageText: 'HelloWorld',
    });
  });

  it('should detect mention via SPAN with data-userid', () => {
    const dom = new jsdom.JSDOM(
      '<div id="root">Hi <span data-userid="user-1">@Alice</span>!</div>',
    );
    const root = dom.window.document.getElementById('root');
    if (!root) throw new Error('root element not found');

    // jsdom does not implement HTMLElement.innerText, so we polyfill it from textContent
    Object.defineProperty(dom.window.HTMLElement.prototype, 'innerText', {
      get() { return this.textContent ?? ''; },
      configurable: true,
    });

    const result = extractTextAndMentions(root.childNodes);
    expect(result.isMentionedMessage).toBe(true);
    expect(result.mentionTemplate).toBe('Hi @{user-1}!');
    expect(result.messageText).toBe('Hi @Alice!');
  });

  it('should treat SPAN without data-userid as plain text and not flag mention', () => {
    const dom = new jsdom.JSDOM('<div id="root"><span>plain</span></div>');
    const root = dom.window.document.getElementById('root');
    if (!root) throw new Error('root element not found');
    Object.defineProperty(dom.window.HTMLElement.prototype, 'innerText', {
      get() { return this.textContent ?? ''; },
      configurable: true,
    });

    const result = extractTextAndMentions(root.childNodes);
    expect(result.isMentionedMessage).toBe(false);
    // userid is empty string \u2192 mentionTemplate appends `@{}`
    expect(result.mentionTemplate).toBe('@{}');
    expect(result.messageText).toBe('plain');
  });

  it('should convert BR to a newline in both text and template', () => {
    const dom = new jsdom.JSDOM('<div id="root">a<br>b</div>');
    const root = dom.window.document.getElementById('root');
    if (!root) throw new Error('root element not found');
    const result = extractTextAndMentions(root.childNodes);
    expect(result.messageText).toBe('a\nb');
    expect(result.mentionTemplate).toBe('a\nb');
    expect(result.isMentionedMessage).toBe(false);
  });

  it('should prepend a newline for nested DIV blocks', () => {
    const dom = new jsdom.JSDOM('<div id="root">first<div>second</div></div>');
    const root = dom.window.document.getElementById('root');
    if (!root) throw new Error('root element not found');
    const result = extractTextAndMentions(root.childNodes);
    expect(result.messageText).toBe('first\nsecond');
    expect(result.mentionTemplate).toBe('first\nsecond');
  });

  it('should fall back to textContent for non-HTMLElement nodes', () => {
    const dom = new jsdom.JSDOM('<div id="root">just text</div>');
    const root = dom.window.document.getElementById('root');
    if (!root) throw new Error('root element not found');
    const result = extractTextAndMentions(root.childNodes);
    expect(result.messageText).toBe('just text');
  });

  it('should handle empty NodeList without throwing', () => {
    const dom = new jsdom.JSDOM('<div id="root"></div>');
    const root = dom.window.document.getElementById('root');
    if (!root) throw new Error('root element not found');
    const result = extractTextAndMentions(root.childNodes);
    expect(result).toEqual({ isMentionedMessage: false, mentionTemplate: '', messageText: '' });
  });
});

describe('Utils/isChannelTypeSupportsMultipleFilesMessage', () => {
  const buildChannel = (overrides: Partial<{
    isGroupChannel: () => boolean;
    isBroadcast: boolean;
    isSuper: boolean;
  }> = {}) => ({
    isGroupChannel: () => true,
    isBroadcast: false,
    isSuper: false,
    ...overrides,
  });

  it('returns true for a non-broadcast non-super group channel', () => {
    expect(isChannelTypeSupportsMultipleFilesMessage(buildChannel() as any)).toBe(true);
  });

  it('returns false when channel is null/undefined', () => {
    expect(isChannelTypeSupportsMultipleFilesMessage(null as any)).toBeFalsy();
    expect(isChannelTypeSupportsMultipleFilesMessage(undefined as any)).toBeFalsy();
  });

  it('returns false for an open channel (isGroupChannel missing or returns false)', () => {
    expect(isChannelTypeSupportsMultipleFilesMessage(buildChannel({ isGroupChannel: () => false }) as any)).toBe(false);
    // isGroupChannel?.() chain \u2014 when method is missing
    expect(isChannelTypeSupportsMultipleFilesMessage({ isBroadcast: false, isSuper: false } as any)).toBeFalsy();
  });

  it('returns false for a broadcast group channel', () => {
    expect(isChannelTypeSupportsMultipleFilesMessage(buildChannel({ isBroadcast: true }) as any)).toBe(false);
  });

  it('returns false for a super group channel', () => {
    expect(isChannelTypeSupportsMultipleFilesMessage(buildChannel({ isSuper: true }) as any)).toBe(false);
  });
});
