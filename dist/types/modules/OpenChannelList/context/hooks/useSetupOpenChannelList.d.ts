import { Logger } from '../../../../lib/SendbirdState';
import { OpenChannelListDispatcherType, UserFilledOpenChannelListQuery } from '../OpenChannelListInterfaces';
import { SdkStore } from '../../../../lib/types';
interface DynamicParams {
    sdk: SdkStore['sdk'];
    sdkInitialized: boolean;
    openChannelListQuery: UserFilledOpenChannelListQuery;
}
interface StaticParams {
    logger: Logger;
    openChannelListDispatcher: OpenChannelListDispatcherType;
}
declare function useSetupOpenChannelList({ sdk, sdkInitialized, openChannelListQuery, }: DynamicParams, { logger, openChannelListDispatcher, }: StaticParams): void;
export default useSetupOpenChannelList;
