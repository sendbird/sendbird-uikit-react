import { useEffect } from 'react';
import type { Logger } from '../../../../lib/SendbirdState';
import { SdkStore } from '../../../../lib/types';
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
    if (channelUrl && sdkInit && sdk?.groupChannel) {
      sdk.groupChannel.getChannel(channelUrl)
        .then((groupChannel) => {
          logger.info('MessageSearch | useSetChannel group channel', groupChannel);
          setCurrentChannel(groupChannel);
        })
        .catch(() => {
          setChannelInvalid();
        });
    }
  }, [channelUrl, sdkInit]);
}

export default useSetChannel;
