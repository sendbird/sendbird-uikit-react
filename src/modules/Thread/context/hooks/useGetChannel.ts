import { useEffect } from 'react';

import { Logger } from '../../../../lib/SendbirdState';
import { SendableMessageType } from '../../../../utils';
import { SdkStore } from '../../../../lib/types';
import useThread from '../useThread';

interface DynamicProps {
  channelUrl: string;
  sdkInit: boolean;
  message: SendableMessageType | null;
}

interface StaticProps {
  sdk: SdkStore['sdk'];
  logger: Logger;
}

export default function useGetChannel({
  channelUrl,
  sdkInit,
  message,
}: DynamicProps, {
  sdk,
  logger,
}: StaticProps): void {
  const {
    actions: {
      getChannelStart,
      getChannelSuccess,
      getChannelFailure,
    },
  } = useThread();

  useEffect(() => {
    // validation check
    if (sdkInit && channelUrl && sdk?.groupChannel) {
      getChannelStart();
      sdk.groupChannel.getChannel?.(channelUrl)
        .then((groupChannel) => {
          logger.info('Thread | useInitialize: Get channel succeeded', groupChannel);
          getChannelSuccess(groupChannel);
        })
        .catch((error) => {
          logger.info('Thread | useInitialize: Get channel failed', error);
          getChannelFailure();
        });
    }
  }, [message, sdkInit]);
  /**
   * We don't use channelUrl here,
   * because Thread must operate independently of the channel.
   */
}
