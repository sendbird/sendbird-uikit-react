import { renderHook } from '@testing-library/react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import useGetChannel from '../hooks/useGetChannel';

jest.mock('../useThread', () => ({
  __esModule: true,
  default: () => ({
    actions: {
      getChannelStart: mockGetChannelStart,
      getChannelSuccess: mockGetChannelSuccess,
      getChannelFailure: mockGetChannelFailure,
    },
  }),
}));

const mockGetChannelStart = jest.fn();
const mockGetChannelSuccess = jest.fn();
const mockGetChannelFailure = jest.fn();
const mockLogger = {
  info: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
};

describe('useGetChannel', () => {
  const mockGroupChannel = {} as GroupChannel;
  const mockGetChannel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('doesnt call getChannel when sdkInit is false', () => {
    const sdk = {
      groupChannel: {
        getChannel: mockGetChannel,
      },
    };

    renderHook(() => useGetChannel(
      {
        channelUrl: 'test-channel-url',
        sdkInit: false,
        message: null,
      },
      {
        sdk,
        logger: mockLogger,
      },
    ));

    expect(mockGetChannelStart).not.toHaveBeenCalled();
    expect(mockGetChannel).not.toHaveBeenCalled();
  });

  it('doesnt call getChannel when channelUrl is empty', () => {
    const sdk = {
      groupChannel: {
        getChannel: mockGetChannel,
      },
    };

    renderHook(() => useGetChannel(
      {
        channelUrl: '',
        sdkInit: true,
        message: null,
      },
      {
        sdk,
        logger: mockLogger,
      },
    ));

    expect(mockGetChannelStart).not.toHaveBeenCalled();
    expect(mockGetChannel).not.toHaveBeenCalled();
  });

  it('doesnt call getChannel when sdk.groupChannel is undefined', () => {
    const sdk = {};

    renderHook(() => useGetChannel(
      {
        channelUrl: 'test-channel-url',
        sdkInit: true,
        message: null,
      },
      {
        sdk,
        logger: mockLogger,
      },
    ));

    expect(mockGetChannelStart).not.toHaveBeenCalled();
    expect(mockGetChannel).not.toHaveBeenCalled();
  });

  it('gets channel successfully', async () => {
    mockGetChannel.mockResolvedValueOnce(mockGroupChannel);
    const sdk = {
      groupChannel: {
        getChannel: mockGetChannel,
      },
    };

    renderHook(() => useGetChannel(
      {
        channelUrl: 'test-channel-url',
        sdkInit: true,
        message: null,
      },
      {
        sdk,
        logger: mockLogger,
      },
    ));

    await new Promise(process.nextTick);

    expect(mockGetChannelStart).toHaveBeenCalled();
    expect(mockGetChannel).toHaveBeenCalledWith('test-channel-url');
    expect(mockGetChannelSuccess).toHaveBeenCalledWith(mockGroupChannel);
    expect(mockGetChannelFailure).not.toHaveBeenCalled();
    expect(mockLogger.info).toHaveBeenCalledWith(
      'Thread | useInitialize: Get channel succeeded',
      mockGroupChannel,
    );
  });

  it('handles error when getting channel fails', async () => {
    const mockError = new Error('Failed to get channel');
    mockGetChannel.mockRejectedValueOnce(mockError);
    const sdk = {
      groupChannel: {
        getChannel: mockGetChannel,
      },
    };

    renderHook(() => useGetChannel(
      {
        channelUrl: 'test-channel-url',
        sdkInit: true,
        message: null,
      },
      {
        sdk,
        logger: mockLogger,
      },
    ));

    await new Promise(process.nextTick);

    expect(mockGetChannelStart).toHaveBeenCalled();
    expect(mockGetChannel).toHaveBeenCalledWith('test-channel-url');
    expect(mockGetChannelSuccess).not.toHaveBeenCalled();
    expect(mockGetChannelFailure).toHaveBeenCalled();
    expect(mockLogger.info).toHaveBeenCalledWith(
      'Thread | useInitialize: Get channel failed',
      mockError,
    );
  });

  it('calls getChannel again when message or sdkInit changes', async () => {
    mockGetChannel.mockResolvedValue(mockGroupChannel);
    const sdk = {
      groupChannel: {
        getChannel: mockGetChannel,
      },
    };

    const { rerender } = renderHook(
      ({ message, sdkInit }) => useGetChannel(
        {
          channelUrl: 'test-channel-url',
          sdkInit,
          message,
        },
        {
          sdk,
          logger: mockLogger,
        },
      ),
      {
        initialProps: { message: null, sdkInit: false },
      },
    );

    expect(mockGetChannel).not.toHaveBeenCalled();
    rerender({ message: null, sdkInit: true });

    await new Promise(process.nextTick);

    expect(mockGetChannel).toHaveBeenCalledTimes(1);
    expect(mockGetChannelSuccess).toHaveBeenCalledWith(mockGroupChannel);
  });
});
