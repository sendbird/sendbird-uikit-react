import {
  getLastMessage,
  getChannelTitle,
  getTotalMembers,
  getChannelUnreadMessageCount,
  getLastMessageCreatedAt,
} from '../utils';
import { LabelStringSet } from '../../../../../ui/Label'

jest.useFakeTimers();
jest.setSystemTime(new Date('March 2, 2022 08:15:52'));

describe('ChannelPreview', () => {
  test('utils/getLastMessage returns lastMessage', function () {
    const text = 'example-text';
    const channel = {
      lastMessage: {
        isUserMessage: () => true,
        isFileMessage: () => false,
        isMultipleFilesMessage: () => false,
      }
    };
    const channel2 = {
      lastMessage: {
        message: '',
        isUserMessage: () => true,
        isFileMessage: () => false,
        isMultipleFilesMessage: () => false,
      }
    };
    const channel3 = {
      lastMessage: {
        message: text,
        isUserMessage: () => true,
        isFileMessage: () => false,
        isMultipleFilesMessage: () => false,
      }
    };
    const channel4 = {
      lastMessage: {
        name: 'file1',
        type: 'wefiwfiwj',
        isUserMessage: () => false,
        isFileMessage: () => true,
        isMultipleFilesMessage: () => false,
      }
    };
    const channel5 = {
      lastMessage: {
        name: 'file2',
        type: 'image/jpg',
        isUserMessage: () => false,
        isFileMessage: () => true,
        isMultipleFilesMessage: () => false,
      }
    };
    const channel6 = {
      lastMessage: {
        name: 'file3',
        type: 'image/gif',
        isUserMessage: () => false,
        isFileMessage: () => true,
        isMultipleFilesMessage: () => false,
      }
    };
    const channel7 = {
      lastMessage: {
        fileInfoList: [
          { fileName: 'file1', mimeType: 'video/mp4', },
          { fileName: 'file2', mimeType: 'image/gif', }
        ],
        isUserMessage: () => false,
        isFileMessage: () => false,
        isMultipleFilesMessage: () => true,
      }
    };
    expect(
      getLastMessage(channel)
    ).toBe('');
    expect(
      getLastMessage(channel2)
    ).toBe('');
    expect(
      getLastMessage(channel3)
    ).toBe(text);
    expect(
      getLastMessage(channel4)
    ).toBe('File');
    expect(
      getLastMessage(channel5)
    ).toBe('Photo');
    expect(
      getLastMessage(channel6)
    ).toBe('GIF');
    expect(
      getLastMessage(channel7)
    ).toBe('Video');
  });

  test('utils/getChannelTitle returns channelTitle', function () {
    const text = 'example-text';
    const channel = {};
    const channel2 = { name: text };
    const channel3 = { members: [{ nickname: 'One' }, { nickname: 'Two' }] };
    const channel4 = { members: [] };
    const channelWithNoOtherMembers = { members: [{ nickname: 'One' }] };
    const oneToOneChannel = { members: [{ nickname: 'One', userId: 'One' }, { nickname: 'Two' }] };
    // no channel
    expect(
      getChannelTitle()
    ).toBe(LabelStringSet.NO_TITLE);
    // no members
    expect(
      getChannelTitle(channel)
    ).toBe(LabelStringSet.NO_TITLE);
    // with channel name
    expect(
      getChannelTitle(channel2)
    ).toBe(text);
    // with two different members
    expect(
      getChannelTitle(channel3, '')
    ).toBe('One, Two');
    // 0 members
    expect(
      getChannelTitle(channel4)
    ).toBe('');
    // Only one member who is the current user
    expect(
      getChannelTitle(channelWithNoOtherMembers, 'One')
    ).toBe(LabelStringSet.NO_MEMBERS);
    // One to one channel
    expect(
      getChannelTitle(oneToOneChannel, 'One')
    ).toBe('Two');
  });

  test('utils/getTotalMembers returns totalMembers', function () {
    const channel = { memberCount: 1 };
    const channel2 = { memberCount: 100 };
    expect(
      getTotalMembers()
    ).toBe(0);
    expect(
      getTotalMembers(channel)
    ).toBe(channel.memberCount)
    expect(
      getTotalMembers(channel2)
    ).toBe(channel2.memberCount);
  });

  test('utils/getChannelUnreadMessageCount returns unreadMessageCount', function () {
    const channel = {};
    const channel2 = { unreadMessageCount: 1 };
    const channel3 = { unreadMessageCount: 100 };
    expect(
      getChannelUnreadMessageCount()
    ).toBe(0);
    expect(
      getChannelUnreadMessageCount(channel)
    ).toBe(0);
    expect(
      getChannelUnreadMessageCount(channel2)
    ).toBe(channel2.unreadMessageCount);
    expect(
      getChannelUnreadMessageCount(channel3)
    ).toBe(channel3.unreadMessageCount);
  });

  test('utils/getLastMessageCreatedAt returns time if ts is created today', () => {
    const nowTime = new Date(Date.now());
    const isPM = nowTime?.getHours() > 12;
    expect(
      getLastMessageCreatedAt({
        channel: { lastMessage: { createdAt: nowTime } },
      })
    ).toBe(`${nowTime?.getHours() - (isPM ? 12 : 0)}:${nowTime?.getMinutes()} ${isPM ? 'PM' : 'AM'}`);
  });

  test('utils/getLastMessageCreatedAt returns "Yesterday" if ts is created yesterday', () => {
    const nowTime = new Date(Date.now());
    nowTime.setDate(nowTime.getDate() - 1);
    expect(
      getLastMessageCreatedAt({
        channel: { lastMessage: { createdAt: nowTime } },
      })
    ).toBe("Yesterday");
  });

  test('utils/getLastMessageCreatedAt returns month and date if ts is created in this year', () => {
    const nowTime = new Date(Date.now());
    nowTime.setDate(nowTime.getDate() - 2);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (!(nowTime.getMonth() === 0 && (nowTime.getDate() === 0 || nowTime.getDate() === 1))) {
      // This test will fail on Jan 1st and 2nd
      expect(
        getLastMessageCreatedAt({
          channel: { lastMessage: { createdAt: nowTime } },
        })
      ).toBe(`${months[nowTime?.getMonth()]} ${nowTime?.getDate()}`)
    }
  });

  test('utils/getLastMessageCreatedAt returns year, month, and date if ts is created last year', () => {
    const nowTime = new Date(Date.now());
    nowTime.setFullYear(nowTime.getFullYear() - 1);
    expect(
      getLastMessageCreatedAt({
        channel: { lastMessage: { createdAt: nowTime } },
      })
    ).toBe(`${nowTime?.getFullYear()}/${nowTime?.getMonth() + 1}/${nowTime?.getDate()}`);
  });
});
