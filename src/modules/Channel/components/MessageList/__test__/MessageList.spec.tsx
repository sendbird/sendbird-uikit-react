import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import useSendbird from '../../../../../lib/Sendbird/context/hooks/useSendbird';
import { useChannelContext } from '../../../context/ChannelProvider';
import { MessageList } from '..';

jest.mock('../../../context/ChannelProvider', () => ({
  useChannelContext: jest.fn(),
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

jest.mock('../../Message', () => (props: any) => (
  <button
    type="button"
    data-testid={`message-${props.message.messageId}`}
    data-previous-message-id={props.previousMessage?.messageId ?? ''}
    data-next-message-id={props.nextMessage?.messageId ?? ''}
    onClick={() => props.handleScroll?.()}
  >
    message
  </button>
));
jest.mock('../../FrozenNotification', () => (props: any) => <div data-testid="frozen" className={props.className}>frozen</div>);
jest.mock('../../UnreadCount', () => (props: any) => <button type="button" data-testid="unread" onClick={props.onClick}>{props.count}</button>);
jest.mock('../../../../GroupChannel/components/MessageList/getMessagePartsInfo', () => ({
  getMessagePartsInfo: jest.fn(() => ({ chainTop: false, chainBottom: false, hasSeparator: false })),
}));
jest.mock('../hooks/useScrollBehavior', () => ({ useScrollBehavior: jest.fn() }));
jest.mock('../hooks/useSetScrollToBottom', () => ({
  useSetScrollToBottom: jest.fn(() => ({ scrollToBottomHandler: jest.fn(), scrollBottom: 80 })),
}));
jest.mock('../../../../../hooks/useHandleOnScrollCallback', () => ({
  useHandleOnScrollCallback: jest.fn(() => jest.fn()),
}));
jest.mock('../../../../../hooks/useOnScrollReachedEndDetector', () => ({
  useOnScrollPositionChangeDetector: jest.fn((handlers) => () => handlers.onReachedBottom?.()),
}));

const scrollRef = { current: null as HTMLDivElement | null };

const createMessage = (messageId: number, userId = 'other') => ({
  messageId,
  createdAt: messageId,
  messageType: 'user',
  sender: { userId },
  reactions: [],
});

const createChannelContext = (overrides = {}) => ({
  allMessages: [createMessage(1), createMessage(2, 'me')],
  localMessages: [createMessage(3, 'me')],
  hasMorePrev: true,
  hasMoreNext: false,
  setInitialTimeStamp: jest.fn(),
  setAnimatedMessageId: jest.fn(),
  setHighLightedMessageId: jest.fn(),
  isMessageGroupingEnabled: false,
  scrollRef,
  onScrollCallback: jest.fn(),
  onScrollDownCallback: jest.fn(),
  messagesDispatcher: jest.fn(),
  messageActionTypes: { MARK_AS_READ: 'MARK_AS_READ' },
  currentGroupChannel: {
    url: 'channel-url',
    isFrozen: true,
    unreadMessageCount: 2,
  },
  disableMarkAsRead: false,
  filterMessageList: undefined,
  replyType: 'NONE',
  loading: false,
  isScrolled: true,
  unreadSince: 'now',
  unreadSinceDate: new Date(0),
  typingMembers: [],
  ...overrides,
});

describe('deprecated Channel MessageList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    scrollRef.current = null;
    (useSendbird as jest.Mock).mockReturnValue({
      state: {
        config: {
          userId: 'me',
          htmlTextDirection: 'auto',
          forceLeftToRightMessageLayout: false,
          groupChannel: {
            enableTypingIndicator: false,
            typingIndicatorTypes: new Set(),
          },
          markAsReadScheduler: { push: jest.fn() },
        },
      },
    });
  });

  it('renders loading and empty placeholders', () => {
    (useChannelContext as jest.Mock).mockReturnValue(createChannelContext({ loading: true }));
    const { rerender } = render(<MessageList renderPlaceholderLoader={() => <div>loading</div>} />);
    expect(screen.getByText('loading')).toBeInTheDocument();

    (useChannelContext as jest.Mock).mockReturnValue(createChannelContext({ allMessages: [], localMessages: [] }));
    rerender(<MessageList renderPlaceholderEmpty={() => <div>empty</div>} />);
    expect(screen.getByText('empty')).toBeInTheDocument();
  });

  it('renders channel messages, local messages, frozen notice, unread count, and scroll button', () => {
    const context = createChannelContext();
    (useChannelContext as jest.Mock).mockReturnValue(context);

    render(<MessageList className="custom-channel-list" />);

    const container = screen.getByTestId('sendbird-message-list-container');
    Object.defineProperty(container, 'scrollHeight', { configurable: true, value: 500 });
    Object.defineProperty(container, 'scrollTop', { configurable: true, writable: true, value: 100 });
    Object.defineProperty(container, 'offsetHeight', { configurable: true, value: 200 });

    expect(screen.getByTestId('message-1')).toBeInTheDocument();
    expect(screen.getByTestId('message-3')).toBeInTheDocument();
    expect(screen.getByTestId('frozen')).toBeInTheDocument();
    expect(screen.getByTestId('unread')).toHaveTextContent('2');
    expect(document.querySelector('.sendbird-conversation__messages.custom-channel-list')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('message-1'));
    expect(container.scrollTop).toBe(220);

    fireEvent.click(screen.getByTestId('unread'));
    expect(context.setInitialTimeStamp).toHaveBeenCalledWith(null);

    fireEvent.scroll(container);
    expect(context.messagesDispatcher).toHaveBeenCalledWith(expect.objectContaining({
      type: 'MARK_AS_READ',
    }));

    fireEvent.click(document.querySelector('.sendbird-conversation__scroll-bottom-button') as Element);
    expect(context.setAnimatedMessageId).toHaveBeenCalledWith(null);
    expect(context.setHighLightedMessageId).toHaveBeenCalledWith(null);
  });

  it('filters messages before rendering', () => {
    (useChannelContext as jest.Mock).mockReturnValue(createChannelContext({
      filterMessageList: (message) => message.messageId === 2,
      localMessages: [],
      currentGroupChannel: { url: 'channel-url', isFrozen: false, unreadMessageCount: 0 },
      unreadSince: null,
      unreadSinceDate: null,
    }));

    render(<MessageList />);

    expect(screen.queryByTestId('message-1')).not.toBeInTheDocument();
    expect(screen.getByTestId('message-2')).toBeInTheDocument();
  });

  it('passes adjacent message data through legacy message props', () => {
    (useChannelContext as jest.Mock).mockReturnValue(createChannelContext({
      currentGroupChannel: { url: 'channel-url', isFrozen: false, unreadMessageCount: 0 },
      unreadSince: null,
      unreadSinceDate: null,
    }));

    render(<MessageList />);

    expect(screen.getByTestId('message-1')).toHaveAttribute('data-previous-message-id', '');
    expect(screen.getByTestId('message-1')).toHaveAttribute('data-next-message-id', '2');
    expect(screen.getByTestId('message-2')).toHaveAttribute('data-previous-message-id', '1');
    expect(screen.getByTestId('message-2')).toHaveAttribute('data-next-message-id', '3');
    expect(screen.getByTestId('message-3')).toHaveAttribute('data-previous-message-id', '2');
    expect(screen.getByTestId('message-3')).toHaveAttribute('data-next-message-id', '');
  });
});
