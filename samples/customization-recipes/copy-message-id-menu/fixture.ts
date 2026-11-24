// Local fixture only: synthetic menu props for each message state. No channel or server calls.
import type { MessageMenuProps } from '@sendbird/uikit-react/ui/MessageMenu';

export type Scenario = 'own' | 'other' | 'other-reply' | 'pending' | 'failed';

const fixtureChannel = {
  url: 'recipe-action-menu',
  isGroupChannel: () => true,
  isEphemeral: false,
  isBroadcast: false,
} as NonNullable<MessageMenuProps['channel']>;

export function menuFixture(scenario: Scenario): Pick<MessageMenuProps, 'channel' | 'message' | 'isByMe' | 'replyType' | 'inThreadList'> {
  const isByMe = scenario !== 'other' && scenario !== 'other-reply';
  const inThreadList = scenario === 'other-reply';
  const message = {
    messageId: 101,
    messageType: 'user',
    message: 'A sample message',
    sender: { userId: isByMe ? 'self' : 'other' },
    sendingStatus: scenario === 'failed' || scenario === 'pending' ? scenario : 'succeeded',
    parentMessageId: inThreadList ? 99 : 0,
    threadInfo: { replyCount: 0 },
    isUserMessage: () => true,
    isFileMessage: () => false,
    isResendable: scenario === 'failed',
  } as unknown as MessageMenuProps['message'];

  return { channel: fixtureChannel, message, isByMe, replyType: 'QUOTE_REPLY', inThreadList };
}
