import { compareMessagesForGrouping } from '../../utils/messages';

const stringSet = {
  DATE_FORMAT__MESSAGE_CREATED_AT: 'p',
} as any;

describe('compareMessagesForGrouping', () => {
  it('should return false for both chainTop and chainBottom when replyType is THREAD and currentMessage has threadInfo', () => {
    const prevMessage = {};
    const currMessage = {
      threadInfo: {},
    };
    const nextMessage = {};
    const currentChannel = { channelType: 'group' };
    const replyType = 'THREAD';
    // @ts-ignore
    const result = compareMessagesForGrouping(prevMessage, currMessage, nextMessage, stringSet, currentChannel, replyType);
    expect(result).toEqual([false, false]);
  });

  it('should return [true, true] when on same group', () => {
    const prevMessage = {
      sendingStatus: 'succeeded',
      messageType: 'user',
      sender: { userId: 'tester1' },
      createdAt: 1000,
    };
    const currMessage = {
      sendingStatus: 'succeeded',
      messageType: 'user',
      sender: { userId: 'tester1' },
      createdAt: 1000,
    };
    const nextMessage = {
      sendingStatus: 'succeeded',
      messageType: 'user',
      sender: { userId: 'tester1' },
      createdAt: 1000,
    };
    const currentChannel = {
      channelType: 'group',
      isGroupChannel: () => true,
      getUnreadMemberCount: () => 1,
      getUndeliveredMemberCount: () => 1,
    };
    const replyType = 'QUOTE_REPLY';
    // @ts-ignore
    const result = compareMessagesForGrouping(prevMessage, currMessage, nextMessage, stringSet, currentChannel, replyType);
    expect(result).toEqual([true, true]);
  });

  it('should return [false, false] when on same group but sendingStatus is pending', () => {
    const prevMessage = {
      sendingStatus: 'succeeded',
      messageType: 'user',
      sender: { userId: 'tester1' },
      createdAt: 1000,
    };
    const currMessage = {
      sendingStatus: 'pending',
      messageType: 'user',
      sender: { userId: 'tester1' },
      createdAt: 1000,
    };
    const nextMessage = {
      sendingStatus: 'succeeded',
      messageType: 'user',
      sender: { userId: 'tester1' },
      createdAt: 1000,
    };
    const currentChannel = {
      channelType: 'group',
      getUnreadMemberCount: () => 1,
      getUndeliveredMemberCount: () => 1,
    };
    const replyType = 'QUOTE_REPLY';
    // @ts-ignore
    const result = compareMessagesForGrouping(prevMessage, currMessage, nextMessage, stringSet, currentChannel, replyType);
    expect(result).toEqual([false, false]);
  });

  it('should return [false, false] when on same group but sendingStatus is failed', () => {
    const prevMessage = {
      sendingStatus: 'succeeded',
      messageType: 'user',
      sender: { userId: 'tester1' },
      createdAt: 1000,
    };
    const currMessage = {
      sendingStatus: 'failed',
      messageType: 'user',
      sender: { userId: 'tester1' },
      createdAt: 1000,
    };
    const nextMessage = {
      sendingStatus: 'succeeded',
      messageType: 'user',
      sender: { userId: 'tester1' },
      createdAt: 1000,
    };
    const currentChannel = {
      channelType: 'group',
      getUnreadMemberCount: () => 1,
      getUndeliveredMemberCount: () => 1,
    };
    const replyType = 'QUOTE_REPLY';
    // @ts-ignore
    const result = compareMessagesForGrouping(prevMessage, currMessage, nextMessage, stringSet, currentChannel, replyType);
    expect(result).toEqual([false, false]);
  });
});
