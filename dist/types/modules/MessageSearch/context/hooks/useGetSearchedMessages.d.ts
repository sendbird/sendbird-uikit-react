import type { GroupChannel } from '@sendbird/chat/groupChannel';
import type { MessageSearchQueryParams } from '@sendbird/chat/lib/__definition';
import type { SendbirdError } from '@sendbird/chat';
import type { Logger } from '../../../../lib/SendbirdState';
import { CoreMessageType } from '../../../../utils';
import { SdkStore } from '../../../../lib/types';
interface MainProps {
    currentChannel: GroupChannel;
    channelUrl: string;
    requestString?: string;
    messageSearchQuery?: MessageSearchQueryParams;
    onResultLoaded?: (messages?: Array<CoreMessageType>, error?: SendbirdError) => void;
    retryCount: number;
}
interface ToolProps {
    sdk: SdkStore['sdk'];
    logger: Logger;
    messageSearchDispatcher: (props: {
        type: string;
        payload: any;
    }) => void;
}
declare function useGetSearchedMessages({ currentChannel, channelUrl, requestString, messageSearchQuery, onResultLoaded, retryCount }: MainProps, { sdk, logger, messageSearchDispatcher }: ToolProps): void;
export default useGetSearchedMessages;
