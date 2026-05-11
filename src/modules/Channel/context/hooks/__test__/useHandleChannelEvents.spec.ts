import { renderHook } from '@testing-library/react';
import { GroupChannelHandler } from '@sendbird/chat/groupChannel';
import useHandleChannelEvents from '../useHandleChannelEvents';
import * as messageActions from '../../dux/actionTypes';

const mockMarkAsReadScheduler = { push: jest.fn() };
const mockMarkAsDeliveredScheduler = { push: jest.fn() };
const mockScrollIntoLast = jest.fn();
let mockDisableMarkAsDelivered = false;
let mockPremiumFeatureList = ['delivery_receipt'];

jest.mock('@sendbird/chat/groupChannel', () => {
  const actual = jest.requireActual('@sendbird/chat/groupChannel');
  return {
    ...actual,
    GroupChannelHandler: jest.fn((handlers) => handlers),
  };
});

jest.mock('../../utils', () => ({
  scrollIntoLast: (...args) => mockScrollIntoLast(...args),
}));

jest.mock('../../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: () => ({
    state: {
      config: {
        markAsReadScheduler: mockMarkAsReadScheduler,
        markAsDeliveredScheduler: mockMarkAsDeliveredScheduler,
        disableMarkAsDelivered: mockDisableMarkAsDelivered,
      },
      stores: {
        sdkStore: {
          sdk: {
            appInfo: { premiumFeatureList: mockPremiumFeatureList },
          },
        },
      },
    },
  }),
}));

const createLogger = () => ({
  info: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
});

const createChannel = (url = 'channel-url', overrides = {}) => ({
  url,
  isGroupChannel: jest.fn(() => true),
  getTypingUsers: jest.fn(() => [{ userId: 'typing-user' }]),
  ...overrides,
} as any);

const renderUseHandleChannelEvents = ({
  sdk = {
    currentUser: { userId: 'me' },
    groupChannel: {
      addGroupChannelHandler: jest.fn(),
      removeGroupChannelHandler: jest.fn(),
    },
  },
  logger = createLogger(),
  messagesDispatcher = jest.fn(),
  setQuoteMessage = jest.fn(),
  scrollRef = { current: { offsetHeight: 100, scrollTop: 100, scrollHeight: 190 } },
  currentGroupChannel = createChannel(),
  sdkInit = true,
  disableMarkAsRead = false,
} = {}) => {
  const hook = renderHook(() => useHandleChannelEvents({
    sdkInit,
    currentGroupChannel,
    disableMarkAsRead,
  }, {
    sdk: sdk as any,
    logger,
    scrollRef: scrollRef as any,
    setQuoteMessage,
    messagesDispatcher,
  }));

  return {
    hook,
    sdk,
    logger,
    messagesDispatcher,
    setQuoteMessage,
    scrollRef,
    handler: (sdk as any).groupChannel?.addGroupChannelHandler?.mock?.calls?.[0]?.[1],
  };
};

describe('useHandleChannelEvents', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDisableMarkAsDelivered = false;
    mockPremiumFeatureList = ['delivery_receipt'];
    jest.useFakeTimers();
    document.body.innerHTML = '<div id="sendbird-dropdown-portal"></div><div id="sendbird-emoji-list-portal"></div>';
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('registers and removes a group channel handler', () => {
    const { hook, sdk } = renderUseHandleChannelEvents();

    expect(GroupChannelHandler).toHaveBeenCalledTimes(1);
    expect(sdk.groupChannel.addGroupChannelHandler).toHaveBeenCalledWith(expect.any(String), expect.any(Object));

    hook.unmount();

    expect(sdk.groupChannel.removeGroupChannelHandler).toHaveBeenCalledWith(expect.any(String));
  });

  it('does not register without a channel URL or initialized sdk and logs missing cleanup API', () => {
    const sdk = {
      groupChannel: {
        addGroupChannelHandler: jest.fn(),
      },
    };
    const logger = createLogger();
    const { hook } = renderUseHandleChannelEvents({
      sdk,
      logger,
      sdkInit: false,
      currentGroupChannel: createChannel(undefined as any),
    });

    expect(sdk.groupChannel.addGroupChannelHandler).not.toHaveBeenCalled();

    hook.unmount();

    expect(logger.error).toHaveBeenCalledWith('Channel | useHandleChannelEvents: Not found the removeGroupChannelHandler');
  });

  it('dispatches message receive events and schedules scroll/read/delivery side effects', () => {
    const currentGroupChannel = createChannel();
    const { handler, messagesDispatcher, scrollRef } = renderUseHandleChannelEvents({ currentGroupChannel });
    const message = { messageId: 1 };

    handler.onMessageReceived(currentGroupChannel, message);
    jest.runOnlyPendingTimers();

    expect(messagesDispatcher).toHaveBeenCalledWith({
      type: messageActions.ON_MESSAGE_RECEIVED,
      payload: { channel: currentGroupChannel, message },
    });
    expect(mockScrollIntoLast).toHaveBeenCalledWith(0, scrollRef);
    expect(mockMarkAsReadScheduler.push).toHaveBeenCalledWith(currentGroupChannel);
    expect(mockMarkAsDeliveredScheduler.push).toHaveBeenCalledWith(currentGroupChannel);
  });

  it('honors disabled read and delivery side-effect options for received messages', () => {
    const currentGroupChannel = createChannel();
    const { handler } = renderUseHandleChannelEvents({
      currentGroupChannel,
      disableMarkAsRead: true,
    });

    handler.onMessageReceived(currentGroupChannel, { messageId: 1 });
    jest.runOnlyPendingTimers();

    expect(mockMarkAsReadScheduler.push).not.toHaveBeenCalled();
    expect(mockMarkAsDeliveredScheduler.push).toHaveBeenCalledWith(currentGroupChannel);

    jest.clearAllMocks();
    mockDisableMarkAsDelivered = true;
    const disabledDelivered = renderUseHandleChannelEvents({ currentGroupChannel });

    disabledDelivered.handler.onMessageReceived(currentGroupChannel, { messageId: 2 });
    jest.runOnlyPendingTimers();

    expect(mockMarkAsReadScheduler.push).toHaveBeenCalledWith(currentGroupChannel);
    expect(mockMarkAsDeliveredScheduler.push).not.toHaveBeenCalled();

    jest.clearAllMocks();
    mockPremiumFeatureList = [];
    mockDisableMarkAsDelivered = false;
    const unavailableDeliveryReceipt = renderUseHandleChannelEvents({ currentGroupChannel });

    unavailableDeliveryReceipt.handler.onMessageReceived(currentGroupChannel, { messageId: 3 });
    jest.runOnlyPendingTimers();

    expect(mockMarkAsReadScheduler.push).toHaveBeenCalledWith(currentGroupChannel);
    expect(mockMarkAsDeliveredScheduler.push).not.toHaveBeenCalled();
  });

  it('skips message receive side effects for stale, non-group, menu-open, or non-bottom channels', () => {
    const currentGroupChannel = createChannel();
    const { handler, messagesDispatcher } = renderUseHandleChannelEvents({ currentGroupChannel });
    const nonGroupChannel = createChannel('channel-url', { isGroupChannel: jest.fn(() => false) });
    const staleChannel = createChannel('stale-url');

    handler.onMessageReceived(nonGroupChannel, { messageId: 1 });
    handler.onMessageReceived(staleChannel, { messageId: 2 });
    expect(messagesDispatcher).not.toHaveBeenCalled();

    document.getElementById('sendbird-dropdown-portal')?.appendChild(document.createElement('div'));
    handler.onMessageReceived(currentGroupChannel, { messageId: 3 });
    jest.runOnlyPendingTimers();

    expect(messagesDispatcher).toHaveBeenCalledTimes(1);
    expect(mockScrollIntoLast).not.toHaveBeenCalled();
  });

  it('dispatches read, unread, delivery, update, thread, delete, reaction, and channel state events', () => {
    const currentGroupChannel = createChannel();
    const { handler, messagesDispatcher, setQuoteMessage } = renderUseHandleChannelEvents({ currentGroupChannel });
    const message = { messageId: 1 };
    const event = { targetMessageId: 1 };

    handler.onUnreadMemberStatusUpdated(currentGroupChannel);
    handler.onUserMarkedRead(currentGroupChannel, ['user-1']);
    handler.onUserMarkedUnread(currentGroupChannel, ['user-2']);
    handler.onUndeliveredMemberStatusUpdated(currentGroupChannel);
    handler.onMessageUpdated(currentGroupChannel, message);
    handler.onThreadInfoUpdated(currentGroupChannel, event);
    handler.onMessageDeleted(currentGroupChannel, 1);
    handler.onReactionUpdated(currentGroupChannel, event);
    handler.onChannelChanged(currentGroupChannel);
    handler.onChannelFrozen(currentGroupChannel);
    handler.onChannelUnfrozen(currentGroupChannel);
    handler.onUserMuted(currentGroupChannel, { userId: 'muted-user' });
    handler.onUserUnmuted(currentGroupChannel, { userId: 'muted-user' });
    handler.onOperatorUpdated(currentGroupChannel, [{ userId: 'operator' }]);
    handler.onTypingStatusUpdated(currentGroupChannel);

    expect(messagesDispatcher).toHaveBeenCalledWith({ type: messageActions.SET_CURRENT_CHANNEL, payload: currentGroupChannel });
    expect(messagesDispatcher).toHaveBeenCalledWith({ type: messageActions.MARK_AS_READ, payload: { channel: currentGroupChannel, userIds: ['user-1'] } });
    expect(messagesDispatcher).toHaveBeenCalledWith({ type: messageActions.MARK_AS_UNREAD, payload: { channel: currentGroupChannel, userIds: ['user-2'] } });
    expect(messagesDispatcher).toHaveBeenCalledWith({ type: messageActions.ON_MESSAGE_UPDATED, payload: { channel: currentGroupChannel, message } });
    expect(messagesDispatcher).toHaveBeenCalledWith({ type: messageActions.ON_MESSAGE_THREAD_INFO_UPDATED, payload: { channel: currentGroupChannel, event } });
    expect(messagesDispatcher).toHaveBeenCalledWith({ type: messageActions.ON_MESSAGE_DELETED, payload: 1 });
    expect(messagesDispatcher).toHaveBeenCalledWith({ type: messageActions.ON_REACTION_UPDATED, payload: event });
    expect(messagesDispatcher).toHaveBeenCalledWith({
      type: messageActions.ON_TYPING_STATUS_UPDATED,
      payload: { channel: currentGroupChannel, typingMembers: [{ userId: 'typing-user' }] },
    });
    expect(setQuoteMessage).toHaveBeenCalledWith(null);
  });

  it('ignores message delete events from stale or non-group channels', () => {
    const currentGroupChannel = createChannel();
    const { handler, messagesDispatcher, setQuoteMessage } = renderUseHandleChannelEvents({ currentGroupChannel });
    const staleChannel = createChannel('stale-url');
    const nonGroupChannel = createChannel('channel-url', { isGroupChannel: jest.fn(() => false) });

    handler.onMessageDeleted(staleChannel, 1);
    handler.onMessageDeleted(nonGroupChannel, 2);

    expect(messagesDispatcher).not.toHaveBeenCalled();
    expect(setQuoteMessage).not.toHaveBeenCalled();
  });

  it('clears the channel when the current user is banned or leaves', () => {
    const currentGroupChannel = createChannel();
    const { handler, messagesDispatcher } = renderUseHandleChannelEvents({ currentGroupChannel });

    handler.onUserBanned(currentGroupChannel, { userId: 'me' });
    handler.onUserBanned(currentGroupChannel, { userId: 'other' });
    handler.onUserLeft(currentGroupChannel, { userId: 'me' });
    handler.onUserLeft(currentGroupChannel, { userId: 'other' });

    expect(messagesDispatcher).toHaveBeenCalledWith({ type: messageActions.SET_CURRENT_CHANNEL, payload: null });
    expect(messagesDispatcher).toHaveBeenCalledWith({ type: messageActions.SET_CURRENT_CHANNEL, payload: currentGroupChannel });
  });
});
