import { compareMessagesForGrouping, isSameGroup } from '../messages';

jest.mock('../utils', () => ({
  isSameGroup: jest.fn(),
}));

describe('compareMessagesForGrouping', () => {
  it('should return false for both chainTop and chainBottom when replyType is THREAD and currentMessage has threadInfo', () => {
    const prevMessage = {};
    const currMessage = {
      threadInfo: {},
    };
    const nextMessage = {};
    const currentChannel = {};
    const replyType = 'THREAD';
    // @ts-ignore
    const result = compareMessagesForGrouping(prevMessage, currMessage, nextMessage, currentChannel, replyType);
    expect(result).toEqual([false, false]);
  });

  it('should return [true, true] when on same group', () => {
    // @ts-ignore
    isSameGroup.mockImplementation(() => true);
    const prevMessage = {
      sendingStatus: 'succeeded',
    };
    const currMessage = {
      sendingStatus: 'succeeded',
    };
    const nextMessage = {
      sendingStatus: 'succeeded',
    };
    const currentChannel = {};
    const replyType = 'REPLY';
    // @ts-ignore
    const result = compareMessagesForGrouping(prevMessage, currMessage, nextMessage, currentChannel, replyType);
    expect(result).toEqual([true, true]);
  });

  it('should return [false, false] when on same group but sendingStatus is pending', () => {
    // @ts-ignore
    isSameGroup.mockImplementation(() => true);
    const prevMessage = {
      sendingStatus: 'succeeded',
    };
    const currMessage = {
      sendingStatus: 'pending',
    };
    const nextMessage = {
      sendingStatus: 'succeeded',
    };
    const currentChannel = {};
    const replyType = 'REPLY';
    // @ts-ignore
    const result = compareMessagesForGrouping(prevMessage, currMessage, nextMessage, currentChannel, replyType);
    expect(result).toEqual([false, false]);
  });

  it('should return [false, false] when on same group but sendingStatus is failed', () => {
    // @ts-ignore
    isSameGroup.mockImplementation(() => true);
    const prevMessage = {
      sendingStatus: 'succeeded',
    };
    const currMessage = {
      sendingStatus: 'failed',
    };
    const nextMessage = {
      sendingStatus: 'succeeded',
    };
    const currentChannel = {};
    const replyType = 'REPLY';
    // @ts-ignore
    const result = compareMessagesForGrouping(prevMessage, currMessage, nextMessage, currentChannel, replyType);
    expect(result).toEqual([false, false]);
  });
});
