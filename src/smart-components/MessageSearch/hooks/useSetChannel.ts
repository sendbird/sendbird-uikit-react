import { useEffect } from 'react';
import * as messageActionTypes from '../dux/actionTypes';

interface MainProps {
  channelUrl: string;
  sdkInit: boolean;
}
interface ToolProps {
  sdk: SendbirdUIKit.Sdk;
  logger: SendbirdUIKit.Logger;
  messageSearchDispathcer: ({ type: string, payload: any }) => void;
}

function useSetChannel(
  { channelUrl, sdkInit }: MainProps,
  { sdk, logger, messageSearchDispathcer }: ToolProps,
): void {
  useEffect(() => {
    if (channelUrl && sdkInit && sdk && (sdk.OpenChannel || sdk.GroupChannel)) {
      sdk.GroupChannel.getChannel(channelUrl, (groupChannel, error) => {
        if (!error) {
          logger.info('MessageSearch | useSetChannel group channel', groupChannel);
          messageSearchDispathcer({
            type: messageActionTypes.SET_CURRENT_CHANNEL,
            payload: groupChannel,
          });
        } else {
          messageSearchDispathcer({
            type: messageActionTypes.CHANNEL_INVALID,
            payload: null,
          });
        }
      });
    }
  }, [channelUrl, sdkInit]);
}

export default useSetChannel;
