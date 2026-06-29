import { renderHook } from '@testing-library/react';
import useHandleThreadPubsubEvents from '../hooks/useHandleThreadPubsubEvents';
import { PUBSUB_TOPICS, SBUGlobalPubSub } from '../../../../lib/pubSub/topics';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { SendableMessageType } from '../../../../utils';

const mockThreadActions = {
  sendMessageStart: vi.fn(),
  sendMessageSuccess: vi.fn(),
  sendMessageFailure: vi.fn(),
  onFileInfoUpdated: vi.fn(),
  onMessageUpdated: vi.fn(),
  onMessageDeleted: vi.fn(),
};

vi.mock('../useThread', () => ({
  __esModule: true,
  default: () => ({
    actions: mockThreadActions,
  }),
}));

const mockLogger = {
  info: vi.fn(),
  warning: vi.fn(),
  error: vi.fn(),
};

const mockPubSub = {
  subscribe: vi.fn(),
  unsubscribe: vi.fn(),
} as unknown as SBUGlobalPubSub;

describe('useHandleThreadPubsubEvents', () => {
  const mockChannel = { url: 'channel-url' } as GroupChannel;
  const mockParentMessage = { messageId: 123 } as SendableMessageType;
  const mockMessage = {
    parentMessageId: 123,
    messageId: 456,
    isMultipleFilesMessage: () => false,
  } as SendableMessageType;

  const renderPubsubEventsHook = ({
    sdkInit = true,
    currentChannel = mockChannel,
    parentMessage = mockParentMessage,
  } = {}) => {
    return renderHook(() => useHandleThreadPubsubEvents(
      {
        sdkInit,
        currentChannel,
        parentMessage,
      },
      {
        logger: mockLogger,
        pubSub: mockPubSub,
      },
    ));
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should subscribe to pubsub events on mount', () => {
    renderPubsubEventsHook();

    expect(mockPubSub.subscribe).toHaveBeenCalledWith(
      PUBSUB_TOPICS.SEND_MESSAGE_START,
      expect.any(Function),
    );
    expect(mockPubSub.subscribe).toHaveBeenCalledWith(
      PUBSUB_TOPICS.ON_FILE_INFO_UPLOADED,
      expect.any(Function),
    );
    expect(mockPubSub.subscribe).toHaveBeenCalledWith(
      PUBSUB_TOPICS.SEND_USER_MESSAGE,
      expect.any(Function),
    );
    expect(mockPubSub.subscribe).toHaveBeenCalledWith(
      PUBSUB_TOPICS.SEND_MESSAGE_FAILED,
      expect.any(Function),
    );
    expect(mockPubSub.subscribe).toHaveBeenCalledWith(
      PUBSUB_TOPICS.SEND_FILE_MESSAGE,
      expect.any(Function),
    );
    expect(mockPubSub.subscribe).toHaveBeenCalledWith(
      PUBSUB_TOPICS.UPDATE_USER_MESSAGE,
      expect.any(Function),
    );
    expect(mockPubSub.subscribe).toHaveBeenCalledWith(
      PUBSUB_TOPICS.DELETE_MESSAGE,
      expect.any(Function),
    );
  });

  it('should unsubscribe from pubsub events on unmount', () => {
    const { unmount } = renderPubsubEventsHook();
    unmount();

    expect(mockPubSub.subscribe).toHaveBeenCalledTimes(7);
  });

  it('should handle SEND_MESSAGE_START event', () => {
    renderPubsubEventsHook();

    const handler = mockPubSub.subscribe.mock.calls.find(call => call[0] === PUBSUB_TOPICS.SEND_MESSAGE_START)[1];
    handler({ channel: mockChannel, message: mockMessage, publishingModules: [] });

    expect(mockThreadActions.sendMessageStart).toHaveBeenCalledWith(mockMessage);
  });

  it('should handle ON_FILE_INFO_UPLOADED event', () => {
    renderPubsubEventsHook();

    const handler = mockPubSub.subscribe.mock.calls.find(call => call[0] === PUBSUB_TOPICS.ON_FILE_INFO_UPLOADED)[1];
    handler({ response: { channelUrl: mockChannel.url }, publishingModules: [] });

    expect(mockThreadActions.onFileInfoUpdated).toHaveBeenCalled();
  });

  it('should handle SEND_USER_MESSAGE event', () => {
    renderPubsubEventsHook();

    const handler = mockPubSub.subscribe.mock.calls.find(call => call[0] === PUBSUB_TOPICS.SEND_USER_MESSAGE)[1];
    handler({ channel: mockChannel, message: mockMessage });

    expect(mockThreadActions.sendMessageSuccess).toHaveBeenCalledWith(mockMessage);
  });

  it('should handle SEND_MESSAGE_FAILED event', () => {
    renderPubsubEventsHook();

    const handler = mockPubSub.subscribe.mock.calls.find(call => call[0] === PUBSUB_TOPICS.SEND_MESSAGE_FAILED)[1];
    handler({ channel: mockChannel, message: mockMessage, publishingModules: [] });

    expect(mockThreadActions.sendMessageFailure).toHaveBeenCalledWith(mockMessage);
  });

  it('should handle SEND_FILE_MESSAGE event', () => {
    renderPubsubEventsHook();

    const handler = mockPubSub.subscribe.mock.calls.find(call => call[0] === PUBSUB_TOPICS.SEND_FILE_MESSAGE)[1];
    handler({ channel: mockChannel, message: mockMessage, publishingModules: [] });

    expect(mockThreadActions.sendMessageSuccess).toHaveBeenCalledWith(mockMessage);
  });

  it('should handle UPDATE_USER_MESSAGE event', () => {
    renderPubsubEventsHook();

    const handler = mockPubSub.subscribe.mock.calls.find(call => call[0] === PUBSUB_TOPICS.UPDATE_USER_MESSAGE)[1];
    handler({ channel: mockChannel, message: mockMessage });

    expect(mockThreadActions.onMessageUpdated).toHaveBeenCalledWith(mockChannel, mockMessage);
  });

  it('should handle DELETE_MESSAGE event', () => {
    renderPubsubEventsHook();

    const handler = mockPubSub.subscribe.mock.calls.find(call => call[0] === PUBSUB_TOPICS.DELETE_MESSAGE)[1];
    handler({ channel: mockChannel, messageId: mockMessage.messageId });

    expect(mockThreadActions.onMessageDeleted).toHaveBeenCalledWith(mockChannel, mockMessage.messageId);
  });
});
