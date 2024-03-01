import type { SendbirdError } from '@sendbird/chat';
import type { MessageSearchQuery } from '@sendbird/chat/message';
import { CoreMessageType } from '../../../../utils';
import { LoggerInterface } from '../../../../lib/Logger';
interface MainProps {
    currentMessageSearchQuery: MessageSearchQuery;
    hasMoreResult: boolean;
    onResultLoaded?: (messages?: Array<CoreMessageType>, error?: SendbirdError) => void;
}
type MessageSearchDispatcherType = {
    type: string;
    payload: any;
};
interface ToolProps {
    logger: LoggerInterface;
    messageSearchDispatcher: (payload: MessageSearchDispatcherType) => void;
}
export type CallbackReturn = (callback: (messages: Array<CoreMessageType>, error: any) => void) => void;
declare function useScrollCallback({ currentMessageSearchQuery, hasMoreResult, onResultLoaded }: MainProps, { logger, messageSearchDispatcher }: ToolProps): CallbackReturn;
export default useScrollCallback;
