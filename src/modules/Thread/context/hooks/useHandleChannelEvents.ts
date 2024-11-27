import { GroupChannel, GroupChannelHandler } from '@sendbird/chat/groupChannel';
import { useEffect } from 'react';
import { Logger } from '../../../../lib/SendbirdState';
import uuidv4 from '../../../../utils/uuid';
import { SdkStore } from '../../../../lib/types';
import compareIds from '../../../../utils/compareIds';
import useThread from '../useThread';
import { SendableMessageType } from '../../../../utils';

interface DynamicProps {
  sdk: SdkStore['sdk'];
  currentChannel: GroupChannel | null;
}
interface StaticProps {
  logger: Logger;
}

export default function useHandleChannelEvents({
  sdk,
  currentChannel,
}: DynamicProps, {
  logger,
}: StaticProps): void {
  const {
    actions: {
      onMessageReceived,
      onMessageUpdated,
      onMessageDeleted,
      onReactionUpdated,
      onUserMuted,
      onUserUnmuted,
      onUserBanned,
      onUserUnbanned,
      onUserLeft,
      onChannelFrozen,
      onChannelUnfrozen,
      onOperatorUpdated,
      onTypingStatusUpdated,
    },
  } = useThread();

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
          onMessageReceived(channel as GroupChannel, message as SendableMessageType);
        },
        onMessageUpdated(channel, message) {
          logger.info('Thread | useHandleChannelEvents: onMessageUpdated', { channel, message });
          onMessageUpdated(channel as GroupChannel, message as SendableMessageType);
        },
        onMessageDeleted(channel, messageId) {
          logger.info('Thread | useHandleChannelEvents: onMessageDeleted', { channel, messageId });
          onMessageDeleted(channel as GroupChannel, messageId);
        },
        onReactionUpdated(channel, reactionEvent) {
          logger.info('Thread | useHandleChannelEvents: onReactionUpdated', { channel, reactionEvent });
          onReactionUpdated(reactionEvent);
        },
        // user status change
        onUserMuted(channel, user) {
          logger.info('Thread | useHandleChannelEvents: onUserMuted', { channel, user });
          onUserMuted(channel as GroupChannel, user);
        },
        onUserUnmuted(channel, user) {
          logger.info('Thread | useHandleChannelEvents: onUserUnmuted', { channel, user });
          onUserUnmuted(channel as GroupChannel, user);
        },
        onUserBanned(channel, user) {
          logger.info('Thread | useHandleChannelEvents: onUserBanned', { channel, user });
          onUserBanned();
        },
        onUserUnbanned(channel, user) {
          logger.info('Thread | useHandleChannelEvents: onUserUnbanned', { channel, user });
          onUserUnbanned();
        },
        onUserLeft(channel, user) {
          logger.info('Thread | useHandleChannelEvents: onUserLeft', { channel, user });
          onUserLeft();
        },
        // channel status change
        onChannelFrozen(channel) {
          logger.info('Thread | useHandleChannelEvents: onChannelFrozen', { channel });
          onChannelFrozen();
        },
        onChannelUnfrozen(channel) {
          logger.info('Thread | useHandleChannelEvents: onChannelUnfrozen', { channel });
          onChannelUnfrozen();
        },
        onOperatorUpdated(channel, users) {
          logger.info('Thread | useHandleChannelEvents: onOperatorUpdated', { channel, users });
          onOperatorUpdated(channel as GroupChannel);
        },
        onTypingStatusUpdated: (channel) => {
          if (compareIds(channel?.url, currentChannel.url)) {
            logger.info('Channel | onTypingStatusUpdated', { channel });
            const typingMembers = channel.getTypingUsers();
            onTypingStatusUpdated(channel as GroupChannel, typingMembers);
          }
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
