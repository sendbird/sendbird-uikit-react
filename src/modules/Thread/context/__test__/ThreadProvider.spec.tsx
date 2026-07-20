import React from 'react';
import { waitFor, renderHook, act } from '@testing-library/react';
import { useGroupChannelThreadMessages } from '@sendbird/uikit-tools';
import { ThreadProvider, ThreadState } from '../ThreadProvider';
import useThread from '../useThread';
import { SendableMessageType } from '../../../../utils';
import useSendbird from '../../../../lib/Sendbird/context/hooks/useSendbird';
import { ChannelStateTypes, ParentMessageStateTypes, ThreadListStateTypes } from '../../types';
import { EmojiContainer } from '@sendbird/chat';
import type { Mock } from 'vitest';

const { mockDs } = vi.hoisted(() => ({
  mockDs: {
    sendUserMessage: vi.fn(),
    loadPrevious: vi.fn(),
    loadNext: vi.fn(),
    resetWithStartingPoint: vi.fn(),
  },
}));

const mockNewMessage = (message) => ({
  messageId: 42,
  message: message ?? 'new message',
});

const mockChannel = {
  url: 'test-channel',
  members: [{ userId: '1', nickname: 'user1' }],
  updateUserMessage: vi.fn().mockImplementation(async (message) => mockNewMessage(message)),
};

const mockGetChannel = vi.fn().mockResolvedValue(mockChannel);

const mockState = {
  stores: {
    sdkStore: {
      sdk: {
        groupChannel: {
          getChannel: mockGetChannel,
        },
      },
      initialized: true,
    },
    userStore: { user: { userId: 'test-user-id' } },
  },
  config: {
    logger: console,
    pubSub: {
      publish: vi.fn(),
    },
    groupChannel: {
      enableMention: true,
      enableReactions: true,
    },
  },
};
vi.mock('../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: vi.fn(() => ({ state: mockState })),
}));

vi.mock('@sendbird/uikit-tools', () => ({
  useGroupChannelThreadMessages: vi.fn(() => ({
    initialized: false,
    loading: false,
    refreshing: false,
    messages: [],
    newMessages: [],
    resetNewMessages: vi.fn(),
    refresh: vi.fn(),
    loadPrevious: mockDs.loadPrevious,
    loadNext: mockDs.loadNext,
    hasPrevious: vi.fn(() => false),
    hasNext: vi.fn(() => false),
    sendUserMessage: mockDs.sendUserMessage,
    sendFileMessage: vi.fn(),
    sendFileMessages: vi.fn(),
    sendMultipleFilesMessage: vi.fn(),
    updateUserMessage: vi.fn(),
    updateFileMessage: vi.fn(),
    resendMessage: vi.fn(),
    deleteMessage: vi.fn(),
    resetWithStartingPoint: mockDs.resetWithStartingPoint,
  })),
}));

describe('ThreadProvider', () => {
  const initialState: ThreadState = {
    channelUrl: 'test-channel-url',
    message: null,
    onHeaderActionClick: undefined,
    onMoveToParentMessage: undefined,
    onBeforeSendUserMessage: undefined,
    onBeforeSendFileMessage: undefined,
    onBeforeSendVoiceMessage: undefined,
    onBeforeSendMultipleFilesMessage: undefined,
    onBeforeDownloadFileMessage: undefined,
    isMultipleFilesMessageEnabled: undefined,
    filterEmojiCategoryIds: undefined,
    currentChannel: null,
    allThreadMessages: [],
    localThreadMessages: [],
    parentMessage: null,
    channelState: ChannelStateTypes.LOADING,
    parentMessageState: ParentMessageStateTypes.NIL,
    threadListState: ThreadListStateTypes.NIL,
    hasMorePrev: false,
    hasMoreNext: false,
    emojiContainer: {} as EmojiContainer,
    isMuted: false,
    isChannelFrozen: false,
    currentUserId: 'test-user-id',
    typingMembers: [],
    nicknamesMap: expect.any(Map),
  };

  const initialMockMessage = {
    messageId: 1,
  } as SendableMessageType;

  beforeEach(() => {
    vi.clearAllMocks();
    const stateContextValue = { state: mockState };
    (useSendbird as Mock).mockReturnValue(stateContextValue);
    renderHook(() => useSendbird());
  });

  it('provides the correct initial state', async () => {
    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel-url" message={null}>{children}</ThreadProvider>
    );

    const { result } = renderHook(() => useThread(), { wrapper });

    expect(result.current.state).toMatchObject(initialState);
  });

  it('provides correct actions through useThread hook', async () => {
    const wrapper = ({ children }) => (
      <ThreadProvider message={initialMockMessage} channelUrl="test-channel">{children}</ThreadProvider>
    );

    const { result } = renderHook(() => useThread(), { wrapper });

    await waitFor(() => {
      expect(result.current.actions).toHaveProperty('toggleReaction');
      expect(result.current.actions).toHaveProperty('sendMessage');
      expect(result.current.actions).toHaveProperty('sendFileMessage');
      expect(result.current.actions).toHaveProperty('sendVoiceMessage');
      expect(result.current.actions).toHaveProperty('sendMultipleFilesMessage');
      expect(result.current.actions).toHaveProperty('resendMessage');
      expect(result.current.actions).toHaveProperty('initializeThreadFetcher');
      expect(result.current.actions).toHaveProperty('fetchPrevThreads');
      expect(result.current.actions).toHaveProperty('fetchNextThreads');
      expect(result.current.actions).toHaveProperty('updateMessage');
      expect(result.current.actions).toHaveProperty('deleteMessage');
      expect(result.current.actions).toHaveProperty('setCurrentUserId');
      expect(result.current.actions).toHaveProperty('getChannelStart');
      expect(result.current.actions).toHaveProperty('getChannelSuccess');
      expect(result.current.actions).toHaveProperty('getChannelFailure');
      expect(result.current.actions).toHaveProperty('getParentMessageStart');
      expect(result.current.actions).toHaveProperty('getParentMessageSuccess');
      expect(result.current.actions).toHaveProperty('getParentMessageFailure');
      expect(result.current.actions).toHaveProperty('setEmojiContainer');
      expect(result.current.actions).toHaveProperty('onUserMuted');
      expect(result.current.actions).toHaveProperty('onUserUnmuted');
      expect(result.current.actions).toHaveProperty('onUserBanned');
      expect(result.current.actions).toHaveProperty('onUserUnbanned');
      expect(result.current.actions).toHaveProperty('onUserLeft');
      expect(result.current.actions).toHaveProperty('onChannelFrozen');
      expect(result.current.actions).toHaveProperty('onChannelUnfrozen');
      expect(result.current.actions).toHaveProperty('onOperatorUpdated');
      expect(result.current.actions).toHaveProperty('onTypingStatusUpdated');
    });
  });

  it('updates state when props change', async () => {
    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel" message={initialMockMessage} onHeaderActionClick={() => {}}>
        {children}
      </ThreadProvider>
    );

    const { result } = renderHook(() => useThread(), { wrapper });

    await waitFor(() => {
      expect(result.current.state.currentChannel).not.toBe(undefined);
    });

    result.current.actions.setCurrentUserId('new-user-id');

    await waitFor(() => {
      expect(result.current.state.currentUserId).toEqual('new-user-id');
    });
  });

  it('delegates sendMessage to the collection data source', async () => {
    mockDs.sendUserMessage.mockResolvedValue({ messageId: 42, message: 'Test Message' });
    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel" message={initialMockMessage}>
        {children}
      </ThreadProvider>
    );

    const { result } = renderHook(() => useThread(), { wrapper });

    await waitFor(() => {
      expect(result.current.state.currentChannel).not.toBe(undefined);
    });

    await act(async () => {
      result.current.actions.sendMessage({ message: 'Test Message' });
    });

    await waitFor(() => {
      expect(mockDs.sendUserMessage).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Test Message' }),
        expect.any(Function),
      );
    });
  });

  it('fetchPrevThreads delegates to the data source loadPrevious and fires the callback', async () => {
    mockDs.loadPrevious.mockResolvedValue(undefined);
    const callback = vi.fn();
    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel" message={initialMockMessage}>{children}</ThreadProvider>
    );

    const { result } = renderHook(() => useThread(), { wrapper });
    await waitFor(() => {
      expect(result.current.state.currentChannel).not.toBe(undefined);
    });

    await act(async () => {
      result.current.actions.fetchPrevThreads(callback);
    });

    expect(mockDs.loadPrevious).toHaveBeenCalled();
    await waitFor(() => {
      expect(callback).toHaveBeenCalled();
    });
  });

  it('fetchNextThreads delegates to the data source loadNext and fires the callback', async () => {
    mockDs.loadNext.mockResolvedValue(undefined);
    const callback = vi.fn();
    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel" message={initialMockMessage}>{children}</ThreadProvider>
    );

    const { result } = renderHook(() => useThread(), { wrapper });
    await waitFor(() => {
      expect(result.current.state.currentChannel).not.toBe(undefined);
    });

    await act(async () => {
      result.current.actions.fetchNextThreads(callback);
    });

    expect(mockDs.loadNext).toHaveBeenCalled();
    await waitFor(() => {
      expect(callback).toHaveBeenCalled();
    });
  });

  it('initializeThreadFetcher delegates to the data source resetWithStartingPoint', async () => {
    mockDs.resetWithStartingPoint.mockResolvedValue(undefined);
    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel" message={initialMockMessage}>{children}</ThreadProvider>
    );

    const { result } = renderHook(() => useThread(), { wrapper });
    await waitFor(() => {
      expect(result.current.state.currentChannel).not.toBe(undefined);
    });

    await act(async () => {
      result.current.actions.initializeThreadFetcher();
    });

    expect(mockDs.resetWithStartingPoint).toHaveBeenCalled();
  });

  it('onParentMessageUpdated option syncs the updated parent message into state', async () => {
    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel" message={initialMockMessage}>{children}</ThreadProvider>
    );

    const { result } = renderHook(() => useThread(), { wrapper });
    await waitFor(() => {
      expect(result.current.state.currentChannel).not.toBe(undefined);
    });

    const options = (useGroupChannelThreadMessages as Mock).mock.calls.at(-1)?.[3];
    const updatedParent = { messageId: 100, message: 'updated parent' } as unknown as SendableMessageType;

    await act(async () => {
      options.onParentMessageUpdated(updatedParent);
    });

    await waitFor(() => {
      expect(result.current.state.parentMessage).toBe(updatedParent);
    });
  });

});
