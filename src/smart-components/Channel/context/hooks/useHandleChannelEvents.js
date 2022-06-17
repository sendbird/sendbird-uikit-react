import { useEffect } from 'react';
import { GroupChannelHandler } from '@sendbird/chat/groupChannel';

import * as messageActions from '../dux/actionTypes';
import { uuidv4 } from '../../../../utils/uuid';
import compareIds from '../../../../utils/compareIds';
import { scrollIntoLast } from '../utils';

/**
 * Handles ChannelEvents and send values to dispatcher using messagesDispatcher
 * messagesDispatcher: Dispatcher
 * sdk: sdkInstance
 * logger: loggerInstance
 * channelUrl: string
 * sdkInit: bool
 */
function useHandleChannelEvents({ currentGroupChannel, sdkInit, hasMoreNext }, {
  messagesDispatcher,
  sdk,
  logger,
  scrollRef,
  setQuoteMessage,
}) {
  useEffect(() => {
    const channelUrl = currentGroupChannel && currentGroupChannel?.url;
    const messageReceiverId = uuidv4();
    if (channelUrl && sdk) {
      const channelHandlerConstructor = {};
      channelHandlerConstructor.onMessageReceived = (channel, message) => {
        // Do not update when hasMoreNext
        if (compareIds(channel.url, channelUrl) && !hasMoreNext) {
          let scrollToEnd = false;
          try {
            const { current } = scrollRef;
            scrollToEnd = current.offsetHeight + current.scrollTop >= current.scrollHeight;
          } catch (error) {
            //
          }

          logger.info('Channel | useHandleChannelEvents: onMessageReceived', message);
          messagesDispatcher({
            type: messageActions.ON_MESSAGE_RECEIVED,
            payload: { channel, message },
          });

          if (scrollToEnd) {
            try {
              setTimeout(() => {
                currentGroupChannel.markAsRead();
                scrollIntoLast();
              });
            } catch (error) {
              logger.warning('Channel | onMessageReceived | scroll to end failed');
            }
          }
        }
      };

      /**
       * We need to update current channel with the channel,
       * (before) onReadReceiptUpdated or onUnreadMemberStatusUpdated are called,
       * because cachedReadReceiptStatus and cachedDeliveryReceiptStatus properties were changed
       */
      channelHandlerConstructor.onUnreadMemberStatusUpdated = (channel) => {
        if (compareIds(channel.url, channelUrl)) {
          logger.info('Channel | useHandleChannelEvents: onReadReceiptUpdated', channel);
          messagesDispatcher({
            type: messageActions.SET_CURRENT_CHANNEL,
            payload: channel,
          });
        }
      };
      // before(onDeliveryReceiptUpdated)
      channelHandlerConstructor.onUndeliveredMemberStatusUpdated = (channel) => {
        if (compareIds(channel.url, channelUrl)) {
          logger.info('Channel | useHandleChannelEvents: onDeliveryReceiptUpdated', channel);
          messagesDispatcher({
            type: messageActions.SET_CURRENT_CHANNEL,
            payload: channel,
          });
        }
      };

      channelHandlerConstructor.onMessageUpdated = (channel, message) => {
        logger.info('Channel | useHandleChannelEvents: onMessageUpdated', message);
        messagesDispatcher({
          type: messageActions.ON_MESSAGE_UPDATED,
          payload: { channel, message },
        });
      };

      channelHandlerConstructor.onThreadInfoUpdated = (channel, event) => {
        logger.info('Channel | useHandleChannelEvents: onThreadInfoUpdated', event);
        messagesDispatcher({
          type: messageActions.ON_MESSAGE_THREAD_INFO_UPDATED,
          payload: { channel, event },
        });
      };

      channelHandlerConstructor.onMessageDeleted = (_, messageId) => {
        logger.info('Channel | useHandleChannelEvents: onMessageDeleted', messageId);
        setQuoteMessage(null);
        messagesDispatcher({
          type: messageActions.ON_MESSAGE_DELETED,
          payload: messageId,
        });
      };

      channelHandlerConstructor.onReactionUpdated = (_, reactionEvent) => {
        logger.info('Channel | useHandleChannelEvents: onReactionUpdated', reactionEvent);
        messagesDispatcher({
          type: messageActions.ON_REACTION_UPDATED,
          payload: reactionEvent,
        });
      };

      channelHandlerConstructor.onChannelChanged = (groupChannel) => {
        if (compareIds(groupChannel.url, channelUrl)) {
          logger.info('Channel | useHandleChannelEvents: onChannelChanged', groupChannel);
          messagesDispatcher({
            type: messageActions.SET_CURRENT_CHANNEL,
            payload: groupChannel,
          });
        }
      };

      channelHandlerConstructor.onChannelFrozen = (groupChannel) => {
        if (compareIds(groupChannel.url, channelUrl)) {
          logger.info('Channel | useHandleChannelEvents: onChannelFrozen', groupChannel);
          messagesDispatcher({
            type: messageActions.SET_CURRENT_CHANNEL,
            payload: groupChannel,
          });
        }
      };

      channelHandlerConstructor.onChannelUnfrozen = (groupChannel) => {
        if (compareIds(groupChannel.url, channelUrl)) {
          logger.info('Channel | useHandleChannelEvents: onChannelUnFrozen', groupChannel);
          messagesDispatcher({
            type: messageActions.SET_CURRENT_CHANNEL,
            payload: groupChannel,
          });
        }
      };

      channelHandlerConstructor.onUserMuted = (groupChannel) => {
        if (compareIds(groupChannel.url, channelUrl)) {
          logger.info('Channel | useHandleChannelEvents: onUserMuted', groupChannel);
          messagesDispatcher({
            type: messageActions.SET_CURRENT_CHANNEL,
            payload: groupChannel,
          });
        }
      };

      channelHandlerConstructor.onUserUnmuted = (groupChannel) => {
        if (compareIds(groupChannel.url, channelUrl)) {
          logger.info('Channel | useHandleChannelEvents: onUserUnmuted', groupChannel);
          messagesDispatcher({
            type: messageActions.SET_CURRENT_CHANNEL,
            payload: groupChannel,
          });
        }
      };

      channelHandlerConstructor.onUserBanned = (groupChannel) => {
        if (compareIds(groupChannel.url, channelUrl)) {
          logger.info('Channel | useHandleChannelEvents: onUserBanned', groupChannel);
          messagesDispatcher({
            type: messageActions.SET_CURRENT_CHANNEL,
            payload: groupChannel,
          });
        }
      };

      channelHandlerConstructor.onOperatorUpdated = (groupChannel) => {
        if (compareIds(groupChannel.url, channelUrl)) {
          logger.info('Channel | useHandleChannelEvents: onOperatorUpdated', groupChannel);
          messagesDispatcher({
            type: messageActions.SET_CURRENT_CHANNEL,
            payload: groupChannel,
          });
        }
      };

      const channelHandler = new GroupChannelHandler(channelHandlerConstructor);
      logger.info('Channel | useHandleChannelEvents: Setup event handler', messageReceiverId);

      // Add this channel event handler to the SendBird object.
      sdk.groupChannel.addChannelHandler(messageReceiverId, channelHandler);
    }
    return () => {
      if (sdk && sdk?.groupChannel?.removeChannelHandler) {
        logger.info('Channel | useHandleChannelEvents: Removing message reciver handler', messageReceiverId);
        sdk.groupChannel.removeChannelHandler(messageReceiverId);
      }
    };
  }, [currentGroupChannel?.url, sdkInit]);
}

export default useHandleChannelEvents;
