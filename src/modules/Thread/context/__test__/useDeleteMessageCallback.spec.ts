import { renderHook } from '@testing-library/react-hooks';
import { GroupChannel } from '@sendbird/chat/groupChannel';

import useDeleteMessageCallback from '../hooks/useDeleteMessageCallback';
import { SendableMessageType } from '../../../../utils';

const mockLogger = {
  info: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
};
const mockOnMessageDeletedByReqId = jest.fn();
const mockOnMessageDeleted = jest.fn();
const mockDeleteMessage = jest.fn();

describe('useDeleteMessageCallback', () => {
  const mockChannel = {
    deleteMessage: mockDeleteMessage,
  } as unknown as GroupChannel;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('delete failed message from local', async () => {
    const { result } = renderHook(() => useDeleteMessageCallback(
      {
        currentChannel: mockChannel,
        onMessageDeletedByReqId: mockOnMessageDeletedByReqId,
        onMessageDeleted: mockOnMessageDeleted,
      },
      { logger: mockLogger },
    ),
    );

    const failedMessage = {
      messageId: 123,
      reqId: 'test-req-id',
      sendingStatus: 'failed',
    };

    await result.current(failedMessage as SendableMessageType);

    expect(mockOnMessageDeletedByReqId).toHaveBeenCalledWith('test-req-id');
    expect(mockDeleteMessage).toHaveBeenCalled();
  });

  it('delete pending message from local', async () => {
    const { result } = renderHook(() => useDeleteMessageCallback(
      {
        currentChannel: mockChannel,
        onMessageDeletedByReqId: mockOnMessageDeletedByReqId,
        onMessageDeleted: mockOnMessageDeleted,
      },
      { logger: mockLogger },
    ),
    );

    const pendingMessage = {
      messageId: 123,
      reqId: 'test-req-id',
      sendingStatus: 'pending',
    };

    await result.current(pendingMessage as SendableMessageType);

    expect(mockOnMessageDeletedByReqId).toHaveBeenCalledWith('test-req-id');
    expect(mockDeleteMessage).toHaveBeenCalled();
  });

  it('delete success message from remote', async () => {
    mockDeleteMessage.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useDeleteMessageCallback(
      {
        currentChannel: mockChannel,
        onMessageDeletedByReqId: mockOnMessageDeletedByReqId,
        onMessageDeleted: mockOnMessageDeleted,
      },
      { logger: mockLogger },
    ),
    );

    const successMessage = {
      messageId: 123,
      reqId: 'test-req-id',
      sendingStatus: 'succeeded',
    };

    await result.current(successMessage as SendableMessageType);

    expect(mockDeleteMessage).toHaveBeenCalledWith(successMessage);
    expect(mockOnMessageDeleted).toHaveBeenCalledWith(mockChannel, 123);
  });

  it('delete failed message from remote', async () => {
    const errorMessage = 'Failed to delete message';
    mockDeleteMessage.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useDeleteMessageCallback(
      {
        currentChannel: mockChannel,
        onMessageDeletedByReqId: mockOnMessageDeletedByReqId,
        onMessageDeleted: mockOnMessageDeleted,
      },
      { logger: mockLogger },
    ),
    );

    const message = {
      messageId: 123,
      reqId: 'test-req-id',
      sendingStatus: 'succeeded',
    };

    await expect(result.current(message as SendableMessageType)).rejects.toThrow(errorMessage);
    expect(mockLogger.warning).toHaveBeenCalled();
  });

  it('currentChannel is null', async () => {
    const { result } = renderHook(() => useDeleteMessageCallback(
      {
        currentChannel: null,
        onMessageDeletedByReqId: mockOnMessageDeletedByReqId,
        onMessageDeleted: mockOnMessageDeleted,
      },
      { logger: mockLogger },
    ),
    );

    const message = {
      messageId: 123,
      reqId: 'test-req-id',
      sendingStatus: 'succeeded',
    };

    await result.current(message as SendableMessageType);
    expect(mockDeleteMessage).not.toHaveBeenCalled();
  });
});
