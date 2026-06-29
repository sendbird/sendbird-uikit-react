import { renderHook } from '@testing-library/react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import useGetSearchedMessages from '../hooks/useGetSearchedMessages';
import useMessageSearch from '../hooks/useMessageSearch';
import type { Mock } from 'vitest';

vi.mock('../hooks/useMessageSearch', () => ({
  __esModule: true,
  default: vi.fn(),
}));

describe('useGetSearchedMessages', () => {
  const mockLogger = {
    warning: vi.fn(),
    info: vi.fn(),
  };

  const mockStartMessageSearch = vi.fn();
  const mockGetSearchedMessages = vi.fn();
  const mockSetQueryInvalid = vi.fn();
  const mockStartGettingSearchedMessages = vi.fn();
  const mockOnResultLoaded = vi.fn();

  const mockSdk = {
    createMessageSearchQuery: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useMessageSearch as Mock).mockReturnValue({
      state: {
        retryCount: 0,
      },
      actions: {
        startMessageSearch: mockStartMessageSearch,
        getSearchedMessages: mockGetSearchedMessages,
        setQueryInvalid: mockSetQueryInvalid,
        startGettingSearchedMessages: mockStartGettingSearchedMessages,
      },
    });
  });

  it('should not proceed when requestString is empty', () => {
    renderHook(
      () => useGetSearchedMessages(
        {
          currentChannel: null,
          channelUrl: 'channel-url',
          requestString: '',
          onResultLoaded: mockOnResultLoaded,
        },
        {
          sdk: mockSdk as any,
          logger: mockLogger as any,
        },
      ),
    );

    expect(mockLogger.info).toHaveBeenCalledWith(
      'MessageSearch | useGetSearchedMessages: search string is empty',
    );
    expect(mockStartMessageSearch).toHaveBeenCalled();
  });

  it('should handle successful message search', async () => {
    const mockMessages = [{ messageId: 1 }];
    const mockQuery = {
      next: vi.fn().mockResolvedValue(mockMessages),
    };

    mockSdk.createMessageSearchQuery.mockReturnValue(mockQuery);

    const mockChannel = {
      url: 'channel-url',
      refresh: vi.fn().mockResolvedValue({
        invitedAt: 1234567890,
      }),
    };

    renderHook(
      () => useGetSearchedMessages(
        {
          currentChannel: mockChannel as unknown as GroupChannel,
          channelUrl: 'channel-url',
          requestString: 'search-term',
          onResultLoaded: mockOnResultLoaded,
        },
        {
          sdk: mockSdk as any,
          logger: mockLogger as any,
        },
      ),
    );

    // eslint-disable-next-line no-promise-executor-return
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(mockStartMessageSearch).toHaveBeenCalled();
    expect(mockChannel.refresh).toHaveBeenCalled();
    expect(mockSdk.createMessageSearchQuery).toHaveBeenCalled();
    expect(mockStartGettingSearchedMessages).toHaveBeenCalled();
    expect(mockGetSearchedMessages).toHaveBeenCalledWith(mockMessages, mockQuery);
    expect(mockOnResultLoaded).toHaveBeenCalledWith(mockMessages, undefined);
  });

  it('should handle channel refresh failure', async () => {
    const mockError = new Error('Channel refresh failed');
    const mockChannel = {
      url: 'channel-url',
      refresh: vi.fn().mockRejectedValue(mockError),
    };

    renderHook(
      () => useGetSearchedMessages(
        {
          currentChannel: mockChannel as unknown as GroupChannel,
          channelUrl: 'channel-url',
          requestString: 'search-term',
          onResultLoaded: mockOnResultLoaded,
        },
        {
          sdk: mockSdk as any,
          logger: mockLogger as any,
        },
      ),
    );

    // eslint-disable-next-line no-promise-executor-return
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(mockStartMessageSearch).toHaveBeenCalled();
    expect(mockChannel.refresh).toHaveBeenCalled();
    expect(mockLogger.warning).toHaveBeenCalledWith(
      'MessageSearch | useGetSearchedMessages: failed getting channel.',
      mockError,
    );
    expect(mockSetQueryInvalid).toHaveBeenCalled();
    expect(mockOnResultLoaded).toHaveBeenCalledWith(undefined, mockError);
  });

  it('should handle message search failure', async () => {
    const mockError = new Error('Search failed');
    const mockQuery = {
      next: vi.fn().mockRejectedValue(mockError),
    };

    mockSdk.createMessageSearchQuery.mockReturnValue(mockQuery);

    const mockChannel = {
      url: 'channel-url',
      refresh: vi.fn().mockResolvedValue({
        invitedAt: 1234567890,
      }),
    };

    renderHook(
      () => useGetSearchedMessages(
        {
          currentChannel: mockChannel as unknown as GroupChannel,
          channelUrl: 'channel-url',
          requestString: 'search-term',
          onResultLoaded: mockOnResultLoaded,
        },
        {
          sdk: mockSdk as any,
          logger: mockLogger as any,
        },
      ),
    );

    // eslint-disable-next-line no-promise-executor-return
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(mockStartMessageSearch).toHaveBeenCalled();
    expect(mockChannel.refresh).toHaveBeenCalled();
    expect(mockSdk.createMessageSearchQuery).toHaveBeenCalled();
    expect(mockStartGettingSearchedMessages).toHaveBeenCalled();
    expect(mockLogger.warning).toHaveBeenCalledWith(
      'MessageSearch | useGetSearchedMessages: failed getting search messages.',
      mockError,
    );
    expect(mockSetQueryInvalid).toHaveBeenCalled();
    expect(mockOnResultLoaded).toHaveBeenCalledWith(undefined, mockError);
  });

  it('should use custom messageSearchQuery params when provided', async () => {
    const mockMessages = [{ messageId: 1 }];
    const mockQuery = {
      next: vi.fn().mockResolvedValue(mockMessages),
    };

    mockSdk.createMessageSearchQuery.mockReturnValue(mockQuery);

    const mockChannel = {
      url: 'channel-url',
      refresh: vi.fn().mockResolvedValue({
        invitedAt: 1234567890,
      }),
    };

    const customSearchQuery = {
      limit: 20,
      reverse: true,
      exactMatch: false,
    };

    renderHook(
      () => useGetSearchedMessages(
        {
          currentChannel: mockChannel as unknown as GroupChannel,
          channelUrl: 'channel-url',
          requestString: 'search-term',
          messageSearchQuery: customSearchQuery,
          onResultLoaded: mockOnResultLoaded,
        },
        {
          sdk: mockSdk as any,
          logger: mockLogger as any,
        },
      ),
    );

    // eslint-disable-next-line no-promise-executor-return
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(mockSdk.createMessageSearchQuery).toHaveBeenCalledWith(
      expect.objectContaining(customSearchQuery),
    );
  });

  it('should not proceed when required dependencies are missing', () => {
    renderHook(
      () => useGetSearchedMessages(
        {
          currentChannel: null,
          channelUrl: 'channel-url',
          requestString: 'search-term',
          onResultLoaded: mockOnResultLoaded,
        },
        {
          sdk: null as any,
          logger: mockLogger as any,
        },
      ),
    );

    expect(mockStartMessageSearch).toHaveBeenCalled();
    expect(mockSdk.createMessageSearchQuery).not.toHaveBeenCalled();
  });

  it('should handle retry mechanism when retryCount changes', async () => {
    const mockMessages = [{ messageId: 1 }];
    const mockQuery = {
      next: vi.fn().mockResolvedValue(mockMessages),
    };

    mockSdk.createMessageSearchQuery.mockReturnValue(mockQuery);

    const mockChannel = {
      url: 'channel-url',
      refresh: vi.fn().mockResolvedValue({
        invitedAt: 1234567890,
      }),
    };

    const { rerender } = renderHook(
      () => useGetSearchedMessages(
        {
          currentChannel: mockChannel as unknown as GroupChannel,
          channelUrl: 'channel-url',
          requestString: 'search-term',
          onResultLoaded: mockOnResultLoaded,
        },
        {
          sdk: mockSdk as any,
          logger: mockLogger as any,
        },
      ),
    );

    // Simulate retry by changing retryCount
    (useMessageSearch as Mock).mockReturnValue({
      state: {
        retryCount: 1,
      },
      actions: {
        startMessageSearch: mockStartMessageSearch,
        getSearchedMessages: mockGetSearchedMessages,
        setQueryInvalid: mockSetQueryInvalid,
        startGettingSearchedMessages: mockStartGettingSearchedMessages,
      },
    });

    rerender();

    // eslint-disable-next-line no-promise-executor-return
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(mockStartMessageSearch).toHaveBeenCalledTimes(2);
    expect(mockChannel.refresh).toHaveBeenCalledTimes(2);
  });
});
