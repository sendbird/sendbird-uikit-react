import React from 'react';
import { render } from '@testing-library/react';
import OpenChannelApp from '../index';
import Sendbird from '../../../lib/Sendbird';

// OpenChannelApp is a thin wrapper that forwards the customer's connection props to <Sendbird>
// (SendbirdProvider) and renders the open-channel layout as children. This proves the
// OpenChannelApp -> SendbirdProvider half of the chain; provider -> SDK is covered by
// SendbirdProvider.sdkInit.integration.spec.tsx.
vi.mock('../../../lib/Sendbird', () => ({
  __esModule: true,
  default: vi.fn(() => null), // spy that captures props; returns null so the layout never mounts
}));

const lastSendbirdProps = () => {
  const calls = vi.mocked(Sendbird).mock.calls;
  return calls[calls.length - 1][0] as any;
};

describe('OpenChannelApp — connection prop passthrough to SendbirdProvider (integration)', () => {
  it('forwards the customer connection props to SendbirdProvider', () => {
    const imageCompression = { compressionRate: 0.5 };

    render(
      <OpenChannelApp
        appId="test-app-id"
        userId="user-42"
        nickname="Alice"
        theme="dark"
        imageCompression={imageCompression}
      />,
    );

    expect(lastSendbirdProps()).toEqual(expect.objectContaining({
      appId: 'test-app-id',
      userId: 'user-42',
      nickname: 'Alice',
      theme: 'dark',
      imageCompression,
    }));
  });
});
