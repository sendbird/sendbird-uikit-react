import { act, renderHook, waitFor } from '@testing-library/react';

import * as messageActionTypes from '../../dux/actionTypes';
import useGetChannel from '../useGetChannel';

const logger = {
  info: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
};

describe('useGetChannel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setup = ({
    channelUrl = 'channel-url',
    disableMarkAsRead = false,
  } = {}) => {
    const channel = { url: 'channel-url' };
    const emojiContainer = { emojiHash: 'emoji-container' };
    const messagesDispatcher = jest.fn();
    const markAsReadScheduler = { push: jest.fn() };
    const sdk = {
      groupChannel: {
        getChannel: jest.fn().mockResolvedValue(channel),
      },
      getAllEmoji: jest.fn().mockResolvedValue(emojiContainer),
    };

    renderHook(() => useGetChannel(
      { channelUrl, sdkInit: true, disableMarkAsRead },
      {
        messagesDispatcher,
        sdk: sdk as any,
        logger,
        markAsReadScheduler: markAsReadScheduler as any,
      },
    ));

    return {
      channel,
      emojiContainer,
      markAsReadScheduler,
      messagesDispatcher,
      sdk,
    };
  };

  it('fetches the channel, dispatches emoji data, and marks the channel as read by default', async () => {
    const {
      channel,
      emojiContainer,
      markAsReadScheduler,
      messagesDispatcher,
      sdk,
    } = setup();

    await waitFor(() => {
      expect(messagesDispatcher).toHaveBeenCalledWith({
        type: messageActionTypes.SET_CURRENT_CHANNEL,
        payload: channel,
      });
    });

    expect(sdk.groupChannel.getChannel).toHaveBeenCalledWith('channel-url');
    expect(messagesDispatcher).toHaveBeenCalledWith({
      type: messageActionTypes.SET_EMOJI_CONTAINER,
      payload: emojiContainer,
    });
    expect(markAsReadScheduler.push).toHaveBeenCalledWith(channel);
  });

  it('does not schedule markAsRead when disableMarkAsRead is true', async () => {
    const {
      channel,
      markAsReadScheduler,
      messagesDispatcher,
    } = setup({ disableMarkAsRead: true });

    await waitFor(() => {
      expect(messagesDispatcher).toHaveBeenCalledWith({
        type: messageActionTypes.SET_CURRENT_CHANNEL,
        payload: channel,
      });
    });

    expect(markAsReadScheduler.push).not.toHaveBeenCalled();
  });

  it('clears the current channel and messages when channelUrl is empty', () => {
    const {
      markAsReadScheduler,
      messagesDispatcher,
      sdk,
    } = setup({ channelUrl: '' });

    expect(sdk.groupChannel.getChannel).not.toHaveBeenCalled();
    expect(messagesDispatcher).toHaveBeenCalledWith({
      type: messageActionTypes.SET_CURRENT_CHANNEL,
      payload: null,
    });
    expect(messagesDispatcher).toHaveBeenCalledWith({
      type: messageActionTypes.RESET_MESSAGES,
      payload: null,
    });
    expect(markAsReadScheduler.push).not.toHaveBeenCalled();
  });

  it('ignores stale channel fetch results after channelUrl changes', async () => {
    const firstChannel = { url: 'first-channel' };
    const secondChannel = { url: 'second-channel' };
    let resolveFirst!: (channel: typeof firstChannel) => void;
    let resolveSecond!: (channel: typeof secondChannel) => void;
    const firstFetch = new Promise<typeof firstChannel>((resolve) => {
      resolveFirst = resolve;
    });
    const secondFetch = new Promise<typeof secondChannel>((resolve) => {
      resolveSecond = resolve;
    });
    const messagesDispatcher = jest.fn();
    const markAsReadScheduler = { push: jest.fn() };
    const sdk = {
      groupChannel: {
        getChannel: jest.fn((url: string) => (url === 'first-channel' ? firstFetch : secondFetch)),
      },
      getAllEmoji: jest.fn().mockResolvedValue({ emojiHash: 'emoji-container' }),
    };

    const { rerender } = renderHook(({ channelUrl }) => useGetChannel(
      { channelUrl, sdkInit: true, disableMarkAsRead: false },
      {
        messagesDispatcher,
        sdk: sdk as any,
        logger,
        markAsReadScheduler: markAsReadScheduler as any,
      },
    ), {
      initialProps: { channelUrl: 'first-channel' },
    });

    rerender({ channelUrl: 'second-channel' });

    await act(async () => {
      resolveSecond(secondChannel);
      await secondFetch;
    });

    await waitFor(() => {
      expect(messagesDispatcher).toHaveBeenCalledWith({
        type: messageActionTypes.SET_CURRENT_CHANNEL,
        payload: secondChannel,
      });
    });

    await act(async () => {
      resolveFirst(firstChannel);
      await firstFetch;
    });

    expect(messagesDispatcher).not.toHaveBeenCalledWith({
      type: messageActionTypes.SET_CURRENT_CHANNEL,
      payload: firstChannel,
    });
    expect(markAsReadScheduler.push).not.toHaveBeenCalledWith(firstChannel);
  });
});
