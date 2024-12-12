import { render, screen } from '@testing-library/react';
import { match } from 'ts-pattern';
import React from 'react';

import { ThreadProvider, ThreadProviderProps, useThreadContext } from '../ThreadProvider';
import { SendableMessageType } from '../../../../utils';

const mockState = {
  stores: {
    userStore: {
    },
    sdkStore: {
      sdk: {
        currentUser: {
          userId: 'test-user-id',
        },
      },
      initialized: true,
    },
  },
  config: {
    logger: console,
    userId: 'test-user-id',
    groupChannel: {
      enableMention: true,
    },
    groupChannelList: {
      enableTypingIndicator: true,
    },
    isOnline: true,
  },
};
const mockActions = { connect: jest.fn(), disconnect: jest.fn() };

jest.mock('../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(() => ({ state: mockState, actions: mockActions })),
  useSendbird: jest.fn(() => ({ state: mockState, actions: mockActions })),
}));

jest.mock('../hooks/useThreadFetchers', () => ({
  useThreadFetchers: jest.fn().mockReturnValue({
    initialize: jest.fn(),
    loadPrevious: jest.fn(),
    loadNext: jest.fn(),
  }),
}));

const mockProps: ThreadProviderProps = {
  disableUserProfile: true,
  renderUserProfile: jest.fn(),
  children: <div>test children</div>,
  channelUrl: 'test-channel-url',
  message: { messageId: 42, message: 'test message' } as SendableMessageType,
  onHeaderActionClick: jest.fn(),
  onMoveToParentMessage: jest.fn(),
  onBeforeSendUserMessage: jest.fn(),
  onBeforeSendFileMessage: jest.fn(),
  onBeforeSendVoiceMessage: jest.fn(),
  onBeforeSendMultipleFilesMessage: jest.fn(),
  onBeforeDownloadFileMessage: jest.fn(),
  isMultipleFilesMessageEnabled: true,
  filterEmojiCategoryIds: jest.fn(),
};

describe('CreateChannel Migration Compatibility Tests', () => {
  // 1. Provider Props Interface test
  describe('CreateChannelProvider Props Compatibility', () => {
    it('should accept all legacy props without type errors', () => {
      const { rerender } = render(
        <ThreadProvider {...mockProps}>
          {mockProps.children}
        </ThreadProvider>,
      );

      // Props change scenario test
      rerender(
        <ThreadProvider
          {...mockProps}
        >
          {mockProps.children}
        </ThreadProvider>,
      );
    });
  });

  // 2. Context Hook return value test
  describe('useCreateChannelContext Hook Return Values', () => {
    type ContextType = ReturnType<typeof useThreadContext>;
    const expectedProps: Array<keyof ContextType> = [
      'disableUserProfile',
      'renderUserProfile',
      'children',
      'channelUrl',
      'message',
      'onHeaderActionClick',
      'onMoveToParentMessage',
      'onBeforeSendUserMessage',
      'onBeforeSendFileMessage',
      'onBeforeSendVoiceMessage',
      'onBeforeSendMultipleFilesMessage',
      'onBeforeDownloadFileMessage',
      'isMultipleFilesMessageEnabled',
      'filterEmojiCategoryIds',
      'currentChannel',
      'allThreadMessages',
      'localThreadMessages',
      'parentMessage',
      'channelState',
      'parentMessageState',
      'threadListState',
      'hasMorePrev',
      'hasMoreNext',
      'emojiContainer',
      'isMuted',
      'isChannelFrozen',
      'currentUserId',
      'typingMembers',
      'fetchPrevThreads',
      'fetchNextThreads',
      'toggleReaction',
      'sendMessage',
      'sendFileMessage',
      'sendVoiceMessage',
      'sendMultipleFilesMessage',
      'resendMessage',
      'updateMessage',
      'deleteMessage',
      'nicknamesMap',
    ];

    const TestComponent = () => {
      const context = useThreadContext();
      return (
        <div>
          {expectedProps.map(prop => (
            <div key={prop} data-testid={`prop-${prop}`}>
              {/* text can be function, object, string, or unknown */}
              {match(context[prop])
                .with('function', () => 'function')
                .with('object', () => JSON.stringify(context[prop]))
                .with('string', () => String(context[prop]))
                .otherwise(() => 'unknown')}
            </div>
          ))}
        </div>
      );
    };

    it('should provide all legacy context values', () => {
      render(
        <ThreadProvider {...mockProps}>
          <TestComponent />
        </ThreadProvider>,
      );

      expectedProps.forEach(prop => {
        const element = screen.getByTestId(`prop-${prop}`);
        expect(element).toBeInTheDocument();
      });
    });
  });
});
