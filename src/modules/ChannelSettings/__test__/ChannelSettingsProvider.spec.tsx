import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { ChannelSettingsProvider, useChannelSettingsContext } from '../context/ChannelSettingsProvider';
import useSendbird from '../../../lib/Sendbird/context/hooks/useSendbird';
import { SendbirdContext } from '../../../lib/Sendbird/context/SendbirdContext';

jest.mock('../../../lib/Sendbird/context/hooks/useSendbird');
jest.mock('../context/hooks/useSetChannel');

const mockLogger = {
  warning: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
};

const mockStore = {
  getState: jest.fn(),
  setState: jest.fn(),
  subscribe: jest.fn(() => jest.fn()),
};

const initialState = {
  channelUrl: 'test-channel',
  channel: null,
  loading: false,
  invalidChannel: false,
};

describe('ChannelSettingsProvider', () => {
  let wrapper;

  beforeEach(() => {
    mockStore.getState.mockReturnValue(initialState);
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

  it('provides the correct initial state and actions', () => {
    const { result } = renderHook(() => useChannelSettingsContext(), { wrapper });

    expect(result.current.channelUrl).toBe(initialState.channelUrl);
    expect(result.current.channel).toBe(initialState.channel);
    expect(result.current.loading).toBe(initialState.loading);
    expect(result.current.invalidChannel).toBe(initialState.invalidChannel);
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

  it('updates channel state correctly', async () => {
    const { result } = renderHook(() => useChannelSettingsContext(), { wrapper });
    const newChannel = { url: 'new-channel' } as any;

    await act(async () => {
      result.current.setChannel(newChannel);
    });

    expect(result.current.channel).toEqual(newChannel);
  });

  it('maintains loading and invalid states', async () => {
    const { result } = renderHook(() => useChannelSettingsContext(), { wrapper });

    await act(async () => {
      result.current.setLoading(true);
      result.current.setInvalid(true);
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.invalidChannel).toBe(true);
  });
});
