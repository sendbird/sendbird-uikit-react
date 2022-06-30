import { useEffect } from "react";
import { GroupChannel, GroupChannelHandler, SendbirdGroupChat } from "@sendbird/chat/groupChannel";
import { FileMessage, UserMessage } from "@sendbird/chat/message";

import { scrollIntoLast } from '../utils';

import { CustomUseReducerDispatcher, Logger } from "../../../../lib/SendbirdState";
import uuidv4 from "../../../../utils/uuid";
import compareIds from '../../../../utils/compareIds';
import * as messageActions from '../dux/actionTypes';

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
  hasMoreNext: boolean;
  currentGroupChannel: GroupChannel;
}
interface StaticParams {
  sdk: SendbirdGroupChat;
  logger: Logger;
  scrollRef: React.RefObject<HTMLDivElement>;
  setQuoteMessage: React.Dispatch<React.SetStateAction<UserMessage | FileMessage>>;
  messagesDispatcher: CustomUseReducerDispatcher;
}

function useHandleChannelEvents(
  {
    sdkInit,
    hasMoreNext,
    currentGroupChannel,
  }: DynamicParams,
  {
    sdk,
    logger,
    scrollRef,
    setQuoteMessage,
    messagesDispatcher,
  }: StaticParams,
): void {
  useEffect(() => {
    const channelUrl = currentGroupChannel?.url;
    const channelHandlerId = uuidv4();
    if (channelUrl && sdkInit) {
      const channelHandler = {
        onMessageReceived: (channel, message) => {
          // Do not update when hasMoreNext
          if (compareIds(channel?.url, channelUrl) && !hasMoreNext) {
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
                  currentGroupChannel?.markAsRead?.();
                  scrollIntoLast();
                });
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
          logger.info('Channel | useHandleChannelEvents: onMessageUpdated', message);
          messagesDispatcher({
            type: messageActions.ON_MESSAGE_UPDATED,
            payload: { channel, message },
          });
        },
        onThreadInfoUpdated: (channel, threadInfoUpdateEvent) => {
          logger.info('Channel | useHandleChannelEvents: onThreadInfoUpdated', { channel, threadInfoUpdateEvent });
          messagesDispatcher({
            type: messageActions.ON_MESSAGE_THREAD_INFO_UPDATED,
            payload: { channel, event: threadInfoUpdateEvent },
          });
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
          if (compareIds(channel?.url, channelUrl)) {
            logger.info('Channel | useHandleChannelEvents: onChannelChanged', channel);
            messagesDispatcher({
              type: messageActions.SET_CURRENT_CHANNEL,
              payload: channel,
            });
          }
        },
        onChannelFrozen: (channel) => {
          if (compareIds(channel?.url, channelUrl)) {
            logger.info('Channel | useHandleChannelEvents: onChannelFrozen', channel);
            messagesDispatcher({
              type: messageActions.SET_CURRENT_CHANNEL,
              payload: channel,
            });
          }
        },
        onChannelUnfrozen: (channel) => {
          if (compareIds(channel?.url, channelUrl)) {
            logger.info('Channel | useHandleChannelEvents: onChannelUnFrozen', channel);
            messagesDispatcher({
              type: messageActions.SET_CURRENT_CHANNEL,
              payload: channel,
            });
          }
        },
        onUserMuted: (channel, user) => {
          if (compareIds(channel?.url, channelUrl)) {
            logger.info('Channel | useHandleChannelEvents: onUserMuted', { channel, user });
            messagesDispatcher({
              type: messageActions.SET_CURRENT_CHANNEL,
              payload: channel,
            });
          }
        },
        onUserUnmuted: (channel, user) => {
          if (compareIds(channel?.url, channelUrl)) {
            logger.info('Channel | useHandleChannelEvents: onUserUnmuted', { channel, user });
            messagesDispatcher({
              type: messageActions.SET_CURRENT_CHANNEL,
              payload: channel,
            });
          }
        },
        onUserBanned: (channel, user) => {
          if (compareIds(channel?.url, channelUrl)) {
            logger.info('Channel | useHandleChannelEvents: onUserBanned', { channel, user });
            messagesDispatcher({
              type: messageActions.SET_CURRENT_CHANNEL,
              payload: null,
            });
          }
        },
        onOperatorUpdated: (channel, users) => {
          if (compareIds(channel?.url, channelUrl)) {
            logger.info('Channel | useHandleChannelEvents: onOperatorUpdated', { channel, users });
            messagesDispatcher({
              type: messageActions.SET_CURRENT_CHANNEL,
              payload: channel,
            });
          }
        },
      };
      logger.info('Channel | useHandleChannelEvents: Setup event handler', channelHandlerId);
      // Add this group channel handler to the Sendbird chat instance
      sdk.groupChannel.addGroupChannelHandler(channelHandlerId, new GroupChannelHandler(channelHandler));
    }
    return () => {
      if (sdk?.groupChannel?.removeGroupChannelHandler) {
        logger.info('Channel | useHandleChannelEvents: Removing message reciver handler', channelHandlerId);
        sdk.groupChannel.removeGroupChannelHandler(channelHandlerId);
      } else {
        logger.error('Channel | useHandleChannelEvents: Not found the removeGroupChannelHandler');
      }
    }
  }, [currentGroupChannel?.url, sdkInit]);
}

export default useHandleChannelEvents;
