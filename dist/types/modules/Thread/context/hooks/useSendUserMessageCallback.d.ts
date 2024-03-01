import { GroupChannel } from '@sendbird/chat/groupChannel';
import { UserMessageCreateParams } from '@sendbird/chat/message';
import { User } from '@sendbird/chat';
import { CustomUseReducerDispatcher, Logger } from '../../../../lib/SendbirdState';
import { SBUGlobalPubSub } from '../../../../lib/pubSub/topics';
import { SendableMessageType } from '../../../../utils';
export type OnBeforeSendUserMessageType = (message: string, quoteMessage?: SendableMessageType) => UserMessageCreateParams;
interface DynamicProps {
    isMentionEnabled: boolean;
    currentChannel: GroupChannel;
    onBeforeSendUserMessage?: OnBeforeSendUserMessageType;
}
interface StaticProps {
    logger: Logger;
    pubSub: SBUGlobalPubSub;
    threadDispatcher: CustomUseReducerDispatcher;
}
export type SendMessageParams = {
    message: string;
    quoteMessage?: SendableMessageType;
    mentionTemplate?: string;
    mentionedUsers?: Array<User>;
};
export default function useSendUserMessageCallback({ isMentionEnabled, currentChannel, onBeforeSendUserMessage, }: DynamicProps, { logger, pubSub, threadDispatcher, }: StaticProps): (props: SendMessageParams) => void;
export {};
