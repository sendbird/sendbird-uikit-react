import { useEffect } from 'react';
import type { Logger, SdkStore } from '../../../../lib/Sendbird/types';
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
  const { actions: { setChannel, setInvalid, setLoading } } = useChannelSettings();

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchChannel = async () => {
      try {
        if (!channelUrl) {
          logger.warning('ChannelSettings: channel url is required');
          setLoading(false);
          return;
        }
        if (!initialized || !sdk) {
          logger.warning('ChannelSettings: SDK is not initialized');
          setLoading(false);
          return;
        }
        if (!sdk.groupChannel) {
          logger.warning('ChannelSettings: GroupChannelModule is not specified in the SDK');
          setLoading(false);
          return;
        }

        setLoading(true);
        const groupChannel = await sdk.groupChannel.getChannel(channelUrl);
        if (!signal.aborted) {
          logger.info('ChannelSettings | useSetChannel: fetched group channel', groupChannel);
          setChannel(groupChannel);
        }
      } catch (error) {
        if (!signal.aborted) {
          logger.error('ChannelSettings | useSetChannel: failed fetching channel', error);
          setInvalid(true);
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchChannel();

    return () => controller.abort(); // Cleanup with AbortController
  }, [channelUrl, initialized, sdk, ...dependencies]);
}

export default useSetChannel;
