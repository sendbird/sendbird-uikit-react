import { UserMessage } from "@sendbird/chat/message";
import { isParentMessage, isThreadMessage } from "../utils";

const mockParentMessage = {
  messageId: 1,
  parentMessage: null,
  parentMessageId: null,
  threadInfo: {
    lastRepliedAt: 100000,
    replyCount: 1,
    mostRepliedUsers: [],
    updatedAt: 100000,
  },
};
const mockThreadMessage = {
  messageId: 2,
  parentMessage: mockParentMessage,
  parentMessageId: 1,
  threadInfo: null,
};

describe('Thread/utils - isParentMessage', () => {
  it('should comfirm if the message is a parent message', () => {
    expect(isParentMessage(mockParentMessage as UserMessage)).toBe(true);
  });
  it('should confirm if the message is not a parent message', () => {
    expect(isParentMessage(mockThreadMessage as UserMessage)).toBe(false);
  });
});

describe('Thread/utils - isThreadMessage', () => {
  it('should comfirm if the message is a thread message', () => {
    expect(isThreadMessage(mockThreadMessage as UserMessage)).toBe(true);
  });
  it('should comfirm if the message is not a thread message', () => {
    expect(isThreadMessage(mockParentMessage as UserMessage)).toBe(false);
  });
});
