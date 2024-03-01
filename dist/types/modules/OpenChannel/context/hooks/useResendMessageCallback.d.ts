import type { OpenChannel } from '@sendbird/chat/openChannel';
import { SendableMessageType } from '../../../../utils';
import { Logger } from '../../../../lib/SendbirdState';
interface DynamicParams {
    currentOpenChannel: OpenChannel;
}
type MessagesDispatcherType = {
    type: string;
    payload: any;
};
interface StaticParams {
    logger: Logger;
    messagesDispatcher: (dispatcher: MessagesDispatcherType) => void;
}
type CallbackReturn = (failedMessage: SendableMessageType) => void;
declare function useResendMessageCallback({ currentOpenChannel }: DynamicParams, { logger, messagesDispatcher }: StaticParams): CallbackReturn;
export default useResendMessageCallback;
