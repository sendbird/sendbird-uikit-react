import { GroupChannel } from '@sendbird/chat/groupChannel';
import { CustomUseReducerDispatcher, Logger } from '../../../../lib/SendbirdState';
import { SBUGlobalPubSub } from '../../../../lib/pubSub/topics';
import { SendableMessageType } from '../../../../utils';
interface DynamicProps {
    sdkInit: boolean;
    currentChannel: GroupChannel;
    parentMessage: SendableMessageType;
}
interface StaticProps {
    logger: Logger;
    pubSub: SBUGlobalPubSub;
    threadDispatcher: CustomUseReducerDispatcher;
}
export default function useHandleThreadPubsubEvents({ sdkInit, currentChannel, parentMessage, }: DynamicProps, { pubSub, threadDispatcher, }: StaticProps): void;
export {};
