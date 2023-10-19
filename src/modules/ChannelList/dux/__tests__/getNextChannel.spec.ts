// See the conditions of this function here https://github.com/sendbird/sendbird-uikit-react/pull/777
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { getNextChannel } from '../getNextChannel';

const mockChannels = [
  { url: '0001' },
  { url: '0002' },
  { url: '0003' },
  { url: '0004' },
  { url: '0005' },
] as unknown as GroupChannel[];

describe('ChannelList-dux-getNextChannel', () => {
  it('should keep the currentChannel if channel is not the same as currentChannel', () => {
    const [channel, currentChannel] = mockChannels;
    const nextChannel = getNextChannel({
      channel,
      currentChannel,
      allChannels: mockChannels,
      disableAutoSelect: false,
    });
    expect(nextChannel?.url).toEqual(currentChannel.url);
  });
  it('should replace the currentChannel if channel is the same as currentChannel', () => {
    const [channel] = mockChannels;
    const currentChannel = channel;
    const nextChannel = getNextChannel({
      channel,
      currentChannel,
      allChannels: mockChannels,
      disableAutoSelect: false,
    });
    expect(nextChannel?.url).not.toEqual(currentChannel.url);
  });
  it('should replace the currentChannel with firstChannel if the channel is not the firstChannel', () => {
    const [firstChannel, channel] = mockChannels;
    const currentChannel = channel;
    const nextChannel = getNextChannel({
      channel,
      currentChannel,
      allChannels: mockChannels,
      disableAutoSelect: false,
    });
    expect(nextChannel?.url).toEqual(firstChannel.url);
  });
  it('should replace the currentChannel with secondChannel if the channel is firstChannel', () => {
    const [firstChannel, secondChannel] = mockChannels;
    const channel = firstChannel;
    const currentChannel = firstChannel;
    const nextChannel = getNextChannel({
      channel,
      currentChannel,
      allChannels: mockChannels,
      disableAutoSelect: false,
    });
    expect(nextChannel?.url).toEqual(secondChannel.url);
  });
  it('should not replace the currentChannel with the other channel if the disableAutoSelect is true', () => {
    const [channel] = mockChannels;
    const currentChannel = channel;
    const nextChannel = getNextChannel({
      channel,
      currentChannel,
      allChannels: mockChannels,
      disableAutoSelect: true,
    });
    expect(nextChannel).toBe(null);
  });
});
