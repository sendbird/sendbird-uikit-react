import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';

import useSendbird from '../../../../../lib/Sendbird/context/hooks/useSendbird';
import { useGroupChannel } from '../../../context/hooks/useGroupChannel';
import { MessageList } from '..';

let mockGroupChannelHandler: any;

jest.mock('@sendbird/uikit-tools', () => ({
  useGroupChannelHandler: jest.fn((_sdk, handler) => {
    mockGroupChannelHandler = handler;
  }),
}));

jest.mock('../../../context/hooks/useGroupChannel', () => ({
  useGroupChannel: jest.fn(),
}));

jest.mock('../../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../../../../../lib/LocalizationContext', () => ({
  useLocalization: () => ({
    stringSet: {
      DATE_FORMAT__MESSAGE_CREATED_AT: 'p',
    },
  }),
}));

jest.mock('../getMessagePartsInfo', () => ({
  getMessagePartsInfo: jest.fn(() => ({
    chainTop: false,
    chainBottom: false,
    hasSeparator: false,
    hasNewMessageSeparator: false,
  })),
}));

jest.mock('../../FrozenNotification', () => (props: any) => <div data-testid="frozen" className={props.className}>frozen</div>);
jest.mock('../../Message', () => (props: any) => <button type="button" data-testid="default-message" onClick={() => props.handleScroll()}>default-message</button>);
jest.mock('../../UnreadCount', () => (props: any) => <button type="button" data-testid="legacy-unread" onClick={props.onClick}>{props.count}</button>);
jest.mock('../../UnreadCountFloatingButton', () => (props: any) => <button type="button" data-testid="unread" onClick={props.onClick}>{props.count}</button>);
jest.mock('../../NewMessageCountFloatingButton', () => (props: any) => <button type="button" data-testid="new-count" onClick={props.onClick}>{props.count}</button>);
jest.mock('../../../../../ui/TypingIndicatorBubble', () => (props: any) => <div data-testid="typing">{props.typingMembers?.length ?? 0}</div>);

const createMessage = (messageId: number, userId = 'other') => ({
  messageId,
  createdAt: messageId,
  messageType: 'user',
  sender: { userId },
  reactions: [],
  isAdminMessage: () => false,
  isUserMessage: () => true,
  isFileMessage: () => false,
});

const scrollRef = { current: null as HTMLDivElement | null };

const createGroupChannelState = (overrides = {}) => ({
  state: {
    channelUrl: 'channel-url',
    hasNext: jest.fn(() => false),
    loading: false,
    messages: [createMessage(1)],
    newMessages: [createMessage(2)],
    isScrollBottomReached: false,
    isMessageGroupingEnabled: false,
    currentChannel: {
      url: 'channel-url',
      isFrozen: true,
      unreadMessageCount: 0,
      myLastRead: 0,
      lastMessage: { createdAt: 2 },
    },
    replyType: 'NONE',
    scrollPubSub: { publish: jest.fn() },
    loadNext: jest.fn().mockResolvedValue(undefined),
    loadPrevious: jest.fn().mockResolvedValue(undefined),
    resetNewMessages: jest.fn(),
    scrollRef,
    scrollPositionRef: { current: 0 },
    scrollDistanceFromBottomRef: { current: 0 },
    markAsUnreadSourceRef: { current: null },
    readState: 'read',
    autoscrollMessageOverflowToTop: true,
    ...overrides,
  },
  actions: {
    scrollToBottom: jest.fn(),
    setIsScrollBottomReached: jest.fn(),
    markAsReadAll: jest.fn(),
    markAsUnread: jest.fn(),
    scrollToMessage: jest.fn(),
  },
});

const setupSendbird = (overrides = {}) => {
  (useSendbird as jest.Mock).mockReturnValue({
    state: {
      stores: {
        sdkStore: { sdk: {} },
      },
      config: {
        userId: 'me',
        htmlTextDirection: 'auto',
        forceLeftToRightMessageLayout: false,
        groupChannel: {
          enableMarkAsUnread: false,
          enableTypingIndicator: false,
          typingIndicatorTypes: new Set(),
        },
        ...overrides,
      },
    },
  });
};

describe('GroupChannel MessageList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGroupChannelHandler = undefined;
    scrollRef.current = null;
    setupSendbird();
  });

  it('renders custom loading and empty placeholders', () => {
    (useGroupChannel as jest.Mock).mockReturnValue(createGroupChannelState({ loading: true }));
    const { rerender } = render(<MessageList renderPlaceholderLoader={() => <div>loading</div>} />);
    expect(screen.getByText('loading')).toBeInTheDocument();

    (useGroupChannel as jest.Mock).mockReturnValue(createGroupChannelState({ messages: [] }));
    rerender(<MessageList renderPlaceholderEmpty={() => <div>empty</div>} />);
    expect(screen.getByText('empty')).toBeInTheDocument();
  });

  it('renders messages, frozen notice, new-message count, and scroll-bottom button', () => {
    const context = createGroupChannelState();
    (useGroupChannel as jest.Mock).mockReturnValue(context);
    render(
      <MessageList
        className="custom-list"
        renderMessage={({ message, handleScroll, scrollMessageOverflowToTop }: any) => (
          <button
            type="button"
            data-testid={`message-${message.messageId}`}
            onClick={() => {
              handleScroll();
              scrollMessageOverflowToTop({ current: { clientHeight: 300 } }, message);
            }}
          >
            message
          </button>
        )}
      />
    );

    const container = screen.getByTestId('sendbird-message-list-container');
    Object.defineProperty(container, 'scrollHeight', { configurable: true, value: 500 });
    Object.defineProperty(container, 'scrollTop', { configurable: true, writable: true, value: 100 });
    Object.defineProperty(container, 'offsetHeight', { configurable: true, value: 200 });
    context.state.scrollDistanceFromBottomRef.current = 50;

    expect(screen.getByTestId('frozen')).toBeInTheDocument();
    expect(screen.getByTestId('new-count')).toHaveTextContent('1');
    expect(document.querySelector('.sendbird-conversation__messages.custom-list')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('message-1'));
    expect(context.state.scrollPubSub.publish).toHaveBeenCalledWith('scroll', expect.objectContaining({ top: 250 }));
    expect(context.actions.scrollToMessage).toHaveBeenCalledWith(1, 1);

    fireEvent.click(screen.getByTestId('new-count'));
    fireEvent.click(document.querySelector('.sendbird-conversation__scroll-bottom-button') as Element);
    expect(context.actions.scrollToBottom).toHaveBeenCalledTimes(2);
  });

  it('marks read when scrolled to the bottom with no unread separator pending', () => {
    const context = createGroupChannelState({
      messages: [createMessage(1), createMessage(2, 'me')],
      newMessages: [],
      isScrollBottomReached: true,
      currentChannel: {
        url: 'channel-url',
        isFrozen: false,
        unreadMessageCount: 0,
        myLastRead: 2,
        lastMessage: { createdAt: 2 },
      },
    });
    (useGroupChannel as jest.Mock).mockReturnValue(context);

    render(<MessageList renderMessage={({ message }: any) => <div>message-{message.messageId}</div>} />);
    const container = screen.getByTestId('sendbird-message-list-container');
    Object.defineProperty(container, 'scrollHeight', { configurable: true, value: 200 });
    Object.defineProperty(container, 'clientHeight', { configurable: true, value: 100 });
    Object.defineProperty(container, 'scrollTop', { configurable: true, writable: true, value: 100 });
    fireEvent.scroll(container);

    expect(context.actions.setIsScrollBottomReached).toHaveBeenCalledWith(true);
  });

  it('uses default renderers for messages and legacy unread notification', () => {
    const loadingContext = createGroupChannelState({
      loading: true,
      currentChannel: {
        url: 'channel-url',
        isFrozen: false,
        unreadMessageCount: 1,
        myLastRead: 1,
        lastMessage: { createdAt: 2 },
      },
    });
    (useGroupChannel as jest.Mock).mockReturnValue(loadingContext);
    const { rerender } = render(<MessageList renderPlaceholderLoader={() => <div>loading</div>} />);

    const readyContext = createGroupChannelState({
      loading: false,
      messages: [createMessage(2)],
      newMessages: [createMessage(3)],
      isScrollBottomReached: false,
      currentChannel: loadingContext.state.currentChannel,
    });
    (useGroupChannel as jest.Mock).mockReturnValue(readyContext);
    rerender(<MessageList />);

    expect(screen.getByTestId('default-message')).toBeInTheDocument();
    expect(screen.getByTestId('legacy-unread')).toHaveTextContent('1');
    fireEvent.click(screen.getByTestId('legacy-unread'));
    expect(readyContext.actions.scrollToBottom).toHaveBeenCalled();
  });

  it('handles mark-as-unread floating count and separator visibility', () => {
    setupSendbird({
      groupChannel: {
        enableMarkAsUnread: true,
        enableTypingIndicator: false,
        typingIndicatorTypes: new Set(),
      },
    });
    const loadingContext = createGroupChannelState({
      loading: true,
      currentChannel: {
        url: 'channel-url',
        isFrozen: false,
        unreadMessageCount: 2,
        myLastRead: 1,
        lastMessage: { createdAt: 4 },
      },
    });
    (useGroupChannel as jest.Mock).mockReturnValue(loadingContext);
    const { rerender } = render(<MessageList renderPlaceholderLoader={() => <div>loading</div>} />);

    const readyContext = createGroupChannelState({
      loading: false,
      messages: [createMessage(2), createMessage(3), createMessage(4)],
      newMessages: [createMessage(5)],
      currentChannel: loadingContext.state.currentChannel,
      readState: 'unread',
    });
    (useGroupChannel as jest.Mock).mockReturnValue(readyContext);
    rerender(
      <MessageList
        renderMessage={({ onNewMessageSeparatorVisibilityChange }: any) => (
          <button type="button" data-testid="separator" onClick={() => onNewMessageSeparatorVisibilityChange(true)}>
            separator
          </button>
        )}
      />,
    );

    fireEvent.click(screen.getByTestId('unread'));
    expect(readyContext.state.resetNewMessages).toHaveBeenCalled();
    expect(readyContext.actions.markAsReadAll).toHaveBeenCalledWith(readyContext.state.currentChannel);

    fireEvent.click(screen.getAllByTestId('separator')[0]);
    expect(readyContext.actions.markAsUnread).toHaveBeenCalledWith(readyContext.state.newMessages[0], 'internal');
  });

  it('marks all as read when the separator is visible without new messages', () => {
    setupSendbird({
      groupChannel: {
        enableMarkAsUnread: true,
        enableTypingIndicator: false,
        typingIndicatorTypes: new Set(),
      },
    });
    const loadingContext = createGroupChannelState({
      loading: true,
      currentChannel: {
        url: 'channel-url',
        isFrozen: false,
        unreadMessageCount: 1,
        myLastRead: 1,
        lastMessage: { createdAt: 2 },
      },
    });
    (useGroupChannel as jest.Mock).mockReturnValue(loadingContext);
    const { rerender } = render(<MessageList renderPlaceholderLoader={() => <div>loading</div>} />);

    const readyContext = createGroupChannelState({
      loading: false,
      messages: [createMessage(2)],
      newMessages: [],
      currentChannel: loadingContext.state.currentChannel,
      readState: 'unread',
    });
    (useGroupChannel as jest.Mock).mockReturnValue(readyContext);
    rerender(
      <MessageList
        renderMessage={({ onNewMessageSeparatorVisibilityChange }: any) => (
          <button type="button" data-testid="separator-read" onClick={() => onNewMessageSeparatorVisibilityChange(true)}>
            separator
          </button>
        )}
      />,
    );

    fireEvent.click(screen.getByTestId('separator-read'));
    expect(readyContext.actions.markAsReadAll).toHaveBeenCalledWith(readyContext.state.currentChannel);
  });

  it('scrolls to bottom when an overflowing bottom message settles within the viewport', () => {
    const context = createGroupChannelState({
      isScrollBottomReached: true,
      currentChannel: {
        url: 'channel-url',
        isFrozen: false,
        unreadMessageCount: 0,
        myLastRead: 0,
        lastMessage: { createdAt: 1 },
      },
    });
    (useGroupChannel as jest.Mock).mockReturnValue(context);
    render(
      <MessageList
        renderMessage={({ message, scrollMessageOverflowToTop }: any) => (
          <button
            type="button"
            data-testid="settled-message"
            onClick={() => scrollMessageOverflowToTop({ current: { clientHeight: 50 } }, message)}
          >
            message
          </button>
        )}
      />,
    );
    const container = screen.getByTestId('sendbird-message-list-container');
    Object.defineProperty(container, 'offsetHeight', { configurable: true, value: 100 });

    fireEvent.click(screen.getByTestId('settled-message'));

    expect(context.actions.scrollToBottom).toHaveBeenCalled();
  });

  it('updates typing members and scrolls to bottom for typing indicator bubbles', () => {
    const originalRaf = global.requestAnimationFrame;
    const rafMock = jest.fn((callback) => {
      callback();
      return 1;
    });
    global.requestAnimationFrame = rafMock;
    setupSendbird({
      groupChannel: {
        enableMarkAsUnread: false,
        enableTypingIndicator: true,
        typingIndicatorTypes: new Set(['bubble']),
      },
    });
    const context = createGroupChannelState({
      isScrollBottomReached: true,
    });
    (useGroupChannel as jest.Mock).mockReturnValue(context);
    document.body.innerHTML = '<div id="sendbird-dropdown-portal"></div><div id="sendbird-emoji-list-portal"></div>';

    try {
      render(<MessageList renderMessage={({ message }: any) => <div>message-{message.messageId}</div>} />);
      expect(screen.getByTestId('typing')).toHaveTextContent('0');

      act(() => {
        mockGroupChannelHandler.onTypingStatusUpdated({
          url: 'channel-url',
          getTypingUsers: () => [{ userId: 'typing-user' }],
        });
      });

      expect(screen.getByTestId('typing')).toHaveTextContent('1');
      expect(context.state.scrollPubSub.publish).toHaveBeenCalledWith('scrollToBottom', {});
      expect(rafMock).toHaveBeenCalled();
    } finally {
      global.requestAnimationFrame = originalRaf;
    }
  });
});
