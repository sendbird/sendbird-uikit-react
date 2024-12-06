import React from 'react';
import { render, screen } from '@testing-library/react';

import { SendbirdProvider, withSendBird } from '../index';

jest.mock('@sendbird/uikit-tools', () => ({
  UIKitConfigProvider: jest.fn(({ children }) => <div data-testid="UIKitConfigProvider">{children}</div>),
}));
jest.mock('../context/SendbirdProvider', () => ({
  SendbirdContextProvider: jest.fn(({ children }) => <div data-testid="SendbirdContextProvider">{children}</div>),
}));
jest.mock('../context/hooks/useSendbird', () => jest.fn(() => ({
  state: { someState: 'testState' },
  actions: { someAction: jest.fn() },
})));
jest.mock('../../utils/uikitConfigMapper', () => ({
  uikitConfigMapper: jest.fn(() => ({
    common: {},
    groupChannel: {},
    openChannel: {},
  })),
}));
jest.mock('../../utils/uikitConfigStorage', () => ({}));

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
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  it('logs a warning if mapStoreToProps is not a function', () => {
    const MockComponent = jest.fn(() => <div data-testid="MockComponent" />);
    const invalidMapStoreToProps = 'invalidValue';

    const WrappedComponent = withSendBird(MockComponent, invalidMapStoreToProps);

    render(<WrappedComponent />);

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Second parameter to withSendbirdContext must be a pure function',
    );
  });

  it('renders OriginalComponent with merged props', () => {
    const MockComponent = jest.fn((props) => <div data-testid="MockComponent">{props.testProp}</div>);
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
      {},
    );
  });
});
