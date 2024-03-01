import { SendbirdError } from '@sendbird/chat';
import { OpenChannel, OpenChannelListQuery } from '@sendbird/chat/openChannel';
import { Logger } from '../../../../lib/SendbirdState';
import { OpenChannelListDispatcherType } from '../OpenChannelListInterfaces';
interface DynamicParams {
    sdkInitialized: boolean;
    openChannelListQuery: OpenChannelListQuery;
}
interface StaticParams {
    logger: Logger;
    openChannelListDispatcher: OpenChannelListDispatcherType;
}
export type FetchNextCallbackType = (callback: (channels?: Array<OpenChannel>, err?: SendbirdError) => void) => void;
declare function useFetchNextCallback({ sdkInitialized, openChannelListQuery, }: DynamicParams, { logger, openChannelListDispatcher, }: StaticParams): FetchNextCallbackType;
export default useFetchNextCallback;
