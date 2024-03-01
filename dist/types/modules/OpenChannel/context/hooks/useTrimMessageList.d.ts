import { LoggerInterface } from '../../../../lib/Logger';
interface DynamicParams {
    messagesLength: number;
    messageLimit: number;
}
type MessagesDispatcherType = {
    type: string;
    payload: {
        messageLimit: number;
    };
};
interface StaticParams {
    messagesDispatcher: (dispatcher: MessagesDispatcherType) => void;
    logger: LoggerInterface;
}
declare function useTrimMessageList({ messagesLength, messageLimit }: DynamicParams, { messagesDispatcher, logger }: StaticParams): void;
export default useTrimMessageList;
