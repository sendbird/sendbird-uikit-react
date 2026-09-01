import React from 'react';
import { render } from '@testing-library/react';
import App from '../index';
import Sendbird from '../../../lib/Sendbird';

// App is a thin wrapper that forwards the customer's connection/init props to <Sendbird>
// (SendbirdProvider) and renders <AppLayout> as children. This proves the App -> SendbirdProvider
// half of the chain (App does not drop/mutate a customer connection prop). The provider -> SDK
// init/connect half is covered by SendbirdProvider.sdkInit.integration.spec.tsx.
vi.mock('../../../lib/Sendbird', () => ({
  __esModule: true,
  // Spy that captures the props App hands down; returns null so AppLayout never mounts.
  default: vi.fn(() => null),
}));

const lastSendbirdProps = () => {
  const calls = vi.mocked(Sendbird).mock.calls;
  return calls[calls.length - 1][0] as any;
};

describe('App — connection prop passthrough to SendbirdProvider (integration)', () => {
  it('forwards the customer connection/init props to SendbirdProvider unchanged', () => {
    const eventHandlers = { connection: { onConnected: vi.fn() } };
    const sdkInitParams = { localCacheEnabled: false };
    const customExtensionParams = { feature: 'custom' };

    render(
      <App
        appId="test-app-id"
        userId="user-42"
        accessToken="token-abc"
        customApiHost="https://api.custom"
        customWebSocketHost="wss://ws.custom"
        nickname="Alice"
        profileUrl="https://img/alice.png"
        sdkInitParams={sdkInitParams}
        customExtensionParams={customExtensionParams}
        eventHandlers={eventHandlers}
      />,
    );

    expect(lastSendbirdProps()).toEqual(expect.objectContaining({
      appId: 'test-app-id',
      userId: 'user-42',
      accessToken: 'token-abc',
      customApiHost: 'https://api.custom',
      customWebSocketHost: 'wss://ws.custom',
      nickname: 'Alice',
      profileUrl: 'https://img/alice.png',
      sdkInitParams,
      customExtensionParams,
      eventHandlers,
    }));
  });

  it('applies empty-string defaults for optional connection props when omitted', () => {
    render(<App appId="test-app-id" userId="user-42" />);

    expect(lastSendbirdProps()).toEqual(expect.objectContaining({
      appId: 'test-app-id',
      userId: 'user-42',
      accessToken: '',
      customApiHost: '',
      customWebSocketHost: '',
      nickname: '',
      profileUrl: '',
    }));
  });
});
