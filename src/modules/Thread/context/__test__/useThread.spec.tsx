import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import useThread from '../useThread';
import { ThreadProvider } from '../ThreadProvider';
import { ChannelStateTypes, ParentMessageStateTypes, ThreadListStateTypes } from '../../types';
import type { SendableMessageType } from '../../../../utils';
import type { EmojiContainer } from '@sendbird/chat';

const mockApplyReactionEvent = vi.fn();

const mockChannel = {
  url: 'test-channel',
  members: [{ userId: '1', nickname: 'user1' }],
  updateUserMessage: vi.fn().mockImplementation(async () => mockNewMessage),
};

const mockNewMessage = {
  messageId: 42,
  message: 'new message',
};

const mockParentMessage = {
  messageId: 100,
  parentMessageId: 0,
  parentMessage: null,
  message: 'parent message',
  reqId: 100,
  applyReactionEvent: mockApplyReactionEvent,
} as unknown as SendableMessageType;

const mockGetChannel = vi.fn().mockResolvedValue(mockChannel);
const mockGetMessage = vi.fn().mockResolvedValue(mockParentMessage);
const mockPubSub = { publish: vi.fn(), subscribe: vi.fn() };

vi.mock('../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: vi.fn(() => ({
    state: {
      stores: {
        sdkStore: {
          sdk: {
            message: {
              getMessage: mockGetMessage,
            },
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
        pubSub: mockPubSub,
        groupChannel: {
          enableMention: true,
          enableReactions: true,
        },
      },
    },
  })),
}));

vi.mock('@sendbird/uikit-tools', () => ({
  useGroupChannelThreadMessages: vi.fn(() => ({
    initialized: true,
    loading: false,
    refreshing: false,
    messages: [],
    newMessages: [],
    resetNewMessages: vi.fn(),
    refresh: vi.fn(),
    loadPrevious: vi.fn().mockResolvedValue(undefined),
    loadNext: vi.fn().mockResolvedValue(undefined),
    hasPrevious: vi.fn(() => false),
    hasNext: vi.fn(() => false),
    sendUserMessage: vi.fn(),
    sendFileMessage: vi.fn(),
    sendFileMessages: vi.fn(),
    sendMultipleFilesMessage: vi.fn(),
    updateUserMessage: vi.fn(),
    updateFileMessage: vi.fn(),
    resendMessage: vi.fn(),
    deleteMessage: vi.fn(),
    resetWithStartingPoint: vi.fn().mockResolvedValue(undefined),
  })),
}));

describe('useThread', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('throws an error if used outside of ThreadProvider', () => {
    try {
      renderHook(() => useThread());
    } catch (error) {
      expect(error.message).toBe('useThread must be used within a ThreadProvider');
    }
  });

  it('handles setEmojiContainer action correctly', async () => {
    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel" message={mockParentMessage}>{children}</ThreadProvider>
    );

    const { result } = renderHook(() => useThread(), { wrapper });
    const { setEmojiContainer } = result.current.actions;

    const emojiContainer = {
      emojiHash: 'test-hash',
      emojiCategories: [{
        id: 'test-category-id',
        name: 'test-category',
        url: 'test-category-url',
        emojis: [],
      }],
    } as unknown as EmojiContainer;

    await act(() => {
      setEmojiContainer(emojiContainer);
    });

    await waitFor(() => {
      expect(result.current.state.emojiContainer).toBe(emojiContainer);
    });
  });

  it('handles onUserMuted action correctly', async () => {
    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel" message={mockParentMessage}>{children}</ThreadProvider>
    );

    let result;
    await act(async () => {
      result = renderHook(() => useThread(), { wrapper }).result;

      waitFor(() => {
        expect(result.current.state.currentChannel).not.toBe(undefined);
      });
    });
    const { onUserMuted } = result.current.actions;

    await act(() => {
      onUserMuted(mockChannel, { userId: 'other-user-id' });
      onUserMuted(mockChannel, { userId: 'test-user-id' });
    });

    await waitFor(() => {
      expect(result.current.state.isMuted).toBe(true);
    });
  });

  it('handles onUserUnmuted action correctly', async () => {
    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel" message={mockParentMessage}>{children}</ThreadProvider>
    );

    let result;
    await act(async () => {
      result = renderHook(() => useThread(), { wrapper }).result;

      waitFor(() => {
        expect(result.current.state.currentChannel).not.toBe(undefined);
      });
    });
    const { onUserUnmuted } = result.current.actions;

    await act(() => {
      onUserUnmuted(mockChannel, { userId: 'other-user-id' });
      onUserUnmuted(mockChannel, { userId: 'test-user-id' });
    });

    await waitFor(() => {
      expect(result.current.state.isMuted).toBe(false);
    });
  });

  it('handles onUserBanned action correctly when current user is banned', async () => {
    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel" message={mockParentMessage}>{children}</ThreadProvider>
    );

    let result;
    await act(async () => {
      result = renderHook(() => useThread(), { wrapper }).result;

      waitFor(() => {
        expect(result.current.state.currentChannel).not.toBe(undefined);
      });
    });
    const { onUserBanned } = result.current.actions;

    await act(() => {
      onUserBanned(mockChannel, { userId: 'test-user-id' });
    });

    await waitFor(() => {
      expect(result.current.state.channelState).toBe(ChannelStateTypes.NIL);
      expect(result.current.state.threadListState).toBe(ThreadListStateTypes.NIL);
      expect(result.current.state.parentMessageState).toBe(ParentMessageStateTypes.NIL);
    });
  });

  it('handles onUserBanned action correctly when another user is banned', async () => {
    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel" message={mockParentMessage}>{children}</ThreadProvider>
    );

    let result;
    await act(async () => {
      result = renderHook(() => useThread(), { wrapper }).result;

      waitFor(() => {
        expect(result.current.state.currentChannel).not.toBe(undefined);
      });
    });
    const { onUserBanned } = result.current.actions;

    // Channel object reflecting the ban: 'other-user-id' is no longer a member.
    const channelAfterBan = {
      url: 'test-channel',
      members: [{ userId: 'test-user-id', nickname: 'me' }],
    };

    await act(() => {
      onUserBanned(channelAfterBan, { userId: 'other-user-id' });
    });

    await waitFor(() => {
      // Thread state must not be reset when another user is banned.
      expect(result.current.state.channelState).not.toBe(ChannelStateTypes.NIL);
      expect(result.current.state.currentChannel).not.toBeNull();
      // currentChannel must be updated so the membership change is reflected.
      expect(result.current.state.currentChannel).toBe(channelAfterBan);
      expect(
        result.current.state.currentChannel.members.find((m: { userId: string }) => m.userId === 'other-user-id'),
      ).toBeUndefined();
      // nicknamesMap must be regenerated so downstream consumers (e.g. mention list) see the change.
      expect(result.current.state.nicknamesMap.get('other-user-id')).toBeUndefined();
      expect(result.current.state.nicknamesMap.get('test-user-id')).toBe('me');
    });
  });

  it('handles onUserUnbanned action correctly', async () => {
    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel" message={mockParentMessage}>{children}</ThreadProvider>
    );

    let result;
    await act(async () => {
      result = renderHook(() => useThread(), { wrapper }).result;

      waitFor(() => {
        expect(result.current.state.currentChannel).not.toBe(undefined);
      });
    });
    const { onUserUnbanned } = result.current.actions;

    await act(() => {
      onUserUnbanned();
    });
  });

  it('handles onUserLeft action correctly when current user has left', async () => {
    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel" message={mockParentMessage}>{children}</ThreadProvider>
    );

    let result;
    await act(async () => {
      result = renderHook(() => useThread(), { wrapper }).result;

      waitFor(() => {
        expect(result.current.state.currentChannel).not.toBe(undefined);
      });
    });
    const { onUserLeft } = result.current.actions;

    await act(() => {
      onUserLeft(mockChannel, { userId: 'test-user-id' });
    });

    await waitFor(() => {
      expect(result.current.state.channelState).toBe(ChannelStateTypes.NIL);
      expect(result.current.state.threadListState).toBe(ThreadListStateTypes.NIL);
      expect(result.current.state.parentMessageState).toBe(ParentMessageStateTypes.NIL);
    });
  });

  it('handles onUserLeft action correctly when another user has left', async () => {
    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel" message={mockParentMessage}>{children}</ThreadProvider>
    );

    let result;
    await act(async () => {
      result = renderHook(() => useThread(), { wrapper }).result;

      waitFor(() => {
        expect(result.current.state.currentChannel).not.toBe(undefined);
      });
    });
    const { onUserLeft } = result.current.actions;

    // Channel object reflecting the leave: 'other-user-id' is no longer a member.
    const channelAfterLeave = {
      url: 'test-channel',
      members: [{ userId: 'test-user-id', nickname: 'me' }],
    };

    await act(() => {
      onUserLeft(channelAfterLeave, { userId: 'other-user-id' });
    });

    await waitFor(() => {
      // Thread state must not be reset when another user leaves.
      expect(result.current.state.channelState).not.toBe(ChannelStateTypes.NIL);
      expect(result.current.state.currentChannel).not.toBeNull();
      // currentChannel must be updated so the membership change is reflected.
      expect(result.current.state.currentChannel).toBe(channelAfterLeave);
      expect(
        result.current.state.currentChannel.members.find((m: { userId: string }) => m.userId === 'other-user-id'),
      ).toBeUndefined();
      // nicknamesMap must be regenerated so downstream consumers (e.g. mention list) see the change.
      expect(result.current.state.nicknamesMap.get('other-user-id')).toBeUndefined();
      expect(result.current.state.nicknamesMap.get('test-user-id')).toBe('me');
    });
  });

  it('handles onChannelFrozen action correctly', async () => {
    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel" message={mockParentMessage}>{children}</ThreadProvider>
    );

    let result;
    await act(async () => {
      result = renderHook(() => useThread(), { wrapper }).result;

      waitFor(() => {
        expect(result.current.state.currentChannel).not.toBe(undefined);
      });
    });
    const { onChannelFrozen } = result.current.actions;

    await act(() => {
      onChannelFrozen();
    });

    await waitFor(() => {
      expect(result.current.state.isChannelFrozen).toBe(true);
    });
  });

  it('handles onChannelUnfrozen action correctly', async () => {
    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel" message={mockParentMessage}>{children}</ThreadProvider>
    );

    let result;
    await act(async () => {
      result = renderHook(() => useThread(), { wrapper }).result;

      waitFor(() => {
        expect(result.current.state.currentChannel).not.toBe(undefined);
      });
    });
    const { onChannelFrozen, onChannelUnfrozen } = result.current.actions;

    await act(() => {
      onChannelFrozen();
      onChannelUnfrozen();
    });

    await waitFor(() => {
      expect(result.current.state.isChannelFrozen).toBe(false);
    });
  });

  it('handles onOperatorUpdated action correctly', async () => {
    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel" message={mockParentMessage}>{children}</ThreadProvider>
    );

    let result;
    await act(async () => {
      result = renderHook(() => useThread(), { wrapper }).result;

      waitFor(() => {
        expect(result.current.state.currentChannel).not.toBe(undefined);
      });
    });
    const { onOperatorUpdated } = result.current.actions;

    const newMockChannel = {
      url: 'test-channel',
    };
    await act(() => {
      onOperatorUpdated(newMockChannel);
    });

    await waitFor(() => {
      expect(result.current.state.currentChannel).toBe(newMockChannel);
    });
  });

  it('handles onTypingStatusUpdated action correctly', async () => {
    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel" message={mockParentMessage}>{children}</ThreadProvider>
    );

    let result;
    await act(async () => {
      result = renderHook(() => useThread(), { wrapper }).result;

      waitFor(() => {
        expect(result.current.state.currentChannel).not.toBe(undefined);
      });
    });
    const { onTypingStatusUpdated } = result.current.actions;
    const mockMember = { userId: '1', nickname: 'user1' };

    await act(() => {
      onTypingStatusUpdated(mockChannel, [mockMember]);
    });

    await waitFor(() => {
      expect(result.current.state.typingMembers).toContain(mockMember);
    });
  });

});
