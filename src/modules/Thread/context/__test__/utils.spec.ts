import { UserMessage } from '@sendbird/chat/message';
import { Member } from '@sendbird/chat/groupChannel';
import {
  compareIds,
  getNicknamesMapFromMembers,
  getParentMessageFrom,
  isAboutSame,
  isEmpty,
  isParentMessage,
  isReadMessage,
  isThreadMessage,
  scrollIntoLast,
} from '../utils';
import { OutgoingMessageStates } from '../../../../utils/exports/getOutgoingMessageState';

jest.mock('../../../../utils/exports/getOutgoingMessageState', () => {
  const actual = jest.requireActual('../../../../utils/exports/getOutgoingMessageState');
  return {
    ...actual,
    getOutgoingMessageState: jest.fn(),
  };
});
// Re-import the mocked function so tests can drive its return value
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getOutgoingMessageState } = require('../../../../utils/exports/getOutgoingMessageState');

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
    expect(isParentMessage({ ...mockParentMessage, parentMessageId: '1' } as any)).toBe(false);
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
    expect(isThreadMessage({ ...mockThreadMessage, parentMessageId: '1' } as any)).toBe(false);
  });
});

describe('Thread/utils - getParentMessageFrom', () => {
  it('should return parent message if it has a parent message', () => {
    expect(getParentMessageFrom(mockThreadMessage as UserMessage)).toBe(mockParentMessage);
  });
  it('should return itself if it is a parent message', () => {
    expect(getParentMessageFrom(mockParentMessage as UserMessage)).toBe(mockParentMessage);
  });
  it('should return null when message is null', () => {
    expect(getParentMessageFrom(null)).toBeNull();
  });
  it('should return null for thread message whose parentMessage is missing', () => {
    const orphan = { ...mockThreadMessage, parentMessage: undefined };
    expect(getParentMessageFrom(orphan as unknown as UserMessage)).toBeNull();
  });
  it('should return null for an unrelated message (neither parent nor thread)', () => {
    const standalone = { messageId: 999, parentMessageId: undefined, parentMessage: null, threadInfo: null };
    expect(getParentMessageFrom(standalone as unknown as UserMessage)).toBeNull();
  });
});

describe('Thread/utils - getNicknamesMapFromMembers', () => {
  it('builds a userId → nickname map preserving order', () => {
    const members = [
      { userId: 'u1', nickname: 'Alice' },
      { userId: 'u2', nickname: 'Bob' },
    ] as Member[];
    const map = getNicknamesMapFromMembers(members);
    expect(map.get('u1')).toBe('Alice');
    expect(map.get('u2')).toBe('Bob');
    expect(map.size).toBe(2);
  });
  it('returns an empty map when members is empty/omitted', () => {
    expect(getNicknamesMapFromMembers().size).toBe(0);
    expect(getNicknamesMapFromMembers([]).size).toBe(0);
  });
});

describe('Thread/utils - compareIds', () => {
  it('returns true for equal numeric ids', () => {
    expect(compareIds(1, 1)).toBe(true);
  });
  it('returns true when one is string and the other is number with same value', () => {
    expect(compareIds('42', 42)).toBe(true);
  });
  it('returns false when ids differ', () => {
    expect(compareIds('42', 43)).toBe(false);
  });
  it('returns false when either id is null/undefined', () => {
    expect(compareIds(null as any, 1)).toBe(false);
    expect(compareIds(1, undefined as any)).toBe(false);
    expect(compareIds(null as any, null as any)).toBe(false);
  });
});

describe('Thread/utils - isAboutSame', () => {
  it('returns true within tolerance', () => {
    expect(isAboutSame(100, 102, 5)).toBe(true);
  });
  it('returns false outside tolerance', () => {
    expect(isAboutSame(100, 110, 5)).toBe(false);
  });
});

describe('Thread/utils - isEmpty', () => {
  it('returns true for null/undefined', () => {
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(undefined)).toBe(true);
  });
  it('returns false for primitives and objects', () => {
    expect(isEmpty(0)).toBe(false);
    expect(isEmpty('')).toBe(false);
    expect(isEmpty({})).toBe(false);
  });
});

describe('Thread/utils - isReadMessage', () => {
  beforeEach(() => {
    (getOutgoingMessageState as jest.Mock).mockReset();
  });
  it('returns true when getOutgoingMessageState resolves to READ', () => {
    (getOutgoingMessageState as jest.Mock).mockReturnValueOnce(OutgoingMessageStates.READ);
    expect(isReadMessage({} as any, {} as any)).toBe(true);
  });
  it('returns false otherwise', () => {
    (getOutgoingMessageState as jest.Mock).mockReturnValueOnce(OutgoingMessageStates.SENT);
    expect(isReadMessage({} as any, {} as any)).toBe(false);
  });
});

describe('Thread/utils - scrollIntoLast', () => {
  let querySelectorSpy: jest.SpyInstance;
  beforeEach(() => {
    querySelectorSpy = jest.spyOn(document, 'querySelector');
  });
  afterEach(() => {
    querySelectorSpy.mockRestore();
    jest.useRealTimers();
  });

  it('scrolls the thread container to the bottom when found', () => {
    const fakeEl = { scrollTop: 0, scrollHeight: 999 } as unknown as Element;
    querySelectorSpy.mockReturnValueOnce(fakeEl);
    scrollIntoLast();
    expect((fakeEl as any).scrollTop).toBe(999);
  });

  it('is a no-op when the container is not in the DOM yet', () => {
    querySelectorSpy.mockReturnValueOnce(null);
    expect(() => scrollIntoLast()).not.toThrow();
  });

  it('returns early after exceeding MAX_TRIES (=10)', () => {
    // 11 should be > MAX_TRIES — should not even call querySelector
    scrollIntoLast(11);
    expect(querySelectorSpy).not.toHaveBeenCalled();
  });

  it('retries via setTimeout when querySelector throws', () => {
    jest.useFakeTimers();
    querySelectorSpy
      .mockImplementationOnce(() => { throw new Error('not ready'); })
      .mockImplementationOnce(() => null);
    scrollIntoLast(1);
    // First call threw; retry is scheduled at 500 * 1 = 500ms
    expect(querySelectorSpy).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(500);
    expect(querySelectorSpy).toHaveBeenCalledTimes(2);
  });
});
