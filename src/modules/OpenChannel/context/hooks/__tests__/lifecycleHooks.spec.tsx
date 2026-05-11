import { ChannelType } from '@sendbird/chat';
import { act, renderHook, waitFor } from '@testing-library/react';

import * as actionTypes from '../../dux/actionTypes';
import * as openChannelUtils from '../../utils';
import useCheckScrollBottom from '../useCheckScrollBottom';
import useHandleChannelEvents from '../useHandleChannelEvents';
import useInitialMessagesFetch from '../useInitialMessagesFetch';
import useSetChannel from '../useSetChannel';
import useTrimMessageList from '../useTrimMessageList';

jest.mock('@sendbird/chat/openChannel', () => ({
  OpenChannelHandler: jest.fn((handlers) => handlers),
}));

const logger = {
  info: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
};

const createSdk = (channel: any) => ({
  currentUser: { userId: 'current-user' },
  openChannel: {
    getChannel: jest.fn().mockResolvedValue(channel),
    addOpenChannelHandler: jest.fn(),
    removeOpenChannelHandler: jest.fn(),
  },
});

const createOpenChannel = (overrides = {}) => ({
  url: 'open-channel-url',
  participantCount: 2,
  enter: jest.fn().mockResolvedValue(undefined),
  exit: jest.fn().mockResolvedValue(undefined),
  isOperator: jest.fn(() => false),
  getMyMutedInfo: jest.fn().mockResolvedValue({ isMuted: false }),
  createBannedUserListQuery: jest.fn(),
  createMutedUserListQuery: jest.fn(),
  createParticipantListQuery: jest.fn(() => ({ hasNext: false, next: jest.fn() })),
  getMessagesByTimestamp: jest.fn().mockResolvedValue([]),
  ...overrides,
});

describe('OpenChannel lifecycle hooks', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    jest.spyOn(openChannelUtils, 'scrollIntoLast').mockImplementation(jest.fn());
    jest.spyOn(openChannelUtils, 'fetchWithListQuery').mockImplementation((query, _logger, callback) => {
      callback(query?.users ?? []);
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('checks whether the open-channel scroll container is at the bottom', () => {
    const scrollElement = document.createElement('div');
    Object.defineProperty(scrollElement, 'scrollHeight', { value: 100, configurable: true });
    Object.defineProperty(scrollElement, 'scrollTop', { value: 50, configurable: true });
    Object.defineProperty(scrollElement, 'clientHeight', { value: 50, configurable: true });

    const { result, rerender } = renderHook(
      ({ conversationScrollRef }) => useCheckScrollBottom(
        { conversationScrollRef },
        { logger: logger as any },
      ),
      { initialProps: { conversationScrollRef: { current: scrollElement } as any } },
    );

    expect(result.current()).toBe(true);

    Object.defineProperty(scrollElement, 'scrollTop', { value: 30, configurable: true });
    expect(result.current()).toBe(false);

    rerender({ conversationScrollRef: { current: null } as any });
    expect(result.current()).toBe(true);

    rerender({
      conversationScrollRef: {
        current: {
          get scrollHeight() {
            throw new Error('scroll failed');
          },
          scrollTop: 0,
          clientHeight: 0,
        },
      } as any,
    });
    expect(result.current()).toBe(true);
    expect(logger.error).toHaveBeenCalledWith('OpenChannel | useCheckScrollBottom', expect.any(Error));
  });

  it('fetches initial open-channel messages and handles success or failure', async () => {
    const messages = [{ messageId: 1, createdAt: 1000 }];
    const channel = createOpenChannel({
      getMessagesByTimestamp: jest.fn().mockResolvedValue(messages),
    });
    const dispatcher = jest.fn();
    const scrollRef = { current: document.createElement('div') };

    renderHook(() => useInitialMessagesFetch(
      { currentOpenChannel: channel as any, userFilledMessageListParams: { prevResultSize: 5, includeReactions: true } },
      { logger: logger as any, messagesDispatcher: dispatcher, scrollRef },
    ));

    expect(dispatcher).toHaveBeenCalledWith({ type: actionTypes.RESET_MESSAGES, payload: null });
    expect(dispatcher).toHaveBeenCalledWith({ type: actionTypes.GET_PREV_MESSAGES_START, payload: null });
    expect(channel.getMessagesByTimestamp).toHaveBeenCalledWith(expect.any(Number), {
      nextResultSize: 0,
      prevResultSize: 5,
      isInclusive: true,
      includeReactions: true,
    });

    await waitFor(() => {
      expect(dispatcher).toHaveBeenCalledWith({
        type: actionTypes.GET_PREV_MESSAGES_SUCESS,
        payload: {
          currentOpenChannel: channel,
          messages,
          hasMore: true,
          lastMessageTimestamp: 1000,
        },
      });
    });

    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(openChannelUtils.scrollIntoLast).toHaveBeenCalledWith(0, scrollRef);

    const error = new Error('fetch failed');
    const failingChannel = createOpenChannel({
      getMessagesByTimestamp: jest.fn().mockRejectedValue(error),
    });
    const failingDispatcher = jest.fn();

    renderHook(() => useInitialMessagesFetch(
      { currentOpenChannel: failingChannel as any },
      { logger: logger as any, messagesDispatcher: failingDispatcher, scrollRef },
    ));

    await waitFor(() => {
      expect(failingDispatcher).toHaveBeenCalledWith({
        type: actionTypes.GET_PREV_MESSAGES_FAIL,
        payload: {
          currentOpenChannel: failingChannel,
          messages: [],
          hasMore: false,
          lastMessageTimestamp: 0,
        },
      });
    });
    expect(logger.error).toHaveBeenCalledWith('OpenChannel | useInitialMessagesFetch: Fetching messages failed', error);
  });

  it('registers open-channel event handlers and dispatches received SDK events', () => {
    const currentOpenChannel = createOpenChannel();
    const sdk = createSdk(currentOpenChannel);
    const dispatcher = jest.fn();
    const scrollRef = { current: document.createElement('div') };
    const channel = { url: currentOpenChannel.url };
    const message = { messageId: 10 };
    const user = { userId: 'member' };

    const { unmount } = renderHook(() => useHandleChannelEvents(
      { currentOpenChannel: currentOpenChannel as any, checkScrollBottom: jest.fn(() => true) },
      { sdk: sdk as any, logger: logger as any, messagesDispatcher: dispatcher, scrollRef },
    ));

    expect(sdk.openChannel.addOpenChannelHandler).toHaveBeenCalledTimes(1);
    const handler = sdk.openChannel.addOpenChannelHandler.mock.calls[0][1];

    act(() => {
      handler.onMessageReceived(channel, message);
      handler.onMessageUpdated(channel, message);
      handler.onMessageDeleted(channel, 10);
      handler.onOperatorUpdated(channel, [user]);
      handler.onUserEntered(channel, user);
      handler.onUserExited(channel, user);
      handler.onUserMuted(channel, user);
      handler.onUserUnmuted(channel, user);
      handler.onUserBanned(channel, user);
      handler.onUserUnbanned(channel, user);
      handler.onChannelFrozen(channel);
      handler.onChannelUnfrozen(channel);
      handler.onChannelChanged(channel);
      handler.onMetaDataCreated(channel, { key: 'created' });
      handler.onMetaDataUpdated(channel, { key: 'updated' });
      handler.onMetaDataDeleted(channel, ['key']);
      handler.onMetaCounterCreated(channel, { count: 1 });
      handler.onMetaCounterUpdated(channel, { count: 2 });
      handler.onMetaCounterDeleted(channel, ['count']);
      handler.onMentionReceived(channel, message);
      handler.onChannelDeleted(currentOpenChannel.url, ChannelType.OPEN);
      jest.runOnlyPendingTimers();
    });

    expect(openChannelUtils.scrollIntoLast).toHaveBeenCalledWith(0, scrollRef);
    [
      actionTypes.ON_MESSAGE_RECEIVED,
      actionTypes.ON_MESSAGE_UPDATED,
      actionTypes.ON_MESSAGE_DELETED,
      actionTypes.ON_OPERATOR_UPDATED,
      actionTypes.ON_USER_ENTERED,
      actionTypes.ON_USER_EXITED,
      actionTypes.ON_USER_MUTED,
      actionTypes.ON_USER_UNMUTED,
      actionTypes.ON_USER_BANNED,
      actionTypes.ON_USER_UNBANNED,
      actionTypes.ON_CHANNEL_FROZEN,
      actionTypes.ON_CHANNEL_UNFROZEN,
      actionTypes.ON_CHANNEL_CHANGED,
      actionTypes.ON_META_DATA_CREATED,
      actionTypes.ON_META_DATA_UPDATED,
      actionTypes.ON_META_DATA_DELETED,
      actionTypes.ON_META_COUNTERS_CREATED,
      actionTypes.ON_META_COUNTERS_UPDATED,
      actionTypes.ON_META_COUNTERS_DELETED,
      actionTypes.ON_MENTION_RECEIVED,
      actionTypes.ON_CHANNEL_DELETED,
    ].forEach((type) => {
      expect(dispatcher).toHaveBeenCalledWith(expect.objectContaining({ type }));
    });

    act(() => {
      handler.onChannelDeleted('other-url', ChannelType.OPEN);
      handler.onChannelDeleted(currentOpenChannel.url, ChannelType.GROUP);
    });
    expect(dispatcher.mock.calls.filter(([action]) => action.type === actionTypes.ON_CHANNEL_DELETED)).toHaveLength(1);

    unmount();
    expect(sdk.openChannel.removeOpenChannelHandler).toHaveBeenCalledTimes(1);
  });

  it('sets open channels and fetches operator, muted, and participant lists', async () => {
    const previousChannel = createOpenChannel({ url: 'previous-channel' });
    const operatorChannel = createOpenChannel({
      isOperator: jest.fn(() => true),
      createBannedUserListQuery: jest.fn(() => ({ users: [{ userId: 'banned' }] })),
      createMutedUserListQuery: jest.fn(() => ({ users: [{ userId: 'muted' }] })),
      createParticipantListQuery: jest.fn(() => ({ users: [{ userId: 'participant' }] })),
    });
    const sdk = createSdk(operatorChannel);
    const dispatcher = jest.fn();

    renderHook(() => useSetChannel(
      {
        channelUrl: operatorChannel.url,
        sdkInit: true,
        fetchingParticipants: true,
        userId: 'operator',
        currentOpenChannel: previousChannel as any,
      },
      { sdk: sdk as any, logger: logger as any, messagesDispatcher: dispatcher },
    ));

    await waitFor(() => {
      expect(dispatcher).toHaveBeenCalledWith({ type: actionTypes.SET_CURRENT_CHANNEL, payload: operatorChannel });
      expect(dispatcher).toHaveBeenCalledWith({
        type: actionTypes.FETCH_BANNED_USER_LIST,
        payload: { channel: operatorChannel, users: [{ userId: 'banned' }] },
      });
      expect(dispatcher).toHaveBeenCalledWith({
        type: actionTypes.FETCH_MUTED_USER_LIST,
        payload: { channel: operatorChannel, users: [{ userId: 'muted' }] },
      });
      expect(dispatcher).toHaveBeenCalledWith({
        type: actionTypes.FETCH_PARTICIPANT_LIST,
        payload: { channel: operatorChannel, users: [{ userId: 'participant' }] },
      });
    });
    expect(previousChannel.exit).toHaveBeenCalledTimes(1);

    const memberChannel = createOpenChannel({
      getMyMutedInfo: jest.fn().mockResolvedValue({ isMuted: true }),
    });
    const memberSdk = createSdk(memberChannel);

    renderHook(() => useSetChannel(
      {
        channelUrl: memberChannel.url,
        sdkInit: true,
        fetchingParticipants: false,
        userId: 'member',
        currentOpenChannel: null,
      },
      { sdk: memberSdk as any, logger: logger as any, messagesDispatcher: dispatcher },
    ));

    await waitFor(() => {
      expect(dispatcher).toHaveBeenCalledWith({
        type: actionTypes.FETCH_MUTED_USER_LIST,
        payload: { channel: memberChannel, users: [memberSdk.currentUser] },
      });
    });
  });

  it('marks the open channel invalid when fetch or enter fails', async () => {
    const dispatcher = jest.fn();
    const fetchError = new Error('fetch failed');
    const failingSdk = {
      openChannel: {
        getChannel: jest.fn().mockRejectedValue(fetchError),
      },
    };

    renderHook(() => useSetChannel(
      { channelUrl: 'missing', sdkInit: true, fetchingParticipants: false, userId: 'member', currentOpenChannel: null },
      { sdk: failingSdk as any, logger: logger as any, messagesDispatcher: dispatcher },
    ));

    await waitFor(() => {
      expect(dispatcher).toHaveBeenCalledWith({ type: actionTypes.SET_CHANNEL_INVALID, payload: null });
    });

    const enterError = new Error('enter failed');
    const enterFailingChannel = createOpenChannel({
      enter: jest.fn().mockRejectedValue(enterError),
    });
    const enterFailingSdk = createSdk(enterFailingChannel);

    renderHook(() => useSetChannel(
      {
        channelUrl: enterFailingChannel.url,
        sdkInit: true,
        fetchingParticipants: false,
        userId: 'member',
        currentOpenChannel: null,
      },
      { sdk: enterFailingSdk as any, logger: logger as any, messagesDispatcher: dispatcher },
    ));

    await waitFor(() => {
      expect(logger.warning).toHaveBeenCalledWith(
        'OpenChannel | useSetChannel: Failed to enter channel',
        { channelUrl: enterFailingChannel.url, error: enterError },
      );
    });
  });

  it('trims oversized message lists and throttles repeated trims', () => {
    const dispatcher = jest.fn();
    const { rerender } = renderHook(
      ({ messagesLength, messageLimit }) => useTrimMessageList(
        { messagesLength, messageLimit },
        { messagesDispatcher: dispatcher, logger: logger as any },
      ),
      { initialProps: { messagesLength: 50, messageLimit: 30 } },
    );

    expect(dispatcher).toHaveBeenCalledWith({
      type: actionTypes.TRIM_MESSAGE_LIST,
      payload: { messageLimit: 30 },
    });

    rerender({ messagesLength: 60, messageLimit: 30 });
    expect(dispatcher).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(5000);
    });
    rerender({ messagesLength: 70, messageLimit: 30 });
    expect(dispatcher).toHaveBeenCalledTimes(2);
  });
});
