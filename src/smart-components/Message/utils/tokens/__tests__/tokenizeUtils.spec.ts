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
    expect(result).toEqual(/(@{1}|@{2})/g);
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
      value: 'abc',
    }, {
      type: 'url',
      value: 'https://www.google.com',
    }, {
      type: 'string',
      value: '123',
    }]);
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
      value: 'abc   pqr',
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
  it('should keep the leading and trailing white spaces', () => {
    const text = ' aaa ';
    const result = getWhiteSpacePreservedText(text);
    expect(result).toEqual(' aaa\u00A0');
  });
  it('should keep the new lines', () => {
    const text = ' aaa\naa';
    const result = getWhiteSpacePreservedText(text);
    expect(result).toEqual(' aaa\naa');
  });
});
