import { OpenChannel, OpenChannelListQuery } from '@sendbird/chat/openChannel';
import { OpenChannelListFetchingStatus } from '../OpenChannelListInterfaces';
export interface OpenChannelListInitialInterface {
    allChannels: Array<OpenChannel>;
    currentChannel: OpenChannel;
    fetchingStatus: OpenChannelListFetchingStatus;
    channelListQuery: OpenChannelListQuery;
}
declare const _default: OpenChannelListInitialInterface;
export default _default;
