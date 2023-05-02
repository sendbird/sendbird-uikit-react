import { OpenChannel, OpenChannelListQuery } from '@sendbird/chat/openChannel';
import { OpenChannelListFetchingStatus } from '../OpenChannelListInterfaces';

export interface OpenChannelListInitialInterface {
  allChannels: Array<OpenChannel>;
  currentChannel: OpenChannel;
  fetchingStatus: OpenChannelListFetchingStatus;
  channelListQuery: OpenChannelListQuery;
}

export default {
  allChannels: [],
  currentChannel: null,
  fetchingStatus: OpenChannelListFetchingStatus.EMPTY,
  channelListQuery: null,
} as OpenChannelListInitialInterface;
