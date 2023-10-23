import { useEffect } from 'react';

import { Logger } from '../../../../lib/SendbirdState';
import { ThreadContextActionTypes } from '../dux/actionTypes';
import { SendableMessageType } from '../../../../utils';
import { SdkStore } from '../../../../lib/types';

interface DynamicProps {
  channelUrl: string;
  sdkInit: boolean;
  message: SendableMessageType;
}

interface StaticProps {
  sdk: SdkStore['sdk'];
  logger: Logger;
  threadDispatcher: (props: { type: string, payload?: any }) => void;
}

export default function useGetChannel({
  channelUrl,
  sdkInit,
  message,
}: DynamicProps, {
  sdk,
  logger,
  threadDispatcher,
}: StaticProps): void {
  useEffect(() => {
    // validation check
    if (sdkInit && channelUrl && sdk?.groupChannel) {
      threadDispatcher({
        type: ThreadContextActionTypes.GET_CHANNEL_START,
        payload: null,
      });
      sdk.groupChannel.getChannel?.(channelUrl)
        .then((groupChannel) => {
          logger.info('Thread | useInitialize: Get channel succeeded', groupChannel);
          threadDispatcher({
            type: ThreadContextActionTypes.GET_CHANNEL_SUCCESS,
            payload: { groupChannel },
          });
        })
        .catch((error) => {
          logger.info('Thread | useInitialize: Get channel failed', error);
          threadDispatcher({
            type: ThreadContextActionTypes.GET_CHANNEL_FAILURE,
            payload: error,
          });
        });
    }
  }, [message, sdkInit]);
  /**
   * We don't use channelUrl here,
   * because Thread must operate independently of the channel.
   */
}
