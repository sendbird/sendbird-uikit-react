import { useCallback } from 'react';

import { Logger } from '../../../../lib/SendbirdState';
import createChannelListQuery from './createChannelListQuery';
import { OpenChannelListDispatcherType, UserFilledOpenChannelListQuery } from '../OpenChannelListInterfaces';
import OpenChannelListActionTypes from '../dux/actionTypes';
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

function useRefreshOpenChannelList(
  {
    sdk,
    sdkInitialized,
    openChannelListQuery,
  }: DynamicParams,
  {
    logger,
    openChannelListDispatcher,
  }: StaticParams,
): () => void {
  return useCallback(() => {
    if (!sdkInitialized) {
      logger.info('OpenChannelList|useRefreshOpenChannelList: Reset OpenChannelList', { sdkInitialized });
      openChannelListDispatcher({
        type: OpenChannelListActionTypes.RESET_OPEN_CHANNEL_LIST,
        payload: null,
      });
      return;
    }
    if (!sdk?.openChannel) {
      logger.warning('OpenChannelList|useRefreshOpenChannelList: openChannel is not included in the Chat SDK', sdk);
      return;
    }
    if (!sdk?.openChannel?.createOpenChannelListQuery) {
      logger.warning('OpenChannelList|useRefreshOpenChannelList: createOpenChannelListQuery is not included in the openChannel', sdk.openChannel);
      return;
    }

    logger.info('OpenChannelList|useRefreshOpenChannelList: Setup OpenChannelList', { sdkInitialized });

    const channelListQuery = createChannelListQuery({
      sdk,
      logger,
      openChannelListQuery,
      openChannelListDispatcher,
      logMessage: 'OpenChannelList|useRefreshOpenChannelList: Succeeded create channelListQuery',
    });

    if (channelListQuery.hasNext) {
      logger.info('OpenChannelList|useRefreshOpenChannelList: Fetch channels');
      openChannelListDispatcher({
        type: OpenChannelListActionTypes.INIT_OPEN_CHANNEL_LIST_START,
        payload: null,
      });
      channelListQuery.next()
        .then((channelList) => {
          logger.info('OpenChannelList|useRefreshOpenChannelList: Succeeded fetching channels', channelList);
          openChannelListDispatcher({
            type: OpenChannelListActionTypes.INIT_OPEN_CHANNEL_LIST_SUCCESS,
            payload: channelList,
          });
        })
        .catch((err) => {
          logger.error('OpenChannelList|useRefreshOpenChannelList: Failed fetching channels', err);
          openChannelListDispatcher({
            type: OpenChannelListActionTypes.INIT_OPEN_CHANNEL_LIST_FAILURE,
            payload: null,
          });
        });
    } else {
      logger.info('OpenChannelList|useRefreshOpenChannelList: There is no more channels');
    }
  }, [sdkInitialized, openChannelListQuery]);
}

export default useRefreshOpenChannelList;
