import React from 'react';
import { render } from '@testing-library/react';

import MessageView from '../Message/MessageView';
import type { EveryMessage } from '../../../../types';
import { ThreadReplySelectType } from '../../context/const';

const { mockState } = vi.hoisted(() => ({
  mockState: {
    stores: { sdkStore: { sdk: {}, initialized: true } },
    config: {
      logger: { info: vi.fn(), warning: vi.fn(), error: vi.fn() },
      isOnline: true,
      userId: 'me',
      groupChannel: { enableMarkAsUnread: true },
    },
  },
}));

vi.mock('../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: vi.fn(() => ({ state: mockState })),
}));

vi.mock('../../../../hooks/useTypingLifecycle', () => ({
  useTypingLifecycle: () => ({ startTyping: vi.fn(), stopTyping: vi.fn() }),
}));

vi.mock('../../../Message/hooks/useDirtyGetMentions', () => ({
  useDirtyGetMentions: () => ({ mentionedUsers: [], mentionedUserIds: [] }),
}));

const message = {
  messageId: 101,
  createdAt: new Date(2026, 8, 10, 10).getTime(),
  updatedAt: 0,
  message: 'hello',
  sendingStatus: 'succeeded',
  messageType: 'user',
  sender: { userId: 'me' },
  isUserMessage: () => true,
  isAdminMessage: () => false,
  isFileMessage: () => false,
  isMultipleFilesMessage: () => false,
} as unknown as EveryMessage;

const channel = { isGroupChannel: () => true, members: [], url: 'channel-a' } as any;

// usedInLegacy={false} mirrors what the GroupChannel module passes (Message/index.tsx:97); the
// prop defaults to true, and that default fires its own mount-time handleScroll.
const view = (hasNewMessageSeparator: boolean, handleScroll: (v?: boolean) => void) => (
  <MessageView
    message={message}
    channel={channel}
    usedInLegacy={false}
    hasSeparator={false}
    hasNewMessageSeparator={hasNewMessageSeparator}
    chainTop={false}
    chainBottom={false}
    handleScroll={handleScroll}
    emojiContainer={{ emojiCategories: [] } as any}
    nicknamesMap={new Map()}
    editInputDisabled={false}
    shouldRenderSuggestedReplies={false}
    replyType="NONE"
    threadReplySelectType={ThreadReplySelectType.THREAD}
    animatedMessageId={null}
    setAnimatedMessageId={vi.fn()}
    scrollToMessage={vi.fn()}
    toggleReaction={vi.fn()}
    setQuoteMessage={vi.fn()}
    sendUserMessage={vi.fn()}
    updateUserMessage={vi.fn()}
    resendMessage={vi.fn()}
    deleteMessage={vi.fn()}
    renderFileViewer={() => <div />}
  >
    <div data-testid="message-body">hello</div>
  </MessageView>
);

// StrictMode must change how many times effects run, never the outcome. Running the same
// expectations under both modes is the only layer that holds that equivalence (docs/TESTING.md).
describe.each([
  ['default', undefined],
  ['StrictMode', React.StrictMode],
])('GroupChannel/MessageView unread separator does not clip the message below it (%s)', (_mode, wrapper) => {
  const renderIn = (element: React.ReactElement) => render(element, { wrapper });

  // Regression: marking the last message as unread inserts the "New Messages" indicator above it.
  // MessageView had no handleScroll trigger for that, so the inserted height pushed the message
  // past the viewport bottom and clipped it. The compensation itself already lives in
  // MessageList's onMessageContentSizeChanged; only the trigger was missing.
  it('asks for scroll compensation when the unread separator appears above the message', () => {
    const handleScroll = vi.fn();
    const { rerender } = renderIn(view(false, handleScroll));

    expect(handleScroll).not.toHaveBeenCalled();

    rerender(view(true, handleScroll));

    expect(handleScroll).toHaveBeenCalledTimes(1);
    // isBottomMessageAffected=true keeps the compensation to lists already sitting at the bottom.
    expect(handleScroll).toHaveBeenCalledWith(true);
  });

  it('does not compensate on the initial render that already shows the separator', () => {
    const handleScroll = vi.fn();
    renderIn(view(true, handleScroll));

    expect(handleScroll).not.toHaveBeenCalled();
  });

  it('does not compensate again when the separator stays put across a rerender', () => {
    const handleScroll = vi.fn();
    const { rerender } = renderIn(view(false, handleScroll));

    rerender(view(true, handleScroll));
    rerender(view(true, handleScroll));

    expect(handleScroll).toHaveBeenCalledTimes(1);
  });

  it('renders the unread separator above the message body', () => {
    const { container } = renderIn(view(true, vi.fn()));

    const wrapper = container.querySelector('.sendbird-msg-hoc');
    const children = Array.from(wrapper?.children ?? []);
    const separatorIndex = children.findIndex((it) => it.classList.contains('sendbird-separator'));
    const bodyIndex = children.findIndex((it) => it.getAttribute('data-testid') === 'message-body');

    expect(separatorIndex).toBeGreaterThanOrEqual(0);
    expect(separatorIndex).toBeLessThan(bodyIndex);
  });
});
