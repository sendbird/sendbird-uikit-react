import { useEffect, useState } from 'react';
import { GroupChannelHandler } from '@sendbird/chat/groupChannel';

import uuidv4 from '../../../../utils/uuid';
import compareIds from '../../../../utils/compareIds';
import type { SdkStore } from '../../../../lib/types';
import type { Logger } from '../../../../lib/SendbirdState';

interface UseChannelHandlerProps {
  sdk: SdkStore['sdk'];
  channelUrl: string;
  logger: Logger;
  forceUpdateUI: () => void;
  dependencies?: any[];
}

export const useChannelHandler = ({
  sdk,
  channelUrl,
  logger,
  forceUpdateUI,
  dependencies = [],
}: UseChannelHandlerProps) => {
  const [channelHandlerId, setChannelHandlerId] = useState<string | null>(null);

  useEffect(() => {
    if (!sdk || !sdk.groupChannel) {
      logger.warning('ChannelSettings: SDK or GroupChannelModule is not available');
      return;
    }

    const channelHandler = new GroupChannelHandler({
      onUserLeft: (channel, user) => {
        if (compareIds(channel?.url, channelUrl)) {
          logger.info('ChannelSettings: onUserLeft', { channel, user });
          forceUpdateUI();
        }
      },
      onUserBanned: (channel, user) => {
        if (compareIds(channel?.url, channelUrl) && channel.isGroupChannel()) {
          logger.info('ChannelSettings: onUserBanned', { channel, user });
          forceUpdateUI();
        }
      },
    });

    const newChannelHandlerId = uuidv4();
    sdk.groupChannel.addGroupChannelHandler(newChannelHandlerId, channelHandler);
    setChannelHandlerId(newChannelHandlerId);

    return () => {
      if (sdk.groupChannel && channelHandlerId) {
        logger.info('ChannelSettings: Removing message receiver handler', channelHandlerId);
        sdk.groupChannel.removeGroupChannelHandler(channelHandlerId);
      }
    };
  }, [sdk, channelUrl, logger, ...dependencies]);

  return null;
};
