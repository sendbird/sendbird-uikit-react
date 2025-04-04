import type { Logger, SdkStore } from '../../../../lib/Sendbird/types';
import { OpenChannelListQuery, OpenChannelListQueryParams } from '@sendbird/chat/openChannel';
import OpenChannelListActionTypes from '../dux/actionTypes';
import { OpenChannelListDispatcherType, UserFilledOpenChannelListQuery } from '../OpenChannelListInterfaces';

interface createChannelListQueryProps {
  sdk: SdkStore['sdk'];
  logMessage: string;
  openChannelListQuery?: UserFilledOpenChannelListQuery;
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
      // @ts-ignore
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
