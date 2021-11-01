import { useEffect } from 'react';

import * as messageActions from '../dux/actionTypes';
import { uuidv4 } from '../../../utils/uuid';
import compareIds from '../../../utils/compareIds';
import { scrollIntoLast } from '../utils';

/**
 * Handles ChannelEvents and send values to dispatcher using messagesDispatcher
 * messagesDispatcher: Dispatcher
 * sdk: sdkInstance
 * logger: loggerInstance
 * channelUrl: string
 * sdkInit: bool
 */
function useHandleChannelEvents({ currentGroupChannel, sdkInit, hasMoreToBottom }, {
  messagesDispatcher,
  sdk,
  logger,
  scrollRef,
}) {
  const channelUrl = currentGroupChannel && currentGroupChannel.url;
  useEffect(() => {
    const messageReceiverId = uuidv4();
    if (channelUrl && sdk && sdk.ChannelHandler) {
      const ChannelHandler = new sdk.ChannelHandler();
      logger.info('Channel | useHandleChannelEvents: Setup event handler', messageReceiverId);

      ChannelHandler.onMessageReceived = (channel, message) => {
        // donot update if hasMoreToBottom
        if (compareIds(channel.url, currentGroupChannel.url) && !hasMoreToBottom) {
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
            payload: { channel, message, scrollToEnd },
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
        if (compareIds(channel.url, currentGroupChannel.url) && hasMoreToBottom) {
          messagesDispatcher({
            type: messageActions.UPDATE_UNREAD_COUNT,
            payload: { channel },
          });
        }
      };

      ChannelHandler.onMessageUpdated = (channel, message) => {
        logger.info('Channel | useHandleChannelEvents: onMessageUpdated', message);
        messagesDispatcher({
          type: messageActions.ON_MESSAGE_UPDATED,
          payload: { channel, message },
        });
      };

      ChannelHandler.onThreadInfoUpdated = (channel, event) => {
        logger.info('Channel | useHandleChannelEvents: onThreadInfoUpdated', event);
        messagesDispatcher({
          type: messageActions.ON_MESSAGE_THREAD_INFO_UPDATED,
          payload: { channel, event },
        });
      };

      ChannelHandler.onMessageDeleted = (_, messageId) => {
        logger.info('Channel | useHandleChannelEvents: onMessageDeleted', messageId);
        messagesDispatcher({
          type: messageActions.ON_MESSAGE_DELETED,
          payload: messageId,
        });
      };

      ChannelHandler.onReactionUpdated = (_, reactionEvent) => {
        logger.info('Channel | useHandleChannelEvents: onReactionUpdated', reactionEvent);
        messagesDispatcher({
          type: messageActions.ON_REACTION_UPDATED,
          payload: reactionEvent,
        });
      };

      ChannelHandler.onChannelChanged = (groupChannel) => {
        if (compareIds(groupChannel.url, currentGroupChannel.url)) {
          logger.info('Channel | useHandleChannelEvents: onChannelChanged', groupChannel);
          messagesDispatcher({
            type: messageActions.SET_CURRENT_CHANNEL,
            payload: groupChannel,
          });
        }
      };

      ChannelHandler.onChannelFrozen = (groupChannel) => {
        if (compareIds(groupChannel.url, currentGroupChannel.url)) {
          logger.info('Channel | useHandleChannelEvents: onChannelFrozen', groupChannel);
          messagesDispatcher({
            type: messageActions.SET_CURRENT_CHANNEL,
            payload: groupChannel,
          });
        }
      };

      ChannelHandler.onChannelUnfrozen = (groupChannel) => {
        if (compareIds(groupChannel.url, currentGroupChannel.url)) {
          logger.info('Channel | useHandleChannelEvents: onChannelUnFrozen', groupChannel);
          messagesDispatcher({
            type: messageActions.SET_CURRENT_CHANNEL,
            payload: groupChannel,
          });
        }
      };

      ChannelHandler.onUserMuted = (groupChannel) => {
        if (compareIds(groupChannel.url, currentGroupChannel.url)) {
          logger.info('Channel | useHandleChannelEvents: onUserMuted', groupChannel);
          messagesDispatcher({
            type: messageActions.SET_CURRENT_CHANNEL,
            payload: groupChannel,
          });
        }
      };

      ChannelHandler.onUserUnmuted = (groupChannel) => {
        if (compareIds(groupChannel.url, currentGroupChannel.url)) {
          logger.info('Channel | useHandleChannelEvents: onUserUnmuted', groupChannel);
          messagesDispatcher({
            type: messageActions.SET_CURRENT_CHANNEL,
            payload: groupChannel,
          });
        }
      };

      ChannelHandler.onUserBanned = (groupChannel) => {
        if (compareIds(groupChannel.url, currentGroupChannel.url)) {
          logger.info('Channel | useHandleChannelEvents: onUserBanned', groupChannel);
          messagesDispatcher({
            type: messageActions.SET_CURRENT_CHANNEL,
            payload: groupChannel,
          });
        }
      };

      ChannelHandler.onOperatorUpdated = (groupChannel) => {
        if (compareIds(groupChannel.url, currentGroupChannel.url)) {
          logger.info('Channel | useHandleChannelEvents: onOperatorUpdated', groupChannel);
          messagesDispatcher({
            type: messageActions.SET_CURRENT_CHANNEL,
            payload: groupChannel,
          });
        }
      };

      // Add this channel event handler to the SendBird object.
      sdk.addChannelHandler(messageReceiverId, ChannelHandler);
    }
    return () => {
      if (sdk && sdk.removeChannelHandler) {
        logger.info('Channel | useHandleChannelEvents: Removing message reciver handler', messageReceiverId);
        sdk.removeChannelHandler(messageReceiverId);
      }
    };
  }, [channelUrl, sdkInit]);
}

export default useHandleChannelEvents;
