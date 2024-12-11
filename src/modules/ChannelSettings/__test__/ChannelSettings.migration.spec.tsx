import React from 'react';
import { render, renderHook, screen } from '@testing-library/react';

import { ChannelSettingsContextProps, ChannelSettingsProvider, useChannelSettingsContext } from '../context/ChannelSettingsProvider';
import { match } from 'ts-pattern';

const mockState = {
  stores: {
    sdkStore: {
      sdk: {},
    },
  },
  config: {
    logger: {
      info: jest.fn(),
      warning: jest.fn(),
      error: jest.fn(),
    },
  },
};

jest.mock('../../../hooks/useSendbirdStateContext', () => ({
  __esModule: true,
  default: jest.fn(() => mockState),
}));
jest.mock('../../../lib/Sendbird', () => ({
  __esModule: true,
  useSendbirdStateContext: jest.fn(() => mockState),
}));

const mockProps: ChannelSettingsContextProps = {
  channelUrl: 'test-channel-url',
  onCloseClick: jest.fn(),
  onLeaveChannel: jest.fn(),
  onChannelModified: jest.fn(),
  onBeforeUpdateChannel: jest.fn(),
  overrideInviteUser: jest.fn(),
  queries: {
    applicationUserListQuery: { limit: 10 },
  },
  className: 'test-class',
  renderUserListItem: jest.fn(),
  renderUserProfile: jest.fn(),
  disableUserProfile: true,
  children: <div>Child Component</div>,
};

describe('ChannelSettingsProvider Interface Validation', () => {
  it('should pass all props to the context correctly', () => {
    const wrapper = ({ children }) => (
      <ChannelSettingsProvider {...mockProps}>{children}</ChannelSettingsProvider>
    );

    const { result } = renderHook(() => useChannelSettingsContext(), { wrapper });

    expect(result.current.channelUrl).toBe(mockProps.channelUrl);
    expect(result.current.onCloseClick).toBe(mockProps.onCloseClick);
    expect(result.current.onLeaveChannel).toBe(mockProps.onLeaveChannel);
    expect(result.current.onChannelModified).toBe(mockProps.onChannelModified);
    expect(result.current.onBeforeUpdateChannel).toBe(mockProps.onBeforeUpdateChannel);
    expect(result.current.overrideInviteUser).toBe(mockProps.overrideInviteUser);
    expect(result.current.queries).toBe(mockProps.queries);
    expect(result.current.renderUserListItem).toBe(mockProps.renderUserListItem);
    // Only props
    expect(result.current['className']).toBeUndefined();
    expect(result.current['renderUserProfile']).toBeUndefined();
    expect(result.current['disableUserProfile']).toBeUndefined();
  });

  it('should provide default values for optional props', () => {
    const minimalProps = { channelUrl: 'minimal-channel-url' };

    const wrapper = ({ children }) => (
      <ChannelSettingsProvider {...minimalProps}>{children}</ChannelSettingsProvider>
    );

    const { result } = renderHook(() => useChannelSettingsContext(), { wrapper });

    expect(result.current.channelUrl).toBe('minimal-channel-url');
    expect(result.current.onCloseClick).toBeUndefined();
    expect(result.current.onLeaveChannel).toBeUndefined();
    expect(result.current.overrideInviteUser).toBeUndefined();
    expect(result.current.queries).toBeUndefined();
    expect(result.current.renderUserListItem).toBeUndefined();
  });

  it('should provide all expected context values', () => {
    const expectedKeys = [
      'channelUrl',
      'onCloseClick',
      'onLeaveChannel',
      'onChannelModified',
      'onBeforeUpdateChannel',
      'overrideInviteUser',
      'setChannelUpdateId',
      'forceUpdateUI',
      'channel',
      'loading',
      'invalidChannel',
      'queries',
      'renderUserListItem',
    ];

    const TestComponent = () => {
      const context = useChannelSettingsContext();
      return (
        <div>
          {Object.keys(context).map((key) => (
            <div key={key} data-testid={`context-${key}`}>
              {match(context[key])
                .with('function', () => 'function')
                .with('object', () => JSON.stringify(context[key]))
                .with('string', () => String(context[key]))
                .otherwise(() => 'unknown')}
            </div>
          ))}
        </div>
      );
    };

    render(
      <ChannelSettingsProvider {...mockProps}>
        <TestComponent />
      </ChannelSettingsProvider>,
    );

    expectedKeys.forEach((key) => {
      const element = screen.getByTestId(`context-${key}`);
      expect(element).toBeInTheDocument();
    });
  });
});
