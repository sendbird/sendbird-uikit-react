import { useEffect } from 'react';
import type { Logger } from '../../../../lib/SendbirdState';
import * as messageActionTypes from '../dux/actionTypes';
import { SdkStore } from '../../../../lib/types';

interface MainProps {
  channelUrl: string;
  sdkInit: boolean;
}
interface ToolProps {
  sdk: SdkStore['sdk'];
  logger: Logger;
  messageSearchDispatcher: (param: { type: string, payload: any }) => void;
}

function useSetChannel(
  { channelUrl, sdkInit }: MainProps,
  { sdk, logger, messageSearchDispatcher }: ToolProps,
): void {
  useEffect(() => {
    if (channelUrl && sdkInit && (sdk?.groupChannel)) {
      sdk.groupChannel.getChannel(channelUrl).then((groupChannel) => {
        logger.info('MessageSearch | useSetChannel group channel', groupChannel);
        messageSearchDispatcher({
          type: messageActionTypes.SET_CURRENT_CHANNEL,
          payload: groupChannel,
        });
      }).catch(() => {
        messageSearchDispatcher({
          type: messageActionTypes.CHANNEL_INVALID,
          payload: null,
        });
      });
    }
  }, [channelUrl, sdkInit]);
}

export default useSetChannel;
