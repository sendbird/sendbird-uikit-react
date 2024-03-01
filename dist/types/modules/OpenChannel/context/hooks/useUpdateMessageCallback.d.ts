import type { UserMessageUpdateParams } from '@sendbird/chat/message';
import type { Logger } from '../../../../lib/SendbirdState';
import type { OpenChannel } from '@sendbird/chat/openChannel';
interface DynamicParams {
    currentOpenChannel: OpenChannel;
    onBeforeSendUserMessage?: (text: any) => UserMessageUpdateParams;
}
interface StaticParams {
    logger: Logger;
    messagesDispatcher: (props: {
        type: string;
        payload: any;
    }) => void;
}
type CallbackReturn = (messageId: any, text: any, callback: any) => void;
declare function useUpdateMessageCallback({ currentOpenChannel, onBeforeSendUserMessage }: DynamicParams, { logger, messagesDispatcher }: StaticParams): CallbackReturn;
export default useUpdateMessageCallback;
