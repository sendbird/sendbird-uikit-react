import { useEffect } from 'react';

import { Logger } from '../../../../lib/SendbirdState';
import OpenChannelListActionTypes from '../dux/actionTypes';
import { OpenChannelListDispatcherType, UserFilledOpenChannelListQuery } from '../OpenChannelListInterfaces';
import createChannelListQuery from './createChannelListQuery';
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

function useSetupOpenChannelList(
  {
    sdk,
    sdkInitialized,
    openChannelListQuery,
  }: DynamicParams,
  {
    logger,
    openChannelListDispatcher,
  }: StaticParams,
): void {
  useEffect(() => {
    if (sdkInitialized) {
      if (sdk?.openChannel) {
        logger.info('OpenChannelList|useSetupOpenChannelList: Setup OpenChannelList', { sdkInitialized });
        const channelListQuery = createChannelListQuery({
          sdk,
          logger,
          openChannelListQuery,
          openChannelListDispatcher,
          logMessage: 'OpenChannelList|useSetupOpenChannelList: Succeeded create channelListQuery',
        });

        if (channelListQuery?.hasNext) {
          logger.info('OpenChannelList|useSetupOpenChannelList: Fetch channels');
          openChannelListDispatcher({
            type: OpenChannelListActionTypes.INIT_OPEN_CHANNEL_LIST_START,
            payload: null,
          });
          channelListQuery.next()
            .then((channelList) => {
              logger.info('OpenChannelList|useSetupOpenChannelList: Succeeded fetching channels', channelList);
              openChannelListDispatcher({
                type: OpenChannelListActionTypes.INIT_OPEN_CHANNEL_LIST_SUCCESS,
                payload: channelList,
              });
            })
            .catch((err) => {
              logger.error('OpenChannelList|useSetupOpenChannelList: Failed fetching channels', err);
              openChannelListDispatcher({
                type: OpenChannelListActionTypes.INIT_OPEN_CHANNEL_LIST_FAILURE,
                payload: null,
              });
            });
        } else {
          logger.info('OpenChannelList|useSetupOpenChannelList: There is no more channels');
        }
      } else {
        logger.warning('OpenChannelList|useSetupOpenChannelList: openChannel is not included in the Chat SDK', sdk);
      }
    } else {
      logger.info('OpenChannelList|useSetupOpenChannelList: Reset OpenChannelList', { sdkInitialized });
      openChannelListDispatcher({
        type: OpenChannelListActionTypes.RESET_OPEN_CHANNEL_LIST,
        payload: null,
      });
    }
  }, [sdkInitialized, openChannelListQuery]);
}

export default useSetupOpenChannelList;
