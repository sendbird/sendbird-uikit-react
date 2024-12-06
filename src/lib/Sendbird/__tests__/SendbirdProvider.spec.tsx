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
        userId: 'mockUserId',
      }),
    );
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
