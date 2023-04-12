import { UserMessage } from '@sendbird/chat/message';
import { getParentMessageFrom, isParentMessage, isThreadMessage } from '../utils';

const mockParentMessage = {
  messageId: 111111,
  parentMessage: null,
  parentMessageId: 0,
  threadInfo: {
    lastRepliedAt: 1000,
    replyCount: 1,
    mostRepliedUsers: [],
    updatedAt: 1000,
  },
};
const mockThreadMessage = {
  messageId: 111112,
  parentMessage: mockParentMessage,
  parentMessageId: 111111,
  threadInfo: null,
};

describe('Thread/utils - isParentMessage', () => {
  it('should comfirm if the message is a parent message', () => {
    expect(isParentMessage(mockParentMessage as UserMessage)).toBe(true);
  });
  it('should confirm if the message is not a parent message', () => {
    expect(isParentMessage(mockThreadMessage as UserMessage)).toBe(false);
  });
  it('should check type of the parentMessageId', () => {
    expect(isParentMessage({ ...mockParentMessage, parentMessageId: '1' } as UserMessage)).toBe(false);
  });
});

describe('Thread/utils - isThreadMessage', () => {
  it('should comfirm if the message is a thread message', () => {
    expect(isThreadMessage(mockThreadMessage as UserMessage)).toBe(true);
  });
  it('should comfirm if the message is not a thread message', () => {
    expect(isThreadMessage(mockParentMessage as UserMessage)).toBe(false);
  });
  it('should check type of the parentMessageId', () => {
    expect(isThreadMessage({ ...mockThreadMessage, parentMessageId: '1' } as UserMessage)).toBe(false);
  });
});

describe('Thread/utils - getParentMessageFrom', () => {
  it('should return parent message if it has a parent message', () => {
    expect(getParentMessageFrom(mockThreadMessage as UserMessage)).toBe(mockParentMessage);
  });
  it('should return itself if it is a parent message', () => {
    expect(getParentMessageFrom(mockParentMessage as UserMessage)).toBe(mockParentMessage);
  });
});
