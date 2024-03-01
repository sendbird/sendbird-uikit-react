import { GroupChannel } from '@sendbird/chat/groupChannel';
import { FileMessage, FileMessageCreateParams } from '@sendbird/chat/message';
import { CustomUseReducerDispatcher, Logger } from '../../../../lib/SendbirdState';
import { SBUGlobalPubSub } from '../../../../lib/pubSub/topics';
import { SendableMessageType } from '../../../../utils';
interface DynamicProps {
    currentChannel: GroupChannel;
    onBeforeSendFileMessage?: (file: File, quotedMessage?: SendableMessageType) => FileMessageCreateParams;
}
interface StaticProps {
    logger: Logger;
    pubSub: SBUGlobalPubSub;
    threadDispatcher: CustomUseReducerDispatcher;
}
export type SendFileMessageFunctionType = (file: File, quoteMessage?: SendableMessageType) => Promise<FileMessage>;
export default function useSendFileMessageCallback({ currentChannel, onBeforeSendFileMessage, }: DynamicProps, { logger, pubSub, threadDispatcher, }: StaticProps): SendFileMessageFunctionType;
export {};
