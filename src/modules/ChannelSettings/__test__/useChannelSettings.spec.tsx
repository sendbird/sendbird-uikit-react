import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useChannelSettings } from '../context/useChannelSettings';
import { ChannelSettingsContext } from '../context/ChannelSettingsProvider';
import type { GroupChannel } from '@sendbird/chat/groupChannel';

describe('useChannelSettings', () => {
  const mockStore = {
    getState: jest.fn(),
    setState: jest.fn(),
    subscribe: jest.fn(() => jest.fn()),
  };

  const mockChannel: GroupChannel = {
    url: 'test-channel',
    name: 'Test Channel',
  } as GroupChannel;

  const wrapper = ({ children }) => (
    <ChannelSettingsContext.Provider value={mockStore}>
      {children}
    </ChannelSettingsContext.Provider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws an error if used outside of ChannelSettingsProvider', () => {
    try {
      renderHook(() => useChannelSettings());
    } catch (error) {
      expect(error.message).toBe('useChannelSettings must be used within a ChannelSettingsProvider');
    }
  });

  it('returns the correct initial state', () => {
    const initialState = {
      channel: null,
      loading: false,
      invalidChannel: false,
    };

    mockStore.getState.mockReturnValue(initialState);

    const { result } = renderHook(() => useChannelSettings(), { wrapper });

    expect(result.current.state).toEqual(initialState);
  });

  it('calls setChannel with the correct channel object', () => {
    const { result } = renderHook(() => useChannelSettings(), { wrapper });

    act(() => {
      result.current.actions.setChannel(mockChannel);
    });

    expect(mockStore.setState).toHaveBeenCalledWith(expect.any(Function));
    const stateSetter = mockStore.setState.mock.calls[0][0];
    expect(stateSetter({})).toEqual({ channel: mockChannel });
  });

  it('calls setLoading with the correct value', () => {
    const { result } = renderHook(() => useChannelSettings(), { wrapper });

    act(() => {
      result.current.actions.setLoading(true);
    });

    expect(mockStore.setState).toHaveBeenCalledWith(expect.any(Function));
    const stateSetter = mockStore.setState.mock.calls[0][0];
    expect(stateSetter({})).toEqual({ loading: true });
  });

  it('calls setInvalid with the correct value', () => {
    const { result } = renderHook(() => useChannelSettings(), { wrapper });

    act(() => {
      result.current.actions.setInvalid(true);
    });

    expect(mockStore.setState).toHaveBeenCalledWith(expect.any(Function));
    const stateSetter = mockStore.setState.mock.calls[0][0];
    expect(stateSetter({})).toEqual({ invalidChannel: true });
  });
});
