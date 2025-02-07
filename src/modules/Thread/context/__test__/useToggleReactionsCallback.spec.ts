import { renderHook } from '@testing-library/react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { BaseMessage } from '@sendbird/chat/message';
import useToggleReactionCallback from '../hooks/useToggleReactionsCallback';

const mockSetEmojiContainer = jest.fn();

jest.mock('../useThread', () => ({
  __esModule: true,
  default: () => ({
    actions: {
      setEmojiContainer: mockSetEmojiContainer,
    },
  }),
}));

const mockLogger = {
  info: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
};

describe('useToggleReactionCallback', () => {
  const mockMessage = {
    messageId: 12345,
  } as BaseMessage;
  const REACTION_KEY = 'thumbs_up';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not toggle reaction when currentChannel is null', () => {
    const { result } = renderHook(() => useToggleReactionCallback(
      {
        currentChannel: null,
      },
      {
        logger: mockLogger,
      },
    ));

    result.current(mockMessage, REACTION_KEY, true);
    expect(mockLogger.warning).not.toHaveBeenCalled();
  });

  it('should delete reaction when isReacted is true', async () => {
    const mockDeleteReaction = jest.fn().mockResolvedValue({ success: true });
    const mockChannel = {
      deleteReaction: mockDeleteReaction,
    } as unknown as GroupChannel;

    const { result } = renderHook(() => useToggleReactionCallback(
      {
        currentChannel: mockChannel,
      },
      {
        logger: mockLogger,
      },
    ));

    await result.current(mockMessage, REACTION_KEY, true);

    expect(mockDeleteReaction).toHaveBeenCalledWith(mockMessage, REACTION_KEY);
    expect(mockLogger.info).toHaveBeenCalledWith(
      'Thread | useToggleReactionsCallback: Delete reaction succeeded.',
      { success: true },
    );
  });

  it('should handle delete reaction failure', async () => {
    const mockError = new Error('Failed to delete reaction');
    const mockDeleteReaction = jest.fn().mockRejectedValue(mockError);
    const mockChannel = {
      deleteReaction: mockDeleteReaction,
    } as unknown as GroupChannel;

    const { result } = renderHook(() => useToggleReactionCallback(
      {
        currentChannel: mockChannel,
      },
      {
        logger: mockLogger,
      },
    ));

    result.current(mockMessage, REACTION_KEY, true);

    await new Promise(process.nextTick);

    expect(mockDeleteReaction).toHaveBeenCalledWith(mockMessage, REACTION_KEY);
    expect(mockLogger.warning).toHaveBeenCalledWith(
      'Thread | useToggleReactionsCallback: Delete reaction failed.',
      mockError,
    );
  });

  it('should add reaction when isReacted is false', async () => {
    const mockAddReaction = jest.fn().mockResolvedValue({ success: true });
    const mockChannel = {
      addReaction: mockAddReaction,
    } as unknown as GroupChannel;

    const { result } = renderHook(() => useToggleReactionCallback(
      {
        currentChannel: mockChannel,
      },
      {
        logger: mockLogger,
      },
    ));

    await result.current(mockMessage, REACTION_KEY, false);

    expect(mockAddReaction).toHaveBeenCalledWith(mockMessage, REACTION_KEY);
    expect(mockLogger.info).toHaveBeenCalledWith(
      'Thread | useToggleReactionsCallback: Add reaction succeeded.',
      { success: true },
    );
  });

  it('should handle add reaction failure', async () => {
    const mockError = new Error('Failed to add reaction');
    const mockAddReaction = jest.fn().mockRejectedValue(mockError);
    const mockChannel = {
      addReaction: mockAddReaction,
    } as unknown as GroupChannel;

    const { result } = renderHook(() => useToggleReactionCallback(
      {
        currentChannel: mockChannel,
      },
      {
        logger: mockLogger,
      },
    ));

    result.current(mockMessage, REACTION_KEY, false);

    await new Promise(process.nextTick);

    expect(mockAddReaction).toHaveBeenCalledWith(mockMessage, REACTION_KEY);
    expect(mockLogger.warning).toHaveBeenCalledWith(
      'Thread | useToggleReactionsCallback: Add reaction failed.',
      mockError,
    );
  });
});
