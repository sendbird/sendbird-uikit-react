// Local fixture only: a synthetic channel and messages with fixed reply counts.
import type { MessageContentProps } from '@sendbird/uikit-react/ui/MessageContent';

export const counts = [0, 1, 2, 5, 21, 22, 100];

export const channel = {
  url: 'recipe-localization', channelType: 'group', members: [],
  isGroupChannel: () => true, isOpenChannel: () => false, isEphemeral: false,
  isBroadcast: false, isSuper: false,
  getUnreadMemberCount: () => 0, getUndeliveredMemberCount: () => 0,
} as unknown as MessageContentProps['channel'];

const participants = ['Alex', 'Jules', 'Morgan'].map((nickname, index) => ({
  nickname, userId: `person-${index}`, profileUrl: '',
}));

export function replyFixture(count: number) {
  const mostRepliedUsers = participants.slice(0, count);
  return {
    messageId: 1000 + count, messageType: 'user', message: 'A sample message',
    createdAt: Date.UTC(2026, 10, 18, 12, 34), updatedAt: 0, customType: '', data: '',
    extendedMessagePayload: {}, sendingStatus: 'succeeded', parentMessageId: 0,
    sender: participants[0], reactions: [], mentionedUsers: [],
    threadInfo: { replyCount: count, memberCount: mostRepliedUsers.length, mostRepliedUsers },
    isAdminMessage: () => false, isUserMessage: () => true, isFileMessage: () => false,
    isMultipleFilesMessage: () => false, isResendable: () => false,
  } as unknown as MessageContentProps['message'];
}
