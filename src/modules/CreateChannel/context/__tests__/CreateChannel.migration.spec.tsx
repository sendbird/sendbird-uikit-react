import { render, screen } from '@testing-library/react';
import { match } from 'ts-pattern';
import React from 'react';
import {
  CreateChannelProvider,
  CreateChannelProviderProps,
  useCreateChannelContext,
} from '../CreateChannelProvider';

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
}; const mockActions = { connect: jest.fn(), disconnect: jest.fn() };

jest.mock('../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(() => ({ state: mockState, actions: mockActions })),
  useSendbird: jest.fn(() => ({ state: mockState, actions: mockActions })),
}));

const mockProps: CreateChannelProviderProps = {
  children: <div>test children</div>,
  userListQuery: () => ({ hasNext: true, next: jest.fn(), isLoading: false }),
  onCreateChannelClick: jest.fn(),
  onChannelCreated: jest.fn(),
  onBeforeCreateChannel: jest.fn(),
  onCreateChannel: jest.fn(),
  overrideInviteUser: jest.fn(),
};

describe('CreateChannel Migration Compatibility Tests', () => {
  // 1. Provider Props Interface test
  describe('CreateChannelProvider Props Compatibility', () => {
    it('should accept all legacy props without type errors', () => {
      const { rerender } = render(
        <CreateChannelProvider {...mockProps}>
          {mockProps.children}
        </CreateChannelProvider>,
      );

      // Props change scenario test
      rerender(
        <CreateChannelProvider
          {...mockProps}
        >
          {mockProps.children}
        </CreateChannelProvider>,
      );
    });
  });

  // 2. Context Hook return value test
  describe('useCreateChannelContext Hook Return Values', () => {
    type ContextType = ReturnType<typeof useCreateChannelContext>;
    const expectedProps: Array<keyof ContextType> = [
      'sdk',
      'createChannel',
      'userListQuery',
      'onCreateChannelClick',
      'onChannelCreated',
      'onBeforeCreateChannel',
      'step',
      'setStep',
      'type',
      'setType',
      'onCreateChannel',
      'overrideInviteUser',
    ];

    const TestComponent = () => {
      const context = useCreateChannelContext();
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
        <CreateChannelProvider {...mockProps}>
          <TestComponent />
        </CreateChannelProvider>,
      );

      expectedProps.forEach(prop => {
        const element = screen.getByTestId(`prop-${prop}`);
        expect(element).toBeInTheDocument();
      });
    });
  });
});
