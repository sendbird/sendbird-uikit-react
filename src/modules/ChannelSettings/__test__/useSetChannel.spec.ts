import { renderHook, act } from '@testing-library/react';
import useChannelSettings from '../context/useChannelSettings';
import useSetChannel from '../context/hooks/useSetChannel';

jest.mock('../context/useChannelSettings');

const mockLogger = {
  warning: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
};

const mockSetChannel = jest.fn();
const mockSetInvalid = jest.fn();
const mockSetLoading = jest.fn();

const mockSdk = {
  groupChannel: {
    getChannel: jest.fn().mockResolvedValue({ name: 'Test Channel' }),
  },
};

beforeEach(() => {
  jest.clearAllMocks();
  useChannelSettings.mockReturnValue({
    actions: {
      setChannel: mockSetChannel,
      setInvalid: mockSetInvalid,
      setLoading: mockSetLoading,
    },
  });
});

describe('useSetChannel', () => {
  it('logs a warning and stops loading if channelUrl is missing', () => {
    const { unmount } = renderHook(() => useSetChannel({ channelUrl: '', sdk: mockSdk, logger: mockLogger, initialized: true }),
    );

    expect(mockLogger.warning).toHaveBeenCalledWith('ChannelSettings: channel url is required');
    expect(mockSetLoading).toHaveBeenCalledWith(false);

    unmount();
  });

  it('logs a warning if SDK is not initialized', () => {
    const { unmount } = renderHook(() => useSetChannel({ channelUrl: 'test-channel', sdk: null, logger: mockLogger, initialized: false }),
    );

    expect(mockLogger.warning).toHaveBeenCalledWith('ChannelSettings: SDK is not initialized');
    expect(mockSetLoading).toHaveBeenCalledWith(false);

    unmount();
  });

  it('fetches channel successfully and sets it', async () => {
    const { unmount } = renderHook(() => useSetChannel({ channelUrl: 'test-channel', sdk: mockSdk, logger: mockLogger, initialized: true }),
    );

    await act(async () => {
      expect(mockSdk.groupChannel.getChannel).toHaveBeenCalledWith('test-channel');
    });

    expect(mockSetChannel).toHaveBeenCalledWith({ name: 'Test Channel' });
    expect(mockLogger.info).toHaveBeenCalledWith(
      'ChannelSettings | useSetChannel: fetched group channel',
      { name: 'Test Channel' },
    );
    expect(mockSetLoading).toHaveBeenCalledWith(false);

    unmount();
  });

  it('logs an error if fetching the channel fails', async () => {
    mockSdk.groupChannel.getChannel.mockRejectedValue(new Error('Failed to fetch channel'));

    const { unmount } = renderHook(() => useSetChannel({ channelUrl: 'test-channel', sdk: mockSdk, logger: mockLogger, initialized: true }),
    );

    await act(async () => {});

    expect(mockLogger.error).toHaveBeenCalledWith(
      'ChannelSettings | useSetChannel: failed fetching channel',
      new Error('Failed to fetch channel'),
    );
    expect(mockSetInvalid).toHaveBeenCalledWith(true);
    expect(mockSetLoading).toHaveBeenCalledWith(false);

    unmount();
  });
});
