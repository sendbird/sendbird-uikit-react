import { GroupChannelHandler, GroupChannelListOrder } from '@sendbird/chat/groupChannel';
import setupChannelList, {
  createChannelListQuery,
  pubSubHandler,
  pubSubHandleRemover,
} from '../utils';
import * as channelActions from '../dux/actionTypes';
import topics from '../../../lib/pubSub/topics';

jest.mock('@sendbird/chat/groupChannel', () => {
  const actual = jest.requireActual('@sendbird/chat/groupChannel');
  return {
    ...actual,
    GroupChannelHandler: jest.fn((handlers) => handlers),
  };
});

const flushPromises = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

const createLogger = () => ({
  info: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
});

const createChannel = (overrides = {}) => ({
  url: 'channel-url',
  lastMessage: { messageId: 1, isEqual: jest.fn((message) => message.messageId === 1) },
  isGroupChannel: jest.fn(() => true),
  ...overrides,
} as any);

const createSdk = (query = { hasNext: false, next: jest.fn() }) => ({
  currentUser: { userId: 'me' },
  appInfo: { premiumFeatureList: ['delivery_receipt'] },
  groupChannel: {
    addGroupChannelHandler: jest.fn(),
    createMyGroupChannelListQuery: jest.fn(() => query),
  },
} as any);

describe('ChannelList utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a channel list query with defaults and caller overrides', () => {
    const query = { hasNext: false };
    const sdk = createSdk(query as any);

    expect(createChannelListQuery({
      sdk,
      userFilledChannelListQuery: {
        includeEmpty: true,
        limit: 50,
        customTypesFilter: ['support'],
      } as any,
    })).toBe(query);

    expect(sdk.groupChannel.createMyGroupChannelListQuery).toHaveBeenCalledWith({
      includeEmpty: true,
      limit: 50,
      order: GroupChannelListOrder.LATEST_LAST_MESSAGE,
      customTypesFilter: ['support'],
    });
  });

  it('sets up handlers, fetches initial channels, sorts, auto-selects, and schedules delivery receipt for unread channels', async () => {
    const firstChannel = createChannel({ url: 'b', unreadMessageCount: 0 });
    const secondChannel = createChannel({ url: 'a', unreadMessageCount: 2 });
    const sortedChannels = [secondChannel, firstChannel];
    const query = {
      hasNext: true,
      next: jest.fn().mockResolvedValue([firstChannel, secondChannel]),
    };
    const sdk = createSdk(query);
    const logger = createLogger();
    const channelListDispatcher = jest.fn();
    const setChannelSource = jest.fn();
    const onChannelSelect = jest.fn();
    const sortChannelList = jest.fn(() => sortedChannels);
    const markAsDeliveredScheduler = { push: jest.fn() };

    setupChannelList({
      sdk,
      sdkChannelHandlerId: 'handler-id',
      channelListDispatcher,
      setChannelSource,
      onChannelSelect,
      userFilledChannelListQuery: { includeEmpty: true } as any,
      logger,
      sortChannelList,
      disableAutoSelect: false,
      markAsDeliveredScheduler: markAsDeliveredScheduler as any,
      disableMarkAsDelivered: false,
    });
    await flushPromises();

    expect(GroupChannelHandler).toHaveBeenCalledTimes(1);
    expect(sdk.groupChannel.addGroupChannelHandler).toHaveBeenCalledWith('handler-id', expect.any(Object));
    expect(setChannelSource).toHaveBeenCalledWith(query);
    expect(channelListDispatcher).toHaveBeenCalledWith({
      type: channelActions.INIT_CHANNELS_START,
      payload: { currentUserId: 'me' },
    });
    expect(channelListDispatcher).toHaveBeenCalledWith({
      type: channelActions.CHANNEL_LIST_PARAMS_UPDATED,
      payload: { channelListQuery: query, currentUserId: 'me' },
    });
    expect(sortChannelList).toHaveBeenCalledWith([firstChannel, secondChannel]);
    expect(onChannelSelect).toHaveBeenCalledWith(secondChannel);
    expect(channelListDispatcher).toHaveBeenCalledWith({
      type: channelActions.INIT_CHANNELS_SUCCESS,
      payload: {
        channelList: sortedChannels,
        disableAutoSelect: false,
      },
    });
    expect(markAsDeliveredScheduler.push).toHaveBeenCalledTimes(1);
    expect(markAsDeliveredScheduler.push).toHaveBeenCalledWith(secondChannel);
  });

  it('logs setup warnings, no-more-channel state, and fetch failures', async () => {
    const logger = createLogger();
    const dispatcher = jest.fn();
    const query = { hasNext: false, next: jest.fn() };
    const sdk = createSdk(query);
    sdk.currentUser = null;

    expect(() => setupChannelList({
      sdk: { ...sdk, groupChannel: undefined },
      sdkChannelHandlerId: 'handler-id',
      channelListDispatcher: dispatcher,
      setChannelSource: jest.fn(),
      onChannelSelect: jest.fn(),
      userFilledChannelListQuery: null as any,
      logger,
      disableAutoSelect: true,
      markAsDeliveredScheduler: { push: jest.fn() } as any,
      disableMarkAsDelivered: true,
    })).toThrow('createMyGroupChannelListQuery');

    expect(logger.warning).toHaveBeenCalled();

    setupChannelList({
      sdk,
      sdkChannelHandlerId: 'handler-id',
      channelListDispatcher: dispatcher,
      setChannelSource: jest.fn(),
      onChannelSelect: jest.fn(),
      userFilledChannelListQuery: null as any,
      logger,
      disableAutoSelect: true,
      markAsDeliveredScheduler: { push: jest.fn() } as any,
      disableMarkAsDelivered: true,
    });
    expect(logger.info).toHaveBeenCalledWith('ChannelList - there are no more channels');

    const error = new Error('next failed');
    setupChannelList({
      sdk: createSdk({ hasNext: true, next: jest.fn().mockRejectedValue(error) }),
      sdkChannelHandlerId: 'handler-id',
      channelListDispatcher: dispatcher,
      setChannelSource: jest.fn(),
      onChannelSelect: jest.fn(),
      userFilledChannelListQuery: {} as any,
      logger,
      disableAutoSelect: true,
      markAsDeliveredScheduler: { push: jest.fn() } as any,
      disableMarkAsDelivered: true,
    });
    await flushPromises();

    expect(logger.error).toHaveBeenCalledWith('ChannelList - couldnt fetch channels', error);
    expect(dispatcher).toHaveBeenCalledWith({ type: channelActions.INIT_CHANNELS_FAILURE });
  });

  it('dispatches channel SDK handler events', () => {
    const sdk = createSdk();
    const logger = createLogger();
    const channelListDispatcher = jest.fn();
    setupChannelList({
      sdk,
      sdkChannelHandlerId: 'handler-id',
      channelListDispatcher,
      setChannelSource: jest.fn(),
      onChannelSelect: jest.fn(),
      userFilledChannelListQuery: {} as any,
      logger,
      disableAutoSelect: true,
      markAsDeliveredScheduler: { push: jest.fn() } as any,
      disableMarkAsDelivered: true,
    });
    const handler = sdk.groupChannel.addGroupChannelHandler.mock.calls[0][1];
    const channel = createChannel();
    const nonGroupChannel = createChannel({ isGroupChannel: jest.fn(() => false) });
    const updatedMessage = { messageId: 1 };

    handler.onChannelChanged(channel);
    handler.onChannelChanged(nonGroupChannel);
    handler.onChannelDeleted('deleted-url');
    handler.onUserJoined(channel);
    handler.onUserBanned(channel, { userId: 'me' });
    handler.onUserBanned(nonGroupChannel, { userId: 'me' });
    handler.onUserLeft(channel, { userId: 'other' });
    handler.onUnreadMemberStatusUpdated(channel);
    handler.onUndeliveredMemberStatusUpdated(channel);
    handler.onUndeliveredMemberStatusUpdated(createChannel({ lastMessage: null }));
    handler.onMessageUpdated(channel, updatedMessage);
    handler.onMessageUpdated(createChannel({ lastMessage: { messageId: 2, isEqual: jest.fn(() => false) } }), updatedMessage);
    handler.onChannelHidden(channel);
    handler.onChannelFrozen(channel);
    handler.onChannelFrozen(nonGroupChannel);
    handler.onChannelUnfrozen(channel);
    handler.onChannelUnfrozen(nonGroupChannel);

    expect(channelListDispatcher).toHaveBeenCalledWith({ type: channelActions.ON_CHANNEL_CHANGED, payload: channel });
    expect(channelListDispatcher).toHaveBeenCalledWith({ type: channelActions.ON_CHANNEL_DELETED, payload: 'deleted-url' });
    expect(channelListDispatcher).toHaveBeenCalledWith({ type: channelActions.ON_USER_JOINED, payload: channel });
    expect(channelListDispatcher).toHaveBeenCalledWith({ type: channelActions.ON_USER_LEFT, payload: { channel, isMe: true } });
    expect(channelListDispatcher).toHaveBeenCalledWith({ type: channelActions.ON_USER_LEFT, payload: { channel, isMe: false } });
    expect(channelListDispatcher).toHaveBeenCalledWith({ type: channelActions.ON_READ_RECEIPT_UPDATED, payload: channel });
    expect(channelListDispatcher).toHaveBeenCalledWith({ type: channelActions.ON_DELIVERY_RECEIPT_UPDATED, payload: channel });
    expect(channelListDispatcher).toHaveBeenCalledWith({ type: channelActions.ON_LAST_MESSAGE_UPDATED, payload: channel });
    expect(channelListDispatcher).toHaveBeenCalledWith({ type: channelActions.ON_CHANNEL_ARCHIVED, payload: channel });
    expect(channelListDispatcher).toHaveBeenCalledWith({ type: channelActions.ON_CHANNEL_FROZEN, payload: channel });
    expect(channelListDispatcher).toHaveBeenCalledWith({ type: channelActions.ON_CHANNEL_UNFROZEN, payload: channel });
  });

  it('subscribes to pubSub events and removes subscribers defensively', () => {
    const callbacks = new Map();
    const removable = { remove: jest.fn() };
    const throwingRemovable = { remove: jest.fn(() => { throw new Error('already removed'); }) };
    const pubSub = {
      subscribe: jest.fn((topic, callback) => {
        callbacks.set(topic, callback);
        return topic === topics.UPDATE_USER_MESSAGE ? throwingRemovable : removable;
      }),
    };
    const dispatcher = jest.fn();
    const subscribers = pubSubHandler(pubSub as any, dispatcher);
    const channel = createChannel();
    const message = { messageId: 1 };

    callbacks.get(topics.CREATE_CHANNEL)({ channel });
    callbacks.get(topics.UPDATE_USER_MESSAGE)({ channel, message });
    callbacks.get(topics.UPDATE_USER_MESSAGE)({
      channel: createChannel({ isGroupChannel: jest.fn(() => false) }),
      message,
    });
    callbacks.get(topics.LEAVE_CHANNEL)({ channel });

    expect(dispatcher).toHaveBeenCalledWith({ type: channelActions.CREATE_CHANNEL, payload: channel });
    expect(dispatcher).toHaveBeenCalledWith({ type: channelActions.ON_LAST_MESSAGE_UPDATED, payload: channel });
    expect(dispatcher).toHaveBeenCalledWith({ type: channelActions.LEAVE_CHANNEL_SUCCESS, payload: channel.url });
    expect(pubSubHandler(null as any, dispatcher).size).toBe(0);

    pubSubHandleRemover(subscribers);

    expect(removable.remove).toHaveBeenCalled();
    expect(throwingRemovable.remove).toHaveBeenCalled();
  });
});
