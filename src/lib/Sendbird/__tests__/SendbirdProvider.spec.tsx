import React from 'react';
import { render } from '@testing-library/react';
import { SendbirdContextProvider } from '../context/SendbirdProvider';
import useSendbird from '../context/hooks/useSendbird';

const mockState = {
  stores: { sdkStore: { initialized: false } },
  config: { logger: console, groupChannel: { enableVoiceMessage: false } },
};
const mockActions = { connect: jest.fn(), disconnect: jest.fn() };

jest.mock('../context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(() => ({ state: mockState, actions: mockActions })),
  useSendbird: jest.fn(() => ({ state: mockState, actions: mockActions })),
}));

describe('SendbirdProvider', () => {
  beforeEach(() => {
    // Reset mock functions before each test
    jest.clearAllMocks();

    // Mock MediaRecorder.isTypeSupported
    global.MediaRecorder = {
      isTypeSupported: jest.fn((type) => {
        const supportedMimeTypes = ['audio/webm', 'audio/wav'];
        return supportedMimeTypes.includes(type);
      }),
    };

    // Mock useSendbird return value
    useSendbird.mockReturnValue({
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
        isNewApp: true,
        userId: 'mockUserId',
      }),
    );
  });

  it('should preserve the legacy isNewApp behavior across app and user changes', () => {
    const { rerender } = render(
      <SendbirdContextProvider appId="mockAppId" userId="mockUserId">
        <div data-testid="child">Child Component</div>
      </SendbirdContextProvider>,
    );

    expect(mockActions.connect).toHaveBeenNthCalledWith(1, expect.objectContaining({
      appId: 'mockAppId',
      isNewApp: true,
      userId: 'mockUserId',
    }));

    rerender(
      <SendbirdContextProvider appId="mockAppId" userId="nextUserId">
        <div data-testid="child">Child Component</div>
      </SendbirdContextProvider>,
    );

    expect(mockActions.connect).toHaveBeenNthCalledWith(2, expect.objectContaining({
      appId: 'mockAppId',
      isNewApp: false,
      userId: 'nextUserId',
    }));

    rerender(
      <SendbirdContextProvider appId="nextAppId" userId="nextUserId">
        <div data-testid="child">Child Component</div>
      </SendbirdContextProvider>,
    );

    expect(mockActions.connect).toHaveBeenNthCalledWith(3, expect.objectContaining({
      appId: 'nextAppId',
      isNewApp: true,
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
      isNewApp: true,
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
