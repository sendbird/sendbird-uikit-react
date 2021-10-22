import { useEffect } from 'react';
import * as messageActionTypes from '../dux/actionTypes';
import uuidv4 from '../../../utils/uuid';
import { scrollIntoLast } from '../utils';

interface DynamicParams {
  currentOpenChannel: SendbirdUIKit.OpenChannelType;
  checkScrollBottom: () => boolean;
}
interface StaticParams {
  sdk: SendbirdUIKit.Sdk;
  logger: SendbirdUIKit.Logger;
  messagesDispatcher: ({ type: string, payload: any }) => void;
}

function useHandleChannelEvents(
  { currentOpenChannel, checkScrollBottom }: DynamicParams,
  { sdk, logger, messagesDispatcher }: StaticParams,
): void {
  useEffect(() => {
    const messageReceiverId = uuidv4();
    if (currentOpenChannel && currentOpenChannel.url && sdk && sdk.ChannelHandler) {
      const ChannelHandler = new sdk.ChannelHandler();
      logger.info('OpenChannel | useHandleChannelEvents: Setup evnet handler', messageReceiverId);

      ChannelHandler.onMessageReceived = (channel, message) => {
        const scrollToEnd = checkScrollBottom();
        const channelUrl = channel.url;
        logger.info('OpenChannel | useHandleChannelEvents: onMessageReceived', { channelUrl, message });
        messagesDispatcher({
          type: messageActionTypes.ON_MESSAGE_RECEIVED,
          payload: { channel, message },
        });
        if (scrollToEnd) {
          try {
            setTimeout(() => {
              scrollIntoLast();
            });
          } catch (error) {
            logger.warning('OpenChannel | onMessageReceived | scroll to end failed');
          }
        }
      };
      ChannelHandler.onMessageUpdated = (channel, message) => {
        const channelUrl = channel.url;
        logger.info('OpenChannel | useHandleChannelEvents: onMessageUpdated', { channelUrl, message });
        messagesDispatcher({
          type: messageActionTypes.ON_MESSAGE_UPDATED,
          payload: { channel, message },
        });
      };
      ChannelHandler.onMessageDeleted = (channel, messageId) => {
        const channelUrl = channel.url;
        logger.info('OpenChannel | useHandleChannelEvents: onMessageDeleted', { channelUrl, messageId });
        messagesDispatcher({
          type: messageActionTypes.ON_MESSAGE_DELETED,
          payload: { channel, messageId },
        });
      };
      ChannelHandler.onOperatorUpdated = (channel, operators) => {
        const channelUrl = channel.url;
        logger.info('OpenChannel | useHandleChannelEvents: onOperatorUpdated', { channelUrl, operators });
        messagesDispatcher({
          type: messageActionTypes.ON_OPERATOR_UPDATED,
          payload: { channel, operators },
        });
      };
      ChannelHandler.onUserEntered = (channel, user) => {
        const channelUrl = channel.url;
        logger.info('OpenChannel | useHandleChannelEvents: onUserEntered', { channelUrl, user });
        messagesDispatcher({
          type: messageActionTypes.ON_USER_ENTERED,
          payload: { channel, user },
        });
      };
      ChannelHandler.onUserExited = (channel, user) => {
        const channelUrl = channel.url;
        logger.info('OpenChannel | useHandleChannelEvents: onUserExited', { channelUrl, user });
        messagesDispatcher({
          type: messageActionTypes.ON_USER_EXITED,
          payload: { channel, user },
        });
      };
      ChannelHandler.onUserMuted = (channel, user) => {
        const channelUrl = channel.url;
        logger.info('OpenChannel | useHandleChannelEvents: onUserMuted', { channelUrl, user });
        messagesDispatcher({
          type: messageActionTypes.ON_USER_MUTED,
          payload: { channel, user },
        });
      };
      ChannelHandler.onUserUnmuted = (channel, user) => {
        const channelUrl = channel.url;
        logger.info('OpenChannel | useHandleChannelEvents: onUserUnmuted', { channelUrl, user });
        messagesDispatcher({
          type: messageActionTypes.ON_USER_UNMUTED,
          payload: { channel, user },
        });
      };
      ChannelHandler.onUserBanned = (channel, user) => {
        const channelUrl = channel.url;
        logger.info('OpenChannel | useHandleChannelEvents: onUserBanned', { channelUrl, user });
        messagesDispatcher({
          type: messageActionTypes.ON_USER_BANNED,
          payload: { channel, user },
        });
      };
      ChannelHandler.onUserUnbanned = (channel, user) => {
        const channelUrl = channel.url;
        logger.info('OpenChannel | useHandleChannelEvents: onUserUnbanned', { channelUrl, user });
        messagesDispatcher({
          type: messageActionTypes.ON_USER_UNBANNED,
          payload: { channel, user },
        });
      };
      ChannelHandler.onChannelFrozen = (channel) => {
        logger.info('OpenChannel | useHandleChannelEvents: onChannelFrozen', channel);
        messagesDispatcher({
          type: messageActionTypes.ON_CHANNEL_FROZEN,
          payload: channel,
        });
      };
      ChannelHandler.onChannelUnfrozen = (channel) => {
        logger.info('OpenChannel | useHandleChannelEvents: onChannelUnfrozen', channel);
        messagesDispatcher({
          type: messageActionTypes.ON_CHANNEL_UNFROZEN,
          payload: channel,
        });
      };
      ChannelHandler.onChannelChanged = (channel) => {
        logger.info('OpenChannel | useHandleChannelEvents: onChannelChanged', channel);
        messagesDispatcher({
          type: messageActionTypes.ON_CHANNEL_CHANGED,
          payload: channel,
        });
      };
      ChannelHandler.onMetaDataCreated = (channel, metaData) => {
        const channelUrl = channel.url;
        logger.info('OpenChannel | useHandleChannelEvents: onMetaDataCreated', { channelUrl, metaData });
        messagesDispatcher({
          type: messageActionTypes.ON_META_DATA_CREATED,
          payload: { channel, metaData },
        });
      };
      ChannelHandler.onMetaDataUpdated = (channel, metaData) => {
        const channelUrl = channel.url;
        logger.info('OpenChannel | useHandleChannelEvents: onMetaDataUpdated', { channelUrl, metaData });
        messagesDispatcher({
          type: messageActionTypes.ON_META_DATA_UPDATED,
          payload: { channel, metaData },
        });
      };
      ChannelHandler.onMetaDataDeleted = (channel, metaDataKeys) => {
        const channelUrl = channel.url;
        logger.info('OpenChannel | useHandleChannelEvents: onMetaDataDeleted', { channelUrl, metaDataKeys });
        messagesDispatcher({
          type: messageActionTypes.ON_META_DATA_DELETED,
          payload: { channel, metaDataKeys },
        });
      };
      ChannelHandler.onMetaCountersCreated = (channel, metaCounter) => {
        const channelUrl = channel.url;
        logger.info('OpenChannel | useHandleChannelEvents: onMetaCountersCreated', { channelUrl, metaCounter });
        messagesDispatcher({
          type: messageActionTypes.ON_META_COUNTERS_CREATED,
          payload: { channel, metaCounter },
        });
      };
      ChannelHandler.onMetaCountersUpdated = (channel, metaCounter) => {
        const channelUrl = channel.url;
        logger.info('OpenChannel | useHandleChannelEvents: onMetaCountersUpdated', { channelUrl, metaCounter });
        messagesDispatcher({
          type: messageActionTypes.ON_META_COUNTERS_UPDATED,
          payload: { channel, metaCounter },
        });
      };
      ChannelHandler.onMetaCountersDeleted = (channel, metaCounterKeys) => {
        const channelUrl = channel.url;
        logger.info('OpenChannel | useHandleChannelEvents: onMetaCountersDeleted', { channelUrl, metaCounterKeys });
        messagesDispatcher({
          type: messageActionTypes.ON_META_COUNTERS_DELETED,
          payload: { channel, metaCounterKeys },
        });
      };
      ChannelHandler.onMentionReceived = (channel, message) => {
        const channelUrl = channel.url;
        logger.info('OpenChannel | useHandleChannelEvents: onMentionReceived', { channelUrl, message });
        messagesDispatcher({
          type: messageActionTypes.ON_MENTION_RECEIVED,
          payload: { channel, message },
        });
      };

      sdk.addChannelHandler(messageReceiverId, ChannelHandler);
    }

    return () => {
      if (sdk && sdk.removeChannelHandler) {
        logger.info('OpenChannel | useHandleChannelEvents: Removing message receiver handler', messageReceiverId);
        sdk.removeChannelHandler(messageReceiverId);
      }
    }
  }, [currentOpenChannel]);
}

export default useHandleChannelEvents;
