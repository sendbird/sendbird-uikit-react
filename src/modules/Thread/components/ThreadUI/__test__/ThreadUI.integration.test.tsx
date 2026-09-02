import * as useThreadModule from '../../../context/useThread';
import { ChannelStateTypes, ParentMessageStateTypes, ThreadListStateTypes } from '../../../types';
import { EmojiContainer } from '@sendbird/chat';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { LocalizationContext } from '../../../../../lib/LocalizationContext';
import ThreadUI from '../index';
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import type { Mock } from 'vitest';

const mockSendUserMessage = vi.fn();

const mockChannel = {
  url: 'test-channel',
  members: [{ userId: 'test-user-id', nickname: 'user1' }],
  updateUserMessage: vi.fn().mockImplementation(async (message) => mockNewMessage(message)),
  sendUserMessage: mockSendUserMessage,
  isGroupChannel: vi.fn().mockImplementation(() => true),
};

const mockNewMessage = (message) => ({
  messageId: 42,
  message: message ?? 'new message',
});

const mockMessage = {
  messageId: 1,
  message: 'first message',
};

const mockGetMessage = vi.fn().mockResolvedValue(mockMessage);
const mockGetChannel = vi.fn().mockResolvedValue(mockChannel);

const mockState = {
  stores: {
    sdkStore: {
      sdk: {
        getMessage: mockGetMessage,
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
    isOnline: true,
    pubSub: {
      publish: vi.fn(),
    },
    groupChannel: {
      enableMention: true,
      enableReactions: true,
      replyType: 'THREAD',
    },
  },
};

vi.mock('../../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: vi.fn(() => ({ state: mockState })),
  useSendbird: vi.fn(() => ({ state: mockState })),
}));

vi.mock('../../../context/useThread');

const mockStringSet = {
  DATE_FORMAT__MESSAGE_CREATED_AT: 'p',
  THREAD__THREAD_REPLY: 'reply',
  THREAD__THREAD_REPLIES: 'replies',
};

const mockLocalizationContext = {
  stringSet: mockStringSet,
};

const defaultMockState = {
  channelUrl: '',
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
  currentChannel: undefined,
  allThreadMessages: [
    {
      messageId: 2,
      message: 'threaded message 1',
      isUserMessage: () => true,
    },
  ],
  localThreadMessages: [],
  parentMessage: null,
  channelState: ChannelStateTypes.INITIALIZED,
  parentMessageState: ParentMessageStateTypes.INITIALIZED,
  threadListState: ThreadListStateTypes.INITIALIZED,
  hasMorePrev: false,
  hasMoreNext: false,
  emojiContainer: {} as EmojiContainer,
  isMuted: false,
  isChannelFrozen: false,
  currentUserId: '',
  typingMembers: [],
  nicknamesMap: null,
};

const defaultMockActions = {
  fetchPrevThreads: vi.fn((callback) => {
    callback();
    return Promise.resolve();
  }),
  fetchNextThreads: vi.fn((callback) => {
    callback();
    return Promise.resolve();
  }),
};

describe('CreateChannelUI Integration Tests', () => {
  const mockUseThread = useThreadModule.default as Mock;

  const renderComponent = (mockState = {}, mockActions = {}) => {
    mockUseThread.mockReturnValue({
      state: { ...defaultMockState, ...mockState },
      actions: { ...defaultMockActions, ...mockActions },
    });

    return render(
      <LocalizationContext.Provider value={mockLocalizationContext as any}>
        <ThreadUI/>
      </LocalizationContext.Provider>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('display initial state correctly', async () => {
    await act(async () => {
      renderComponent(
        {
          parentMessage: {
            messageId: 1,
            message: 'parent message',
            isUserMessage: () => true,
            isTextMessage: true,
            createdAt: 0,
            sender: {
              userId: 'test-user-id',
            },
          },
        },
      );
    });

    expect(screen.getByText('parent message')).toBeInTheDocument();
    expect(screen.getByText('threaded message 1')).toBeInTheDocument();
  });

  it('shows the reply count once the parent is initialized', async () => {
    await act(async () => {
      renderComponent({
        parentMessage: {
          messageId: 1,
          message: 'parent message',
          isUserMessage: () => true,
          isTextMessage: true,
          createdAt: 0,
          sender: { userId: 'test-user-id' },
        },
        parentMessageState: ParentMessageStateTypes.INITIALIZED,
      });
    });

    // defaultMockState has 1 threaded message → "1 reply".
    expect(screen.getByText('1 reply')).toBeInTheDocument();
  });

  it('does not show a stale reply count while the parent is not yet initialized (thread switch)', async () => {
    // On a thread switch the previous thread's replies linger in the store until the new collection
    // mirrors; the parent is loading, so the count must be gated off (no stale "1 reply").
    await act(async () => {
      renderComponent({
        parentMessage: null,
        parentMessageState: ParentMessageStateTypes.LOADING,
        // allThreadMessages still holds the previous thread's reply (from defaultMockState).
      });
    });

    expect(screen.queryByText('1 reply')).not.toBeInTheDocument();
  });

  it('fetchPrevThread is correctly called when scroll is top', async () => {
    let container;
    const parentMessage = {
      messageId: 1,
      message: 'parent message',
      isUserMessage: () => true,
      isTextMessage: true,
      createdAt: 0,
      sender: {
        userId: 'test-user-id',
      },
      getThreadedMessagesByTimestamp: () => ({
        parentMessage,
        threadedMessages: [
          { messageId: 3, message: 'threaded message -1', isUserMessage: () => true },
          { messageId: 4, message: 'threaded message 0', isUserMessage: () => true },
        ],
      }),
    };

    await act(async () => {
      const result = renderComponent(
        {
          parentMessage,
          hasMorePrev: true,
        },
      );

      container = result.container;
    });

    const scrollContainer = container.getElementsByClassName('sendbird-thread-ui--scroll')[0];
    fireEvent.scroll(scrollContainer, { target: { scrollY: -1 } });

    await waitFor(() => {
      expect(defaultMockActions.fetchPrevThreads).toBeCalledTimes(1);
    });
  });

  it('does not crash when fetchPrevThreads rejects during scroll to top', async () => {
    let container;
    const fetchPrevThreads = vi.fn(() => Promise.reject(new Error('fetch failed')));
    const parentMessage = {
      messageId: 1,
      message: 'parent message',
      isUserMessage: () => true,
      isTextMessage: true,
      createdAt: 0,
      sender: {
        userId: 'test-user-id',
      },
    };

    await act(async () => {
      const result = renderComponent(
        { parentMessage, hasMorePrev: true },
        { fetchPrevThreads },
      );

      container = result.container;
    });

    const scrollContainer = container.getElementsByClassName('sendbird-thread-ui--scroll')[0];
    fireEvent.scroll(scrollContainer, { target: { scrollY: -1 } });

    await waitFor(() => {
      expect(fetchPrevThreads).toBeCalledTimes(1);
    });
    expect(screen.getByText('threaded message 1')).toBeInTheDocument();
  });

  it('fetchNextThreads is correctly called when scroll is bottom', async () => {
    let container;
    const parentMessage = {
      messageId: 1,
      message: 'parent message',
      isUserMessage: () => true,
      isTextMessage: true,
      createdAt: 0,
      sender: {
        userId: 'test-user-id',
      },
      getThreadedMessagesByTimestamp: () => ({
        parentMessage,
        threadedMessages: [
          { messageId: 3, message: 'threaded message -1', isUserMessage: () => true },
          { messageId: 4, message: 'threaded message 0', isUserMessage: () => true },
        ],
      }),
    };

    await act(async () => {
      const result = renderComponent(
        {
          parentMessage,
          hasMoreNext: true,
        },
      );

      container = result.container;
    });

    const scrollContainer = container.getElementsByClassName('sendbird-thread-ui--scroll')[0];
    fireEvent.scroll(scrollContainer, { target: { scrollY: scrollContainer.scrollHeight + 1 } });

    await waitFor(() => {
      expect(defaultMockActions.fetchNextThreads).toBeCalledTimes(1);
    });
  });

  it('show proper placeholder when ParentMessageStateTypes is NIL', async () => {
    let container;
    const parentMessage = {
      messageId: 1,
      message: 'parent message',
      isUserMessage: () => true,
      isTextMessage: true,
      createdAt: 0,
      sender: {
        userId: 'test-user-id',
      },
    };

    await act(async () => {
      const result = renderComponent(
        {
          parentMessage,
          parentMessageState: ParentMessageStateTypes.NIL,
        },
      );

      container = result.container;
    });

    await waitFor(() => {
      const placeholder = container.getElementsByClassName('placeholder-nil')[0];
      expect(placeholder).not.toBe(undefined);
    });

  });

  it('show proper placeholder when ParentMessageStateTypes is LOADING', async () => {
    let container;
    const parentMessage = {
      messageId: 1,
      message: 'parent message',
      isUserMessage: () => true,
      isTextMessage: true,
      createdAt: 0,
      sender: {
        userId: 'test-user-id',
      },
    };

    await act(async () => {
      const result = renderComponent(
        {
          parentMessage,
          parentMessageState: ParentMessageStateTypes.LOADING,
        },
      );

      container = result.container;
    });

    await waitFor(() => {
      const placeholder = container.getElementsByClassName('placeholder-loading')[0];
      expect(placeholder).not.toBe(undefined);
    });

  });

  it('show proper placeholder when ParentMessageStateTypes is INVALID', async () => {
    let container;
    const parentMessage = {
      messageId: 1,
      message: 'parent message',
      isUserMessage: () => true,
      isTextMessage: true,
      createdAt: 0,
      sender: {
        userId: 'test-user-id',
      },
    };

    await act(async () => {
      const result = renderComponent(
        {
          parentMessage,
          parentMessageState: ParentMessageStateTypes.INVALID,
        },
      );

      container = result.container;
    });

    await waitFor(() => {
      const placeholder = container.getElementsByClassName('placeholder-invalid')[0];
      expect(placeholder).not.toBe(undefined);
    });
  });

  it('show proper placeholder when ThreadListState is LOADING', async () => {
    let container;
    const parentMessage = {
      messageId: 1,
      message: 'parent message',
      isUserMessage: () => true,
      isTextMessage: true,
      createdAt: 0,
      sender: {
        userId: 'test-user-id',
      },
    };

    await act(async () => {
      const result = renderComponent(
        {
          parentMessage,
          threadListState: ThreadListStateTypes.LOADING,
        },
      );

      container = result.container;
    });

    await waitFor(() => {
      const placeholder = container.getElementsByClassName('placeholder-loading')[0];
      expect(placeholder).not.toBe(undefined);
    });
  });

  it('show proper placeholder when ThreadListState is INVALID', async () => {
    let container;
    const parentMessage = {
      messageId: 1,
      message: 'parent message',
      isUserMessage: () => true,
      isTextMessage: true,
      createdAt: 0,
      sender: {
        userId: 'test-user-id',
      },
    };

    await act(async () => {
      const result = renderComponent(
        {
          parentMessage,
          threadListState: ThreadListStateTypes.INVALID,
        },
      );

      container = result.container;
    });

    await waitFor(() => {
      const placeholder = container.getElementsByClassName('placeholder-invalid')[0];
      expect(placeholder).not.toBe(undefined);
    });
  });

});
