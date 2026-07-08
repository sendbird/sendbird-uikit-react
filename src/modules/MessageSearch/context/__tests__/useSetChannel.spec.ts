import { renderHook } from '@testing-library/react';
import useSetChannel from '../hooks/useSetChannel';
import useMessageSearch from '../hooks/useMessageSearch';
import type { Mock } from 'vitest';

vi.mock('../hooks/useMessageSearch', () => ({
  __esModule: true,
  default: vi.fn(),
}));

describe('useSetChannel', () => {
  const mockLogger = {
    info: vi.fn(),
    warning: vi.fn(),
  };

  const mockSetCurrentChannel = vi.fn();
  const mockSetChannelInvalid = vi.fn();

  const mockSdk = {
    groupChannel: {
      getChannel: vi.fn(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useMessageSearch as Mock).mockReturnValue({
      actions: {
        setCurrentChannel: mockSetCurrentChannel,
        setChannelInvalid: mockSetChannelInvalid,
      },
    });
  });

  it('should set current channel when channelUrl and sdkInit are valid', async () => {
    const mockChannel = { url: 'test-channel' };
    mockSdk.groupChannel.getChannel.mockResolvedValue(mockChannel);

    renderHook(() => useSetChannel(
      { channelUrl: 'test-channel', sdkInit: true },
      { sdk: mockSdk as any, logger: mockLogger as any },
    ));

    // eslint-disable-next-line no-promise-executor-return
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(mockSdk.groupChannel.getChannel).toHaveBeenCalledWith('test-channel');
    expect(mockLogger.info).toHaveBeenCalledWith(
      'MessageSearch | useSetChannel group channel',
      mockChannel,
    );
    expect(mockSetCurrentChannel).toHaveBeenCalledWith(mockChannel);
  });

  it('should set channel invalid when getChannel fails', async () => {
    const mockError = new Error('Failed to get channel');
    mockSdk.groupChannel.getChannel.mockRejectedValue(mockError);

    renderHook(() => useSetChannel(
      { channelUrl: 'test-channel', sdkInit: true },
      { sdk: mockSdk as any, logger: mockLogger as any },
    ));

    // eslint-disable-next-line no-promise-executor-return
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(mockSdk.groupChannel.getChannel).toHaveBeenCalledWith('test-channel');
    expect(mockSetChannelInvalid).toHaveBeenCalled();
  });

  it('should not attempt to get channel if sdkInit is false', () => {
    renderHook(() => useSetChannel(
      { channelUrl: 'test-channel', sdkInit: false },
      { sdk: mockSdk as any, logger: mockLogger as any },
    ));

    expect(mockSdk.groupChannel.getChannel).not.toHaveBeenCalled();
    expect(mockSetCurrentChannel).not.toHaveBeenCalled();
    expect(mockSetChannelInvalid).not.toHaveBeenCalled();
  });

  it('should not attempt to get channel if channelUrl is empty', () => {
    renderHook(() => useSetChannel(
      { channelUrl: '', sdkInit: true },
      { sdk: mockSdk as any, logger: mockLogger as any },
    ));

    expect(mockSdk.groupChannel.getChannel).not.toHaveBeenCalled();
    expect(mockSetCurrentChannel).not.toHaveBeenCalled();
    expect(mockSetChannelInvalid).not.toHaveBeenCalled();
  });

  it('should handle missing sdk gracefully', () => {
    renderHook(() => useSetChannel(
      { channelUrl: 'test-channel', sdkInit: true },
      { sdk: null as any, logger: mockLogger as any },
    ));

    expect(mockSdk.groupChannel.getChannel).not.toHaveBeenCalled();
    expect(mockSetCurrentChannel).not.toHaveBeenCalled();
    expect(mockSetChannelInvalid).not.toHaveBeenCalled();
  });
});
