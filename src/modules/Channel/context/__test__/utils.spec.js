// test mergeAndSortMessages
//   const mergedMessages = [...oldMessages, ...newMessages];
//   const getUniqueListByMessageId = (arr) => getUniqueListBy(arr, 'messageId');
//   const unique = getUniqueListByMessageId(mergedMessages);
//   return unique;

import { mergeAndSortMessages, scrollToRenderedMessage } from "../utils";

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
