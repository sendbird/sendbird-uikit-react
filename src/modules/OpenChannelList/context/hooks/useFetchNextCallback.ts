import { useCallback } from 'react';

import { SendbirdError } from '@sendbird/chat';
import { OpenChannel, OpenChannelListQuery } from '@sendbird/chat/openChannel';

import type { Logger } from '../../../../lib/Sendbird/types';
import OpenChannelListActionTypes from '../dux/actionTypes';
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

function useFetchNextCallback(
  {
    sdkInitialized,
    openChannelListQuery,
  }: DynamicParams,
  {
    logger,
    openChannelListDispatcher,
  }: StaticParams,
): FetchNextCallbackType {
  return useCallback((callback) => {
    if (sdkInitialized && openChannelListQuery?.hasNext) {
      logger.info('OpenChannelList|useFetchNextCallback : Fetch channels');
      openChannelListDispatcher({
        type: OpenChannelListActionTypes.FETCH_OPEN_CHANNEL_LIST_START,
        payload: null,
      });
      openChannelListQuery.next()
        .then((channelList) => {
          callback(channelList, undefined);
          logger.info('OpenChannelList|useFetchNextCallback: Succeeded fetching channels', channelList);
          openChannelListDispatcher({
            type: OpenChannelListActionTypes.FETCH_OPEN_CHANNEL_LIST_SUCCESS,
            payload: channelList,
          });
        })
        .catch((err) => {
          callback(undefined, err);
          logger.error('OpenChannelList|useFetchNextCallback: Failed fetching channels', err);
          openChannelListDispatcher({
            type: OpenChannelListActionTypes.FETCH_OPEN_CHANNEL_LIST_FAILURE,
            payload: null,
          });
        });
    } else {
      logger.info('OpenChannelList|useFetchNextCallback : There is no more channels');
    }
  }, [sdkInitialized, openChannelListQuery]);
}

export default useFetchNextCallback;
