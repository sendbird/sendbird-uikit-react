import React from 'react';
import { render } from '@testing-library/react';

import App from '../index';

const { sendbirdCapture } = vi.hoisted(() => ({
  sendbirdCapture: { props: null as any },
}));

// Isolate App from the real provider/SDK: capture the props App passes down.
vi.mock('../../../lib/Sendbird', () => ({
  __esModule: true,
  default: (props: any) => {
    sendbirdCapture.props = props;
    return null;
  },
}));

vi.mock('../AppLayout', () => ({
  __esModule: true,
  AppLayout: () => null,
}));

describe('App - direct-message hook forwarding', () => {
  beforeEach(() => {
    sendbirdCapture.props = null;
  });

  it('forwards onBeforeStartDirectMessage straight to SendbirdProvider', () => {
    const onBeforeStartDirectMessage = vi.fn((params) => params);
    render(<App appId="app-id" userId="user-id" onBeforeStartDirectMessage={onBeforeStartDirectMessage} />);

    expect(sendbirdCapture.props.onBeforeStartDirectMessage).toBe(onBeforeStartDirectMessage);
  });
});
