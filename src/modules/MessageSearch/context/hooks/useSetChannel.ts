import { useEffect } from 'react';
import type { Logger, SdkStore } from '../../../../lib/Sendbird/types';
import useMessageSearch from '../hooks/useMessageSearch';

interface MainProps {
  channelUrl: string;
  sdkInit: boolean;
}
interface ToolProps {
  sdk: SdkStore['sdk'];
  logger: Logger;
}

function useSetChannel(
  { channelUrl, sdkInit }: MainProps,
  { sdk, logger }: ToolProps,
): void {
  const {
    actions: {
      setCurrentChannel,
      setChannelInvalid,
    },
  } = useMessageSearch();

  useEffect(() => {
    let disposed = false;

    if (!sdkInit) {
      return () => {
        disposed = true;
      };
    }

    if (!channelUrl) {
      setChannelInvalid();
      return () => {
        disposed = true;
      };
    }

    if (channelUrl && sdkInit && sdk?.groupChannel) {
      sdk.groupChannel.getChannel(channelUrl)
        .then((groupChannel) => {
          if (disposed) {
            return;
          }
          logger.info('MessageSearch | useSetChannel group channel', groupChannel);
          setCurrentChannel(groupChannel);
        })
        .catch(() => {
          if (disposed) {
            return;
          }
          setChannelInvalid();
        });
    }

    return () => {
      disposed = true;
    };
  }, [channelUrl, sdkInit, sdk, logger, setCurrentChannel, setChannelInvalid]);
}

export default useSetChannel;
