import React from 'react';
import { render } from '@testing-library/react';
import type { Mock } from 'vitest';
import { SendbirdContextProvider } from '../context/SendbirdProvider';
import useSendbird from '../context/hooks/useSendbird';

const mockState = {
  stores: { sdkStore: { initialized: false } },
  config: { logger: console, groupChannel: { enableVoiceMessage: false } },
};
const mockActions = { connect: vi.fn(), disconnect: vi.fn() };

vi.mock('../context/hooks/useSendbird', () => ({
  __esModule: true,
  default: vi.fn(() => ({ state: mockState, actions: mockActions })),
  useSendbird: vi.fn(() => ({ state: mockState, actions: mockActions })),
}));

describe('SendbirdProvider', () => {
  beforeEach(() => {
    // Reset mock functions before each test
    vi.clearAllMocks();

    // Mock MediaRecorder.isTypeSupported
    global.MediaRecorder = {
      isTypeSupported: vi.fn((type) => {
        const supportedMimeTypes = ['audio/webm', 'audio/wav'];
        return supportedMimeTypes.includes(type);
      }),
    } as unknown as typeof MediaRecorder;

    // Mock useSendbird return value
    (useSendbird as unknown as Mock).mockReturnValue({
      state: mockState,
      actions: mockActions,
    });
  });

  it('should render child components', () => {
    const { getByTestId } = render(
      <SendbirdContextProvider appId="mockAppId" userId="mockUserId">
        <div data-testid="child">Child Component</div>
      </SendbirdContextProvider>,
    );

    expect(getByTestId('child')).toBeInTheDocument();
  });

  it('should call connect when mounted', () => {
    render(
      <SendbirdContextProvider appId="mockAppId" userId="mockUserId">
        <div data-testid="child">Child Component</div>
      </SendbirdContextProvider>,
    );

    expect(mockActions.connect).toHaveBeenCalledWith(
      expect.objectContaining({
        appId: 'mockAppId',
        userId: 'mockUserId',
      }),
    );
  });

  it('should never ask connect for a new SDK instance', () => {
    const { rerender } = render(
      <SendbirdContextProvider appId="mockAppId" userId="mockUserId">
        <div data-testid="child">Child Component</div>
      </SendbirdContextProvider>,
    );

    rerender(
      <SendbirdContextProvider appId="mockAppId" userId="nextUserId">
        <div data-testid="child">Child Component</div>
      </SendbirdContextProvider>,
    );

    rerender(
      <SendbirdContextProvider appId="nextAppId" userId="nextUserId">
        <div data-testid="child">Child Component</div>
      </SendbirdContextProvider>,
    );

    expect(mockActions.connect).toHaveBeenCalledTimes(3);
    // Whether a new SendbirdChat instance is needed is decided in connect() from the
    // cached instance's appId, never inferred from the provider's own mount history.
    mockActions.connect.mock.calls.forEach(([params]) => {
      expect(params).not.toHaveProperty('isNewApp');
    });
    expect(mockActions.connect).toHaveBeenNthCalledWith(3, expect.objectContaining({
      appId: 'nextAppId',
      userId: 'nextUserId',
    }));
  });

  it('should reconnect on StrictMode remount with the same appId and userId', () => {
    render(
      <React.StrictMode>
        <SendbirdContextProvider appId="mockAppId" userId="mockUserId">
          <div data-testid="child">Child Component</div>
        </SendbirdContextProvider>
      </React.StrictMode>,
    );

    expect(mockActions.connect).toHaveBeenCalledTimes(2);
    expect(mockActions.connect).toHaveBeenNthCalledWith(1, expect.objectContaining({
      appId: 'mockAppId',
      userId: 'mockUserId',
    }));
    expect(mockActions.connect).toHaveBeenNthCalledWith(2, expect.objectContaining({
      appId: 'mockAppId',
      userId: 'mockUserId',
    }));
  });

  it('should call disconnect on unmount', () => {
    const { unmount } = render(
      <SendbirdContextProvider appId="mockAppId" userId="mockUserId">
        <div data-testid="child">Child Component</div>
      </SendbirdContextProvider>,
    );

    unmount();
    expect(mockActions.disconnect).toHaveBeenCalled();
  });
});
