import getCaseResolvedReplyType from '../resolvedReplyType';

describe('getCaseResolvedReplyType', () => {
  it('should return correct lowerCase and upperCase of replyType', () => {
    expect(getCaseResolvedReplyType('QUOTE_REPLY').lowerCase).toBe('quote_reply');
    expect(getCaseResolvedReplyType('QUOTE_REPLY').upperCase).toBe('QUOTE_REPLY');
    expect(getCaseResolvedReplyType('quote_reply').lowerCase).toBe('quote_reply');
    expect(getCaseResolvedReplyType('quote_reply').upperCase).toBe('QUOTE_REPLY');

    expect(getCaseResolvedReplyType('THREAD').lowerCase).toBe('thread');
    expect(getCaseResolvedReplyType('THREAD').upperCase).toBe('THREAD');
    expect(getCaseResolvedReplyType('thread').lowerCase).toBe('thread');
    expect(getCaseResolvedReplyType('thread').upperCase).toBe('THREAD');

    expect(getCaseResolvedReplyType('NONE').lowerCase).toBe('none');
    expect(getCaseResolvedReplyType('NONE').upperCase).toBe('NONE');
    expect(getCaseResolvedReplyType('none').lowerCase).toBe('none');
    expect(getCaseResolvedReplyType('none').upperCase).toBe('NONE');
  });
});
