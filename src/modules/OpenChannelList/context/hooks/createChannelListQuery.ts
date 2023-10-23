import { OpenChannelListQuery, OpenChannelListQueryParams } from '@sendbird/chat/openChannel';
import { Logger } from '../../../../lib/SendbirdState';
import OpenChannelListActionTypes from '../dux/actionTypes';
import { OpenChannelListDispatcherType, UserFilledOpenChannelListQuery } from '../OpenChannelListInterfaces';
import { SdkStore } from '../../../../lib/types';

interface createChannelListQueryProps {
  sdk: SdkStore['sdk'];
  logMessage: string;
  openChannelListQuery: UserFilledOpenChannelListQuery;
  logger: Logger;
  openChannelListDispatcher: OpenChannelListDispatcherType;
}

function createChannelListQuery({
  sdk,
  logMessage,
  openChannelListQuery,
  logger,
  openChannelListDispatcher,
}: createChannelListQueryProps): OpenChannelListQuery {
  const params = {} as OpenChannelListQueryParams;
  params.limit = 20;
  params.includeFrozen = true;
  if (openChannelListQuery) {
    Object.keys(openChannelListQuery).forEach((key) => {
      params[key] = openChannelListQuery[key];
    });
  }
  const channelListQuery = sdk?.openChannel?.createOpenChannelListQuery?.(params);
  logger.info(logMessage, channelListQuery);
  openChannelListDispatcher({
    type: OpenChannelListActionTypes.UPDATE_OPEN_CHANNEL_LIST_QUERY,
    payload: channelListQuery,
  });
  return channelListQuery;
}

export default createChannelListQuery;
