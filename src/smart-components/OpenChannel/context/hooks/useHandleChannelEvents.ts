import { useEffect } from 'react';
import { ChannelType } from '@sendbird/chat';
import { OpenChannel, OpenChannelHandler, SendbirdOpenChat } from '@sendbird/chat/openChannel';
import * as messageActionTypes from '../dux/actionTypes';
import uuidv4 from '../../../../utils/uuid';
import { scrollIntoLast } from '../utils';
import { Logger } from '../../../../lib/SendbirdState';

type MessagesDispatcherType = {
  type: string, payload: any,
}
interface DynamicParams {
  currentOpenChannel: OpenChannel;
  checkScrollBottom: () => boolean;
}
interface StaticParams {
  sdk: SendbirdOpenChat;
  logger: Logger;
  messagesDispatcher: (props: MessagesDispatcherType) => void;
}

function useHandleChannelEvents(
  { currentOpenChannel, checkScrollBottom }: DynamicParams,
  { sdk, logger, messagesDispatcher }: StaticParams,
): void {
  useEffect(() => {
    const messageReceiverId = uuidv4();
    if (currentOpenChannel && currentOpenChannel.url && sdk?.openChannel?.addOpenChannelHandler) {
      logger.info('OpenChannel | useHandleChannelEvents: Setup evnet handler', messageReceiverId);
      const channelHandlerParams: OpenChannelHandler = {
        onMessageReceived: (channel, message) => {
          const scrollToEnd = checkScrollBottom();
          const channelUrl = channel?.url;
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
        },
        onMessageUpdated: (channel, message) => {
          const channelUrl = channel?.url;
          logger.info('OpenChannel | useHandleChannelEvents: onMessageUpdated', { channelUrl, message });
          messagesDispatcher({
            type: messageActionTypes.ON_MESSAGE_UPDATED,
            payload: { channel, message },
          });
        },
        onMessageDeleted: (channel, messageId) => {
          const channelUrl = channel?.url;
          logger.info('OpenChannel | useHandleChannelEvents: onMessageDeleted', { channelUrl, messageId });
          messagesDispatcher({
            type: messageActionTypes.ON_MESSAGE_DELETED,
            payload: { channel, messageId },
          });
        },
        onOperatorUpdated: (channel, operators) => {
          const channelUrl = channel?.url;
          logger.info('OpenChannel | useHandleChannelEvents: onOperatorUpdated', { channelUrl, operators });
          messagesDispatcher({
            type: messageActionTypes.ON_OPERATOR_UPDATED,
            payload: { channel, operators },
          });
        },
        onUserEntered: (channel, user) => {
          const channelUrl = channel?.url;
          logger.info('OpenChannel | useHandleChannelEvents: onUserEntered', { channelUrl, user });
          messagesDispatcher({
            type: messageActionTypes.ON_USER_ENTERED,
            payload: { channel, user },
          });
        },
        onUserExited: (channel, user) => {
          const channelUrl = channel?.url;
          logger.info('OpenChannel | useHandleChannelEvents: onUserExited', { channelUrl, user });
          messagesDispatcher({
            type: messageActionTypes.ON_USER_EXITED,
            payload: { channel, user },
          });
        },
        onUserMuted: (channel, user) => {
          const channelUrl = channel?.url;
          logger.info('OpenChannel | useHandleChannelEvents: onUserMuted', { channelUrl, user });
          messagesDispatcher({
            type: messageActionTypes.ON_USER_MUTED,
            payload: { channel, user },
          });
        },
        onUserUnmuted: (channel, user) => {
          const channelUrl = channel?.url;
          logger.info('OpenChannel | useHandleChannelEvents: onUserUnmuted', { channelUrl, user });
          messagesDispatcher({
            type: messageActionTypes.ON_USER_UNMUTED,
            payload: { channel, user },
          });
        },
        onUserBanned: (channel, user) => {
          const channelUrl = channel?.url;
          logger.info('OpenChannel | useHandleChannelEvents: onUserBanned', { channelUrl, user });
          messagesDispatcher({
            type: messageActionTypes.ON_USER_BANNED,
            payload: { channel, user, currentUser: sdk?.currentUser },
          });
        },
        onUserUnbanned: (channel, user) => {
          const channelUrl = channel?.url;
          logger.info('OpenChannel | useHandleChannelEvents: onUserUnbanned', { channelUrl, user });
          messagesDispatcher({
            type: messageActionTypes.ON_USER_UNBANNED,
            payload: { channel, user },
          });
        },
        onChannelFrozen: (channel) => {
          logger.info('OpenChannel | useHandleChannelEvents: onChannelFrozen', channel);
          messagesDispatcher({
            type: messageActionTypes.ON_CHANNEL_FROZEN,
            payload: channel,
          });
        },
        onChannelUnfrozen: (channel) => {
          logger.info('OpenChannel | useHandleChannelEvents: onChannelUnfrozen', channel);
          messagesDispatcher({
            type: messageActionTypes.ON_CHANNEL_UNFROZEN,
            payload: channel,
          });
        },
        onChannelChanged: (channel) => {
          logger.info('OpenChannel | useHandleChannelEvents: onChannelChanged', channel);
          messagesDispatcher({
            type: messageActionTypes.ON_CHANNEL_CHANGED,
            payload: channel,
          });
        },
        onMetaDataCreated: (channel, metaData) => {
          const channelUrl = channel?.url;
          logger.info('OpenChannel | useHandleChannelEvents: onMetaDataCreated', { channelUrl, metaData });
          messagesDispatcher({
            type: messageActionTypes.ON_META_DATA_CREATED,
            payload: { channel, metaData },
          });
        },
        onMetaDataUpdated: (channel, metaData) => {
          const channelUrl = channel?.url;
          logger.info('OpenChannel | useHandleChannelEvents: onMetaDataUpdated', { channelUrl, metaData });
          messagesDispatcher({
            type: messageActionTypes.ON_META_DATA_UPDATED,
            payload: { channel, metaData },
          });
        },
        onMetaDataDeleted: (channel, metaDataKeys) => {
          const channelUrl = channel?.url;
          logger.info('OpenChannel | useHandleChannelEvents: onMetaDataDeleted', { channelUrl, metaDataKeys });
          messagesDispatcher({
            type: messageActionTypes.ON_META_DATA_DELETED,
            payload: { channel, metaDataKeys },
          });
        },
        onMetaCounterCreated: (channel, metaCounter) => {
          const channelUrl = channel?.url;
          logger.info('OpenChannel | useHandleChannelEvents: onMetaCountersCreated', { channelUrl, metaCounter });
          messagesDispatcher({
            type: messageActionTypes.ON_META_COUNTERS_CREATED,
            payload: { channel, metaCounter },
          });
        },
        onMetaCounterUpdated: (channel, metaCounter) => {
          const channelUrl = channel?.url;
          logger.info('OpenChannel | useHandleChannelEvents: onMetaCountersUpdated', { channelUrl, metaCounter });
          messagesDispatcher({
            type: messageActionTypes.ON_META_COUNTERS_UPDATED,
            payload: { channel, metaCounter },
          });
        },
        onMetaCounterDeleted: (channel, metaCounterKeys) => {
          const channelUrl = channel?.url;
          logger.info('OpenChannel | useHandleChannelEvents: onMetaCountersDeleted', { channelUrl, metaCounterKeys });
          messagesDispatcher({
            type: messageActionTypes.ON_META_COUNTERS_DELETED,
            payload: { channel, metaCounterKeys },
          });
        },
        onMentionReceived: (channel, message) => {
          const channelUrl = channel?.url;
          logger.info('OpenChannel | useHandleChannelEvents: onMentionReceived', { channelUrl, message });
          messagesDispatcher({
            type: messageActionTypes.ON_MENTION_RECEIVED,
            payload: { channel, message },
          });
        },
        onChannelDeleted: (channelUrl, channelType) => {
          if (channelType === ChannelType.OPEN && currentOpenChannel?.url === channelUrl) {
            messagesDispatcher({
              type: messageActionTypes.ON_CHANNEL_DELETED,
              payload: channelUrl,
            });
          }
        },
      };

      const ChannelHandler = new OpenChannelHandler(channelHandlerParams);

      sdk?.openChannel?.addOpenChannelHandler(messageReceiverId, ChannelHandler);
    }

    return () => {
      if (sdk?.openChannel?.removeOpenChannelHandler) {
        logger.info('OpenChannel | useHandleChannelEvents: Removing message receiver handler', messageReceiverId);
        sdk.openChannel.removeOpenChannelHandler(messageReceiverId);
      }
    }
  }, [currentOpenChannel]);
}

export default useHandleChannelEvents;
