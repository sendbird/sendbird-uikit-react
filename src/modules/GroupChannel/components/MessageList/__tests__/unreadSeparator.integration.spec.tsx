/**
 * Phase 5.2.b.c — UnreadReducer ↔ consumer integration.
 *
 * Scoped down from the original AC-5 (which proposed mounting the full
 * `<GroupChannelProvider>` stack with mocked SDK + collection). The
 * Provider's dependency chain (useSendbird, useGroupChannelMessages,
 * useGroupChannelHandler, scroll plumbing) is too heavy for a unit-style
 * jest mount — initial attempt OOM'd. Per Plan §5 risk mitigation, we
 * fall back to exercising the same observable behavior via:
 *
 *   1. The reducer + integration helper (5.2.b.a/5.2.b.b code path)
 *   2. The `useUnreadSelector` hook reading through the context
 *
 * This covers the contract MessageList.firstUnreadMessage (5.2.b.c) now
 * depends on: dispatch → reducer state → selector output. The
 * Provider's `useEffect` shape itself is straightforward and is already
 * type-checked + built; a future cycle can add a full app-shell spec if
 * the integration risk merits it.
 */
import React from 'react';
import { render, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GroupChannelUnreadContext } from '../../../context/GroupChannelUnreadContext';
import { useUnreadSelector } from '../../../context/hooks/useUnreadSelector';
import {
  createUnreadStore,
  dispatchToUnreadStore,
} from '../../../internal/unread/integration';
import {
  selectFirstUnreadMessageId,
  selectFirstUnreadCreatedAt,
  selectUnreadCount,
  selectUnreadMode,
} from '../../../internal/unread/selectors';

type Observed = {
  firstUnreadMessageId: number | null;
  firstUnreadCreatedAt: number | null;
  unreadCount: number;
  mode: ReturnType<typeof selectUnreadMode>;
};

let observed: Observed = {
  firstUnreadMessageId: null,
  firstUnreadCreatedAt: null,
  unreadCount: 0,
  mode: 'clean',
};

const Probe: React.FC = () => {
  observed = {
    firstUnreadMessageId: useUnreadSelector(selectFirstUnreadMessageId),
    firstUnreadCreatedAt: useUnreadSelector(selectFirstUnreadCreatedAt),
    unreadCount: useUnreadSelector(selectUnreadCount),
    mode: useUnreadSelector(selectUnreadMode),
  };
  return null;
};

function mount(store = createUnreadStore()) {
  return render(
    <GroupChannelUnreadContext.Provider value={store}>
      <Probe />
    </GroupChannelUnreadContext.Provider>,
  );
}

describe('Phase 5.2.b.c — UnreadReducer ↔ consumer integration', () => {
  beforeEach(() => {
    observed = { firstUnreadMessageId: null, firstUnreadCreatedAt: null, unreadCount: 0, mode: 'clean' };
  });

  it('mount with no dispatch → consumer sees clean state', () => {
    mount();
    expect(observed.mode).toBe('clean');
    expect(observed.firstUnreadMessageId).toBeNull();
    expect(observed.unreadCount).toBe(0);
  });

  it('CHANNEL_HYDRATED with server unread → consumer sees seeded tracking', () => {
    const store = createUnreadStore();
    mount(store);
    expect(observed.mode).toBe('clean');

    act(() => {
      dispatchToUnreadStore(store, {
        type: 'CHANNEL_HYDRATED',
        channelUrl: 'ch-pre',
        unreadCount: 3,
        firstUnreadMessageId: 20,
        firstUnreadCreatedAt: 1500,
        unreadMessageIds: [20, 21, 22],
        lastReadAt: 1000,
      });
    });
    expect(observed.mode).toBe('tracking');
    expect(observed.firstUnreadMessageId).toBe(20);
    expect(observed.firstUnreadCreatedAt).toBe(1500);
    expect(observed.unreadCount).toBe(3);
  });

  it('CHANNEL_HYDRATED with zero unread → consumer stays clean (lastReadAt records)', () => {
    const store = createUnreadStore();
    mount(store);

    act(() => {
      dispatchToUnreadStore(store, {
        type: 'CHANNEL_HYDRATED',
        channelUrl: 'ch-clean',
        unreadCount: 0,
        firstUnreadMessageId: null,
        firstUnreadCreatedAt: null,
        unreadMessageIds: [],
        lastReadAt: 2000,
      });
    });
    expect(observed.mode).toBe('clean');
    expect(observed.firstUnreadMessageId).toBeNull();
    expect(observed.unreadCount).toBe(0);
    expect(store.getState().lastReadAt).toBe(2000);
  });

  it('hydrate + receive away from bottom → count grows, anchor stays on first seed', () => {
    const store = createUnreadStore();
    mount(store);

    act(() => {
      dispatchToUnreadStore(store, {
        type: 'CHANNEL_HYDRATED',
        channelUrl: 'ch1',
        unreadCount: 2,
        firstUnreadMessageId: 10,
        firstUnreadCreatedAt: 1000,
        unreadMessageIds: [10, 11],
        lastReadAt: 999,
      });
    });
    expect(observed.firstUnreadMessageId).toBe(10);
    expect(observed.unreadCount).toBe(2);

    act(() => {
      dispatchToUnreadStore(
        store,
        {
          type: 'MESSAGES_RECEIVED',
          messages: [{ messageId: 12, createdAt: 1100 }, { messageId: 13, createdAt: 1200 }],
          fromCurrentUser: false,
        },
        { isAtBottom: false },
      );
    });
    expect(observed.firstUnreadMessageId).toBe(10); // anchor unchanged
    expect(observed.unreadCount).toBe(4);
  });

  it('hydrate + mark-as-unread → user pin overrides, mode=marked-unread', () => {
    const store = createUnreadStore();
    mount(store);

    act(() => {
      dispatchToUnreadStore(store, {
        type: 'CHANNEL_HYDRATED',
        channelUrl: 'ch1',
        unreadCount: 1,
        firstUnreadMessageId: 50,
        firstUnreadCreatedAt: 5000,
        unreadMessageIds: [50],
        lastReadAt: 4900,
      });
    });
    expect(observed.firstUnreadMessageId).toBe(50);

    act(() => {
      dispatchToUnreadStore(store, {
        type: 'MARK_AS_UNREAD_SET',
        messageId: 99,
        createdAt: 9900,
      });
    });
    expect(observed.mode).toBe('marked-unread');
    expect(observed.firstUnreadMessageId).toBe(99);
  });

  it('hydrate then channel switch → fresh seed survives the previous state', () => {
    const store = createUnreadStore();
    mount(store);

    act(() => {
      dispatchToUnreadStore(store, {
        type: 'CHANNEL_HYDRATED',
        channelUrl: 'ch-a',
        unreadCount: 2,
        firstUnreadMessageId: 10,
        firstUnreadCreatedAt: 1000,
        unreadMessageIds: [10, 11],
        lastReadAt: 999,
      });
    });
    expect(observed.firstUnreadMessageId).toBe(10);

    act(() => {
      dispatchToUnreadStore(store, { type: 'CHANNEL_CHANGED', channelUrl: 'ch-b' });
    });
    expect(observed.mode).toBe('clean');
    expect(observed.firstUnreadMessageId).toBeNull();

    act(() => {
      dispatchToUnreadStore(store, {
        type: 'CHANNEL_HYDRATED',
        channelUrl: 'ch-b',
        unreadCount: 5,
        firstUnreadMessageId: 200,
        firstUnreadCreatedAt: 20000,
        unreadMessageIds: [200, 201, 202, 203, 204],
        lastReadAt: 19999,
      });
    });
    expect(observed.firstUnreadMessageId).toBe(200);
    expect(observed.unreadCount).toBe(5);
  });
});
