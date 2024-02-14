import { User } from '@sendbird/chat';
import {
  getUserMentionRegex,
  identifyMentions,
  identifyUrlsAndStrings,
  combineNearbyStrings,
  getWhiteSpacePreservedText,
} from '../tokenize';
import { Token, UndeterminedToken } from '../types';

describe('getUserMentionRegex', () => {
  it('should return a regex with the correct pattern', () => {
    const mentionedUsers = [
      { userId: '1', nickname: 'user1' },
      { userId: '2', nickname: 'user2' },
    ] as User[];
    const templatePrefix = '@';
    const result = getUserMentionRegex(mentionedUsers, templatePrefix);
    expect(result).toEqual(/(@\{1\}|@\{2\})/g);
  });

  it('should return a correct regex pattern; userId includes some patterns need to be escaped', () => {
    const mentionedUsers = [
      { userId: '1*', nickname: 'user1' },
      { userId: '2+', nickname: 'user2' },
    ] as User[];
    const templatePrefix = '@';
    const result = getUserMentionRegex(mentionedUsers, templatePrefix);
    expect(result).toEqual(/(@\{1\*\}|@\{2\+\})/g);
  });
});

describe('identifyMentions', () => {
  it('should return a token with type mention', () => {
    const tokens = [{
      type: 'undetermined',
      value: 'abc @{userA} 123',
    }] as UndeterminedToken[];
    const mentionedUsers = [
      { userId: 'userA', nickname: 'User A' },
    ] as User[];
    const templatePrefix = '@';
    const result = identifyMentions({ tokens, mentionedUsers, templatePrefix });
    expect(result).toEqual([{
      type: 'undetermined',
      value: 'abc ',
    }, {
      type: 'mention',
      value: 'User A',
      userId: 'userA',
    }, {
      type: 'undetermined',
      value: ' 123',
    }]);
  });
});

describe('identifyUrlsAndStrings', () => {
  it('should return a token with type url', () => {
    const tokens = [{
      type: 'undetermined',
      value: 'abc https://www.google.com 123',
    }] as UndeterminedToken[];
    const result = identifyUrlsAndStrings(tokens);
    expect(result).toEqual([{
      type: 'string',
      value: 'abc ',
    }, {
      type: 'url',
      value: 'https://www.google.com',
    }, {
      type: 'string',
      value: ' 123',
    }]);
  });

  it('should parse multiple urls with special charactors', () => {
    const tokens = [{
      type: 'undetermined',
      value: '[https://www.google.com](https://www.google.com)',
    }] as UndeterminedToken[];
    const result = identifyUrlsAndStrings(tokens);
    expect(result).toEqual([{
      type: 'string',
      value: '[',
    }, {
      type: 'url',
      value: 'https://www.google.com',
    }, {
      type: 'string',
      value: '](',
    }, {
      type: 'url',
      value: 'https://www.google.com',
    }, {
      type: 'string',
      value: ')',
    }]);
  });

  it('should parse valid URLs correctly', () => {
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
      const result = identifyUrlsAndStrings([
        {
          type: 'undetermined',
          value: url,
        },
      ]);
      expect(result).toEqual([
        {
          type: 'url',
          value: url,
        },
      ]);
    });
  });

  it('should not parse invalid URLs', () => {
    const invalidURLs = [
      // with number top-level domain
      'abcd.1234',
    ];

    invalidURLs.forEach((url) => {
      const result = identifyUrlsAndStrings([
        { type: 'undetermined', value: url },
      ]);

      expect(result).toEqual([
        {
          type: 'string',
          value: url,
        },
      ]);
    });
  });
});

describe('combineNearbyStrings', () => {
  it('should combine nearby strings', () => {
    const tokens = [{
      type: 'string',
      value: 'abc ',
    }, {
      type: 'string',
      value: ' pqr',
    }, {
      type: 'url',
      value: 'https://www.google.com',
    }, {
      type: 'mention',
      value: 'User A',
      userId: 'userA',
    }, {
      type: 'string',
      value: '123',
    }] as Token[];
    const expected = [{
      type: 'string',
      value: 'abc  pqr',
    }, {
      type: 'url',
      value: 'https://www.google.com',
    }, {
      type: 'mention',
      value: 'User A',
      userId: 'userA',
    }, {
      type: 'string',
      value: '123',
    }];
    const result = combineNearbyStrings(tokens);
    expect(result).toEqual(expected);
  });
});

describe('getWhiteSpacePreservedText', () => {
  it('should convert leading, trailing white space to nbsp', () => {
    const text = ' aaa ';
    const result = getWhiteSpacePreservedText(text);
    expect(result).toEqual('\u00A0aaa\u00A0');
  });

  it('should convert leading, trailing white space to nbsp', () => {
    const text = '  aaa  ';
    const result = getWhiteSpacePreservedText(text);
    expect(result).toEqual('\u00A0\u00A0aaa\u00A0\u00A0');
  });

  it('should convert leading, trailing white space to nbsp, while preserving space in between', () => {
    const text = ' aaa   cc  dd ';
    const result = getWhiteSpacePreservedText(text);
    expect(result).toEqual('\u00A0aaa   cc  dd\u00A0');
  });

  it('should keep the new lines', () => {
    const text = ' aaa\naa';
    const result = getWhiteSpacePreservedText(text);
    expect(result).toEqual('\u00A0aaa\naa');
  });

  it('should add the padding after new lines', () => {
    const text = 'line1\n  line2_with_prefix_space\n line3_with_prefix_space\nline4';
    const expected = 'line1\n\u00A0\u00A0line2_with_prefix_space\n\u00A0line3_with_prefix_space\nline4';
    const result = getWhiteSpacePreservedText(text);
    expect(result).toEqual(expected);
  });

  it('should keep the tabs', () => {
    const text = ' aaa\taa';
    const result = getWhiteSpacePreservedText(text);
    expect(result).toEqual('\u00A0aaa\taa');
  });

  it('should handle empty string', () => {
    const text = '';
    const result = getWhiteSpacePreservedText(text);
    expect(result).toEqual('');
  });
});
