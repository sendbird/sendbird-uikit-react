import { renderHook } from '@testing-library/react';
import useScrollCallback from '../hooks/useScrollCallback';
import useMessageSearch from '../hooks/useMessageSearch';

jest.mock('../hooks/useMessageSearch', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('useScrollCallback', () => {
  const mockLogger = {
    warning: jest.fn(),
    info: jest.fn(),
  };

  const mockOnResultLoaded = jest.fn();
  const mockGetNextSearchedMessages = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useMessageSearch as jest.Mock).mockReturnValue({
      state: {
        currentMessageSearchQuery: null,
        hasMoreResult: false,
      },
      actions: {
        getNextSearchedMessages: mockGetNextSearchedMessages,
      },
    });
  });

  it('should log warning when there are no more results', () => {
    const { result } = renderHook(() => useScrollCallback(
      { onResultLoaded: mockOnResultLoaded },
      { logger: mockLogger as any },
    ),
    );

    const callback = jest.fn();
    result.current(callback);

    expect(mockLogger.warning).toHaveBeenCalledWith(
      'MessageSearch | useScrollCallback: no more searched results',
      false,
    );
  });

  it('should log warning when there is no currentMessageSearchQuery', () => {
    (useMessageSearch as jest.Mock).mockReturnValue({
      state: {
        currentMessageSearchQuery: null,
        hasMoreResult: true,
      },
      actions: {
        getNextSearchedMessages: mockGetNextSearchedMessages,
      },
    });

    const { result } = renderHook(() => useScrollCallback(
      { onResultLoaded: mockOnResultLoaded },
      { logger: mockLogger as any },
    ),
    );

    const callback = jest.fn();
    result.current(callback);

    expect(mockLogger.warning).toHaveBeenCalledWith(
      'MessageSearch | useScrollCallback: no currentMessageSearchQuery',
    );
  });

  it('should handle successful message search', async () => {
    const mockMessages = [{ messageId: 1 }, { messageId: 2 }];
    const mockNext = jest.fn().mockResolvedValue(mockMessages);

    (useMessageSearch as jest.Mock).mockReturnValue({
      state: {
        currentMessageSearchQuery: {
          hasNext: true,
          next: mockNext,
        },
        hasMoreResult: true,
      },
      actions: {
        getNextSearchedMessages: mockGetNextSearchedMessages,
      },
    });

    const { result } = renderHook(() => useScrollCallback(
      { onResultLoaded: mockOnResultLoaded },
      { logger: mockLogger as any },
    ),
    );

    const callback = jest.fn();
    await result.current(callback);

    expect(mockNext).toHaveBeenCalled();
    expect(mockLogger.info).toHaveBeenCalledWith(
      'MessageSearch | useScrollCallback: succeeded getting searched messages',
      mockMessages,
    );
    expect(mockGetNextSearchedMessages).toHaveBeenCalledWith(mockMessages);
    expect(callback).toHaveBeenCalledWith(mockMessages, null);
    expect(mockOnResultLoaded).toHaveBeenCalledWith(mockMessages, null);
  });

  it('should handle failed message search', async () => {
    const mockError = new Error('Search failed');
    const mockNext = jest.fn().mockRejectedValue(mockError);

    (useMessageSearch as jest.Mock).mockReturnValue({
      state: {
        currentMessageSearchQuery: {
          hasNext: true,
          next: mockNext,
        },
        hasMoreResult: true,
      },
      actions: {
        getNextSearchedMessages: mockGetNextSearchedMessages,
      },
    });

    const { result } = renderHook(() => useScrollCallback(
      { onResultLoaded: mockOnResultLoaded },
      { logger: mockLogger as any },
    ),
    );

    const callback = jest.fn();

    try {
      await result.current(callback);
    } catch (error) {
      // execute even if error occurs
    }

    // eslint-disable-next-line no-promise-executor-return
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(mockNext).toHaveBeenCalled();
    expect(mockLogger.warning).toHaveBeenCalledWith(
      'MessageSearch | useScrollCallback: failed getting searched messages',
      mockError,
    );
    expect(callback).toHaveBeenCalledWith(null, mockError);
    expect(mockOnResultLoaded).toHaveBeenCalledWith(null, mockError);
  });

  it('should not call onResultLoaded if not provided', async () => {
    const mockMessages = [{ messageId: 1 }];
    const mockNext = jest.fn().mockResolvedValue(mockMessages);

    (useMessageSearch as jest.Mock).mockReturnValue({
      state: {
        currentMessageSearchQuery: {
          hasNext: true,
          next: mockNext,
        },
        hasMoreResult: true,
      },
      actions: {
        getNextSearchedMessages: mockGetNextSearchedMessages,
      },
    });

    const { result } = renderHook(() => useScrollCallback(
      { onResultLoaded: undefined },
      { logger: mockLogger as any },
    ),
    );

    const callback = jest.fn();
    await result.current(callback);

    expect(mockNext).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith(mockMessages, null);
    expect(mockOnResultLoaded).not.toHaveBeenCalled();
  });

  it('should not proceed with search if query has no next', () => {
    (useMessageSearch as jest.Mock).mockReturnValue({
      state: {
        currentMessageSearchQuery: {
          hasNext: false,
        },
        hasMoreResult: true,
      },
      actions: {
        getNextSearchedMessages: mockGetNextSearchedMessages,
      },
    });

    const { result } = renderHook(() => useScrollCallback(
      { onResultLoaded: mockOnResultLoaded },
      { logger: mockLogger as any },
    ),
    );

    const callback = jest.fn();
    result.current(callback);

    expect(mockLogger.warning).toHaveBeenCalledWith(
      'MessageSearch | useScrollCallback: no currentMessageSearchQuery',
    );
  });
});
