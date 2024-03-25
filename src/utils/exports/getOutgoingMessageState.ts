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
): string => {
  if (!message || !('sendingStatus' in message)) return OutgoingMessageStates.NONE;

  if (message.sendingStatus === 'pending') {
    return OutgoingMessageStates.PENDING;
  }
  if (message.sendingStatus === 'failed') {
    return OutgoingMessageStates.FAILED;
  }
  if (channel?.isGroupChannel?.()) {
    /* GroupChannel only */
    if ((channel as GroupChannel).getUnreadMemberCount?.(message) === 0) {
      return OutgoingMessageStates.READ;
    } else if ((channel as GroupChannel).getUndeliveredMemberCount?.(message) === 0) {
      return OutgoingMessageStates.DELIVERED;
    }
  }
  if (message.sendingStatus === 'succeeded') {
    return OutgoingMessageStates.SENT;
  }
  return OutgoingMessageStates.NONE;
};
