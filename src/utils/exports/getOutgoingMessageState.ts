import { GroupChannel } from '@sendbird/chat/groupChannel';
import { OpenChannel } from '@sendbird/chat/openChannel';
import { Nullable } from '../../types';
import { CoreMessageType } from '../index';

export enum OutgoingMessageStates {
  NONE = 'NONE',
  PENDING = 'PENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
}

export const getOutgoingMessageState = (
  channel: Nullable<GroupChannel | OpenChannel>,
  message: CoreMessageType | undefined | null,
) => {
  if (!message || !('sendingStatus' in message)) return OutgoingMessageStates.NONE;

  if (message.sendingStatus === 'pending') {
    return OutgoingMessageStates.PENDING;
  }
  if (message.sendingStatus === 'failed') {
    return OutgoingMessageStates.FAILED;
  }
  // Read/delivery receipts only mean something once the message reached the server.
  // The counters below report 0 for super, broadcast and exclusive channels, and for
  // channels with no other joined member, so running them first made a message that
  // never left the device report as READ.
  if (message.sendingStatus !== 'succeeded') {
    return OutgoingMessageStates.NONE;
  }
  if (channel?.isGroupChannel?.()) {
    /* GroupChannel only */
    if ((channel as GroupChannel).getUnreadMemberCount?.(message) === 0) {
      return OutgoingMessageStates.READ;
    } else if ((channel as GroupChannel).getUndeliveredMemberCount?.(message) === 0) {
      return OutgoingMessageStates.DELIVERED;
    }
  }
  return OutgoingMessageStates.SENT;
};
