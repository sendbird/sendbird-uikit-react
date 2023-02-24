// test mergeAndSortMessages
//   const mergedMessages = [...oldMessages, ...newMessages];
//   const getUniqueListByMessageId = (arr) => getUniqueListBy(arr, 'messageId');
//   const unique = getUniqueListByMessageId(mergedMessages);
//   return unique;

import { mergeAndSortMessages } from "../utils";

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
