const React = require('react');
const { createSendbirdContextStore, SendbirdContext } = require('../src/lib/Sendbird/context/SendbirdContext');
const { initialState } = require('../src/lib/Sendbird/context/initialState');

const createLogger = () => ({
  debug: jest.fn(),
  info: jest.fn(),
  log: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
});

const createQuery = () => ({
  hasNext: false,
  isLoading: false,
  next: jest.fn().mockResolvedValue([]),
});

const createCollection = () => ({
  channels: [],
  hasMore: false,
  loadMore: jest.fn().mockResolvedValue([]),
  setGroupChannelCollectionHandler: jest.fn(),
  dispose: jest.fn(),
});

const createMockSdk = () => ({
  currentUser: {
    userId: 'mockUserId',
    nickname: 'mockNickname',
    profileUrl: '',
  },
  appInfo: {
    uploadSizeLimit: 1024 * 1024 * 5,
    multipleFilesMessageFileCountLimit: 10,
    premiumFeatureList: [],
  },
  isCacheEnabled: false,
  connect: jest.fn().mockResolvedValue({ userId: 'mockUserId' }),
  disconnect: jest.fn().mockResolvedValue(undefined),
  disconnectWebSocket: jest.fn().mockResolvedValue(undefined),
  updateCurrentUserInfo: jest.fn().mockResolvedValue(undefined),
  addExtension: jest.fn(),
  addSendbirdExtensions: jest.fn(),
  setSessionHandler: jest.fn(),
  createApplicationUserListQuery: jest.fn(createQuery),
  createMessageSearchQuery: jest.fn(createQuery),
  groupChannel: {
    getChannel: jest.fn().mockResolvedValue(null),
    addGroupChannelHandler: jest.fn(),
    removeGroupChannelHandler: jest.fn(),
    createMyGroupChannelListQuery: jest.fn(createQuery),
    createGroupChannelCollection: jest.fn(createCollection),
    createChannel: jest.fn().mockResolvedValue({ url: 'mockChannelUrl' }),
  },
  openChannel: {
    getChannel: jest.fn().mockResolvedValue(null),
    addOpenChannelHandler: jest.fn(),
    removeOpenChannelHandler: jest.fn(),
    createOpenChannelListQuery: jest.fn(createQuery),
    createChannel: jest.fn().mockResolvedValue({ url: 'mockOpenChannelUrl' }),
  },
});

const createPubSub = () => ({
  publish: jest.fn(),
  subscribe: jest.fn(() => ({ remove: jest.fn() })),
});

const createMockSendbirdState = (overrides = {}) => ({
  config: {
    ...initialState.config,
    logger: createLogger(),
    pubSub: createPubSub(),
    isOnline: true,
    userId: 'mockUserId',
    userMention: {
      maxMentionCount: 10,
      maxSuggestionCount: 15,
    },
    markAsReadScheduler: { push: jest.fn(), clear: jest.fn() },
    markAsDeliveredScheduler: { push: jest.fn(), clear: jest.fn() },
    groupChannel: { ...initialState.config.groupChannel },
    groupChannelList: { ...initialState.config.groupChannelList },
    groupChannelSettings: { ...initialState.config.groupChannelSettings },
    openChannel: { ...initialState.config.openChannel },
    ...(overrides.config || {}),
  },
  stores: {
    ...initialState.stores,
    sdkStore: {
      ...initialState.stores.sdkStore,
      sdk: createMockSdk(),
      initialized: false,
      loading: false,
    },
    userStore: {
      ...initialState.stores.userStore,
      user: {
        userId: 'mockUserId',
        nickname: 'mockNickname',
        profileUrl: '',
      },
      initialized: true,
      loading: false,
    },
    appInfoStore: {
      ...initialState.stores.appInfoStore,
    },
    ...(overrides.stores || {}),
  },
  eventHandlers: {
    ...initialState.eventHandlers,
    ...(overrides.eventHandlers || {}),
  },
  emojiManager: overrides.emojiManager || initialState.emojiManager,
  utils: {
    ...initialState.utils,
    updateMessageTemplatesInfo: jest.fn(),
    getCachedTemplate: jest.fn(() => null),
    ...(overrides.utils || {}),
  },
});

const MockSendbirdProvider = ({ children, state }) => {
  const storeRef = React.useRef(null);

  if (!storeRef.current) {
    storeRef.current = createSendbirdContextStore(state || createMockSendbirdState());
  }

  return React.createElement(
    SendbirdContext.Provider,
    { value: storeRef.current },
    children,
  );
};

module.exports = {
  __esModule: true,
  default: MockSendbirdProvider,
  createMockSdk,
  createMockSendbirdState,
};
