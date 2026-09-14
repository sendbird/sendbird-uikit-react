import React from 'react';
import { render } from '@testing-library/react';
import { MessageList } from '../index';
import Message from '../../Message';
import { useGroupChannel } from '../../../context/hooks/useGroupChannel';
import useSendbird from '../../../../../lib/Sendbird/context/hooks/useSendbird';
import { useLocalization } from '../../../../../lib/LocalizationContext';

// Focus the test on MessageList's renderMessage wiring: stub the virtualized InfiniteList so it
// synchronously invokes renderMessage per message, mock the leaf Message to capture props, and
// inject controlled context. getMessagePartsInfo stays real (computes chainTop/hasSeparator/...).
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

// Spaced so every grouping output takes both values: 1 and 2 share a clock minute (they chain),
// 3 lands on another calendar day (it breaks the chain and gets a date separator).
const t0 = 1700000000000;
const sameMinuteAsT0 = t0 + 30 * 1000;
const nextDay = t0 + 26 * 60 * 60 * 1000;
const makeMessage = (messageId: number, createdAt: number) => ({
  messageId,
  createdAt,
  sendingStatus: 'succeeded',
  messageType: 'user',
  sender: { userId: 'user-1' },
  isUserMessage: () => true,
  isFileMessage: () => false,
  isAdminMessage: () => false,
});
const messages = [makeMessage(1, t0), makeMessage(2, sameMinuteAsT0), makeMessage(3, nextDay)];
const currentChannel = {
  url: 'channel-1',
  myLastRead: 0,
  unreadMessageCount: 0,
  isFrozen: false,
  lastMessage: { createdAt: 0 },
  isGroupChannel: () => true,
  getUnreadMemberCount: () => 0,
  getUndeliveredMemberCount: () => 0,
};
const groupChannelState = {
  channelUrl: 'channel-1',
  hasNext: () => false,
  loading: false,
  messages,
  newMessages: [],
  isScrollBottomReached: true,
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
  readState: 'read',
  autoscrollMessageOverflowToTop: false,
};
const groupChannelActions = {
  scrollToBottom: vi.fn(),
  setIsScrollBottomReached: vi.fn(),
  markAsReadAll: vi.fn(),
  markAsUnread: vi.fn(),
  scrollToMessage: vi.fn(),
};
const sendbirdState = {
  config: {
    userId: 'user-1',
    htmlTextDirection: 'ltr',
    forceLeftToRightMessageLayout: false,
    groupChannel: { enableMarkAsUnread: false, enableTypingIndicator: false, typingIndicatorTypes: undefined },
  },
  stores: { sdkStore: { sdk: {} } },
};

const groupingFor = (message: unknown) => {
  const call = vi.mocked(Message).mock.calls.find((c) => (c[0] as any).message === message);
  const { chainTop, chainBottom, hasSeparator, hasNewMessageSeparator } = call![0] as any;
  return { chainTop, chainBottom, hasSeparator, hasNewMessageSeparator };
};

describe('MessageList — renderMessage propagation (integration)', () => {
  beforeEach(() => {
    vi.mocked(useGroupChannel).mockReturnValue({ state: groupChannelState, actions: groupChannelActions } as any);
    vi.mocked(useSendbird).mockReturnValue({ state: sendbirdState } as any);
    vi.mocked(useLocalization).mockReturnValue({ stringSet: { DATE_FORMAT__MESSAGE_CREATED_AT: 'p' } } as any);
  });

  it('renders the default Message for each message with the computed grouping values', () => {
    render(<MessageList />);

    const renderedMessages = vi.mocked(Message).mock.calls.map((c) => (c[0] as any).message);
    expect(renderedMessages).toEqual(messages);

    expect(groupingFor(messages[0])).toEqual({
      chainTop: false, chainBottom: true, hasSeparator: true, hasNewMessageSeparator: false,
    });
    expect(groupingFor(messages[1])).toEqual({
      chainTop: true, chainBottom: false, hasSeparator: false, hasNewMessageSeparator: false,
    });
    expect(groupingFor(messages[2])).toEqual({
      chainTop: false, chainBottom: false, hasSeparator: true, hasNewMessageSeparator: false,
    });
  });

  it('invokes a custom renderMessage prop with the full parameter bag', () => {
    const renderMessage: any = vi.fn(() => null);
    render(<MessageList renderMessage={renderMessage} />);

    expect(renderMessage).toHaveBeenCalled();
    const call = renderMessage.mock.calls.find((c) => (c[0] as any).message === messages[0]);
    expect(call).toBeTruthy();
    expect((call![0] as any).message).toBe(messages[0]);
    expect(Object.keys(call![0] as any).sort()).toEqual([
      'chainBottom',
      'chainTop',
      'handleScroll',
      'hasNewMessageSeparator',
      'hasSeparator',
      'message',
      'onNewMessageSeparatorVisibilityChange',
      'renderCustomSeparator',
      'renderMessageContent',
      'renderSuggestedReplies',
      'scrollMessageOverflowToTop',
    ]);

    // custom renderMessage replaces the default leaf entirely
    expect(vi.mocked(Message)).not.toHaveBeenCalled();
  });
});
