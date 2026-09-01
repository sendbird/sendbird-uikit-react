import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { CreateChannelProvider } from '../CreateChannelProvider';
import useCreateChannel from '../useCreateChannel';

// Verify the customer's create-channel callbacks passed to CreateChannelProvider reach the store
// state (prop -> store -> context) unchanged. Mirrors the callback-propagation pattern.
vi.mock('../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: vi.fn(() => ({
    state: {
      stores: { sdkStore: { sdk: { currentUser: { userId: 'test-user-id' } }, initialized: true } },
      config: { logger: console },
    },
  })),
}));

const onBeforeCreateChannel = vi.fn((users) => ({ invitedUserIds: users }));
const onCreateChannelClick = vi.fn();

describe('CreateChannelProvider — callback propagation (integration)', () => {
  it('exposes the customer onBeforeCreateChannel / onCreateChannelClick on the state unchanged', async () => {
    const wrapper = ({ children }) => (
      <CreateChannelProvider
        onChannelCreated={vi.fn()}
        onBeforeCreateChannel={onBeforeCreateChannel}
        onCreateChannelClick={onCreateChannelClick}
      >
        {children}
      </CreateChannelProvider>
    );

    const { result } = renderHook(() => useCreateChannel(), { wrapper });

    // `toBe` (reference identity) proves the provider seeds the store with the exact functions
    // (the state InviteUsers reads at create time) — not a wrapper/clone.
    await waitFor(() => {
      expect(result.current.state.onBeforeCreateChannel).toBe(onBeforeCreateChannel);
      expect(result.current.state.onCreateChannelClick).toBe(onCreateChannelClick);
    });
  });
});
