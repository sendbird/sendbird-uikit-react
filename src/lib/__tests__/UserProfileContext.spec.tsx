import React, { useContext } from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { UserProfileProvider, UserProfileContext } from '../UserProfileContext';

const { configCallback } = vi.hoisted(() => ({ configCallback: vi.fn() }));

const mockConfig = {
  common: { enableUsingDefaultUserProfile: true },
  renderUserProfile: undefined,
  onStartDirectMessage: undefined,
  onBeforeStartDirectMessage: configCallback,
};

vi.mock('../Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: vi.fn(() => ({ state: { config: mockConfig } })),
}));

let captured: unknown;
const Consumer = () => {
  captured = useContext(UserProfileContext).onBeforeStartDirectMessage;
  return null;
};

describe('UserProfileProvider - onBeforeStartDirectMessage wiring', () => {
  beforeEach(() => {
    captured = undefined;
  });

  it('exposes config.onBeforeStartDirectMessage through the context value', () => {
    render(
      <UserProfileProvider>
        <Consumer />
      </UserProfileProvider>,
    );
    expect(captured).toBe(configCallback);
  });

  it('lets a provider prop override the config value', () => {
    const propCallback = vi.fn();
    render(
      <UserProfileProvider onBeforeStartDirectMessage={propCallback}>
        <Consumer />
      </UserProfileProvider>,
    );
    expect(captured).toBe(propCallback);
  });

  it('is unaffected by the unrelated create-list onBeforeCreateChannel prop', () => {
    const listFlowCallback = vi.fn();
    const spreadProps = { onBeforeCreateChannel: listFlowCallback } as any;
    render(
      <UserProfileProvider {...spreadProps}>
        <Consumer />
      </UserProfileProvider>,
    );
    expect(captured).toBe(configCallback);
  });
});
