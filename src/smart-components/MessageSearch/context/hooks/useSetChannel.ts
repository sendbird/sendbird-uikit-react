import { useEffect } from 'react';
import * as messageActionTypes from '../dux/actionTypes';

interface MainProps {
  channelUrl: string;
  sdkInit: boolean;
}
interface ToolProps {
  sdk: SendbirdUIKit.Sdk;
  logger: SendbirdUIKit.Logger;
  messageSearchDispatcher: ({ type: string, payload: any }) => void;
}

function useSetChannel(
  { channelUrl, sdkInit }: MainProps,
  { sdk, logger, messageSearchDispatcher }: ToolProps,
): void {
  useEffect(() => {
    if (channelUrl && sdkInit && sdk && (sdk.OpenChannel || sdk.GroupChannel)) {
      sdk.GroupChannel.getChannel(channelUrl, (groupChannel, error) => {
        if (!error) {
          logger.info('MessageSearch | useSetChannel group channel', groupChannel);
          messageSearchDispatcher({
            type: messageActionTypes.SET_CURRENT_CHANNEL,
            payload: groupChannel,
          });
        } else {
          messageSearchDispatcher({
            type: messageActionTypes.CHANNEL_INVALID,
            payload: null,
          });
        }
      });
    }
  }, [channelUrl, sdkInit]);
}

export default useSetChannel;
