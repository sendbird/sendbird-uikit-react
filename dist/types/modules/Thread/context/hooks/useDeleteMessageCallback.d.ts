import { GroupChannel } from '@sendbird/chat/groupChannel';
import { CustomUseReducerDispatcher, Logger } from '../../../../lib/SendbirdState';
import { SendableMessageType } from '../../../../utils';
interface DynamicProps {
    currentChannel: GroupChannel;
    threadDispatcher: CustomUseReducerDispatcher;
}
interface StaticProps {
    logger: Logger;
}
export default function useDeleteMessageCallback({ currentChannel, threadDispatcher, }: DynamicProps, { logger, }: StaticProps): (message: SendableMessageType) => Promise<void>;
export {};
