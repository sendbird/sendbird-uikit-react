import React from 'react';
import { act, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { ThreadProvider, ThreadState } from '../ThreadProvider';
import { ChannelStateTypes, ParentMessageStateTypes, ThreadListStateTypes } from '../../types';
import useThread from '../useThread';
import { SendableMessageType } from '../../../../utils';

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

jest.mock('../../../../hooks/useSendbirdStateContext', () => ({
  __esModule: true,
  default: jest.fn(() => ({
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
  })),
}));

describe('ThreadProvider', () => {
  const initialState: ThreadState = {
    channelUrl: '',
    message: null,
    currentChannel: null,
    allThreadMessages: [],
    localThreadMessages: [],
    parentMessage: null,
    channelState: ChannelStateTypes.NIL,
    parentMessageState: ParentMessageStateTypes.NIL,
    threadListState: ThreadListStateTypes.NIL,
    hasMorePrev: false,
    hasMoreNext: false,
    emojiContainer: {} as any,
    isMuted: false,
    isChannelFrozen: false,
    currentUserId: '',
    typingMembers: [],
    nicknamesMap: new Map(),
  };

  const initialMockMessage = {
    messageId: 1,
  } as SendableMessageType;

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
});
