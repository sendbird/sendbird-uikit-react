import mapData from '../TemplateMessageItemBody/utils/mapData';
import restoreNumbersFromMessageTemplateObject from '../TemplateMessageItemBody/utils/restoreNumbersFromMessageTemplateObject';
import { checkOGIsEnalbed, createUrlTester, URL_REG } from '../OpenchannelOGMessage/utils';
import { copyToClipboard as copyOpenChannelUserMessage } from '../OpenchannelUserMessage/utils';

describe('UI utility branches', () => {
  it('maps nested template placeholders and restores numeric template values', () => {
    const mapped = mapData({
      template: {
        text: 'Hello {user.name}',
        missing: '{missing}',
        color: '#FF112233',
        items: ['{count}', { value: '{count}', top: '5' }],
      },
      source: {
        user: { name: 'Alice' },
        count: '12',
      },
    });

    expect(mapped).toEqual({
      text: 'Hello Alice',
      missing: '{missing}',
      color: '#112233FF',
      items: ['12', { value: '12', top: '5' }],
    });
    expect(mapData({ template: 'Count {count}', source: { count: 0 } })).toBe('Count {count}');
    expect(mapData({ template: null as any, source: {} })).toBeNull();

    expect(restoreNumbersFromMessageTemplateObject({
      version: '1',
      nested: [{ top: '5', text: 'abc', value: 'not-number' }],
    })).toEqual({
      version: 1,
      nested: [{ top: 5, text: 'abc', value: 'not-number' }],
    });
  });

  it('checks OG metadata, URL matching, clipboard fallbacks, and open-channel grouping', () => {
    expect(checkOGIsEnalbed({ ogMetaData: { url: 'https://sendbird.com' } } as any)).toBe(true);
    expect(checkOGIsEnalbed({ ogMetaData: {} } as any)).toBe(false);
    expect(checkOGIsEnalbed({} as any)).toBe(false);
    expect(createUrlTester(URL_REG)('sendbird.com/docs')).toBe(true);

    (window as any).clipboardData = { setData: jest.fn(() => true) };
    expect(copyOpenChannelUserMessage('copy me')).toBe(true);
    expect((window as any).clipboardData.setData).toHaveBeenCalledWith('Text', 'copy me');
    delete (window as any).clipboardData;
    document.queryCommandSupported = jest.fn(() => true);
    document.execCommand = jest.fn(() => true);
    expect(copyOpenChannelUserMessage('copy me')).toBe(true);
    (document.execCommand as jest.Mock).mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(copyOpenChannelUserMessage('copy me')).toBe(false);
    document.queryCommandSupported = jest.fn(() => false);
    expect(copyOpenChannelUserMessage('copy me')).toBe(false);
  });
});
