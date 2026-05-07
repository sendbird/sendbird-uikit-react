import selectors, {
  UikitMessageHandler,
  getConnect,
  getCreateGroupChannel,
  getCreateOpenChannel,
  getDeleteMessage,
  getDisconnect,
  getEnterOpenChannel,
  getExitOpenChannel,
  getFreezeChannel,
  getGetGroupChannel,
  getGetOpenChannel,
  getLeaveGroupChannel,
  getPubSub,
  getResendFileMessage,
  getResendUserMessage,
  getSdk,
  getSendFileMessage,
  getSendUserMessage,
  getUnfreezeChannel,
  getUpdateUserInfo,
  getUpdateUserMessage,
} from '../selectors';
import topics from '../pubSub/topics';

const createPubSub = () => ({
  publish: jest.fn(),
});

const createState = (sdk: Record<string, any>, pubSub = createPubSub()) => ({
  stores: {
    sdkStore: { sdk },
  },
  config: { pubSub },
} as any);

const createRequest = () => {
  const callbacks: Record<string, (...args: any[]) => void> = {};
  const request = {
    onFailed: jest.fn((callback) => {
      callbacks.failed = callback;
      return request;
    }),
    onPending: jest.fn((callback) => {
      callbacks.pending = callback;
      return request;
    }),
    onSucceeded: jest.fn((callback) => {
      callbacks.succeeded = callback;
      return request;
    }),
  };

  return { callbacks, request };
};

describe('selectors', () => {
  it('exposes the selector API as the default export', () => {
    expect(selectors).toMatchObject({
      getSdk,
      getPubSub,
      getConnect,
      getDisconnect,
      getUpdateUserInfo,
      getCreateGroupChannel,
      getCreateOpenChannel,
      getGetGroupChannel,
      getGetOpenChannel,
      getLeaveGroupChannel,
      getEnterOpenChannel,
      getExitOpenChannel,
      getFreezeChannel,
      getUnfreezeChannel,
      getSendUserMessage,
      getSendFileMessage,
      getUpdateUserMessage,
      getDeleteMessage,
      getResendUserMessage,
      getResendFileMessage,
    });
  });

  it('selects SDK and pubSub instances from state', () => {
    const sdk = { connect: jest.fn() };
    const pubSub = createPubSub();
    const state = createState(sdk, pubSub);

    expect(getSdk(state)).toBe(sdk);
    expect(getPubSub(state)).toBe(pubSub);
  });

  it('connects with and without an access token', async () => {
    const user = { userId: 'user-1' };
    const sdk = { connect: jest.fn().mockResolvedValue(user) };
    const state = createState(sdk);

    await expect(getConnect(state)('user-1')).resolves.toBe(user);
    await expect(getConnect(state)('user-1', 'token')).resolves.toBe(user);

    expect(sdk.connect).toHaveBeenNthCalledWith(1, 'user-1');
    expect(sdk.connect).toHaveBeenNthCalledWith(2, 'user-1', 'token');
  });

  it('propagates rejected SDK operations', async () => {
    const error = new Error('sdk failed');
    const sdk = {
      connect: jest.fn().mockRejectedValue(error),
      disconnect: jest.fn().mockRejectedValue(error),
      updateCurrentUserInfo: jest.fn().mockRejectedValue(error),
    };
    const state = createState(sdk);

    await expect(getConnect(state)('user-1')).rejects.toBe(error);
    await expect(getConnect(state)('user-1', 'token')).rejects.toBe(error);
    await expect(getDisconnect(state)()).rejects.toBe(error);
    await expect(getUpdateUserInfo(state)('Jane')).rejects.toBe(error);
  });

  it('rejects when required SDK methods or modules are missing', async () => {
    await expect(getConnect(createState({}))('user-1')).rejects.toThrow('connect');
    await expect(getDisconnect(createState({}))()).rejects.toThrow('disconnect');
    await expect(getUpdateUserInfo(createState({}))('Jane')).rejects.toThrow('updateCurrentUserInfo');

    await expect(getCreateGroupChannel(createState({}))({} as any)).rejects.toThrow('GroupChannelModule');
    await expect(getCreateGroupChannel(createState({ groupChannel: {} }))({} as any)).rejects.toThrow('createChannel');
    await expect(getCreateOpenChannel(createState({}))({} as any)).rejects.toThrow('OpenChannelModule');
    await expect(getCreateOpenChannel(createState({ openChannel: {} }))({} as any)).rejects.toThrow('createChannel');
    await expect(getGetGroupChannel(createState({}))('group-1')).rejects.toThrow('GroupChannelModule');
    await expect(getGetGroupChannel(createState({ groupChannel: {} }))('group-1')).rejects.toThrow('getChannel');
    await expect(getGetOpenChannel(createState({}))('open-1')).rejects.toThrow('OpenChannelModule');
    await expect(getGetOpenChannel(createState({ openChannel: {} }))('open-1')).rejects.toThrow('getChannel');

    await expect(getFreezeChannel()({} as any)).rejects.toThrow('freeze');
    await expect(getUnfreezeChannel()({} as any)).rejects.toThrow('unfreeze');
  });

  it('disconnects and updates current user info', async () => {
    const user = { userId: 'user-1', nickname: 'Jane' };
    const sdk = {
      disconnect: jest.fn().mockResolvedValue(undefined),
      updateCurrentUserInfo: jest.fn().mockResolvedValue(user),
    };
    const state = createState(sdk);

    await expect(getDisconnect(state)()).resolves.toBeUndefined();
    await expect(getUpdateUserInfo(state)('Jane', 'profile.png')).resolves.toBe(user);

    expect(sdk.disconnect).toHaveBeenCalledTimes(1);
    expect(sdk.updateCurrentUserInfo).toHaveBeenCalledWith({
      nickname: 'Jane',
      profileUrl: 'profile.png',
    });
  });

  it('creates group and open channels through their SDK modules', async () => {
    const pubSub = createPubSub();
    const groupChannel = { url: 'group-1' };
    const openChannel = { url: 'open-1' };
    const sdk = {
      groupChannel: {
        createChannel: jest.fn().mockResolvedValue(groupChannel),
      },
      openChannel: {
        createChannel: jest.fn().mockResolvedValue(openChannel),
      },
    };
    const state = createState(sdk, pubSub);

    await expect(getCreateGroupChannel(state)({ name: 'group' } as any)).resolves.toBe(groupChannel);
    await expect(getCreateOpenChannel(state)({ name: 'open' } as any)).resolves.toBe(openChannel);

    expect(pubSub.publish).toHaveBeenCalledWith(topics.CREATE_CHANNEL, { channel: groupChannel });
    expect(sdk.groupChannel.createChannel).toHaveBeenCalledWith({ name: 'group' });
    expect(sdk.openChannel.createChannel).toHaveBeenCalledWith({ name: 'open' });
  });

  it('gets, leaves, enters, exits, freezes, and unfreezes channels', async () => {
    const groupChannel = {
      url: 'group-1',
      leave: jest.fn().mockResolvedValue(undefined),
      freeze: jest.fn().mockResolvedValue(undefined),
      unfreeze: jest.fn().mockResolvedValue(undefined),
    };
    const openChannel = {
      url: 'open-1',
      enter: jest.fn().mockResolvedValue(undefined),
      exit: jest.fn().mockResolvedValue(undefined),
      freeze: jest.fn().mockResolvedValue(undefined),
      unfreeze: jest.fn().mockResolvedValue(undefined),
    };
    const state = createState({
      groupChannel: {
        getChannel: jest.fn().mockResolvedValue(groupChannel),
      },
      openChannel: {
        getChannel: jest.fn().mockResolvedValue(openChannel),
      },
    });

    await expect(getGetGroupChannel(state)('group-1')).resolves.toBe(groupChannel);
    await expect(getGetOpenChannel(state)('open-1')).resolves.toBe(openChannel);
    await expect(getLeaveGroupChannel(state)('group-1')).resolves.toBeUndefined();
    await expect(getEnterOpenChannel(state)('open-1')).resolves.toBe(openChannel);
    await expect(getExitOpenChannel(state)('open-1')).resolves.toBe(openChannel);
    await expect(getFreezeChannel()(groupChannel as any)).resolves.toBeUndefined();
    await expect(getUnfreezeChannel()(openChannel as any)).resolves.toBeUndefined();

    expect(groupChannel.leave).toHaveBeenCalledTimes(1);
    expect(openChannel.enter).toHaveBeenCalledTimes(1);
    expect(openChannel.exit).toHaveBeenCalledTimes(1);
    expect(groupChannel.freeze).toHaveBeenCalledTimes(1);
    expect(openChannel.unfreeze).toHaveBeenCalledTimes(1);
  });

  it('bridges pending, failed, and succeeded message callbacks', () => {
    const handler = new UikitMessageHandler();
    const pending = jest.fn();
    const failed = jest.fn();
    const succeeded = jest.fn();
    const error = new Error('failed');
    const resendableMessage = { messageId: 1, isResendable: true } as any;
    const nonResendableMessage = { messageId: 2, isResendable: false } as any;

    expect(handler.onPending(pending)).toBe(handler);
    expect(handler.onFailed(failed)).toBe(handler);
    expect(handler.onSucceeded(succeeded)).toBe(handler);

    handler.triggerPending(resendableMessage);
    handler.triggerFailed(error, resendableMessage);
    handler.triggerFailed(error, nonResendableMessage);
    handler.triggerSucceeded(resendableMessage);

    expect(pending).toHaveBeenCalledWith(resendableMessage);
    expect(failed).toHaveBeenNthCalledWith(1, error, resendableMessage);
    expect(failed).toHaveBeenNthCalledWith(2, error, null);
    expect(succeeded).toHaveBeenCalledWith(resendableMessage);
  });

  it('publishes send user message lifecycle events', () => {
    const pubSub = createPubSub();
    const state = createState({}, pubSub);
    const { callbacks, request } = createRequest();
    const channel = { sendUserMessage: jest.fn(() => request) };
    const handler = getSendUserMessage(state, ['module' as any])(channel as any, { message: 'hello' } as any);
    const pending = jest.fn();
    const failed = jest.fn();
    const succeeded = jest.fn();
    const error = new Error('send failed');
    const message = { messageId: 10, isResendable: true };

    handler.onPending(pending).onFailed(failed).onSucceeded(succeeded);
    callbacks.pending(message);
    callbacks.failed(error, message);
    callbacks.succeeded(message);

    expect(channel.sendUserMessage).toHaveBeenCalledWith({ message: 'hello' });
    expect(pubSub.publish).toHaveBeenCalledWith(topics.SEND_MESSAGE_START, { message, channel, publishingModules: ['module'] });
    expect(pubSub.publish).toHaveBeenCalledWith(topics.SEND_MESSAGE_FAILED, { error, message, channel, publishingModules: ['module'] });
    expect(pubSub.publish).toHaveBeenCalledWith(topics.SEND_USER_MESSAGE, { message, channel, publishingModules: ['module'] });
    expect(pending).toHaveBeenCalledWith(message);
    expect(failed).toHaveBeenCalledWith(error, message);
    expect(succeeded).toHaveBeenCalledWith(message);
  });

  it('publishes send file message lifecycle events', () => {
    const pubSub = createPubSub();
    const state = createState({}, pubSub);
    const { callbacks, request } = createRequest();
    const channel = { sendFileMessage: jest.fn(() => request) };
    const handler = getSendFileMessage(state)(channel as any, { file: new File(['x'], 'x.txt') } as any);
    const failed = jest.fn();
    const fileMessage = { messageId: 20, isResendable: false };
    const error = new Error('file failed');

    handler.onFailed(failed);
    callbacks.pending(fileMessage);
    callbacks.failed(error, fileMessage);
    callbacks.succeeded(fileMessage);

    expect(pubSub.publish).toHaveBeenCalledWith(topics.SEND_MESSAGE_START, { message: fileMessage, channel, publishingModules: [] });
    expect(pubSub.publish).toHaveBeenCalledWith(topics.SEND_MESSAGE_FAILED, { error, message: fileMessage, channel, publishingModules: [] });
    expect(pubSub.publish).toHaveBeenCalledWith(topics.SEND_FILE_MESSAGE, { message: fileMessage, channel, publishingModules: [] });
    expect(failed).toHaveBeenCalledWith(error, null);
  });

  it('publishes update, delete, and resend message events', async () => {
    const pubSub = createPubSub();
    const state = createState({}, pubSub);
    const updatedMessage = { messageId: 1 };
    const deletedMessage = { messageId: 2 };
    const userMessage = { messageId: 3 };
    const fileMessage = { messageId: 4 };
    const channel = {
      updateUserMessage: jest.fn().mockResolvedValue(updatedMessage),
      deleteMessage: jest.fn().mockResolvedValue(undefined),
      resendUserMessage: jest.fn().mockResolvedValue(userMessage),
      resendFileMessage: jest.fn().mockResolvedValue(fileMessage),
    };

    await expect(getUpdateUserMessage(state, ['module' as any])(channel as any, 1, { message: 'updated' } as any)).resolves.toBe(updatedMessage);
    await expect(getDeleteMessage(state)(channel as any, deletedMessage as any)).resolves.toBe(deletedMessage);
    await expect(getResendUserMessage(state)(channel as any, userMessage as any)).resolves.toBe(userMessage);
    await expect(getResendFileMessage(state, ['module' as any])(channel as any, fileMessage as any, new Blob())).resolves.toBe(fileMessage);

    expect(pubSub.publish).toHaveBeenCalledWith(topics.UPDATE_USER_MESSAGE, {
      message: updatedMessage,
      channel,
      fromSelector: true,
      publishingModules: ['module'],
    });
    expect(pubSub.publish).toHaveBeenCalledWith(topics.DELETE_MESSAGE, { messageId: 2, channel });
    expect(pubSub.publish).toHaveBeenCalledWith(topics.SEND_USER_MESSAGE, { message: userMessage, channel, publishingModules: [] });
    expect(pubSub.publish).toHaveBeenCalledWith(topics.SEND_FILE_MESSAGE, { message: fileMessage, channel, publishingModules: ['module'] });
  });
});
