import { useEffect } from 'react';
import type { Logger } from '../../../../lib/SendbirdState';
import { SdkStore } from '../../../../lib/types';
import useChannelSettings from '../useChannelSettings';

  interface Props {
    channelUrl: string;
    sdk: SdkStore['sdk'];
    logger: Logger;
    initialized: boolean;
    dependencies?: any[];
  }

function useSetChannel({
  channelUrl,
  sdk,
  logger,
  initialized,
  dependencies = [],
}: Props) {
  const {
    actions: {
      setChannel,
      setInvalid,
      setLoading,
    },
  } = useChannelSettings();
  const logAndStopLoading = (message): void => {
    logger.warning(message);
    setLoading(false);
    return null;
  };

  useEffect(() => {
    if (!channelUrl) {
      return logAndStopLoading('ChannelSettings: channel url is required');
    }
    if (!initialized || !sdk) {
      return logAndStopLoading('ChannelSettings: SDK is not initialized');
    }
    if (!sdk.groupChannel) {
      return logAndStopLoading('ChannelSettings: GroupChannelModule is not specified in the SDK');
    }

    if (channelUrl && sdk?.groupChannel) {
      setLoading(true);
      sdk.groupChannel.getChannel(channelUrl)
        .then((groupChannel) => {
          logger.info('ChannelSettings | useSetChannel: fetched group channel', groupChannel);
          setChannel(groupChannel);
        })
        .catch((err) => {
          logger.error('ChannelSettings | useSetChannel: failed fetching channel', err);
          setInvalid(true);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [channelUrl, initialized, ...dependencies]);
}

export default useSetChannel;
