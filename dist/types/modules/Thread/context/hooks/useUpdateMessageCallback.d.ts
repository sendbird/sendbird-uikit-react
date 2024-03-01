import { GroupChannel } from '@sendbird/chat/groupChannel';
import { CustomUseReducerDispatcher, Logger } from '../../../../lib/SendbirdState';
import { SBUGlobalPubSub } from '../../../../lib/pubSub/topics';
interface DynamicProps {
    currentChannel: GroupChannel;
    isMentionEnabled?: boolean;
}
interface StaticProps {
    logger: Logger;
    pubSub: SBUGlobalPubSub;
    threadDispatcher: CustomUseReducerDispatcher;
}
export default function useUpdateMessageCallback({ currentChannel, isMentionEnabled, }: DynamicProps, { logger, pubSub, threadDispatcher, }: StaticProps): (props: any) => void;
export {};
