import type { UserMessage } from '@sendbird/chat/message';
import { isParentMessage } from '..';

// mock messages
const mockNormalMessage = {
  parentMessageId: 0,
  parentMessage: null,
  threadInfo: null,
};
const mockParentMessage = {
  parentMessageId: 0,
  parentMessage: null,
  threadInfo: {
    lastRepliedAt: 0,
    mostRepliedUsers: [],
    replyCount: 3,
    updatedAt: 0,
  },
};
const mockThreadMessage = {
  parentMessageId: 1,
  parentMessage: {},
  threadInfo: null,
};

describe('Global-utils/isParentMessage', () => {
  it('should verify parent message', () => {
    expect(
      isParentMessage(mockParentMessage as unknown as UserMessage),
    ).toBeTrue();
  });
  it('should return false when the message does not have replyCount', () => {
    const normalMessage = { ...mockParentMessage };
    normalMessage.threadInfo.replyCount = 0;
    expect(
      isParentMessage(normalMessage as unknown as UserMessage),
    ).toBeFalse();
  });
  it('should filter the other messages', () => {
    expect(
      isParentMessage(mockNormalMessage as unknown as UserMessage),
    ).toBeFalse();
    expect(
      isParentMessage(mockThreadMessage as unknown as UserMessage),
    ).toBeFalse();
  });
});
