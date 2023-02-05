import React, { useEffect } from 'react';
import { GroupChannel, GroupChannelHandler, SendbirdGroupChat } from '@sendbird/chat/groupChannel';

import { actionTypes } from '../dux/actionTypes';
import { Logger } from '../../../../lib/SendbirdState';
import { Action } from '../dux/reducers';
import uuidv4 from '../../../../utils/uuid';
import compareIds from '../../../../utils/compareIds';

type DynamicParams = {
  currentChannel: GroupChannel;
  sdkInit: boolean;
};

type StaticParams = {
  notificationsDispatcher: React.Dispatch<Action>;
  sdk: SendbirdGroupChat;
  logger: Logger;
};

function useEventListener({ currentChannel, sdkInit }: DynamicParams, {
  notificationsDispatcher,
  sdk,
  logger,
}: StaticParams) {
  useEffect(() => {
    const channelUrl = currentChannel?.url;
    const channelHandlerId = uuidv4();
    if (channelUrl && sdkInit) {
      const channelHandler: GroupChannelHandler = {
        onMessageReceived: (channel, message) => {
          if (compareIds(channel?.url, channelUrl)) {
            logger.info('NotificationChannel | useHandleChannelEvents: onMessageReceived', message);
            notificationsDispatcher({
              type: actionTypes.ON_MESSAGE_RECEIVED,
              payload: { channel, message },
            });
            const _channel = channel as GroupChannel;
            _channel?.markAsRead();
          }
        },
        onMessageUpdated: (channel, message) => {
          logger.info('NotificationChannel | useHandleChannelEvents: onMessageUpdated', message);
          notificationsDispatcher({
            type: actionTypes.ON_MESSAGE_UPDATED,
            payload: { channel, message },
          });
        },
        onMessageDeleted: (channel, messageId) => {
          logger.info('NotificationChannel | useHandleChannelEvents: onMessageDeleted', { channel, messageId });
          notificationsDispatcher({
            type: actionTypes.ON_MESSAGE_DELETED,
            payload: { channel, messageId },
          });
        },
        onChannelDeleted: (channelUrl) => {
          logger.info('NotificationChannel | useHandleChannelEvents: onChannelDeleted', { channelUrl });

        },
      };
      logger.info('NotificationChannel | useHandleChannelEvents: Setup event handler', { channelHandlerId, channelHandler });
      // Add this group channel handler to the Sendbird chat instance
      sdk.groupChannel?.addGroupChannelHandler(channelHandlerId, new GroupChannelHandler(channelHandler));
    }
    return () => {
      if (sdk?.groupChannel?.removeGroupChannelHandler) {
        logger.info('NotificationChannel | useHandleChannelEvents: Removing message reciver handler', channelHandlerId);
        sdk.groupChannel.removeGroupChannelHandler(channelHandlerId);
      } else if (sdk?.groupChannel) {
        logger.error('Channel | useHandleChannelEvents: Not found the removeGroupChannelHandler');
      }
    }
  }, [currentChannel?.url, sdkInit]);
}

export default useEventListener;
