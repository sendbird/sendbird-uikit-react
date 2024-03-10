import { SendbirdError } from '@sendbird/chat';
import type { GroupChannel, GroupChannelListQuery } from '@sendbird/chat/groupChannel';

export interface ChannelListInitialStateType {
  initialized: boolean;
  loading: boolean;
  error: SendbirdError | null;
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
  error: null,
  allChannels: [],
  currentChannel: null,
  channelListQuery: null,
  currentUserId: '',
  disableAutoSelect: false,
};

export default initialState;
