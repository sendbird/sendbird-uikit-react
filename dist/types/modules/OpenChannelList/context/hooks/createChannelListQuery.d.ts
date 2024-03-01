import { OpenChannelListQuery } from '@sendbird/chat/openChannel';
import { Logger } from '../../../../lib/SendbirdState';
import { OpenChannelListDispatcherType, UserFilledOpenChannelListQuery } from '../OpenChannelListInterfaces';
import { SdkStore } from '../../../../lib/types';
interface createChannelListQueryProps {
    sdk: SdkStore['sdk'];
    logMessage: string;
    openChannelListQuery: UserFilledOpenChannelListQuery;
    logger: Logger;
    openChannelListDispatcher: OpenChannelListDispatcherType;
}
declare function createChannelListQuery({ sdk, logMessage, openChannelListQuery, logger, openChannelListDispatcher, }: createChannelListQueryProps): OpenChannelListQuery;
export default createChannelListQuery;
