// test mergeAndSortMessages
//   const mergedMessages = [...oldMessages, ...newMessages];
//   const getUniqueListByMessageId = (arr) => getUniqueListBy(arr, 'messageId');
//   const unique = getUniqueListByMessageId(mergedMessages);
//   return unique;

import {
  getAllEmojisMapFromEmojiContainer,
  getNicknamesMapFromMembers,
  isAboutSame,
  isDisabledBecauseFrozen,
  isDisabledBecauseMuted,
  isOperator,
  mergeAndSortMessages,
  passUnsuccessfullMessages,
  pxToNumber,
  scrollIntoLast,
  scrollToRenderedMessage,
} from "../utils";

const oldMessages = [
  {
    messageId: 390282401,
    createdAt: 390282401,
  },
  {
    messageId: 390282407,
    createdAt: 390282407,
  },
];

const messagesToAdd_1 = [
  {
    messageId: 390282408,
    createdAt: 390282408
  },
  {
    messageId: 390282409,
    createdAt: 390282409,
  },
];

const messagesToAdd_2 = [
  {
    messageId: 390282404,
    createdAt: 390282404,
  },
  {
    messageId: 390282405,
    createdAt: 390282405,
  },
];

describe('mergeAndSortMessages', () => {
  it('should append new list of messages to end of list', () => {
    const newList = mergeAndSortMessages(oldMessages, messagesToAdd_1);
    expect(newList).toEqual([...oldMessages, ...messagesToAdd_1]);
  });

  it('should sort messages by createdAt', () => {
    const newList = mergeAndSortMessages(oldMessages, messagesToAdd_2);
    expect(newList).toEqual([
      oldMessages[0],
      messagesToAdd_2[0],
      messagesToAdd_2[1],
      oldMessages[1],
    ]);
  });
});


describe('scrollToRenderedMessage', () => {
  const mockSetIsScrolled = jest.fn();
  const mockRefCurrent = { offsetHeight: 500, querySelectorAll: jest.fn() };
  const mockRef = { current: mockRefCurrent };
  const initialTimeStamp = 123456789;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle the case where the element is not found', () => {
    mockRefCurrent.querySelectorAll.mockReturnValue([]);

    scrollToRenderedMessage(mockRef, initialTimeStamp, mockSetIsScrolled);

    // Ensure that scrollTop is not modified
    expect(mockRefCurrent.scrollTop).toBe(undefined);
    expect(mockSetIsScrolled).toHaveBeenCalledWith(true);
  });

  it('should handle errors gracefully', () => {
    // Mocking an error in the try block
    mockRefCurrent.querySelectorAll.mockImplementation(() => {
      throw new Error('Mock error');
    });

    scrollToRenderedMessage(mockRef, initialTimeStamp, mockSetIsScrolled);

    // Ensure that scrollTop is not modified
    expect(mockRefCurrent.scrollTop).toBe(undefined);
    expect(mockSetIsScrolled).toHaveBeenCalledWith(true);
  });


  it('should scroll to the top of the element', () => {
    // Mocking the element
    const mockElement = document.createElement('div');
    jest.spyOn(mockElement, 'offsetHeight', 'get').mockReturnValue(100);
    jest.spyOn(mockElement, 'offsetTop', 'get').mockReturnValue(200);
    mockRefCurrent.querySelectorAll.mockReturnValue([mockElement]);

    scrollToRenderedMessage(mockRef, initialTimeStamp, mockSetIsScrolled);
    // Ensure that scrollTop is modified
    expect(mockRefCurrent.scrollTop).toBe(200);
    expect(mockSetIsScrolled).toHaveBeenCalledWith(true);
  });
});

describe('channel context utils', () => {
  it('scrolls to the bottom of the current container and marks as scrolled', () => {
    const setIsScrolled = jest.fn();
    const scrollDOM = { scrollHeight: 300, scrollTop: 0 };

    scrollIntoLast(0, { current: scrollDOM }, setIsScrolled);

    expect(scrollDOM.scrollTop).toBe(300);
    expect(setIsScrolled).toHaveBeenCalledWith(true);
  });

  it('stops retrying scrollIntoLast after the maximum attempts', () => {
    const setIsScrolled = jest.fn();

    scrollIntoLast(11, { current: null }, setIsScrolled);

    expect(setIsScrolled).toHaveBeenCalledWith(true);
  });

  it('evaluates channel permission helpers', () => {
    expect(isOperator({ myRole: 'operator' })).toBe(true);
    expect(isOperator({ myRole: 'none' })).toBe(false);
    expect(isDisabledBecauseFrozen({ isFrozen: true, myRole: 'none' })).toBe(true);
    expect(isDisabledBecauseFrozen({ isFrozen: true, myRole: 'operator' })).toBe(false);
    expect(isDisabledBecauseMuted({ myMutedState: 'muted' })).toBe(true);
    expect(isDisabledBecauseMuted({ myMutedState: 'unmuted' })).toBe(false);
  });

  it('maps emoji container entries and member nicknames by key', () => {
    const emojiMap = getAllEmojisMapFromEmojiContainer({
      emojiCategories: [
        { emojis: [{ key: 'smile', url: 'smile.png' }] },
        { emojis: [{ key: 'wave', url: 'wave.png' }] },
      ],
    });
    const nicknameMap = getNicknamesMapFromMembers([
      { userId: 'user-1', nickname: 'Ada' },
      { userId: 'user-2', nickname: 'Grace' },
    ]);

    expect(emojiMap.get('smile')).toBe('smile.png');
    expect(emojiMap.get('wave')).toBe('wave.png');
    expect(nicknameMap.get('user-1')).toBe('Ada');
    expect(nicknameMap.get('user-2')).toBe('Grace');
  });

  it('inserts successful local messages before failed messages', () => {
    const succeeded = { messageId: 1, sendingStatus: 'succeeded', isAdminMessage: () => false };
    const failed = { messageId: 2, sendingStatus: 'failed', isAdminMessage: () => false };
    const pending = { messageId: 3, sendingStatus: 'pending', isAdminMessage: () => false };

    expect(passUnsuccessfullMessages([succeeded, failed], pending)).toEqual([succeeded, pending, failed]);
    expect(passUnsuccessfullMessages([succeeded], { messageId: 4, isAdminMessage: () => false }))
      .toEqual([succeeded, { messageId: 4, isAdminMessage: expect.any(Function) }]);
  });

  it('parses pixel values and compares nearby numbers', () => {
    expect(pxToNumber(12)).toBe(12);
    expect(pxToNumber('12.5px')).toBe(12.5);
    expect(pxToNumber('not-a-size')).toBeNull();
    expect(isAboutSame(10, 14, 4)).toBe(true);
    expect(isAboutSame(10, 15, 4)).toBe(false);
  });
});
