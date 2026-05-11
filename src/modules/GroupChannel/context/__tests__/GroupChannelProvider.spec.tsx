import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import { CollectionEventSource } from '@sendbird/chat';

import { GroupChannelManager } from '../GroupChannelProvider';
import useSendbird from '../../../../lib/Sendbird/context/hooks/useSendbird';
import { useGroupChannel } from '../hooks/useGroupChannel';
import { useMessageListScroll } from '../hooks/useMessageListScroll';
import { useStore } from '../../../../hooks/useStore';
import useDeepCompareEffect from '../../../../hooks/useDeepCompareEffect';
import { useGroupChannelMessages } from '@sendbird/uikit-tools';

jest.mock('@sendbird/uikit-tools', () => {
  const React = require('react');
  return {
    useAsyncEffect: (callback: Function, deps: unknown[]) => {
      React.useEffect(() => {
        let cleanup: Function | undefined;
        Promise.resolve(callback()).then((result) => {
          cleanup = typeof result === 'function' ? result : undefined;
        });
        return () => cleanup?.();
      }, deps);
    },
    useAsyncLayoutEffect: (callback: Function, deps: unknown[]) => {
      React.useLayoutEffect(() => {
        let cleanup: Function | undefined;
        Promise.resolve(callback()).then((result) => {
          cleanup = typeof result === 'function' ? result : undefined;
        });
        return () => cleanup?.();
      }, deps);
    },
    useIIFE: (callback: Function) => callback(),
    useGroupChannelMessages: jest.fn(),
  };
});
jest.mock('../../../../lib/UserProfileContext', () => ({
  UserProfileProvider: ({ children }: any) => <div data-testid="profile-provider">{children}</div>,
}));
jest.mock('../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('../hooks/useGroupChannel', () => ({
  useGroupChannel: jest.fn(),
}));
jest.mock('../hooks/useMessageListScroll', () => ({
  useMessageListScroll: jest.fn(),
}));
jest.mock('../../../../hooks/useStore', () => ({
  useStore: jest.fn(),
}));
jest.mock('../../../../hooks/useDeepCompareEffect', () => jest.fn());
jest.mock('../utils', () => ({
  isContextMenuClosed: jest.fn(() => true),
}));

const logger = {
  info: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
};
const markAsReadScheduler = { push: jest.fn() };
const pubSubSubscriptions = [{ remove: jest.fn() }, { remove: jest.fn() }];
const pubSub = {
  subscribe: jest.fn((_topic, _handler) => pubSubSubscriptions.shift() ?? { remove: jest.fn() }),
};
const updateState = jest.fn();

const createChannel = (overrides = {}) => ({
  url: 'channel-url',
  members: [],
  markAsUnread: jest.fn(),
  serialize: jest.fn(() => ({ url: 'channel-url' })),
  createMessageCollection: jest.fn((params) => ({ params })),
  ...overrides,
});

const createActions = () => ({
  scrollToBottom: jest.fn(),
  setNewMessageIds: jest.fn(),
  setCurrentChannel: jest.fn(),
  handleChannelError: jest.fn(),
  setReadStateChanged: jest.fn(),
  scrollToMessage: jest.fn(),
  setAnimatedMessageId: jest.fn(),
});

const setupMocks = ({
  enableMarkAsUnread = false,
  currentChannel = createChannel(),
  initialized = true,
  messages = [{ messageId: 1, serialize: () => ({ messageId: 1 }) }],
  autoscrollMessageOverflowToTop = false,
  getChannel,
} = {}) => {
  const actions = createActions();
  const getChannelMock = getChannel ?? jest.fn().mockResolvedValue(currentChannel);
  const sdk = {
    groupChannel: {
      getChannel: getChannelMock,
    },
  };
  pubSubSubscriptions.splice(0, pubSubSubscriptions.length, { remove: jest.fn() }, { remove: jest.fn() });

  (useSendbird as jest.Mock).mockReturnValue({
    state: {
      stores: {
        sdkStore: {
          sdk,
          initialized: true,
        },
      },
      config: {
        userId: 'user-id',
        logger,
        pubSub,
        markAsReadScheduler,
        autoscrollMessageOverflowToTop,
        groupChannel: {
          replyType: 'THREAD',
          threadReplySelectType: 'PARENT',
          enableMarkAsUnread,
        },
        groupChannelSettings: {
          enableMessageSearch: true,
        },
      },
    },
  });
  (useGroupChannel as jest.Mock).mockReturnValue({
    state: {
      currentChannel,
      initialized,
      messages,
      isScrollBottomReached: true,
    },
    actions,
  });
  (useMessageListScroll as jest.Mock).mockReturnValue({
    scrollRef: { current: null },
    scrollPubSub: { publish: jest.fn() },
    scrollDistanceFromBottomRef: { current: 0 },
    scrollPositionRef: { current: 0 },
  });
  (useStore as jest.Mock).mockReturnValue({ updateState });
  (useDeepCompareEffect as jest.Mock).mockImplementation((callback: Function) => {
    React.useEffect(() => {
      callback();
    });
  });
  (useGroupChannelMessages as jest.Mock).mockReturnValue({
    initialized,
    loading: false,
    messages,
  });

  return { actions, sdk, currentChannel };
};

describe('GroupChannelManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMocks();
  });

  it('fetches the channel, subscribes to sent message events, and publishes provider state', async () => {
    const onBackClick = jest.fn();
    const onMessageAnimated = jest.fn();
    const onBeforeSendUserMessage = jest.fn();
    const { actions, sdk, currentChannel } = setupMocks();

    render(
      <GroupChannelManager
        channelUrl="channel-url"
        startingPoint={123}
        animatedMessageId={456}
        onBackClick={onBackClick}
        onMessageAnimated={onMessageAnimated}
        onBeforeSendUserMessage={onBeforeSendUserMessage}
        isMessageGroupingEnabled={false}
        isMultipleFilesMessageEnabled
        showSearchIcon={false}
      >
        <div>child</div>
      </GroupChannelManager>,
    );

    expect(screen.getByText('child')).toBeInTheDocument();
    await waitFor(() => {
      expect(sdk.groupChannel.getChannel).toHaveBeenCalledWith('channel-url');
      expect(actions.setCurrentChannel).toHaveBeenCalledWith(currentChannel);
    });
    expect(pubSub.subscribe).toHaveBeenCalledTimes(2);
    expect(actions.scrollToBottom).toHaveBeenCalled();
    expect(actions.scrollToMessage).toHaveBeenCalledWith(123, 0, false, false);
    expect(actions.setAnimatedMessageId).toHaveBeenCalledWith(456);

    await waitFor(() => {
      expect(updateState).toHaveBeenCalledWith(expect.objectContaining({
        channelUrl: 'channel-url',
        currentChannel,
        isMessageGroupingEnabled: false,
        isMultipleFilesMessageEnabled: true,
        showSearchIcon: false,
        onBeforeSendUserMessage,
      }));
    });
  });

  it('clears the current channel when channelUrl becomes empty', async () => {
    const { actions, sdk } = setupMocks();
    const { rerender } = render(
      <GroupChannelManager channelUrl="channel-url">
        <div>child</div>
      </GroupChannelManager>,
    );

    await waitFor(() => {
      expect(sdk.groupChannel.getChannel).toHaveBeenCalledWith('channel-url');
    });

    jest.clearAllMocks();

    rerender(
      <GroupChannelManager channelUrl="">
        <div>child</div>
      </GroupChannelManager>,
    );

    await waitFor(() => {
      expect(actions.setCurrentChannel).toHaveBeenCalledWith(null);
    });
    expect(sdk.groupChannel.getChannel).not.toHaveBeenCalled();
  });

  it('ignores stale channel fetch results after channelUrl changes', async () => {
    const firstChannel = createChannel({ url: 'first-channel' });
    const secondChannel = createChannel({ url: 'second-channel' });
    let resolveFirst!: (channel: ReturnType<typeof createChannel>) => void;
    let resolveSecond!: (channel: ReturnType<typeof createChannel>) => void;
    const firstFetch = new Promise<ReturnType<typeof createChannel>>((resolve) => {
      resolveFirst = resolve;
    });
    const secondFetch = new Promise<ReturnType<typeof createChannel>>((resolve) => {
      resolveSecond = resolve;
    });
    const getChannel = jest.fn((url: string) => (url === 'first-channel' ? firstFetch : secondFetch));
    const { actions } = setupMocks({ currentChannel: firstChannel, getChannel });

    const { rerender } = render(
      <GroupChannelManager channelUrl="first-channel">
        <div>child</div>
      </GroupChannelManager>,
    );

    rerender(
      <GroupChannelManager channelUrl="second-channel">
        <div>child</div>
      </GroupChannelManager>,
    );

    await act(async () => {
      resolveSecond(secondChannel);
      await secondFetch;
    });

    await waitFor(() => {
      expect(actions.setCurrentChannel).toHaveBeenCalledWith(secondChannel);
    });

    await act(async () => {
      resolveFirst(firstChannel);
      await firstFetch;
    });

    expect(actions.setCurrentChannel).not.toHaveBeenCalledWith(firstChannel);
  });

  it('exercises message collection callbacks and collection creation', () => {
    const onBackClick = jest.fn();
    const { actions, currentChannel } = setupMocks();
    render(
      <GroupChannelManager channelUrl="channel-url" onBackClick={onBackClick}>
        <div>child</div>
      </GroupChannelManager>,
    );

    const options = (useGroupChannelMessages as jest.Mock).mock.calls[0][2];
    options.markAsRead([currentChannel]);
    expect(markAsReadScheduler.push).toHaveBeenCalledWith(currentChannel);

    act(() => {
      options.onMessagesReceived([
        { messageId: 1 },
        { messageId: 2 },
      ]);
    });
    return waitFor(() => {
      expect(actions.scrollToBottom).toHaveBeenCalledWith(true);
    }).then(() => {

      options.onChannelDeleted();
      options.onCurrentUserBanned();
      expect(actions.setCurrentChannel).toHaveBeenCalledWith(null);
      expect(onBackClick).toHaveBeenCalledTimes(2);

      options.onChannelUpdated(currentChannel, {
        source: CollectionEventSource.EVENT_CHANNEL_UNREAD,
        userIds: ['user-id'],
      });
      options.onChannelUpdated(currentChannel, {
        source: CollectionEventSource.EVENT_CHANNEL_READ,
        userIds: ['user-id'],
      });
      expect(actions.setReadStateChanged).toHaveBeenCalledWith('unread');
      expect(actions.setReadStateChanged).toHaveBeenCalledWith('read');
      expect(actions.setCurrentChannel).toHaveBeenCalledWith(currentChannel);

      const collection = options.collectionCreator({ customTypeFilter: 'custom' });
      expect(collection).toEqual({ params: expect.objectContaining({ prevResultLimit: 30, nextResultLimit: 30 }) });
      expect(currentChannel.createMessageCollection).toHaveBeenCalled();
    });
  });

  it('supports mark as unread branches and autoscroll overflow mode', async () => {
    const currentChannel = createChannel();
    const { actions } = setupMocks({
      enableMarkAsUnread: true,
      currentChannel,
      autoscrollMessageOverflowToTop: true,
    });
    render(
      <GroupChannelManager channelUrl="channel-url" autoscrollMessageOverflowToTop>
        <div>child</div>
      </GroupChannelManager>,
    );

    await waitFor(() => expect(updateState).toHaveBeenCalled());
    const providerState = updateState.mock.calls.at(-1)[0];
    providerState.markAsUnread({ messageId: 10 }, 'manual');
    expect(currentChannel.markAsUnread).toHaveBeenCalledWith({ messageId: 10 });
    expect(logger.info).toHaveBeenCalledWith('GroupChannelProvider: markAsUnread called for message', {
      messageId: 10,
      source: 'manual',
    });
    expect(providerState.markAsUnreadSourceRef.current).toBe('manual');

    const options = (useGroupChannelMessages as jest.Mock).mock.calls.at(-1)[2];
    options.markAsRead([currentChannel]);
    expect(markAsReadScheduler.push).not.toHaveBeenCalled();
    options.onMessagesReceived([{ messageId: 1 }, { messageId: 2 }]);
    expect(actions.setNewMessageIds).toHaveBeenCalledWith([2]);
    actions.setNewMessageIds.mockClear();
    options.onMessagesReceived([
      { messageId: 3, messageType: 'admin', isAdminMessage: () => true },
      { messageId: 4, messageType: 'user', isAdminMessage: () => false },
    ]);
    expect(actions.setNewMessageIds).toHaveBeenCalledWith([4]);
    actions.setNewMessageIds.mockClear();
    options.onMessagesReceived([{ messageId: 5, messageType: 'admin', isAdminMessage: () => true }]);
    expect(actions.setNewMessageIds).not.toHaveBeenCalled();
  });

  it('handles channel fetch and mark-as-unread errors', async () => {
    const error = new Error('fetch failed');
    const actions = createActions();
    const sdk = {
      groupChannel: {
        getChannel: jest.fn().mockRejectedValue(error),
      },
    };
    (useSendbird as jest.Mock).mockReturnValue({
      state: {
        stores: {
          sdkStore: { sdk, initialized: true },
        },
        config: {
          userId: 'user-id',
          logger,
          pubSub,
          markAsReadScheduler,
          autoscrollMessageOverflowToTop: false,
          groupChannel: {
            replyType: 'NONE',
            threadReplySelectType: 'PARENT',
            enableMarkAsUnread: true,
          },
          groupChannelSettings: {
            enableMessageSearch: true,
          },
        },
      },
    });
    (useGroupChannel as jest.Mock).mockReturnValue({
      state: {
        currentChannel: null,
        initialized: false,
        messages: [],
        isScrollBottomReached: true,
      },
      actions,
    });

    render(
      <GroupChannelManager channelUrl="channel-url" replyType="NONE">
        <div>child</div>
      </GroupChannelManager>,
    );

    await waitFor(() => {
      expect(actions.handleChannelError).toHaveBeenCalledWith(error);
      expect(logger.error).toHaveBeenCalledWith('GroupChannelProvider: error when fetching channel', error);
    });
    const providerState = updateState.mock.calls.at(-1)[0];
    providerState.markAsUnread({ messageId: 12 });
    expect(logger.error).toHaveBeenCalledWith('GroupChannelProvider: channel is required for markAsUnread');
  });
});
