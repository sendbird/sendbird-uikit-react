import type { GroupChannel, GroupChannelListQuery } from '@sendbird/chat/groupChannel';
export interface ChannelListInitialStateType {
    initialized: boolean;
    loading: boolean;
    allChannels: GroupChannel[];
    currentChannel: null | GroupChannel;
    channelListQuery: null | GroupChannelListQuery;
    currentUserId: string;
    disableAutoSelect: boolean;
}
declare const initialState: ChannelListInitialStateType;
export default initialState;
