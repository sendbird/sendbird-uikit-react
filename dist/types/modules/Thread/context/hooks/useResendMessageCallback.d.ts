import { GroupChannel } from '@sendbird/chat/groupChannel';
import { CustomUseReducerDispatcher, Logger } from '../../../../lib/SendbirdState';
import { SBUGlobalPubSub } from '../../../../lib/pubSub/topics';
import { SendableMessageType } from '../../../../utils';
interface DynamicProps {
    currentChannel: GroupChannel;
}
interface StaticProps {
    logger: Logger;
    pubSub: SBUGlobalPubSub;
    threadDispatcher: CustomUseReducerDispatcher;
}
export default function useResendMessageCallback({ currentChannel, }: DynamicProps, { logger, pubSub, threadDispatcher, }: StaticProps): (failedMessage: SendableMessageType) => void;
export {};
