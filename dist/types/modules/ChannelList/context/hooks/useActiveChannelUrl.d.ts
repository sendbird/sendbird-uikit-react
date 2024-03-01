/// <reference types="react" />
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { Logger } from '../../../../lib/SendbirdState';
import { SdkStore } from '../../../../lib/types';
export type DynamicProps = {
    activeChannelUrl?: string;
    channels?: GroupChannel[];
    sdk?: SdkStore['sdk'];
};
export type StaticProps = {
    logger: Logger;
    channelListDispatcher: React.Dispatch<any>;
};
declare function useActiveChannelUrl({ activeChannelUrl, channels, sdk, }: DynamicProps, { logger, channelListDispatcher, }: StaticProps): void;
export default useActiveChannelUrl;
