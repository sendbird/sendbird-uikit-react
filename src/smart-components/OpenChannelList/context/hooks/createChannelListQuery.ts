import { OpenChannelListQuery, OpenChannelListQueryParams, SendbirdOpenChat } from "@sendbird/chat/openChannel";
import { CustomUseReducerDispatcher, Logger } from "../../../../lib/SendbirdState";
import OpenChannelListActionTypes from "../dux/actionTypes";
import { UserFilledOpenChannelListQuery } from '../OpenChannelListInterfaces';

interface createChannelListQueryProps {
  sdk: SendbirdOpenChat;
  logMessage: string;
  openChannelListQuery: UserFilledOpenChannelListQuery;
  logger: Logger;
  openChannelListDispatcher: CustomUseReducerDispatcher;
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
