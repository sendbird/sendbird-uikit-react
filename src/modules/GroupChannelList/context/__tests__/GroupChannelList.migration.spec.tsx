import React from 'react';
import { render, screen } from '@testing-library/react';
import { match } from 'ts-pattern';
import {
  GroupChannelListProvider,
  GroupChannelListProviderProps,
  useGroupChannelListContext,
} from '../GroupChannelListProvider';

const mockState = {
  stores: {
    userStore: {
      user: {
        userId: ' test-user-id',
      },
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

jest.mock('@sendbird/uikit-tools', () => ({
  ...jest.requireActual('@sendbird/uikit-tools'),
  useGroupChannelList: jest.fn(() => ({
    refreshing: false,
    initialized: true,
    groupChannels: [{ url: 'test-groupchannel-url-1', serialize: () => JSON.stringify(this) }],
    refresh: jest.fn(),
    loadMore: jest.fn(),
  })),
}));

const mockProps: GroupChannelListProviderProps = {
  onChannelSelect: jest.fn(),
  onChannelCreated: jest.fn(),

  className: 'test-classname',
  selectedChannelUrl: 'test-selected-channel-url',

  allowProfileEdit: true,
  disableAutoSelect: true,
  isTypingIndicatorEnabled: true,
  isMessageReceiptStatusEnabled: true,

  channelListQueryParams: { limit: 30 },
  onThemeChange: jest.fn(),
  onCreateChannelClick: jest.fn(),
  onBeforeCreateChannel: jest.fn(),
  onUserProfileUpdated: jest.fn(),

  onUserProfileMessage: jest.fn(),
  onStartDirectMessage: jest.fn(),
  renderUserProfile: jest.fn(),
  disableUserProfile: true,
  children: <div>test children</div>,
};

describe('GroupChannelList Migration Compatibility Tests', () => {
  // 1. Provider Props Interface test
  describe('GroupChannelListProvider Props Compatibility', () => {
    it('should accept all legacy props without type errors', () => {
      const { rerender } = render(
        <GroupChannelListProvider {...mockProps}>
          {mockProps.children}
        </GroupChannelListProvider>,
      );

      // Props change scenario test
      rerender(
        <GroupChannelListProvider
          {...mockProps}
        >
          {mockProps.children}
        </GroupChannelListProvider>,
      );
    });
  });

  // 2. Context Hook return value test
  describe('useGroupChannelListContext Hook Return Values', () => {
    type ContextType = ReturnType<typeof useGroupChannelListContext>;
    const expectedProps: Array<keyof ContextType> = [
      'onChannelSelect',
      'onChannelCreated',
      'className',
      'selectedChannelUrl',
      'allowProfileEdit',
      'disableAutoSelect',
      'isTypingIndicatorEnabled',
      'isMessageReceiptStatusEnabled',
      'channelListQueryParams',
      'onThemeChange',
      'onCreateChannelClick',
      'onBeforeCreateChannel',
      'onUserProfileUpdated',
      'typingChannelUrls',
      'refreshing',
      'initialized',
      'groupChannels',
      'refresh',
      'loadMore',
    ];

    const TestComponent = () => {
      const context = useGroupChannelListContext();
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
        <GroupChannelListProvider {...mockProps}>
          <TestComponent />
        </GroupChannelListProvider>,
      );

      expectedProps.forEach(prop => {
        const element = screen.getByTestId(`prop-${prop}`);
        expect(element).toBeInTheDocument();
      });
    });
  });
});
