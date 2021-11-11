import {
  getLastMessage,
  getChannelTitle,
  getTotalMembers,
  getChannelUnreadMessageCount,
} from '../utils';
import { LabelStringSet } from '../../../../../ui/Label'

describe('ChannelPreview', () => {
  it('utils/getLastMessage: should return lastMessage', function () {
    const text = 'example-text';
    const channel = {};
    const channel2 = { lastMessage: { message: '' } };
    const channel3 = { lastMessage: { message: text } };
    expect(
      getLastMessage(channel)
    ).toBe('');
    expect(
      getLastMessage(channel2)
    ).toBe('');
    expect(
      getLastMessage(channel3)
    ).toBe(text);
  });

  it('utils/getChannelTitle: should return channelTitle', function () {
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

  it('utils/getTotalMembers: should return totalMembers', function () {
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

  it('utils/getChannelUnreadMessageCount: should return unreadMessageCount', function () {
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
});