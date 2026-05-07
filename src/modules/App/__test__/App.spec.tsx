import React from 'react';
import { act, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

const mockSendbird = jest.fn(({ children }) => (
  <div data-testid="sendbird-provider">
    {children}
  </div>
));
const mockAppLayout = jest.fn((props) => (
  <div data-testid="app-layout">
    {props.currentChannel?.url ?? 'no-channel'}
  </div>
));

jest.mock('../../../lib/Sendbird', () => ({
  __esModule: true,
  default: (props) => mockSendbird(props),
}));

jest.mock('../AppLayout', () => ({
  AppLayout: (props) => mockAppLayout(props),
}));

import App from '..';

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the Sendbird provider and AppLayout with the expected default props', () => {
    const onProfileEditSuccess = jest.fn();

    render(
      <App
        appId="mock-app-id"
        userId="mock-user-id"
        allowProfileEdit
        onProfileEditSuccess={onProfileEditSuccess}
      />,
    );

    expect(screen.getByTestId('sendbird-provider')).toBeInTheDocument();
    expect(screen.getByTestId('app-layout')).toHaveTextContent('no-channel');
    expect(mockSendbird).toHaveBeenCalledWith(expect.objectContaining({
      appId: 'mock-app-id',
      userId: 'mock-user-id',
      accessToken: '',
      customApiHost: '',
      customWebSocketHost: '',
      theme: 'light',
      htmlTextDirection: 'ltr',
      forceLeftToRightMessageLayout: false,
    }));
    expect(mockAppLayout).toHaveBeenCalledWith(expect.objectContaining({
      allowProfileEdit: true,
      onProfileEditSuccess,
      disableAutoSelect: false,
      currentChannel: undefined,
      enableLegacyChannelModules: false,
    }));
  });

  it('updates AppLayout currentChannel from the Sendbird direct-message callback', () => {
    render(<App appId="mock-app-id" userId="mock-user-id" />);

    const selectedChannel = { url: 'selected-channel-url' };
    act(() => {
      mockSendbird.mock.calls[0][0].onStartDirectMessage(selectedChannel);
    });

    expect(mockAppLayout).toHaveBeenLastCalledWith(expect.objectContaining({
      currentChannel: selectedChannel,
    }));
    expect(screen.getByTestId('app-layout')).toHaveTextContent('selected-channel-url');
  });
});
