import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { ChannelSettingsProvider, useChannelSettingsContext } from '../context/ChannelSettingsProvider';
import { useSendbird } from '../../../lib/Sendbird/context/hooks/useSendbird';
import { SendbirdContext } from '../../../lib/Sendbird/context/SendbirdContext';

jest.mock('../../../lib/Sendbird/context/hooks/useSendbird');
jest.mock('../context/hooks/useSetChannel');

const mockLogger = {
  warning: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
};

const initialState = {
  channelUrl: 'test-channel',
  onCloseClick: undefined,
  onLeaveChannel: undefined,
  onChannelModified: undefined,
  onBeforeUpdateChannel: undefined,
  renderUserListItem: undefined,
  queries: undefined,
  overrideInviteUser: undefined,
  channel: null,
  loading: false,
  invalidChannel: false,
  forceUpdateUI: expect.any(Function),
  setChannelUpdateId: expect.any(Function),
};

describe('ChannelSettingsProvider', () => {
  let wrapper;

  beforeEach(() => {
    useSendbird.mockReturnValue({
      state: {
        stores: { sdkStore: { sdk: {}, initialized: true } },
        config: { logger: mockLogger },
      },
    });

    wrapper = ({ children }) => (
      <SendbirdContext.Provider value={{ config: { logger: mockLogger } } as any}>
        <ChannelSettingsProvider channelUrl="test-channel">
          {children}
        </ChannelSettingsProvider>
      </SendbirdContext.Provider>
    );

    jest.clearAllMocks();
  });

  it('provides the correct initial state', () => {
    const { result } = renderHook(() => useChannelSettingsContext(), { wrapper });

    expect(result.current.getState()).toEqual(expect.objectContaining(initialState));
  });

  it('logs a warning if SDK is not initialized', () => {
    useSendbird.mockReturnValue({
      state: {
        stores: { sdkStore: { sdk: null, initialized: false } },
        config: { logger: mockLogger },
      },
    });

    renderHook(() => useChannelSettingsContext(), { wrapper });

    expect(mockLogger.warning).toHaveBeenCalledWith('ChannelSettings: SDK or GroupChannelModule is not available');
  });

  it('updates state correctly when setChannelUpdateId is called', async () => {
    const { result } = renderHook(() => useChannelSettingsContext(), { wrapper });

    await act(async () => {
      result.current.setState({ channelUrl: 'new-channel' });
      await waitForStateUpdate();
      expect(result.current.getState().channelUrl).toBe('new-channel');
    });
  });

  it('maintains other state values when channel changes', async () => {
    const { result } = renderHook(() => useChannelSettingsContext(), { wrapper });

    await act(async () => {
      result.current.setState({ channel: { name: 'Updated Channel' } });
      await waitForStateUpdate();
      const updatedState = result.current.getState();
      expect(updatedState.channel).toEqual({ name: 'Updated Channel' });
      expect(updatedState.loading).toBe(false);
      expect(updatedState.invalidChannel).toBe(false);
    });
  });

  const waitForStateUpdate = () => new Promise(resolve => { setTimeout(resolve, 0); });
});
