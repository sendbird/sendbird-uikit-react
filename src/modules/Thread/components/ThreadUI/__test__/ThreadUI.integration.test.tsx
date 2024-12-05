import { SendableMessageType } from '../../../../../utils';
import * as useThreadModule from '../../../context/useThread';
import { ChannelStateTypes, ParentMessageStateTypes, ThreadListStateTypes } from '../../../types';
import { EmojiContainer } from '@sendbird/chat';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { LocalizationContext } from '../../../../../lib/LocalizationContext';
import ThreadUI from '../index';
import React from 'react';
import '@testing-library/jest-dom/extend-expect';

class MockMessageMethod {
  _onPending: (message: SendableMessageType) => void;

  _onFailed: (message: SendableMessageType) => void;

  _onSucceeded: (message: SendableMessageType) => void;

  constructor(message, willSucceed = true) {
    this._onPending = undefined;
    this._onFailed = undefined;
    this._onSucceeded = undefined;

    this.init(message, willSucceed);
  }

  init(message, willSucceed) {
    setTimeout(() => this._onPending?.(message), 0);
    setTimeout(() => {
      if (willSucceed) {
        this._onSucceeded?.(message);
      } else {
        this._onFailed?.(message);
      }
    }, 300);
  }

  onPending(func) {
    this._onPending = func;
    return this;
  }

  onFailed(func) {
    this._onFailed = func;
    return this;
  }

  onSucceeded(func) {
    this._onSucceeded = func;
    return this;
  }
}

const mockSendUserMessage = jest.fn();

const mockChannel = {
  url: 'test-channel',
  members: [{ userId: 'test-user-id', nickname: 'user1' }],
  updateUserMessage: jest.fn().mockImplementation(async (message) => mockNewMessage(message)),
  sendUserMessage: mockSendUserMessage,
  isGroupChannel: jest.fn().mockImplementation(() => true),
};

const mockNewMessage = (message) => ({
  messageId: 42,
  message: message ?? 'new message',
});

const mockMessage = {
  messageId: 1,
  message: 'first message',
};

const mockGetMessage = jest.fn().mockResolvedValue(mockMessage);
const mockGetChannel = jest.fn().mockResolvedValue(mockChannel);

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
      publish: jest.fn(),
    },
    groupChannel: {
      enableMention: true,
      enableReactions: true,
      replyType: 'THREAD',
    },
  },
};

jest.mock('../../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(() => ({ state: mockState })),
  useSendbird: jest.fn(() => ({ state: mockState })),
}));

jest.mock('../../../context/useThread');

const mockStringSet = {
  DATE_FORMAT__MESSAGE_CREATED_AT: 'p',
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
  fetchPrevThreads: jest.fn((callback) => {
    callback();
  }),
  fetchNextThreads: jest.fn((callback) => {
    callback();
  }),
};

describe('CreateChannelUI Integration Tests', () => {
  const mockUseThread = useThreadModule.default as jest.Mock;

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
    jest.clearAllMocks();
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
