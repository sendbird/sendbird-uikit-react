import { renderHook, act } from '@testing-library/react-hooks';
import { useChannelSettings } from '../context/useChannelSettings';
import { useChannelSettingsContext } from '../context/ChannelSettingsProvider';
import type { GroupChannel } from '@sendbird/chat/groupChannel';

jest.mock('../context/ChannelSettingsProvider', () => ({
  useChannelSettingsContext: jest.fn(),
}));

const mockStore = {
  getState: jest.fn(),
  setState: jest.fn(),
  subscribe: jest.fn(() => jest.fn()),
};

const mockChannel: GroupChannel = {
  url: 'test-channel',
  name: 'Test Channel',
} as GroupChannel;

beforeEach(() => {
  jest.clearAllMocks();
  (useChannelSettingsContext as jest.Mock).mockReturnValue(mockStore);
});

describe('useChannelSettings', () => {
  it('throws an error if used outside of ChannelSettingsProvider', () => {
    (useChannelSettingsContext as jest.Mock).mockReturnValueOnce(null);

    const { result } = renderHook(() => useChannelSettings());

    expect(result.error).toEqual(
      new Error('useChannelSettings must be used within a ChannelSettingsProvider'),
    );
  });

  it('returns the correct initial state', () => {
    const initialState = {
      channel: null,
      loading: false,
      invalidChannel: false,
    };

    mockStore.getState.mockReturnValue(initialState);

    const { result } = renderHook(() => useChannelSettings());

    expect(result.current.state).toEqual(initialState);
  });

  it('calls setChannel with the correct channel object', () => {
    const { result } = renderHook(() => useChannelSettings());

    act(() => {
      result.current.actions.setChannel(mockChannel);
    });

    expect(mockStore.setState).toHaveBeenCalledWith(expect.any(Function));
    const stateSetter = mockStore.setState.mock.calls[0][0];
    expect(stateSetter({})).toEqual({ channel: mockChannel });
  });

  it('calls setLoading with the correct value', () => {
    const { result } = renderHook(() => useChannelSettings());

    act(() => {
      result.current.actions.setLoading(true);
    });

    expect(mockStore.setState).toHaveBeenCalledWith(expect.any(Function));
    const stateSetter = mockStore.setState.mock.calls[0][0];
    expect(stateSetter({})).toEqual({ loading: true });
  });

  it('calls setInvalid with the correct value', () => {
    const { result } = renderHook(() => useChannelSettings());

    act(() => {
      result.current.actions.setInvalid(true);
    });

    expect(mockStore.setState).toHaveBeenCalledWith(expect.any(Function));
    const stateSetter = mockStore.setState.mock.calls[0][0];
    expect(stateSetter({})).toEqual({ invalidChannel: true });
  });
});
