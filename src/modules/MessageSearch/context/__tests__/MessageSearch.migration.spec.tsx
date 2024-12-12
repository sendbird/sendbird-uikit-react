import React from 'react';
import { render, screen } from '@testing-library/react';
import { MessageSearchProvider, useMessageSearchContext } from '../MessageSearchProvider';
import { match } from 'ts-pattern';

const mockState = {
  stores: { sdkStore: {} },
  config: { logger: console, groupChannel: {} },
};
const mockActions = { connect: jest.fn(), disconnect: jest.fn() };

jest.mock('../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(() => ({ state: mockState, actions: mockActions })),
  useSendbird: jest.fn(() => ({ state: mockState, actions: mockActions })),
}));

const mockProps = {
  channelUrl: 'channel-1',
  searchString: 'test',
  messageSearchQuery: {},
  onResultLoaded: jest.fn(),
  onResultClick: jest.fn(),
  children: <div>Child Component</div>,
};

describe('MessageSearch Migration Compatibility Tests', () => {
  // 1. Provider Props Interface test
  describe('MessageSearchProvider Props Compatibility', () => {
    it('should accept all legacy props without type errors', () => {
      const { rerender } = render(
        <MessageSearchProvider {...mockProps}>
          {mockProps.children}
        </MessageSearchProvider>,
      );

      // Props change scenario test
      rerender(
        <MessageSearchProvider
          {...mockProps}
          searchString="updated"
          onResultLoaded={() => {}}
        >
          {mockProps.children}
        </MessageSearchProvider>,
      );
    });
  });

  // 2. Context Hook return value test
  describe('useMessageSearchContext Hook Return Values', () => {
    type ContextType = ReturnType<typeof useMessageSearchContext>;
    const expectedProps: Array<keyof ContextType> = [
      'channelUrl',
      'searchString',
      'messageSearchQuery',
      'onResultLoaded',
      'onResultClick',
      'children',
      'requestString',
      'retryCount',
      'setRetryCount',
      'selectedMessageId',
      'setSelectedMessageId',
      'messageSearchDispatcher',
      'scrollRef',
      'allMessages',
      'loading',
      'isInvalid',
      'currentChannel',
      'currentMessageSearchQuery',
      'hasMoreResult',
      'onScroll',
      'handleRetryToConnect',
      'handleOnScroll',
    ];

    const TestComponent = () => {
      const context = useMessageSearchContext();
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
        <MessageSearchProvider {...mockProps}>
          <TestComponent />
        </MessageSearchProvider>,
      );

      expectedProps.forEach(prop => {
        const element = screen.getByTestId(`prop-${prop}`);
        expect(element).toBeInTheDocument();
      });
    });
  });
});
