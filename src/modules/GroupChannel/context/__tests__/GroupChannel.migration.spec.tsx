import React, { act } from 'react';
import { render, screen } from '@testing-library/react';
import type { GroupChannelProviderProps } from '../types';
import { GroupChannelProvider, useGroupChannelContext } from '../GroupChannelProvider';
import { ThreadReplySelectType } from '../const';
import { match } from 'ts-pattern';

const mockState = {
  config: {
    pubSub: { subscribe: () => ({ remove: () => {} }) },
    isOnline: true,
    logger: {},
    groupChannel: {
      replyType: 'NONE',
      threadReplySelectType: 'NONE',
    },
    groupChannelSettings: {
      enableMessageSearch: false,
    },
    onStartDirectMessage: vi.fn(),
  },
  stores: {
    sdkStore: {
      initialized: true,
      sdk: {
        groupChannel: {
          getChannel: vi.fn().mockResolvedValue({}),
          addGroupChannelHandler: vi.fn(),
          removeGroupChannelHandler: vi.fn(),
        },
      },
    },
  },
};
const mockActions = { connect: vi.fn(), disconnect: vi.fn() };
vi.mock('../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: vi.fn(() => ({ state: mockState, actions: mockActions })),
  useSendbird: vi.fn(() => ({ state: mockState, actions: mockActions })),
}));

const mockProps: GroupChannelProviderProps = {
  // from ContextBaseType
  channelUrl: 'channel-1',
  children: <div>Child Component</div>,

  renderUserProfile: vi.fn(),
  disableUserProfile: false,
  // Flags
  isReactionEnabled: true,
  isMessageGroupingEnabled: true,
  isMultipleFilesMessageEnabled: true,
  showSearchIcon: true,
  replyType: 'NONE',
  threadReplySelectType: ThreadReplySelectType.THREAD,
  disableMarkAsRead: false,
  scrollBehavior: 'smooth',
  forceLeftToRightMessageLayout: false,

  startingPoint: undefined,
  // Message Focusing
  animatedMessageId: null,
  onMessageAnimated: vi.fn(),

  // Custom
  messageListQueryParams: {},
  filterEmojiCategoryIds: vi.fn(),

  // Handlers
  onBeforeSendUserMessage: vi.fn(),
  onBeforeSendFileMessage: vi.fn(),
  onBeforeSendVoiceMessage: vi.fn(),
  onBeforeSendMultipleFilesMessage: vi.fn(),
  onBeforeUpdateUserMessage: vi.fn(),
  onBeforeDownloadFileMessage: vi.fn(),

  // Click
  onBackClick: vi.fn(),
  onChatHeaderActionClick: vi.fn(),
  onReplyInThreadClick: vi.fn(),
  onSearchClick: vi.fn(),
  onQuoteMessageClick: vi.fn(),

  // Render
  renderUserMentionItem: vi.fn(),

  // from UserProfileProviderProps
  onUserProfileMessage: vi.fn(),
  onStartDirectMessage: vi.fn(),
};

describe('GroupChannel Migration Compatibility Tests', () => {
  // 1. Provider Props Interface test
  describe('GroupChannelProvider Props Compatibility', () => {
    it('should accept all legacy props without type errors', async () => {
      const { rerender } = await act(async () => render(
        <GroupChannelProvider {...mockProps}>
          {mockProps.children}
        </GroupChannelProvider>,
      ));

      // Props change scenario test
      await act(async () => rerender(
        <GroupChannelProvider
          {...mockProps}
          isReactionEnabled={false}
          onBackClick={() => {}}
        >
          {mockProps.children}
        </GroupChannelProvider>,
      ));
    });
  });

  // 2. Context Hook return value test
  describe('useGroupChannelContext Hook Return Values', () => {
    type ContextType = ReturnType<typeof useGroupChannelContext>;
    const expectedProps: Array<keyof ContextType> = [
      // from ContextBaseType
      'channelUrl',
      'renderUserProfile',
      'disableUserProfile',
      'isReactionEnabled',
      'isMessageGroupingEnabled',
      'isMultipleFilesMessageEnabled',
      'showSearchIcon',
      'replyType',
      'threadReplySelectType',
      'disableMarkAsRead',
      'scrollBehavior',
      'forceLeftToRightMessageLayout',
      'startingPoint',
      'animatedMessageId',
      'onMessageAnimated',
      'messageListQueryParams',
      'filterEmojiCategoryIds',
      'onBeforeSendUserMessage',
      'onBeforeSendFileMessage',
      'onBeforeSendVoiceMessage',
      'onBeforeSendMultipleFilesMessage',
      'onBeforeUpdateUserMessage',
      'onBeforeDownloadFileMessage',
      'onBackClick',
      'onChatHeaderActionClick',
      'onReplyInThreadClick',
      'onSearchClick',
      'onQuoteMessageClick',
      'renderUserMentionItem',
      // from MessageListDataSourceWithoutActions
      'initialized',
      'loading',
      'refreshing',
      'messages',
      'newMessages',
      'resetNewMessages',
      'refresh',
      'loadPrevious',
      'hasPrevious',
      'loadNext',
      'hasNext',
      'updateFileMessage',
      'resendMessage',
      'deleteMessage',
      'resetWithStartingPoint',
      // from useMessageActions
      'sendUserMessage',
      'sendFileMessage',
      'sendVoiceMessage',
      'sendMultipleFilesMessage',
      'updateUserMessage',
      // from GroupChannelContextType
      'currentChannel',
      'fetchChannelError',
      'nicknamesMap',
      'scrollRef',
      'scrollDistanceFromBottomRef',
      'scrollPositionRef',
      'scrollPubSub',
      'messageInputRef',
      'quoteMessage',
      'setQuoteMessage',
      'setAnimatedMessageId',
      'isScrollBottomReached',
      'setIsScrollBottomReached',
      'scrollToBottom',
      'scrollToMessage',
      'toggleReaction',
    ];

    const TestComponent = () => {
      const context = useGroupChannelContext();
      return (
        <div>
          {expectedProps.map(prop => (
            <div key={prop} data-testid={`prop-${prop}`}>
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
        <GroupChannelProvider {...mockProps}>
          <TestComponent />
        </GroupChannelProvider>,
      );

      expectedProps.forEach(prop => {
        const element = screen.getByTestId(`prop-${prop}`);
        expect(element).toBeInTheDocument();
      });
    });
  });
});
