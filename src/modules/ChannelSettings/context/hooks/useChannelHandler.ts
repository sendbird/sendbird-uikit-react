import { useEffect } from 'react';
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
  useEffect(() => {
    if (!sdk || !sdk.groupChannel) {
      logger.warning('ChannelSettings: SDK or GroupChannelModule is not available');
      return;
    }
    const newChannelHandlerId = uuidv4();

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

    sdk.groupChannel.addGroupChannelHandler(newChannelHandlerId, channelHandler);

    return () => {
      if (sdk.groupChannel && newChannelHandlerId) {
        logger.info('ChannelSettings: Removing message receiver handler', newChannelHandlerId);
        sdk.groupChannel.removeGroupChannelHandler(newChannelHandlerId);
      }
    };
  }, [sdk, channelUrl, logger, ...dependencies]);

  return null;
};
