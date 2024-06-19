import { User } from '@sendbird/chat';
import { tokenizeMessage } from '../tokenize';

describe('tokenizeMessage', () => {
  it('should tokenize a simple string', () => {
    const tokens = tokenizeMessage({
      messageText: 'Hello world',
    });
    expect(tokens).toEqual([
      { type: 'string', value: 'Hello world' },
    ]);
  });

  it('should tokenize a string with a url', () => {
    const tokens = tokenizeMessage({
      messageText: 'Hello world https://example.com',
    });
    expect(tokens).toEqual([
      { type: 'string', value: 'Hello world ' },
      { type: 'url', value: 'https://example.com' },
    ]);
  });

  it('should tokenize a string with a url and a string', () => {
    const tokens = tokenizeMessage({
      messageText: 'Hello world https://example.com and more',
    });
    expect(tokens).toEqual([
      { type: 'string', value: 'Hello world ' },
      { type: 'url', value: 'https://example.com' },
      { type: 'string', value: ' and more' },
    ]);
  });

  it('should tokenize a string with mention and a string', () => {
    const tokens = tokenizeMessage({
      messageText: 'Hello world @{userA} and more https://example.com',
      mentionedUsers: [
        ({ userId: 'userA', nickname: 'User A' } as User),
      ],
    });

    expect(tokens).toEqual([{
      value: 'Hello world ',
      type: 'string',
    }, {
      value: 'User A',
      type: 'mention',
      userId: 'userA',
    }, {
      value: ' and more ',
      type: 'string',
    }, {
      value: 'https://example.com',
      type: 'url',
    }]);
  });

  it('should tokenize a string markdown strings', () => {
    const tokens = tokenizeMessage({
      messageText: '**bold**  https://www.naver.com  ** https://www.naver.com ** [bold] **text** **text**',
      includeMarkdown: true,
    });
    expect(tokens).toEqual([
      { value: '', type: 'string' },
      {
        type: 'markdown',
        markdownType: 'bold',
        value: '**bold**',
        groups: ['**bold**', 'bold'],
      },
      { value: '  ', type: 'string' },
      { value: 'https://www.naver.com', type: 'url' },
      { value: '  ', type: 'string' },
      {
        type: 'markdown',
        markdownType: 'bold',
        value: '** https://www.naver.com **',
        groups: ['** https://www.naver.com **', ' https://www.naver.com '],
      },
      { value: ' [bold] ', type: 'string' },
      {
        type: 'markdown',
        markdownType: 'bold',
        value: '**text**',
        groups: ['**text**', 'text'],
      },
      { value: ' ', type: 'string' },
      {
        type: 'markdown',
        markdownType: 'bold',
        value: '**text**',
        groups: ['**text**', 'text'],
      },
    ]);
  });

  it('should tokenize a string with mention, markdown strings', () => {
    const tokens = tokenizeMessage({
      messageText: 'Hello @{userA}! This is a test for **tokenizeMessage**. Followings are urls with different '
        + 'syntaxes: https://example.com, and [here](https://example.com). Finally, the followings are nested '
        + 'markdown cases: [**this one**](https://example.com) and **[this one](https://example.com)**',
      mentionedUsers: [
        ({ userId: 'userA', nickname: 'User A' } as User),
      ],
      includeMarkdown: true,
    });
    expect(tokens).toEqual([
      { value: 'Hello ', type: 'string' },
      { value: 'User A', type: 'mention', userId: 'userA' },
      { value: '! This is a test for ', type: 'string' },
      {
        type: 'markdown',
        markdownType: 'bold',
        value: '**tokenizeMessage**',
        groups: ['**tokenizeMessage**', 'tokenizeMessage'],
      },
      {
        value: '. Followings are urls with different syntaxes: ',
        type: 'string',
      },
      { value: 'https://example.com', type: 'url' },
      { value: ', and ', type: 'string' },
      {
        type: 'markdown',
        markdownType: 'url',
        value: '[here](https://example.com)',
        groups: [
          '[here](https://example.com)',
          'here',
          'https://example.com',
        ],
      },
      {
        value: '. Finally, the followings are nested markdown cases: ',
        type: 'string',
      },
      {
        groups: [
          '[**this one**](https://example.com)',
          '**this one**',
          'https://example.com',
        ],
        markdownType: 'url',
        type: 'markdown',
        value: '[**this one**](https://example.com)',
      },
      {
        type: 'string',
        value: ' and ',
      },
      {
        groups: [
          '**[this one](https://example.com)**',
          '[this one](https://example.com)',
        ],
        markdownType: 'bold',
        type: 'markdown',
        value: '**[this one](https://example.com)**',
      },
    ]);
  });
});
