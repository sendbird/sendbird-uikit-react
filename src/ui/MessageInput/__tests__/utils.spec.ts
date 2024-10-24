import jsdom from 'jsdom';
import { nodeListToArray, sanitizeString } from '../utils';

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
