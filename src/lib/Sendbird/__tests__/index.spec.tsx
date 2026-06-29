import React from 'react';
import { render, screen } from '@testing-library/react';

import { SendbirdProvider, withSendBird } from '../index';
import type { MockInstance } from 'vitest';

vi.mock('@sendbird/uikit-tools', () => ({
  UIKitConfigProvider: vi.fn(({ children }) => <div data-testid="UIKitConfigProvider">{children}</div>),
}));
vi.mock('../context/SendbirdProvider', () => ({
  SendbirdContextProvider: vi.fn(({ children }) => <div data-testid="SendbirdContextProvider">{children}</div>),
}));
vi.mock('../context/hooks/useSendbird', () => ({
  default: vi.fn(() => ({
    state: { someState: 'testState' },
    actions: { someAction: vi.fn() },
  })),
}));
vi.mock('../../utils/uikitConfigMapper', () => ({
  uikitConfigMapper: vi.fn(() => ({
    common: {},
    groupChannel: {},
    openChannel: {},
  })),
}));
vi.mock('../../utils/uikitConfigStorage', () => ({ uikitConfigStorage: {} }));

describe('SendbirdProvider/index', () => {
  it('renders UIKitConfigProvider with correct localConfigs', () => {
    const props = {
      replyType: 'threaded',
      isMentionEnabled: true,
      isReactionEnabled: true,
      disableUserProfile: false,
      isVoiceMessageEnabled: true,
      isTypingIndicatorEnabledOnChannelList: false,
      isMessageReceiptStatusEnabledOnChannelList: false,
      showSearchIcon: true,
      uikitOptions: {},
    };

    render(<SendbirdProvider {...props} />);

    expect(screen.getByTestId('UIKitConfigProvider')).toBeInTheDocument();
    expect(screen.getByTestId('SendbirdContextProvider')).toBeInTheDocument();
  });
});

describe('withSendbirdContext', () => {
  let consoleWarnSpy: MockInstance;

  beforeEach(() => {
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  it('logs a warning if mapStoreToProps is not a function', () => {
    const MockComponent = vi.fn(() => <div data-testid="MockComponent" />);
    const invalidMapStoreToProps = 'invalidValue';

    const WrappedComponent = withSendBird(MockComponent, invalidMapStoreToProps);

    render(<WrappedComponent />);

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Second parameter to withSendbirdContext must be a pure function',
    );
  });

  it('renders OriginalComponent with merged props', () => {
    const MockComponent = vi.fn((props) => <div data-testid="MockComponent">{props.testProp}</div>);
    const mapStoreToProps = (context: any) => ({
      mappedProp: context.someState,
    });

    const WrappedComponent = withSendBird(MockComponent, mapStoreToProps);

    render(<WrappedComponent testProp="additionalValue" />);

    expect(screen.getByTestId('MockComponent')).toHaveTextContent('additionalValue');

    expect(MockComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        mappedProp: 'testState',
        testProp: 'additionalValue',
      }),
      undefined,
    );
  });
});
