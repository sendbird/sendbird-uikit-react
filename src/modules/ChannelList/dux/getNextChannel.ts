// See the conditions of this function here https://github.com/sendbird/sendbird-uikit-react/pull/777
import { GroupChannel } from '@sendbird/chat/groupChannel';

type CurrentChannelType = GroupChannel | null;

export interface GetNextChannelProps {
  channel: GroupChannel;
  currentChannel: CurrentChannelType;
  allChannels: GroupChannel[];
  disableAutoSelect: boolean;
}

/**
 * NOTICE: Use this function IF the current channel is removed from allChannels.
 * This function will give you the next currentChannel value.
 */
export const getNextChannel = ({
  channel,
  currentChannel,
  allChannels,
  disableAutoSelect,
}: GetNextChannelProps): CurrentChannelType => {
  let nextChannel: CurrentChannelType = null;
  if (currentChannel?.url === channel.url) {
    if (!disableAutoSelect && allChannels.length > 0) {
      const [firstChannel, secondChannel = null] = allChannels;
      nextChannel = firstChannel.url === channel.url ? secondChannel : firstChannel;
    }
  } else {
    nextChannel = currentChannel;
  }
  return nextChannel;
};
