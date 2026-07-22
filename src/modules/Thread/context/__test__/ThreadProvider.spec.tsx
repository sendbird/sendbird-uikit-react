import React from 'react';
import { waitFor, renderHook, act } from '@testing-library/react';
import { useGroupChannelThreadMessages } from '@sendbird/uikit-tools';
import { ThreadProvider, ThreadState } from '../ThreadProvider';
import useThread from '../useThread';
import { SendableMessageType } from '../../../../utils';
import useSendbird from '../../../../lib/Sendbird/context/hooks/useSendbird';
import { ChannelStateTypes, ParentMessageStateTypes, ThreadListStateTypes } from '../../types';
import { EmojiContainer } from '@sendbird/chat';
import { SendingStatus } from '@sendbird/chat/message';
import type { Mock } from 'vitest';

const { mockDs, makeDefaultDs } = vi.hoisted(() => {
  const mockDs = {
    sendUserMessage: vi.fn(),
    loadPrevious: vi.fn(),
    loadNext: vi.fn(),
    resetWithStartingPoint: vi.fn(),
  };
  const makeDefaultDs = () => ({
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
  });
  return { mockDs, makeDefaultDs };
});

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
    logger: { info: vi.fn(), warning: vi.fn(), error: vi.fn() },
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
  useGroupChannelThreadMessages: vi.fn(makeDefaultDs),
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
    threadMessages: [],
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
    // clearAllMocks only clears call history, not implementations, so restore the default
    // collection mock here — otherwise a test that overrides it (e.g. mockReturnValue) leaks
    // into later tests and makes the suite order-dependent.
    (useGroupChannelThreadMessages as Mock).mockImplementation(makeDefaultDs);
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

  it('initializeThreadFetcher resets a root thread (no anchor) at the latest edge (MAX_SAFE_INTEGER)', async () => {
    mockDs.resetWithStartingPoint.mockResolvedValue(undefined);
    const rootMessage = { messageId: 1, createdAt: 1000, parentMessage: null, parentMessageId: 0 } as unknown as SendableMessageType;
    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel" message={rootMessage}>{children}</ThreadProvider>
    );

    const { result } = renderHook(() => useThread(), { wrapper });
    await waitFor(() => {
      expect(result.current.state.currentChannel).not.toBe(undefined);
    });

    // Normal parent message: anchor (message) === parentMessage, so there is no separate anchor.
    const options = (useGroupChannelThreadMessages as Mock).mock.calls.at(-1)?.[3];
    await act(async () => {
      options.onParentMessageUpdated({ messageId: 1, createdAt: 1000 } as unknown as SendableMessageType);
    });

    await act(async () => {
      result.current.actions.initializeThreadFetcher();
    });

    // Must match the provider's initial open (MAX), not parentMessage.createdAt (which would hide the
    // latest replies behind hasMoreNext).
    expect(mockDs.resetWithStartingPoint).toHaveBeenCalledWith(Number.MAX_SAFE_INTEGER);
  });

  it('initializeThreadFetcher resets an anchored reply at the anchor message createdAt', async () => {
    mockDs.resetWithStartingPoint.mockResolvedValue(undefined);
    // Entering from a specific reply: message (anchor) differs from the parent.
    const anchorReply = { messageId: 2, createdAt: 5000, parentMessageId: 1 } as unknown as SendableMessageType;
    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel" message={anchorReply}>{children}</ThreadProvider>
    );

    const { result } = renderHook(() => useThread(), { wrapper });
    await waitFor(() => {
      expect(result.current.state.currentChannel).not.toBe(undefined);
    });

    const options = (useGroupChannelThreadMessages as Mock).mock.calls.at(-1)?.[3];
    await act(async () => {
      options.onParentMessageUpdated({ messageId: 1, createdAt: 1000 } as unknown as SendableMessageType);
    });

    await act(async () => {
      result.current.actions.initializeThreadFetcher();
    });

    expect(mockDs.resetWithStartingPoint).toHaveBeenCalledWith(5000);
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

  it('splits mirrored collection messages into allThreadMessages (succeeded) and localThreadMessages (pending/failed)', async () => {
    const parentMessageId = 500;
    const succeededMessage = {
      messageId: 501,
      parentMessageId,
      sendingStatus: SendingStatus.SUCCEEDED,
      serialize: () => ({ messageId: 501 }),
    } as unknown as SendableMessageType;
    const pendingMessage = {
      messageId: 502,
      parentMessageId,
      sendingStatus: SendingStatus.PENDING,
      serialize: () => ({ messageId: 502 }),
    } as unknown as SendableMessageType;
    const failedMessage = {
      messageId: 503,
      parentMessageId,
      sendingStatus: SendingStatus.FAILED,
      serialize: () => ({ messageId: 503 }),
    } as unknown as SendableMessageType;

    (useGroupChannelThreadMessages as Mock).mockReturnValue({
      ...makeDefaultDs(),
      initialized: true,
      messages: [succeededMessage, pendingMessage, failedMessage],
    });

    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel" message={initialMockMessage}>{children}</ThreadProvider>
    );

    const { result } = renderHook(() => useThread(), { wrapper });
    await waitFor(() => {
      expect(result.current.state.currentChannel).not.toBe(undefined);
    });

    // The mirror effect early-returns unless state.parentMessage is set. Set it via the
    // collection's onParentMessageUpdated option so the parent's messageId matches the
    // messages' parentMessageId.
    const options = (useGroupChannelThreadMessages as Mock).mock.calls.at(-1)?.[3];
    const parent = { messageId: parentMessageId, message: 'parent' } as unknown as SendableMessageType;

    await act(async () => {
      options.onParentMessageUpdated(parent);
    });

    await waitFor(() => {
      expect(result.current.state.allThreadMessages).toEqual([succeededMessage]);
    });
    expect(result.current.state.localThreadMessages).toEqual([pendingMessage, failedMessage]);
    expect(result.current.state.threadMessages).toEqual([succeededMessage, pendingMessage, failedMessage]);
  });

  it('reclassifies a reply from local to server when it transitions pending -> succeeded, without leaving a duplicate', async () => {
    const parentMessageId = 600;
    // Same messageId across the transition: the pending local echo becoming its succeeded server message.
    // serialize() embeds sendingStatus so messagesSyncKey changes and the mirror effect re-fires even
    // though the array length and messageId are unchanged (guards against the effect under-firing on an
    // in-place status flip — the class of bug behind CLNP-8740's "shows then disappears/duplicates").
    const pendingEcho = {
      messageId: 601,
      parentMessageId,
      sendingStatus: SendingStatus.PENDING,
      serialize: () => ({ messageId: 601, sendingStatus: SendingStatus.PENDING }),
    } as unknown as SendableMessageType;
    const succeededEcho = {
      messageId: 601,
      parentMessageId,
      sendingStatus: SendingStatus.SUCCEEDED,
      serialize: () => ({ messageId: 601, sendingStatus: SendingStatus.SUCCEEDED }),
    } as unknown as SendableMessageType;

    let dsMessages: SendableMessageType[] = [pendingEcho];
    (useGroupChannelThreadMessages as Mock).mockImplementation(() => ({
      ...makeDefaultDs(),
      initialized: true,
      messages: dsMessages,
    }));

    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel" message={initialMockMessage}>{children}</ThreadProvider>
    );
    const { result, rerender } = renderHook(() => useThread(), { wrapper });
    await waitFor(() => {
      expect(result.current.state.currentChannel).not.toBe(undefined);
    });

    const options = (useGroupChannelThreadMessages as Mock).mock.calls.at(-1)?.[3];
    const parent = { messageId: parentMessageId, message: 'parent' } as unknown as SendableMessageType;
    await act(async () => {
      options.onParentMessageUpdated(parent);
    });

    // While pending, the echo is a local (pending/failed) reply.
    await waitFor(() => {
      expect(result.current.state.localThreadMessages).toEqual([pendingEcho]);
    });
    expect(result.current.state.allThreadMessages).toEqual([]);
    expect(result.current.state.threadMessages).toHaveLength(1);

    // The echo succeeds. The collection replaces it in place; the mirror must move it to the server
    // list and leave localThreadMessages empty with no duplicate in threadMessages.
    dsMessages = [succeededEcho];
    rerender();

    await waitFor(() => {
      expect(result.current.state.allThreadMessages).toEqual([succeededEcho]);
    });
    expect(result.current.state.localThreadMessages).toEqual([]);
    expect(result.current.state.threadMessages).toHaveLength(1);
    expect(result.current.state.threadMessages).toEqual([succeededEcho]);
  });

  it('clears threadMessages, allThreadMessages and localThreadMessages together when the current user is banned', async () => {
    const parentMessageId = 700;
    const succeededMessage = {
      messageId: 701,
      parentMessageId,
      sendingStatus: SendingStatus.SUCCEEDED,
      serialize: () => ({ messageId: 701 }),
    } as unknown as SendableMessageType;
    const pendingMessage = {
      messageId: 702,
      parentMessageId,
      sendingStatus: SendingStatus.PENDING,
      serialize: () => ({ messageId: 702 }),
    } as unknown as SendableMessageType;

    (useGroupChannelThreadMessages as Mock).mockReturnValue({
      ...makeDefaultDs(),
      initialized: true,
      messages: [succeededMessage, pendingMessage],
    });

    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel" message={initialMockMessage}>{children}</ThreadProvider>
    );
    const { result } = renderHook(() => useThread(), { wrapper });
    await waitFor(() => {
      expect(result.current.state.currentChannel).not.toBe(undefined);
    });

    const options = (useGroupChannelThreadMessages as Mock).mock.calls.at(-1)?.[3];
    const parent = { messageId: parentMessageId, message: 'parent' } as unknown as SendableMessageType;
    await act(async () => {
      options.onParentMessageUpdated(parent);
    });
    await waitFor(() => {
      expect(result.current.state.threadMessages.length).toBe(2);
      expect(result.current.state.localThreadMessages.length).toBe(1);
    });

    // Banning the current user must clear all three arrays together (no stale legacy or new state).
    await act(async () => {
      result.current.actions.onUserBanned(mockChannel as never, { userId: 'test-user-id' } as never);
    });

    await waitFor(() => {
      expect(result.current.state.threadMessages).toEqual([]);
      expect(result.current.state.allThreadMessages).toEqual([]);
      expect(result.current.state.localThreadMessages).toEqual([]);
    });
  });

  it('clears the parent (and reply arrays) when the channel is deleted, so the composer disables', async () => {
    const parentMessageId = 750;
    const reply = {
      messageId: 751,
      parentMessageId,
      sendingStatus: SendingStatus.SUCCEEDED,
      serialize: () => ({ messageId: 751 }),
    } as unknown as SendableMessageType;

    (useGroupChannelThreadMessages as Mock).mockReturnValue({
      ...makeDefaultDs(),
      initialized: true,
      messages: [reply],
    });

    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel" message={initialMockMessage}>{children}</ThreadProvider>
    );
    const { result } = renderHook(() => useThread(), { wrapper });
    await waitFor(() => {
      expect(result.current.state.currentChannel).not.toBe(undefined);
    });

    const options = (useGroupChannelThreadMessages as Mock).mock.calls.at(-1)?.[3];
    const parent = { messageId: parentMessageId, message: 'parent' } as unknown as SendableMessageType;
    await act(async () => {
      options.onParentMessageUpdated(parent);
    });
    await waitFor(() => {
      expect(result.current.state.parentMessage).toBe(parent);
      expect(result.current.state.threadMessages).toHaveLength(1);
    });

    // Channel deleted: parent must be cleared too (ThreadMessageInput disables on parentMessage === null),
    // along with the channel and every reply array.
    await act(async () => {
      options.onChannelDeleted('test-channel');
    });

    await waitFor(() => {
      expect(result.current.state.parentMessage).toBe(null);
      expect(result.current.state.parentMessageState).toBe(ParentMessageStateTypes.NIL);
      expect(result.current.state.currentChannel).toBe(null);
    });
    expect(result.current.state.threadMessages).toEqual([]);
    expect(result.current.state.allThreadMessages).toEqual([]);
    expect(result.current.state.localThreadMessages).toEqual([]);
  });

  it('exposes the removed low-level action creators as safe no-op shims (backward compat)', async () => {
    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel" message={initialMockMessage}>{children}</ThreadProvider>
    );

    const { result } = renderHook(() => useThread(), { wrapper });

    await waitFor(() => {
      expect(result.current.state.currentChannel).not.toBe(undefined);
    });

    const { actions } = result.current;
    const msg = { messageId: 1 } as unknown as SendableMessageType;

    const backwardCompatCreators = [
      'sendMessageStart',
      'sendMessageSuccess',
      'sendMessageFailure',
      'resendMessageStart',
      'onMessageReceived',
      'onReactionUpdated',
      'onFileInfoUpdated',
      'onMessageUpdated',
      'onMessageDeleted',
      'onMessageDeletedByReqId',
      'initializeThreadListStart',
      'initializeThreadListSuccess',
      'initializeThreadListFailure',
      'getPrevMessagesStart',
      'getPrevMessagesSuccess',
      'getPrevMessagesFailure',
      'getNextMessagesStart',
      'getNextMessagesSuccess',
      'getNextMessagesFailure',
    ] as const;

    backwardCompatCreators.forEach((name) => {
      expect(typeof actions[name]).toBe('function');
    });

    // Calling them logs a deprecation warning and is otherwise a no-op (must not throw).
    expect(() => actions.sendMessageStart(msg)).not.toThrow();
    expect(() => actions.sendMessageSuccess(msg)).not.toThrow();
    expect(() => actions.sendMessageFailure(msg)).not.toThrow();
    expect(() => actions.resendMessageStart(msg)).not.toThrow();
    expect(() => actions.onMessageReceived(mockChannel as never, msg)).not.toThrow();
    expect(() => actions.onReactionUpdated({} as never)).not.toThrow();
    expect(() => actions.onFileInfoUpdated({} as never)).not.toThrow();
    expect(() => actions.onMessageUpdated(mockChannel as never, msg)).not.toThrow();
    expect(() => actions.onMessageDeleted(mockChannel as never, 1)).not.toThrow();
    expect(() => actions.onMessageDeletedByReqId('req-id')).not.toThrow();
    expect(() => actions.initializeThreadListStart()).not.toThrow();
    expect(() => actions.initializeThreadListSuccess({} as never, msg, [])).not.toThrow();
    expect(() => actions.initializeThreadListFailure()).not.toThrow();
    expect(() => actions.getPrevMessagesStart()).not.toThrow();
    expect(() => actions.getPrevMessagesSuccess([])).not.toThrow();
    expect(() => actions.getPrevMessagesFailure()).not.toThrow();
    expect(() => actions.getNextMessagesStart()).not.toThrow();
    expect(() => actions.getNextMessagesSuccess([])).not.toThrow();
    expect(() => actions.getNextMessagesFailure()).not.toThrow();

    // Each deprecated shim logs a warning (not a silent no-op).
    expect(mockState.config.logger.warning).toHaveBeenCalled();
  });

  it('binds the reply collection to the parent derived from the current message prop on thread switch', async () => {
    // Root messages: parentMessage === null && parentMessageId falsy number => getParentMessageFrom
    // returns the message itself, so the collection binds to messageId 1, then 2.
    const rootMessageA = { messageId: 1, parentMessage: null, parentMessageId: 0 } as unknown as SendableMessageType;
    const rootMessageB = { messageId: 2, parentMessage: null, parentMessageId: 0 } as unknown as SendableMessageType;

    // renderHook's initialProps are passed to the callback, not the wrapper, so drive the
    // switchable message prop through a closure the wrapper reads on every (re)render.
    let currentMessage: SendableMessageType = rootMessageA;
    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel" message={currentMessage}>{children}</ThreadProvider>
    );

    const { rerender } = renderHook(() => useThread(), { wrapper });

    await waitFor(() => {
      const parentArg = (useGroupChannelThreadMessages as Mock).mock.calls.at(-1)?.[2];
      expect(parentArg?.messageId).toBe(1);
    });

    // Switch to message B. <ThreadManager> is keyed by message.messageId, so it remounts.
    currentMessage = rootMessageB;
    rerender();

    await waitFor(() => {
      const parentArg = (useGroupChannelThreadMessages as Mock).mock.calls.at(-1)?.[2];
      expect(parentArg?.messageId).toBe(2);
    });
  });

  it('prefers the props-derived parent over a stale store parent on thread switch (3e6fb321)', async () => {
    const rootMessageA = { messageId: 1, parentMessage: null, parentMessageId: 0 } as unknown as SendableMessageType;
    const rootMessageB = { messageId: 2, parentMessage: null, parentMessageId: 0 } as unknown as SendableMessageType;

    let currentMessage: SendableMessageType = rootMessageA;
    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel" message={currentMessage}>{children}</ThreadProvider>
    );

    const { rerender } = renderHook(() => useThread(), { wrapper });

    await waitFor(() => {
      const parentArg = (useGroupChannelThreadMessages as Mock).mock.calls.at(-1)?.[2];
      expect(parentArg?.messageId).toBe(1);
    });

    // Populate the persistent store with a STALE parent (from the previous thread). The store
    // (InternalThreadProvider) survives the keyed ThreadManager remount, so this value lingers.
    const staleParent = { messageId: 999, message: 'stale parent' } as unknown as SendableMessageType;
    const options = (useGroupChannelThreadMessages as Mock).mock.calls.at(-1)?.[3];
    await act(async () => {
      options.onParentMessageUpdated(staleParent);
    });

    // Switch to message B. With props-first binding (propsParentMessage ?? parentMessage), the
    // collection must bind to B (messageId 2), NOT the stale store parent (messageId 999).
    currentMessage = rootMessageB;
    rerender();

    await waitFor(() => {
      const parentArg = (useGroupChannelThreadMessages as Mock).mock.calls.at(-1)?.[2];
      expect(parentArg?.messageId).toBe(2);
    });
    expect((useGroupChannelThreadMessages as Mock).mock.calls.at(-1)?.[2]?.messageId).not.toBe(999);
  });

});
