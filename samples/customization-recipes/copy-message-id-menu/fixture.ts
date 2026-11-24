// Local fixture only: synthetic menu props for each message state. No channel or server calls.
import type { MessageMenuProps } from '@sendbird/uikit-react/ui/MessageMenu';
import type { MessageContentProps } from '@sendbird/uikit-react/ui/MessageContent';

export type Scenario = 'own' | 'other' | 'other-reply' | 'other-parent-only' | 'other-thread-only'
  | 'other-ephemeral' | 'other-broadcast' | 'other-thread-mode' | 'other-jump-parent'
  | 'own-hide-delete' | 'pending' | 'failed';

const fixtureChannel = {
  url: 'recipe-action-menu',
  channelType: 'group',
  members: [],
  isGroupChannel: () => true,
  isOpenChannel: () => false,
  isEphemeral: false,
  isBroadcast: false,
  isSuper: false,
} as unknown as NonNullable<MessageMenuProps['channel']>;

const heartUrl = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#d6336c" d="M12 21 3 12a5 5 0 0 1 9-6 5 5 0 0 1 9 6z"/></svg>')}`;
export const emojiContainer = {
  emojiHash: 'fixture',
  emojiCategories: [{ id: 1, name: 'Fixture', emojis: [{ key: 'heart', url: heartUrl }] }],
} as unknown as MessageContentProps['emojiContainer'];

export function menuFixture(scenario: Scenario): Pick<MessageMenuProps, 'channel' | 'message' | 'isByMe' | 'replyType' | 'inThreadList'> {
  const isByMe = scenario === 'own' || scenario === 'own-hide-delete' || scenario === 'pending' || scenario === 'failed';
  const inThreadList = scenario === 'other-reply' || scenario === 'other-thread-only';
  const message = {
    messageId: 101,
    messageType: 'user',
    message: 'A sample message',
    createdAt: Date.UTC(2026, 0, 5, 9, 30),
    updatedAt: 0,
    customType: '',
    data: '',
    extendedMessagePayload: {},
    sender: { userId: isByMe ? 'self' : 'other', nickname: isByMe ? 'Sam' : 'Alex', profileUrl: '' },
    sendingStatus: scenario === 'failed' || scenario === 'pending' ? scenario : 'succeeded',
    parentMessageId: scenario === 'other-reply' || scenario === 'other-parent-only' ? 99 : 0,
    reactions: [],
    mentionedUsers: [],
    threadInfo: { replyCount: 0 },
    isAdminMessage: () => false,
    isUserMessage: () => true,
    isFileMessage: () => false,
    isMultipleFilesMessage: () => false,
    isResendable: scenario === 'failed',
  } as unknown as MessageMenuProps['message'];

  const channel = {
    ...fixtureChannel,
    isEphemeral: scenario === 'other-ephemeral',
    isBroadcast: scenario === 'other-broadcast',
  } as NonNullable<MessageMenuProps['channel']>;
  return { channel, message, isByMe, replyType: scenario === 'other-thread-mode' ? 'THREAD' : 'QUOTE_REPLY', inThreadList };
}
