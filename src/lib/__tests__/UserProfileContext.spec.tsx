import React, { useContext } from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { UserProfileProvider, UserProfileContext } from '../UserProfileContext';

const { configOnBeforeCreateChannel } = vi.hoisted(() => ({ configOnBeforeCreateChannel: vi.fn() }));

const mockConfig = {
  common: { enableUsingDefaultUserProfile: true },
  renderUserProfile: undefined,
  onStartDirectMessage: undefined,
  onBeforeCreateChannel: configOnBeforeCreateChannel,
};

vi.mock('../Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: vi.fn(() => ({ state: { config: mockConfig } })),
}));

const Consumer = () => {
  const ctx = useContext(UserProfileContext);
  return (
    <div data-testid="result">
      {ctx.onBeforeCreateChannel === configOnBeforeCreateChannel ? 'from-config' : 'other'}
    </div>
  );
};

describe('UserProfileProvider - onBeforeCreateChannel wiring', () => {
  it('exposes config.onBeforeCreateChannel through the context value', () => {
    render(
      <UserProfileProvider>
        <Consumer />
      </UserProfileProvider>,
    );
    expect(screen.getByTestId('result')).toHaveTextContent('from-config');
  });

  it('ignores a spread onBeforeCreateChannel prop and always reads from config (create-list flow must not leak in)', () => {
    const listFlowCallback = vi.fn();
    const spreadProps = { onBeforeCreateChannel: listFlowCallback } as any;

    render(
      <UserProfileProvider {...spreadProps}>
        <Consumer />
      </UserProfileProvider>,
    );

    expect(screen.getByTestId('result')).toHaveTextContent('from-config');
  });
});
