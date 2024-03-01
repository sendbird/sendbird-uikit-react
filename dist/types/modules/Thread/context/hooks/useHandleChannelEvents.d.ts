import { GroupChannel } from '@sendbird/chat/groupChannel';
import { CustomUseReducerDispatcher, Logger } from '../../../../lib/SendbirdState';
import { SdkStore } from '../../../../lib/types';
interface DynamicProps {
    sdk: SdkStore['sdk'];
    currentChannel: GroupChannel;
}
interface StaticProps {
    logger: Logger;
    threadDispatcher: CustomUseReducerDispatcher;
}
export default function useHandleChannelEvents({ sdk, currentChannel, }: DynamicProps, { logger, threadDispatcher, }: StaticProps): void;
export {};
