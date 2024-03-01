import { GroupChannel } from '@sendbird/chat/groupChannel';
import { FileMessageCreateParams } from '@sendbird/chat/message';
import { CustomUseReducerDispatcher, Logger } from '../../../../lib/SendbirdState';
import { SBUGlobalPubSub } from '../../../../lib/pubSub/topics';
import { SendableMessageType } from '../../../../utils';
interface DynamicParams {
    currentChannel: GroupChannel;
    onBeforeSendVoiceMessage?: (file: File, quoteMessage?: SendableMessageType) => FileMessageCreateParams;
}
interface StaticParams {
    logger: Logger;
    pubSub: SBUGlobalPubSub;
    threadDispatcher: CustomUseReducerDispatcher;
}
type FuncType = (file: File, duration: number, quoteMessage: SendableMessageType) => void;
export declare const useSendVoiceMessageCallback: ({ currentChannel, onBeforeSendVoiceMessage, }: DynamicParams, { logger, pubSub, threadDispatcher, }: StaticParams) => FuncType;
export default useSendVoiceMessageCallback;
