import type { GroupChannel, GroupChannelListQuery } from '@sendbird/chat/groupChannel';

export interface ChannelListInitialStateType {
  initialized: boolean;
  loading: boolean;
  refreshing: boolean;
  allChannels: GroupChannel[];
  currentChannel: null | GroupChannel;
  channelListQuery: null | GroupChannelListQuery;
  currentUserId: string;
  disableAutoSelect: boolean;
}

const initialState: ChannelListInitialStateType = {
  // we might not need this initialized state -> should remove
  initialized: false,
  loading: true,
  refreshing: false,
  allChannels: [],
  currentChannel: null,
  channelListQuery: null,
  currentUserId: '',
  disableAutoSelect: false,
};

export default initialState;
