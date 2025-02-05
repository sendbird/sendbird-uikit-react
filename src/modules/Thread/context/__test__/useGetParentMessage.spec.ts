import { renderHook } from '@testing-library/react';
import { BaseMessage } from '@sendbird/chat/message';
import { ChannelType } from '@sendbird/chat';
import useGetParentMessage from '../hooks/useGetParentMessage';

jest.mock('../useThread', () => ({
  __esModule: true,
  default: () => ({
    actions: {
      getParentMessageStart: mockGetParentMessageStart,
      getParentMessageSuccess: mockGetParentMessageSuccess,
      getParentMessageFailure: mockGetParentMessageFailure,
    },
  }),
}));

const mockGetParentMessageStart = jest.fn();
const mockGetParentMessageSuccess = jest.fn();
const mockGetParentMessageFailure = jest.fn();
const mockLogger = {
  info: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
};

describe('useGetParentMessage', () => {
  const mockGetMessage = jest.fn();
  const mockParentMessage = {
    messageId: 12345,
    ogMetaData: { title: 'Test OG' },
  } as unknown as BaseMessage;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('doesnt call getParentMessage when sdkInit is false', () => {
    const sdk = {
      message: {
        getMessage: mockGetMessage,
      },
    };

    renderHook(() => useGetParentMessage(
      {
        channelUrl: 'test-channel-url',
        sdkInit: false,
        parentMessage: mockParentMessage,
      },
      {
        sdk,
        logger: mockLogger,
      },
    ));

    expect(mockGetParentMessageStart).not.toHaveBeenCalled();
    expect(mockGetMessage).not.toHaveBeenCalled();
  });

  it('doesnt call getParentMessage when sdk.message.getMessage is undefined', () => {
    const sdk = {
      message: {},
    };

    renderHook(() => useGetParentMessage(
      {
        channelUrl: 'test-channel-url',
        sdkInit: true,
        parentMessage: mockParentMessage,
      },
      {
        sdk,
        logger: mockLogger,
      },
    ));

    expect(mockGetParentMessageStart).not.toHaveBeenCalled();
    expect(mockGetMessage).not.toHaveBeenCalled();
  });

  it('doesnt call getParentMessage when parentMessage is null', () => {
    const sdk = {
      message: {
        getMessage: mockGetMessage,
      },
    };

    renderHook(() => useGetParentMessage(
      {
        channelUrl: 'test-channel-url',
        sdkInit: true,
        parentMessage: null,
      },
      {
        sdk,
        logger: mockLogger,
      },
    ));

    expect(mockGetParentMessageStart).not.toHaveBeenCalled();
    expect(mockGetMessage).not.toHaveBeenCalled();
  });

  it('gets parent message successfully', async () => {
    const receivedParentMsg = { ...mockParentMessage, ogMetaData: null };
    mockGetMessage.mockResolvedValueOnce(receivedParentMsg);

    const sdk = {
      message: {
        getMessage: mockGetMessage,
      },
    };

    renderHook(() => useGetParentMessage(
      {
        channelUrl: 'test-channel-url',
        sdkInit: true,
        parentMessage: mockParentMessage,
      },
      {
        sdk,
        logger: mockLogger,
      },
    ));

    await new Promise(process.nextTick);

    expect(mockGetParentMessageStart).toHaveBeenCalled();
    expect(mockGetMessage).toHaveBeenCalledWith({
      channelUrl: 'test-channel-url',
      channelType: ChannelType.GROUP,
      messageId: mockParentMessage.messageId,
      includeMetaArray: true,
      includeReactions: true,
      includeThreadInfo: true,
      includeParentMessageInfo: true,
    });
    expect(mockGetParentMessageSuccess).toHaveBeenCalledWith({
      ...receivedParentMsg,
      ogMetaData: mockParentMessage.ogMetaData,
    });
    expect(mockLogger.info).toHaveBeenCalledWith(
      'Thread | useGetParentMessage: Get parent message succeeded.',
      mockParentMessage,
    );
  });

  it('handles error when getting parent message fails', async () => {
    const mockError = new Error('Failed to get parent message');
    mockGetMessage.mockRejectedValueOnce(mockError);

    const sdk = {
      message: {
        getMessage: mockGetMessage,
      },
    };

    renderHook(() => useGetParentMessage(
      {
        channelUrl: 'test-channel-url',
        sdkInit: true,
        parentMessage: mockParentMessage,
      },
      {
        sdk,
        logger: mockLogger,
      },
    ));

    await new Promise(process.nextTick);

    expect(mockGetParentMessageStart).toHaveBeenCalled();
    expect(mockGetMessage).toHaveBeenCalled();
    expect(mockGetParentMessageSuccess).not.toHaveBeenCalled();
    expect(mockGetParentMessageFailure).toHaveBeenCalled();
    expect(mockLogger.info).toHaveBeenCalledWith(
      'Thread | useGetParentMessage: Get parent message failed.',
      mockError,
    );
  });

  it('calls getParentMessage again when sdkInit or parentMessage.messageId changes', async () => {
    mockGetMessage.mockResolvedValue({ ...mockParentMessage, ogMetaData: null });

    const sdk = {
      message: {
        getMessage: mockGetMessage,
      },
    };

    const { rerender } = renderHook(
      ({ sdkInit, parentMessage }) => useGetParentMessage(
        {
          channelUrl: 'test-channel-url',
          sdkInit,
          parentMessage,
        },
        {
          sdk,
          logger: mockLogger,
        },
      ),
      {
        initialProps: { sdkInit: false, parentMessage: null },
      },
    );

    expect(mockGetMessage).not.toHaveBeenCalled();

    rerender({
      sdkInit: true,
      parentMessage: mockParentMessage,
    });

    await new Promise(process.nextTick);

    expect(mockGetMessage).toHaveBeenCalledTimes(1);
    expect(mockGetParentMessageSuccess).toHaveBeenCalled();
  });
});
