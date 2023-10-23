import { GroupChannel, GroupChannelHandler } from '@sendbird/chat/groupChannel';
import { useEffect } from 'react';
import { CustomUseReducerDispatcher, Logger } from '../../../../lib/SendbirdState';
import uuidv4 from '../../../../utils/uuid';
import { ThreadContextActionTypes } from '../dux/actionTypes';
import { SdkStore } from '../../../../lib/types';

interface DynamicProps {
  sdk: SdkStore['sdk'];
  currentChannel: GroupChannel;
}
interface StaticProps {
  logger: Logger;
  threadDispatcher: CustomUseReducerDispatcher;
}

export default function useHandleChannelEvents({
  sdk,
  currentChannel,
}: DynamicProps, {
  logger,
  threadDispatcher,
}: StaticProps): void {
  useEffect(() => {
    const handlerId = uuidv4();
    // validation check
    if (sdk?.groupChannel?.addGroupChannelHandler
      && currentChannel
    ) {
      const channelHandlerParams: GroupChannelHandler = {
        // message status change
        onMessageReceived(channel, message) {
          logger.info('Thread | useHandleChannelEvents: onMessageReceived', { channel, message });
          threadDispatcher({
            type: ThreadContextActionTypes.ON_MESSAGE_RECEIVED,
            payload: { channel, message },
          });
        },
        onMessageUpdated(channel, message) {
          logger.info('Thread | useHandleChannelEvents: onMessageUpdated', { channel, message });
          threadDispatcher({
            type: ThreadContextActionTypes.ON_MESSAGE_UPDATED,
            payload: { channel, message },
          });
        },
        onMessageDeleted(channel, messageId) {
          logger.info('Thread | useHandleChannelEvents: onMessageDeleted', { channel, messageId });
          threadDispatcher({
            type: ThreadContextActionTypes.ON_MESSAGE_DELETED,
            payload: { channel, messageId },
          });
        },
        onReactionUpdated(channel, reactionEvent) {
          logger.info('Thread | useHandleChannelEvents: onReactionUpdated', { channel, reactionEvent });
          threadDispatcher({
            type: ThreadContextActionTypes.ON_REACTION_UPDATED,
            payload: { channel, reactionEvent },
          });
        },
        // user status change
        onUserMuted(channel, user) {
          logger.info('Thread | useHandleChannelEvents: onUserMuted', { channel, user });
          threadDispatcher({
            type: ThreadContextActionTypes.ON_USER_MUTED,
            payload: { channel, user },
          });
        },
        onUserUnmuted(channel, user) {
          logger.info('Thread | useHandleChannelEvents: onUserUnmuted', { channel, user });
          threadDispatcher({
            type: ThreadContextActionTypes.ON_USER_UNMUTED,
            payload: { channel, user },
          });
        },
        onUserBanned(channel, user) {
          logger.info('Thread | useHandleChannelEvents: onUserBanned', { channel, user });
          threadDispatcher({
            type: ThreadContextActionTypes.ON_USER_BANNED,
            payload: { channel, user },
          });
        },
        onUserUnbanned(channel, user) {
          logger.info('Thread | useHandleChannelEvents: onUserUnbanned', { channel, user });
          threadDispatcher({
            type: ThreadContextActionTypes.ON_USER_UNBANNED,
            payload: { channel, user },
          });
        },
        onUserLeft(channel, user) {
          logger.info('Thread | useHandleChannelEvents: onUserLeft', { channel, user });
          threadDispatcher({
            type: ThreadContextActionTypes.ON_USER_LEFT,
            payload: { channel, user },
          });
        },
        // channel status change
        onChannelFrozen(channel) {
          logger.info('Thread | useHandleChannelEvents: onChannelFrozen', { channel });
          threadDispatcher({
            type: ThreadContextActionTypes.ON_CHANNEL_FROZEN,
            payload: { channel },
          });
        },
        onChannelUnfrozen(channel) {
          logger.info('Thread | useHandleChannelEvents: onChannelUnfrozen', { channel });
          threadDispatcher({
            type: ThreadContextActionTypes.ON_CHANNEL_UNFROZEN,
            payload: { channel },
          });
        },
        onOperatorUpdated(channel, users) {
          logger.info('Thread | useHandleChannelEvents: onOperatorUpdated', { channel, users });
          threadDispatcher({
            type: ThreadContextActionTypes.ON_OPERATOR_UPDATED,
            payload: { channel, users },
          });
        },
      };
      const channelHandler = new GroupChannelHandler(channelHandlerParams);
      sdk.groupChannel.addGroupChannelHandler?.(handlerId, channelHandler);
      logger.info('Thread | useHandleChannelEvents: Added channelHandler in Thread', { handlerId, channelHandler });
    }
    return () => {
      // validation check
      if (handlerId && sdk?.groupChannel?.removeGroupChannelHandler) {
        sdk.groupChannel.removeGroupChannelHandler?.(handlerId);
        logger.info('Thread | useHandleChannelEvents: Removed channelHandler in Thread.', handlerId);
      }
    };
  }, [
    sdk?.groupChannel,
    currentChannel,
  ]);
}
