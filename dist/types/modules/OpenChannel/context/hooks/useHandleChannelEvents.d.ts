/// <reference types="react" />
import { OpenChannel } from '@sendbird/chat/openChannel';
import { Logger } from '../../../../lib/SendbirdState';
import { SdkStore } from '../../../../lib/types';
type MessagesDispatcherType = {
    type: string;
    payload: any;
};
interface DynamicParams {
    currentOpenChannel: OpenChannel;
    checkScrollBottom: () => boolean;
}
interface StaticParams {
    sdk: SdkStore['sdk'];
    logger: Logger;
    scrollRef: React.RefObject<HTMLElement>;
    messagesDispatcher: (props: MessagesDispatcherType) => void;
}
declare function useHandleChannelEvents({ currentOpenChannel, checkScrollBottom }: DynamicParams, { sdk, logger, messagesDispatcher, scrollRef }: StaticParams): void;
export default useHandleChannelEvents;
