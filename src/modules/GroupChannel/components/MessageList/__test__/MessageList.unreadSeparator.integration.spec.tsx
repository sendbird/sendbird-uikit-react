import React from 'react';
import { act, render } from '@testing-library/react';
import { MessageList } from '../index';
import Message from '../../Message';
import { useGroupChannel } from '../../../context/hooks/useGroupChannel';
import useSendbird from '../../../../../lib/Sendbird/context/hooks/useSendbird';
import { useLocalization } from '../../../../../lib/LocalizationContext';

vi.mock('../InfiniteList', () => ({
  InfiniteList: ({ messages, renderMessage }: any) => messages.map((message: any, index: number) => renderMessage({ message, index })),
}));
vi.mock('../../../../Message/context/MessageProvider', () => ({
  MessageProvider: ({ children }: any) => children,
}));
vi.mock('../../Message', () => ({ default: vi.fn(() => null) }));
vi.mock('../../../context/hooks/useGroupChannel', () => ({ useGroupChannel: vi.fn() }));
vi.mock('../../../../../lib/Sendbird/context/hooks/useSendbird', () => ({ default: vi.fn() }));
vi.mock('../../../../../lib/LocalizationContext', async () => ({
  ...(await vi.importActual('../../../../../lib/LocalizationContext')),
  useLocalization: vi.fn(),
}));

const t0 = 1793962600000;
const MINUTE = 60 * 1000;

const userMessage = (messageId: number, createdAt: number) => ({
  messageId,
  createdAt,
  silent: false,
  sendingStatus: 'succeeded',
  messageType: 'user',
  sender: { userId: 'other-user' },
  isUserMessage: () => true,
  isFileMessage: () => false,
  isAdminMessage: () => false,
});

const adminMessage = (messageId: number, createdAt: number, silent = false) => ({
  messageId,
  createdAt,
  silent,
  messageType: 'admin',
  isUserMessage: () => false,
  isFileMessage: () => false,
  isAdminMessage: () => true,
});

interface Scenario {
  myLastRead: number;
  messages: any[];
  hasPrevious: boolean;
}

const renderList = ({ myLastRead, messages, hasPrevious }: Scenario) => {
  const markAsReadAll = vi.fn();
  const currentChannel = {
    url: 'channel-1',
    myLastRead,
    unreadMessageCount: 1,
    isFrozen: false,
    lastMessage: { createdAt: messages[messages.length - 1].createdAt },
    isGroupChannel: () => true,
    getUnreadMemberCount: () => 0,
    getUndeliveredMemberCount: () => 0,
  };
  const baseState = {
    channelUrl: 'channel-1',
    hasNext: () => false,
    hasPrevious: () => hasPrevious,
    newMessages: [],
    isMessageGroupingEnabled: true,
    currentChannel,
    replyType: 'NONE',
    scrollPubSub: { publish: vi.fn(), subscribe: vi.fn() },
    loadNext: vi.fn(),
    loadPrevious: vi.fn(),
    resetNewMessages: vi.fn(),
    scrollRef: { current: null },
    scrollPositionRef: { current: 0 },
    scrollDistanceFromBottomRef: { current: 0 },
    markAsUnreadSourceRef: { current: null },
    readState: null,
    autoscrollMessageOverflowToTop: false,
  };
  const actions = {
    scrollToBottom: vi.fn(),
    setIsScrollBottomReached: vi.fn(),
    markAsReadAll,
    markAsUnread: vi.fn(),
    scrollToMessage: vi.fn(),
  };
  const setState = (overrides: Record<string, unknown>) => {
    vi.mocked(useGroupChannel).mockReturnValue({ state: { ...baseState, ...overrides }, actions } as any);
  };

  setState({ loading: true, messages: [], isScrollBottomReached: true });
  const { rerender } = render(<MessageList renderPlaceholderLoader={() => null} />);
  setState({ loading: false, messages, isScrollBottomReached: true });
  rerender(<MessageList renderPlaceholderLoader={() => null} />);

  const update = (overrides: Record<string, unknown>) => {
    setState({ loading: false, messages, isScrollBottomReached: true, ...overrides });
    rerender(<MessageList renderPlaceholderLoader={() => null} />);
  };

  const lastPropsOf = (message: unknown) => {
    return vi.mocked(Message).mock.calls.filter((call) => (call[0] as any).message === message).pop()![0] as any;
  };

  return {
    update,
    markAsReadAll,
    currentChannel,
    separatorMessages: () => messages.filter((message) => lastPropsOf(message).hasNewMessageSeparator),
    seeSeparator: () => act(() => { lastPropsOf(messages[0]).onNewMessageSeparatorVisibilityChange(true); }),
  };
};

describe('GroupChannel/MessageList unread separator in mark-as-unread mode (CLNP-9056)', () => {
  beforeEach(() => {
    vi.mocked(Message).mockClear();
    vi.mocked(useSendbird).mockReturnValue({
      state: {
        config: {
          userId: 'me',
          htmlTextDirection: 'ltr',
          forceLeftToRightMessageLayout: false,
          groupChannel: { enableMarkAsUnread: true, enableTypingIndicator: false, typingIndicatorTypes: undefined },
        },
        stores: { sdkStore: { sdk: {} } },
      },
    } as any);
    vi.mocked(useLocalization).mockReturnValue({ stringSet: { DATE_FORMAT__MESSAGE_CREATED_AT: 'p' } } as any);
  });

  describe('when the read position is 0', () => {
    it('puts the separator on the oldest message and marks the channel read once it is seen', () => {
      const first = userMessage(1, t0);
      const second = userMessage(2, t0 + MINUTE);
      const { separatorMessages, seeSeparator, markAsReadAll, currentChannel } = renderList({
        myLastRead: 0,
        messages: [first, second],
        hasPrevious: false,
      });

      expect(separatorMessages()).toEqual([first]);
      seeSeparator();
      expect(markAsReadAll).toHaveBeenCalledWith(currentChannel);
    });

    it('shows no separator while older messages are still unloaded', () => {
      const { separatorMessages } = renderList({
        myLastRead: 0,
        messages: [userMessage(1, t0), userMessage(2, t0 + MINUTE)],
        hasPrevious: true,
      });

      expect(separatorMessages()).toEqual([]);
    });

    it('puts the separator on the oldest message once there turns out to be no older history, with the same messages', () => {
      const first = userMessage(1, t0);
      const { separatorMessages, update } = renderList({
        myLastRead: 0,
        messages: [first, userMessage(2, t0 + MINUTE)],
        hasPrevious: true,
      });
      expect(separatorMessages()).toEqual([]);

      update({ hasPrevious: () => false });

      expect(separatorMessages()).toEqual([first]);
    });
  });

  describe('when the first unread message is older than the loaded messages', () => {
    it('shows no separator on the oldest loaded message', () => {
      const { separatorMessages } = renderList({
        myLastRead: t0 - MINUTE,
        messages: [userMessage(1, t0), userMessage(2, t0 + MINUTE)],
        hasPrevious: true,
      });

      expect(separatorMessages()).toEqual([]);
    });

    it('puts the separator on the oldest loaded message once there turns out to be no older history, with the same messages', () => {
      const first = userMessage(1, t0);
      const { separatorMessages, update } = renderList({
        myLastRead: t0 - MINUTE,
        messages: [first, userMessage(2, t0 + MINUTE)],
        hasPrevious: true,
      });
      expect(separatorMessages()).toEqual([]);

      update({ hasPrevious: () => false });

      expect(separatorMessages()).toEqual([first]);
    });

    it('puts the separator on the first unread message once the read one before it is loaded', () => {
      const read = userMessage(1, t0 - 2 * MINUTE);
      const firstUnread = userMessage(2, t0);
      const { separatorMessages } = renderList({
        myLastRead: t0 - MINUTE,
        messages: [read, firstUnread, userMessage(3, t0 + MINUTE)],
        hasPrevious: true,
      });

      expect(separatorMessages()).toEqual([firstUnread]);
    });
  });

  describe('admin messages', () => {
    it('puts the separator on an admin message that is the only unread message and marks the channel read once it is seen', () => {
      const notice = adminMessage(2, t0 + MINUTE);
      const { separatorMessages, seeSeparator, markAsReadAll, currentChannel } = renderList({
        myLastRead: t0,
        messages: [userMessage(1, t0), notice],
        hasPrevious: false,
      });

      expect(separatorMessages()).toEqual([notice]);
      seeSeparator();
      expect(markAsReadAll).toHaveBeenCalledWith(currentChannel);
    });

    it('puts the separator on the first unread message when a read silent message opens the loaded messages', () => {
      const firstUnread = userMessage(2, t0 + MINUTE);
      const { separatorMessages } = renderList({
        myLastRead: t0 + 30 * 1000,
        messages: [adminMessage(1, t0, true), firstUnread, userMessage(3, t0 + 2 * MINUTE)],
        hasPrevious: true,
      });

      expect(separatorMessages()).toEqual([firstUnread]);
    });

    it('shows no separator when an unread silent message opens the loaded messages', () => {
      const { separatorMessages } = renderList({
        myLastRead: t0 - MINUTE,
        messages: [adminMessage(1, t0, true), userMessage(2, t0 + MINUTE)],
        hasPrevious: true,
      });

      expect(separatorMessages()).toEqual([]);
    });

    it('skips a silent admin message and puts the separator on the next message', () => {
      const firstUnread = userMessage(3, t0 + 2 * MINUTE);
      const { separatorMessages } = renderList({
        myLastRead: t0,
        messages: [userMessage(1, t0), adminMessage(2, t0 + MINUTE, true), firstUnread],
        hasPrevious: false,
      });

      expect(separatorMessages()).toEqual([firstUnread]);
    });
  });

  it('keeps the separator on a message marked as unread while older messages are still unloaded', () => {
    const marked = userMessage(1, t0);
    const { separatorMessages } = renderList({
      myLastRead: t0 - 1,
      messages: [marked, userMessage(2, t0 + MINUTE)],
      hasPrevious: true,
    });

    expect(separatorMessages()).toEqual([marked]);
  });
});
