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
      { type: 'string', value: 'Hello world' },
      { type: 'url', value: 'https://example.com' },
    ]);
  });

  it('should tokenize a string with a url and a string', () => {
    const tokens = tokenizeMessage({
      messageText: 'Hello world https://example.com and more',
    });
    expect(tokens).toEqual([
      { type: 'string', value: 'Hello world' },
      { type: 'url', value: 'https://example.com' },
      { type: 'string', value: 'and more' },
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
      value: ' and more',
      type: 'string',
    }, {
      value: 'https://example.com',
      type: 'url',
    }]);
  });
});
