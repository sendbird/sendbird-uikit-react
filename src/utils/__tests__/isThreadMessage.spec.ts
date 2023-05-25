import type { UserMessage } from '@sendbird/chat/message';
import { isThreadMessage } from '..';

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
    replyCount: 0,
    updatedAt: 0,
  },
};
const mockThreadMessage = {
  parentMessageId: 1,
  parentMessage: {},
  threadInfo: null,
};

describe('Global-utils/isThreadMessage', () => {
  it('should verify thread message', () => {
    expect(
      isThreadMessage(mockThreadMessage as unknown as UserMessage),
    ).toBeTrue();
  });
  it('should filter the other messages', () => {
    expect(
      isThreadMessage(mockNormalMessage as unknown as UserMessage),
    ).toBeFalse();
    expect(
      isThreadMessage(mockParentMessage as unknown as UserMessage),
    ).toBeFalse();
  });
});
