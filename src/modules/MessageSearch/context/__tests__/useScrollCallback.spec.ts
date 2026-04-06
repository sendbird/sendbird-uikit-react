import { renderHook, act } from '@testing-library/react';
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

  const originalNavigator = { ...navigator };

  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(global, 'navigator', {
      value: { ...originalNavigator, onLine: true },
      writable: true,
    });
    (useMessageSearch as jest.Mock).mockReturnValue({
      state: {
        currentMessageSearchQuery: null,
      },
      actions: {
        getNextSearchedMessages: mockGetNextSearchedMessages,
      },
    });
  });

  it('should log warning when offline', () => {
    Object.defineProperty(global, 'navigator', {
      value: { ...originalNavigator, onLine: false },
      writable: true,
    });

    const { result } = renderHook(() => useScrollCallback(
      { onResultLoaded: mockOnResultLoaded },
      { logger: mockLogger as any },
    ));

    const callback = jest.fn();
    result.current(callback);

    expect(mockLogger.warning).toHaveBeenCalledWith(
      'MessageSearch | useScrollCallback: offline, skip loading more results',
    );
  });

  it('should log warning when query is already loading', () => {
    (useMessageSearch as jest.Mock).mockReturnValue({
      state: {
        currentMessageSearchQuery: {
          hasNext: true,
          isLoading: true,
          next: jest.fn(),
        },
      },
      actions: {
        getNextSearchedMessages: mockGetNextSearchedMessages,
      },
    });

    const { result } = renderHook(() => useScrollCallback(
      { onResultLoaded: mockOnResultLoaded },
      { logger: mockLogger as any },
    ));

    const callback = jest.fn();
    result.current(callback);

    expect(mockLogger.warning).toHaveBeenCalledWith(
      'MessageSearch | useScrollCallback: query already in progress',
    );
  });

  it('should log warning when there is no currentMessageSearchQuery or no more results', () => {
    const { result } = renderHook(() => useScrollCallback(
      { onResultLoaded: mockOnResultLoaded },
      { logger: mockLogger as any },
    ));

    const callback = jest.fn();
    result.current(callback);

    expect(mockLogger.warning).toHaveBeenCalledWith(
      'MessageSearch | useScrollCallback: no currentMessageSearchQuery or no more results',
    );
  });

  it('should handle successful message search', async () => {
    const mockMessages = [{ messageId: 1 }, { messageId: 2 }];
    const mockNext = jest.fn().mockResolvedValue(mockMessages);

    (useMessageSearch as jest.Mock).mockReturnValue({
      state: {
        currentMessageSearchQuery: {
          hasNext: true,
          isLoading: false,
          next: mockNext,
        },
      },
      actions: {
        getNextSearchedMessages: mockGetNextSearchedMessages,
      },
    });

    const { result } = renderHook(() => useScrollCallback(
      { onResultLoaded: mockOnResultLoaded },
      { logger: mockLogger as any },
    ));

    const callback = jest.fn();
    await act(async () => {
      await result.current(callback);
    });

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
          isLoading: false,
          next: mockNext,
        },
      },
      actions: {
        getNextSearchedMessages: mockGetNextSearchedMessages,
      },
    });

    const { result } = renderHook(() => useScrollCallback(
      { onResultLoaded: mockOnResultLoaded },
      { logger: mockLogger as any },
    ));

    const callback = jest.fn();

    await act(async () => {
      try {
        await result.current(callback);
      } catch (error) {
        // expected
      }
    });

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
          isLoading: false,
          next: mockNext,
        },
      },
      actions: {
        getNextSearchedMessages: mockGetNextSearchedMessages,
      },
    });

    const { result } = renderHook(() => useScrollCallback(
      { onResultLoaded: undefined },
      { logger: mockLogger as any },
    ));

    const callback = jest.fn();
    await act(async () => {
      await result.current(callback);
    });

    expect(mockNext).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith(mockMessages, null);
    expect(mockOnResultLoaded).not.toHaveBeenCalled();
  });

  it('should not proceed with search if query has no next', () => {
    (useMessageSearch as jest.Mock).mockReturnValue({
      state: {
        currentMessageSearchQuery: {
          hasNext: false,
          isLoading: false,
        },
      },
      actions: {
        getNextSearchedMessages: mockGetNextSearchedMessages,
      },
    });

    const { result } = renderHook(() => useScrollCallback(
      { onResultLoaded: mockOnResultLoaded },
      { logger: mockLogger as any },
    ));

    const callback = jest.fn();
    result.current(callback);

    expect(mockLogger.warning).toHaveBeenCalledWith(
      'MessageSearch | useScrollCallback: no currentMessageSearchQuery or no more results',
    );
  });

  it('should use latest query via ref when callback is called', () => {
    const mockNext1 = jest.fn();
    const mockNext2 = jest.fn().mockResolvedValue([]);

    // Initial render with query1
    (useMessageSearch as jest.Mock).mockReturnValue({
      state: {
        currentMessageSearchQuery: {
          hasNext: true,
          isLoading: false,
          next: mockNext1,
        },
      },
      actions: {
        getNextSearchedMessages: mockGetNextSearchedMessages,
      },
    });

    const { result, rerender } = renderHook(() => useScrollCallback(
      { onResultLoaded: mockOnResultLoaded },
      { logger: mockLogger as any },
    ));

    // Update to query2
    (useMessageSearch as jest.Mock).mockReturnValue({
      state: {
        currentMessageSearchQuery: {
          hasNext: true,
          isLoading: false,
          next: mockNext2,
        },
      },
      actions: {
        getNextSearchedMessages: mockGetNextSearchedMessages,
      },
    });

    rerender();

    // Callback should use query2 (latest), not query1
    result.current(jest.fn());

    expect(mockNext1).not.toHaveBeenCalled();
    expect(mockNext2).toHaveBeenCalled();
  });
});
