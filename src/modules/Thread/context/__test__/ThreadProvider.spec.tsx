import React from 'react';
import { act, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { ThreadProvider } from '../ThreadProvider';
import useThread from '../useThread';
import { SendableMessageType } from '../../../../utils';
import { useSendbird } from '../../../../lib/Sendbird/context/hooks/useSendbird';

const mockChannel = {
  url: 'test-channel',
  members: [{ userId: '1', nickname: 'user1' }],
  updateUserMessage: jest.fn().mockImplementation(async () => mockNewMessage),
};

const mockNewMessage = {
  messageId: 42,
  message: 'new message',
};

const mockGetChannel = jest.fn().mockResolvedValue(mockChannel);

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
      publish: jest.fn(),
    },
    groupChannel: {
      enableMention: true,
      enableReactions: true,
    },
  },
};
jest.mock('../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  useSendbird: jest.fn(() => ({ state: mockState })),
}));

describe('ThreadProvider', () => {
  const initialMockMessage = {
    messageId: 1,
  } as SendableMessageType;

  beforeEach(() => {
    const stateContextValue = { state: mockState };
    useSendbird.mockReturnValue(stateContextValue);
    renderHook(() => useSendbird());
  });

  it('provides the correct initial state', async () => {
    const wrapper = ({ children }) => (
      <ThreadProvider message={initialMockMessage} channelUrl="test-channel">{children}</ThreadProvider>
    );

    await act(async () => {
      const { result } = renderHook(() => useThread(), { wrapper });
      await waitFor(() => {
        expect(result.current.state.message).toBe(initialMockMessage);
      });
    });

  });

  it('provides correct actions through useThread hook', async () => {
    const wrapper = ({ children }) => (
      <ThreadProvider message={initialMockMessage} channelUrl="test-channel">{children}</ThreadProvider>
    );

    await act(async () => {
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
        expect(result.current.actions).toHaveProperty('onMessageReceived');
        expect(result.current.actions).toHaveProperty('onMessageUpdated');
        expect(result.current.actions).toHaveProperty('onMessageDeleted');
        expect(result.current.actions).toHaveProperty('onMessageDeletedByReqId');
        expect(result.current.actions).toHaveProperty('onReactionUpdated');
        expect(result.current.actions).toHaveProperty('onUserMuted');
        expect(result.current.actions).toHaveProperty('onUserUnmuted');
        expect(result.current.actions).toHaveProperty('onUserBanned');
        expect(result.current.actions).toHaveProperty('onUserUnbanned');
        expect(result.current.actions).toHaveProperty('onUserLeft');
        expect(result.current.actions).toHaveProperty('onChannelFrozen');
        expect(result.current.actions).toHaveProperty('onChannelUnfrozen');
        expect(result.current.actions).toHaveProperty('onOperatorUpdated');
        expect(result.current.actions).toHaveProperty('onTypingStatusUpdated');
        expect(result.current.actions).toHaveProperty('sendMessageStart');
        expect(result.current.actions).toHaveProperty('sendMessageSuccess');
        expect(result.current.actions).toHaveProperty('sendMessageFailure');
        expect(result.current.actions).toHaveProperty('resendMessageStart');
        expect(result.current.actions).toHaveProperty('onFileInfoUpdated');
        expect(result.current.actions).toHaveProperty('initializeThreadListStart');
        expect(result.current.actions).toHaveProperty('initializeThreadListSuccess');
        expect(result.current.actions).toHaveProperty('initializeThreadListFailure');
        expect(result.current.actions).toHaveProperty('getPrevMessagesStart');
        expect(result.current.actions).toHaveProperty('getPrevMessagesSuccess');
        expect(result.current.actions).toHaveProperty('getPrevMessagesFailure');
        expect(result.current.actions).toHaveProperty('getNextMessagesStart');
        expect(result.current.actions).toHaveProperty('getNextMessagesSuccess');
        expect(result.current.actions).toHaveProperty('getNextMessagesFailure');
      });
    });

  });

  it('updates state when props change', async () => {
    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel" message={initialMockMessage} onHeaderActionClick={() => {}}>
        {children}
      </ThreadProvider>
    );

    await act(async () => {
      const { result } = renderHook(() => useThread(), { wrapper });

      await waitFor(() => {
        expect(result.current.state.currentChannel).not.toBe(undefined);
      });

      result.current.actions.setCurrentUserId('new-user-id');

      await waitFor(() => {
        expect(result.current.state.currentUserId).toEqual('new-user-id');
      });
    });
  });

  // it('calls sendMessage correctly', async () => {
  //   const wrapper = ({ children }) => (
  //     <ThreadProvider channelUrl="test-channel" message={{ messageId: 1 }}>
  //       {children}
  //     </ThreadProvider>
  //   );
  //
  //   const { result } = renderHook(() => useThreadContext(), { wrapper });
  //   const sendMessageMock = jest.fn();
  //
  //   result.current.sendMessage({ message: 'Test Message' });
  //
  //   expect(sendMessageMock).toHaveBeenCalledWith({ message: 'Test Message' });
  // });
  //
  // it('handles channel events correctly', () => {
  //   const wrapper = ({ children }) => (
  //     <ThreadProvider channelUrl="test-channel" message={{ messageId: 1 }}>
  //       {children}
  //     </ThreadProvider>
  //   );
  //
  //   render(<ThreadProvider channelUrl="test-channel" message={{ messageId: 1 }} />);
  //   // Add assertions for handling channel events
  // });
  //
  // it('updates state when nicknamesMap is updated', async () => {
  //   const wrapper = ({ children }) => (
  //     <ThreadProvider channelUrl="test-channel" message={{ messageId: 1 }}>
  //       {children}
  //     </ThreadProvider>
  //   );
  //
  //   const { result } = renderHook(() => useThreadContext(), { wrapper });
  //
  //   await act(async () => {
  //     result.current.updateState({
  //       nicknamesMap: new Map([['user1', 'User One'], ['user2', 'User Two']]),
  //     });
  //     await waitFor(() => {
  //       expect(result.current.nicknamesMap.get('user1')).toBe('User One');
  //     });
  //   });
  // });
  //
  // it('calls onMoveToParentMessage when provided', async () => {
  //   const onMoveToParentMessageMock = jest.fn();
  //   const wrapper = ({ children }) => (
  //     <ThreadProvider
  //       channelUrl="test-channel"
  //       message={{ messageId: 1 }}
  //       onMoveToParentMessage={onMoveToParentMessageMock}
  //     >
  //       {children}
  //     </ThreadProvider>
  //   );
  //
  //   const { result } = renderHook(() => useThreadContext(), { wrapper });
  //
  //   await act(async () => {
  //     result.current.onMoveToParentMessage({ message: { messageId: 1 }, channel: {} });
  //     await waitFor(() => {
  //       expect(onMoveToParentMessageMock).toHaveBeenCalled();
  //     });
  //   });
  // });
});
