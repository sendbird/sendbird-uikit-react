import React, { useEffect } from 'react';
import { GroupChannel, GroupChannelHandler } from '@sendbird/chat/groupChannel';

import { scrollIntoLast } from '../utils';

import uuidv4 from '../../../../utils/uuid';
import compareIds from '../../../../utils/compareIds';
import * as messageActions from '../dux/actionTypes';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { SendableMessageType } from '../../../../utils';
import { ChannelActionTypes } from '../dux/actionTypes';
import { LoggerInterface } from '../../../../lib/Logger';
import { SdkStore } from '../../../../lib/types';

/**
 * Handles ChannelEvents and send values to dispatcher using messagesDispatcher
 * messagesDispatcher: Dispatcher
 * sdk: sdkInstance
 * logger: loggerInstance
 * channelUrl: string
 * sdkInit: bool
 */
interface DynamicParams {
  sdkInit: boolean;
  currentUserId: string;
  currentGroupChannel: GroupChannel;
  disableMarkAsRead: boolean;
}
interface StaticParams {
  sdk: SdkStore['sdk'];
  logger: LoggerInterface;
  scrollRef: React.RefObject<HTMLDivElement>;
  setQuoteMessage: React.Dispatch<React.SetStateAction<SendableMessageType>>;
  messagesDispatcher: React.Dispatch<ChannelActionTypes>;
}

const DELIVERY_RECEIPT = 'delivery_receipt';

function useHandleChannelEvents({
  sdkInit,
  currentGroupChannel,
  disableMarkAsRead,
}: DynamicParams, {
  sdk,
  logger,
  scrollRef,
  setQuoteMessage,
  messagesDispatcher,
}: StaticParams): void {
  const store = useSendbirdStateContext();
  const {
    markAsReadScheduler,
    markAsDeliveredScheduler,
    disableMarkAsDelivered,
  } = store.config;
  const canSetMarkAsDelivered = store.stores.sdkStore.sdk?.appInfo?.premiumFeatureList
    ?.find((feature) => (feature === DELIVERY_RECEIPT));

  useEffect(() => {
    const channelUrl = currentGroupChannel?.url;
    const channelHandlerId = uuidv4();
    if (channelUrl && sdkInit) {
      const channelHandler: GroupChannelHandler = {
        onMessageReceived: (channel, message) => {
          if (channel.isGroupChannel() && compareIds(channel?.url, channelUrl)) {
            let scrollToEnd = false;
            try {
              const { current } = scrollRef;
              scrollToEnd = current.offsetHeight + current.scrollTop >= current.scrollHeight - 10;
              // 10 is a buffer
            } catch (error) {
              //
            }

            logger.info('Channel | useHandleChannelEvents: onMessageReceived', message);
            messagesDispatcher({
              type: messageActions.ON_MESSAGE_RECEIVED,
              payload: { channel, message: message as SendableMessageType },
            });
            if (scrollToEnd
              && document.getElementById('sendbird-dropdown-portal')?.childElementCount === 0
              && document.getElementById('sendbird-emoji-list-portal')?.childElementCount === 0
            ) {
              // and !openContextMenu
              try {
                setTimeout(() => scrollIntoLast(0, scrollRef));
                if (!disableMarkAsRead) {
                  markAsReadScheduler.push(currentGroupChannel);
                }
                if (canSetMarkAsDelivered && !disableMarkAsDelivered) {
                  markAsDeliveredScheduler.push(currentGroupChannel);
                }
              } catch (error) {
                logger.warning('Channel | onMessageReceived | scroll to end failed');
              }
            }
          }
        },
        onUnreadMemberStatusUpdated: (channel) => {
          logger.info('Channel | useHandleChannelEvents: onUnreadMemberStatusUpdated', channel);
          if (compareIds(channel?.url, channelUrl)) {
            messagesDispatcher({
              type: messageActions.SET_CURRENT_CHANNEL,
              payload: channel,
            });
          }
        },
        // before(onDeliveryReceiptUpdated)
        onUndeliveredMemberStatusUpdated: (channel) => {
          if (compareIds(channel?.url, channelUrl)) {
            logger.info('Channel | useHandleChannelEvents: onDeliveryReceiptUpdated', channel);
            messagesDispatcher({
              type: messageActions.SET_CURRENT_CHANNEL,
              payload: channel,
            });
          }
        },
        onMessageUpdated: (channel, message) => {
          if (channel.isGroupChannel() && compareIds(channel?.url, channelUrl)) {
            logger.info('Channel | useHandleChannelEvents: onMessageUpdated', message);
            messagesDispatcher({
              type: messageActions.ON_MESSAGE_UPDATED,
              payload: { channel, message: message as SendableMessageType },
            });
          }
        },
        onThreadInfoUpdated: (channel, threadInfoUpdateEvent) => {
          if (channel.isGroupChannel() && compareIds(channel?.url, channelUrl)) {
            logger.info('Channel | useHandleChannelEvents: onThreadInfoUpdated', { channel, threadInfoUpdateEvent });
            messagesDispatcher({
              type: messageActions.ON_MESSAGE_THREAD_INFO_UPDATED,
              payload: { channel, event: threadInfoUpdateEvent },
            });
          }
        },
        onMessageDeleted: (channel, messageId) => {
          logger.info('Channel | useHandleChannelEvents: onMessageDeleted', { channel, messageId });
          setQuoteMessage(null);
          messagesDispatcher({
            type: messageActions.ON_MESSAGE_DELETED,
            payload: messageId,
          });
        },
        onReactionUpdated: (channel, reactionEvent) => {
          logger.info('Channel | useHandleChannelEvents: onReactionUpdated', { channel, reactionEvent });
          messagesDispatcher({
            type: messageActions.ON_REACTION_UPDATED,
            payload: reactionEvent,
          });
        },
        onChannelChanged: (channel) => {
          if (channel.isGroupChannel() && compareIds(channel?.url, channelUrl)) {
            logger.info('Channel | useHandleChannelEvents: onChannelChanged', channel);
            messagesDispatcher({
              type: messageActions.SET_CURRENT_CHANNEL,
              payload: channel,
            });
          }
        },
        onChannelFrozen: (channel) => {
          if (channel.isGroupChannel() && compareIds(channel?.url, channelUrl)) {
            logger.info('Channel | useHandleChannelEvents: onChannelFrozen', channel);
            messagesDispatcher({
              type: messageActions.SET_CURRENT_CHANNEL,
              payload: channel,
            });
          }
        },
        onChannelUnfrozen: (channel) => {
          if (channel.isGroupChannel() && compareIds(channel?.url, channelUrl)) {
            logger.info('Channel | useHandleChannelEvents: onChannelUnFrozen', channel);
            messagesDispatcher({
              type: messageActions.SET_CURRENT_CHANNEL,
              payload: channel,
            });
          }
        },
        onUserMuted: (channel, user) => {
          if (channel.isGroupChannel() && compareIds(channel?.url, channelUrl)) {
            logger.info('Channel | useHandleChannelEvents: onUserMuted', { channel, user });
            messagesDispatcher({
              type: messageActions.SET_CURRENT_CHANNEL,
              payload: channel,
            });
          }
        },
        onUserUnmuted: (channel, user) => {
          if (channel.isGroupChannel() && compareIds(channel?.url, channelUrl)) {
            logger.info('Channel | useHandleChannelEvents: onUserUnmuted', { channel, user });
            messagesDispatcher({
              type: messageActions.SET_CURRENT_CHANNEL,
              payload: channel,
            });
          }
        },
        onUserBanned: (channel: GroupChannel, user) => {
          if (compareIds(channel?.url, channelUrl)) {
            logger.info('Channel | useHandleChannelEvents: onUserBanned', { channel, user });
            const isByMe = user?.userId === sdk?.currentUser?.userId;
            messagesDispatcher({
              type: messageActions.SET_CURRENT_CHANNEL,
              payload: isByMe ? null : channel,
            });
          }
        },
        onOperatorUpdated: (channel, users) => {
          if (channel.isGroupChannel() && compareIds(channel?.url, channelUrl)) {
            logger.info('Channel | useHandleChannelEvents: onOperatorUpdated', { channel, users });
            messagesDispatcher({
              type: messageActions.SET_CURRENT_CHANNEL,
              payload: channel,
            });
          }
        },
        onUserLeft: (channel, user) => {
          if (compareIds(channel?.url, channelUrl)) {
            logger.info('Channel | useHandleChannelEvents: onUserLeft', { channel, user });
            const isByMe = user?.userId === sdk?.currentUser?.userId;
            messagesDispatcher({
              type: messageActions.SET_CURRENT_CHANNEL,
              payload: isByMe ? null : channel,
            });
          }
        },
        onTypingStatusUpdated: (channel) => {
          if (compareIds(channel?.url, channelUrl)) {
            logger.info('Channel | onTypingStatusUpdated', { channel });
            const typingMembers = channel.getTypingUsers();
            messagesDispatcher({
              type: messageActions.ON_TYPING_STATUS_UPDATED,
              payload: {
                channel,
                typingMembers,
              },
            });
          }
        },
      };
      logger.info('Channel | useHandleChannelEvents: Setup event handler', { channelHandlerId, channelHandler });
      // Add this group channel handler to the Sendbird chat instance
      sdk.groupChannel?.addGroupChannelHandler(channelHandlerId, new GroupChannelHandler(channelHandler));
    }
    return () => {
      if (sdk?.groupChannel?.removeGroupChannelHandler) {
        logger.info('Channel | useHandleChannelEvents: Removing message reciver handler', channelHandlerId);
        sdk.groupChannel.removeGroupChannelHandler(channelHandlerId);
      } else if (sdk?.groupChannel) {
        logger.error('Channel | useHandleChannelEvents: Not found the removeGroupChannelHandler');
      }
    };
  }, [currentGroupChannel?.url, sdkInit]);
}

export default useHandleChannelEvents;
