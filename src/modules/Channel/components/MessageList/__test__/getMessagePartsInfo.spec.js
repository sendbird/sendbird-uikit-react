import { getMessagePartsInfo } from "../getMessagePartsInfo";

const mockChannel = {
  isGroupChannel: () => true,
  getUnreadMemberCount: () => 0,
  getUndeliveredMemberCount: () => 0,
};

const currentTime = Date.now();
const timeList = [1, 2, 3].map((gap) => {
  const time = new Date(currentTime);
  time.setMinutes(time.getMinutes() + gap);
  return time.valueOf();
});
const users = [{ userId: 1 }, { userId: 2 }];

// same sender & same sent at
const messageGroup1 = [1, 2, 3].map((n) => ({
  messageId: n,
  sendingStatus: 'succeeded',
  createdAt: timeList[0],
  messageType: 'user',
  sender: users[0],
}));
// same sender & different sent at
const messageGroup2 = [1, 2, 3].map((n, i) => ({
  messageId: n,
  sendingStatus: 'succeeded',
  createdAt: timeList[i],
  messageType: 'user',
  sender: users[0],
}));
// different sender && same sent at
const messageGroup3 = [1, 2, 3].map((n, i) => ({
  messageId: n,
  sendingStatus: 'succeeded',
  createdAt: timeList[0],
  messageType: 'user',
  sender: users[i],
}));

describe('getMessagePartsInfo', () => {
  it('should group messages that are sent at same time', () => {
    const defaultSetting = {
      allMessages: messageGroup1,
      isMessageGroupingEnabled: true,
      currentChannel: mockChannel,
      replyType: 'THREAD',
    };
    const firstGroupingInfo = getMessagePartsInfo({
      ...defaultSetting,
      currentIndex: 0,
      currentMessage: defaultSetting.allMessages[0],
    });
    expect(firstGroupingInfo.chainTop).toBe(false);
    expect(firstGroupingInfo.chainBottom).toBe(true);
    expect(firstGroupingInfo.hasSeparator).toBe(true);
    const secondGroupingInfo = getMessagePartsInfo({
      ...defaultSetting,
      currentIndex: 1,
      currentMessage: defaultSetting.allMessages[1],
    });
    expect(secondGroupingInfo.chainTop).toBe(true);
    expect(secondGroupingInfo.chainBottom).toBe(true);
    expect(secondGroupingInfo.hasSeparator).toBe(false);
    const thirdGroupingInfo = getMessagePartsInfo({
      ...defaultSetting,
      currentIndex: 2,
      currentMessage: defaultSetting.allMessages[2],
    });
    expect(thirdGroupingInfo.chainTop).toBe(true);
    expect(thirdGroupingInfo.chainBottom).toBe(false);
    expect(thirdGroupingInfo.hasSeparator).toBe(false);
  });

  it('should not group messages if isMessageGroupingEnabled is false', () => {
    const defaultSetting = {
      allMessages: messageGroup1,
      isMessageGroupingEnabled: false,
      currentChannel: mockChannel,
      replyType: 'THREAD',
    };
    const firstGroupingInfo = getMessagePartsInfo({
      ...defaultSetting,
      currentIndex: 0,
      currentMessage: defaultSetting.allMessages[0],
    });
    expect(firstGroupingInfo.chainTop).toBe(false);
    expect(firstGroupingInfo.chainBottom).toBe(false);
    expect(firstGroupingInfo.hasSeparator).toBe(true);
    const secondGroupingInfo = getMessagePartsInfo({
      ...defaultSetting,
      currentIndex: 1,
      currentMessage: defaultSetting.allMessages[1],
    });
    expect(secondGroupingInfo.chainTop).toBe(false);
    expect(secondGroupingInfo.chainBottom).toBe(false);
    expect(secondGroupingInfo.hasSeparator).toBe(false);
    const thirdGroupingInfo = getMessagePartsInfo({
      ...defaultSetting,
      currentIndex: 2,
      currentMessage: defaultSetting.allMessages[2],
    });
    expect(thirdGroupingInfo.chainTop).toBe(false);
    expect(thirdGroupingInfo.chainBottom).toBe(false);
    expect(thirdGroupingInfo.hasSeparator).toBe(false);
  });

  it('should not group messages if sent time are different', () => {
    const defaultSetting = {
      allMessages: messageGroup2,
      isMessageGroupingEnabled: true,
      currentChannel: mockChannel,
      replyType: 'THREAD',
    };
    const firstGroupingInfo = getMessagePartsInfo({
      ...defaultSetting,
      currentIndex: 0,
      currentMessage: defaultSetting.allMessages[0],
    });
    expect(firstGroupingInfo.chainTop).toBe(false);
    expect(firstGroupingInfo.chainBottom).toBe(false);
    expect(firstGroupingInfo.hasSeparator).toBe(true);
    const secondGroupingInfo = getMessagePartsInfo({
      ...defaultSetting,
      currentIndex: 1,
      currentMessage: defaultSetting.allMessages[1],
    });
    expect(secondGroupingInfo.chainTop).toBe(false);
    expect(secondGroupingInfo.chainBottom).toBe(false);
    expect(secondGroupingInfo.hasSeparator).toBe(false);
    const thirdGroupingInfo = getMessagePartsInfo({
      ...defaultSetting,
      currentIndex: 2,
      currentMessage: defaultSetting.allMessages[2],
    });
    expect(thirdGroupingInfo.chainTop).toBe(false);
    expect(thirdGroupingInfo.chainBottom).toBe(false);
    expect(thirdGroupingInfo.hasSeparator).toBe(false);
  });
  it('should not group messages if sender is different', () => {
    const defaultSetting = {
      allMessages: messageGroup3,
      isMessageGroupingEnabled: true,
      currentChannel: mockChannel,
      replyType: 'THREAD',
    };
    const firstGroupingInfo = getMessagePartsInfo({
      ...defaultSetting,
      currentIndex: 0,
      currentMessage: defaultSetting.allMessages[0],
    });
    expect(firstGroupingInfo.chainTop).toBe(false);
    expect(firstGroupingInfo.chainBottom).toBe(false);
    expect(firstGroupingInfo.hasSeparator).toBe(true);
    const secondGroupingInfo = getMessagePartsInfo({
      ...defaultSetting,
      currentIndex: 1,
      currentMessage: defaultSetting.allMessages[1],
    });
    expect(secondGroupingInfo.chainTop).toBe(false);
    expect(secondGroupingInfo.chainBottom).toBe(false);
    expect(secondGroupingInfo.hasSeparator).toBe(false);
    const thirdGroupingInfo = getMessagePartsInfo({
      ...defaultSetting,
      currentIndex: 2,
      currentMessage: defaultSetting.allMessages[2],
    });
    expect(thirdGroupingInfo.chainTop).toBe(false);
    expect(thirdGroupingInfo.chainBottom).toBe(false);
    expect(thirdGroupingInfo.hasSeparator).toBe(false);
  });
});
