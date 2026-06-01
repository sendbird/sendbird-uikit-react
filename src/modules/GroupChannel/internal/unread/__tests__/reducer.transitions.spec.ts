/**
 * Phase 4 RV — UnreadReducer transition table (RV-4.1, RV-4.7, RV-4.8).
 *
 * Covers all 7 UnreadEvent variants × the rules in design §7.6.
 */
import { unreadReducer, ALL_UNREAD_EVENT_TYPES, type UnreadMessage } from '../reducer';
import { createInitialUnreadState, UNREAD_STATE_SENTINELS } from '../model';

function msg(id: number, createdAt = id * 100): UnreadMessage {
  return { messageId: id, createdAt };
}

describe('Phase 4 — unreadReducer transitions (RV-4.1 et al)', () => {
  /* ─── Initial state ───────────────────────────────────────────── */
  it('createInitialUnreadState returns a clean snapshot', () => {
    const s = createInitialUnreadState();
    expect(s.mode).toBe('clean');
    expect(s.unreadCount).toBe(0);
    expect(s.firstUnreadMessageId).toBeNull();
    expect(s.firstUnreadCreatedAt).toBeNull();
    expect(s.separatorVisible).toBe(false);
    expect(s.badgeVisible).toBe(false);
    expect(s.shouldMarkAsRead).toBe(false);
    expect(s.lastReadAt).toBeNull();
    expect(s.unreadMessageIds).toBe(UNREAD_STATE_SENTINELS.EMPTY_NUMBER_SET);
  });

  /* ─── USER_LEFT_BOTTOM ────────────────────────────────────────── */
  it('USER_LEFT_BOTTOM does not mutate state', () => {
    const s0 = createInitialUnreadState();
    const r = unreadReducer(s0, { type: 'USER_LEFT_BOTTOM', at: 1000 });
    expect(r).toBe(s0);
  });

  /* ─── USER_REACHED_BOTTOM ─────────────────────────────────────── */
  it('USER_REACHED_BOTTOM from clean (no unread) only flips shouldMarkAsRead', () => {
    const s0 = createInitialUnreadState();
    const r = unreadReducer(s0, { type: 'USER_REACHED_BOTTOM', at: 1000 });
    expect(r.shouldMarkAsRead).toBe(true);
    expect(r.mode).toBe('clean');
  });

  it('USER_REACHED_BOTTOM from tracking clears unread and schedules mark-as-read', () => {
    const s = unreadReducer(createInitialUnreadState(), {
      type: 'MESSAGES_RECEIVED',
      messages: [msg(1), msg(2)],
      fromCurrentUser: false,
    }, { isAtBottom: false });
    expect(s.mode).toBe('tracking');

    const r = unreadReducer(s, { type: 'USER_REACHED_BOTTOM', at: 1500 });
    expect(r.mode).toBe('clean');
    expect(r.unreadCount).toBe(0);
    expect(r.firstUnreadMessageId).toBeNull();
    expect(r.shouldMarkAsRead).toBe(true);
  });

  it('USER_REACHED_BOTTOM preserves marked-unread mode but still schedules mark-as-read flag', () => {
    const s = unreadReducer(createInitialUnreadState(), {
      type: 'MARK_AS_UNREAD_SET',
      messageId: 9,
      createdAt: 999,
    });
    expect(s.mode).toBe('marked-unread');

    const r = unreadReducer(s, { type: 'USER_REACHED_BOTTOM', at: 2000 });
    expect(r.mode).toBe('marked-unread'); // preserved
    expect(r.shouldMarkAsRead).toBe(true);
  });

  /* ─── MESSAGES_RECEIVED — RV-4.7 sender filtering ─────────────── */
  it('RV-4.7  MESSAGES_RECEIVED fromCurrentUser=true does not increment unread', () => {
    const s0 = createInitialUnreadState();
    const r = unreadReducer(s0, {
      type: 'MESSAGES_RECEIVED',
      messages: [msg(1)],
      fromCurrentUser: true,
    }, { isAtBottom: false });
    expect(r).toBe(s0);
  });

  it('MESSAGES_RECEIVED at bottom + clean → stays clean and only flips shouldMarkAsRead', () => {
    const s0 = createInitialUnreadState();
    const r = unreadReducer(s0, {
      type: 'MESSAGES_RECEIVED',
      messages: [msg(1)],
      fromCurrentUser: false,
    }, { isAtBottom: true });
    expect(r.mode).toBe('clean');
    expect(r.unreadCount).toBe(0);
    expect(r.shouldMarkAsRead).toBe(true);
  });

  it('MESSAGES_RECEIVED away from bottom enters tracking mode and grows the counter', () => {
    const s0 = createInitialUnreadState();
    const r = unreadReducer(s0, {
      type: 'MESSAGES_RECEIVED',
      messages: [msg(1), msg(2), msg(3)],
      fromCurrentUser: false,
    }, { isAtBottom: false });
    expect(r.mode).toBe('tracking');
    expect(r.unreadCount).toBe(3);
    expect(r.firstUnreadMessageId).toBe(1);
    expect(r.firstUnreadCreatedAt).toBe(100);
    expect(r.separatorVisible).toBe(true);
    expect(r.badgeVisible).toBe(true);
  });

  it('Subsequent MESSAGES_RECEIVED in tracking grows the count but keeps the anchor', () => {
    const s = unreadReducer(createInitialUnreadState(), {
      type: 'MESSAGES_RECEIVED',
      messages: [msg(1), msg(2)],
      fromCurrentUser: false,
    }, { isAtBottom: false });
    const r = unreadReducer(s, {
      type: 'MESSAGES_RECEIVED',
      messages: [msg(3), msg(4)],
      fromCurrentUser: false,
    }, { isAtBottom: false });
    expect(r.unreadCount).toBe(4);
    expect(r.firstUnreadMessageId).toBe(1); // anchor preserved
  });

  it('MESSAGES_RECEIVED in marked-unread mode grows count but keeps anchor (sticky)', () => {
    const s = unreadReducer(createInitialUnreadState(), {
      type: 'MARK_AS_UNREAD_SET',
      messageId: 5,
      createdAt: 500,
    });
    const r = unreadReducer(s, {
      type: 'MESSAGES_RECEIVED',
      messages: [msg(10)],
      fromCurrentUser: false,
    }, { isAtBottom: false });
    expect(r.mode).toBe('marked-unread');
    expect(r.firstUnreadMessageId).toBe(5); // sticky
    expect(r.unreadCount).toBeGreaterThan(s.unreadCount);
  });

  /* ─── MESSAGES_DELETED ────────────────────────────────────────── */
  it('MESSAGES_DELETED removes contributing ids and updates the count', () => {
    const s = unreadReducer(createInitialUnreadState(), {
      type: 'MESSAGES_RECEIVED',
      messages: [msg(1), msg(2), msg(3)],
      fromCurrentUser: false,
    }, { isAtBottom: false });
    const r = unreadReducer(s, { type: 'MESSAGES_DELETED', messageIds: [2] });
    expect(r.unreadCount).toBe(2);
    expect(Array.from(r.unreadMessageIds).sort()).toEqual([1, 3]);
  });

  it('MESSAGES_DELETED clears state when all unread messages are removed', () => {
    const s = unreadReducer(createInitialUnreadState(), {
      type: 'MESSAGES_RECEIVED',
      messages: [msg(1)],
      fromCurrentUser: false,
    }, { isAtBottom: false });
    const r = unreadReducer(s, { type: 'MESSAGES_DELETED', messageIds: [1] });
    expect(r.mode).toBe('clean');
    expect(r.unreadCount).toBe(0);
    expect(r.separatorVisible).toBe(false);
    expect(r.badgeVisible).toBe(false);
  });

  it('MESSAGES_DELETED in marked-unread mode deleting the anchor clears separator but may keep count', () => {
    const s0 = unreadReducer(createInitialUnreadState(), {
      type: 'MARK_AS_UNREAD_SET',
      messageId: 5,
      createdAt: 500,
    });
    // Add another unread message in marked-unread mode
    const s1 = unreadReducer(s0, {
      type: 'MESSAGES_RECEIVED',
      messages: [msg(7)],
      fromCurrentUser: false,
    });
    const r = unreadReducer(s1, { type: 'MESSAGES_DELETED', messageIds: [5] });
    expect(r.firstUnreadMessageId).toBeNull();
    expect(r.separatorVisible).toBe(false);
    expect(r.unreadCount).toBe(1); // message 7 still present
  });

  it('MESSAGES_DELETED with unknown ids is a no-op', () => {
    const s = unreadReducer(createInitialUnreadState(), {
      type: 'MESSAGES_RECEIVED',
      messages: [msg(1)],
      fromCurrentUser: false,
    }, { isAtBottom: false });
    const r = unreadReducer(s, { type: 'MESSAGES_DELETED', messageIds: [99] });
    expect(r).toBe(s);
  });

  /* ─── MARK_AS_UNREAD_SET ──────────────────────────────────────── */
  it('MARK_AS_UNREAD_SET pins the separator and switches mode to marked-unread', () => {
    const s0 = createInitialUnreadState();
    const r = unreadReducer(s0, {
      type: 'MARK_AS_UNREAD_SET',
      messageId: 42,
      createdAt: 4200,
    });
    expect(r.mode).toBe('marked-unread');
    expect(r.firstUnreadMessageId).toBe(42);
    expect(r.firstUnreadCreatedAt).toBe(4200);
    expect(r.separatorVisible).toBe(true);
    expect(r.badgeVisible).toBe(true);
    expect(r.shouldMarkAsRead).toBe(false);
  });

  /* ─── RV-4.8  cache/API replace preserves marked-unread anchor ── */
  it('RV-4.8  MARK_AS_UNREAD_SET followed by message refresh preserves the anchor', () => {
    // Mark a message as unread, then a subsequent burst of MESSAGES_RECEIVED
    // (simulating coreTs cache/API hydration) should NOT reset the anchor.
    const s = unreadReducer(createInitialUnreadState(), {
      type: 'MARK_AS_UNREAD_SET',
      messageId: 5,
      createdAt: 500,
    });
    const r = unreadReducer(s, {
      type: 'MESSAGES_RECEIVED',
      messages: [msg(1), msg(2), msg(3), msg(4), msg(5), msg(6)],
      fromCurrentUser: false,
    });
    expect(r.mode).toBe('marked-unread');
    expect(r.firstUnreadMessageId).toBe(5);
    expect(r.firstUnreadCreatedAt).toBe(500);
    expect(r.separatorVisible).toBe(true);
  });

  /* ─── READ_CONFIRMED ──────────────────────────────────────────── */
  it('READ_CONFIRMED clears shouldMarkAsRead and records lastReadAt', () => {
    const s = { ...createInitialUnreadState(), shouldMarkAsRead: true };
    const r = unreadReducer(s, { type: 'READ_CONFIRMED', channelUrl: 'ch1', at: 9999 });
    expect(r.shouldMarkAsRead).toBe(false);
    expect(r.lastReadAt).toBe(9999);
  });

  /* ─── CHANNEL_CHANGED ─────────────────────────────────────────── */
  it('CHANNEL_CHANGED resets to a fresh UnreadState', () => {
    const s = unreadReducer(createInitialUnreadState(), {
      type: 'MARK_AS_UNREAD_SET',
      messageId: 99,
      createdAt: 9900,
    });
    const r = unreadReducer(s, { type: 'CHANNEL_CHANGED', channelUrl: 'ch2' });
    expect(r.mode).toBe('clean');
    expect(r.firstUnreadMessageId).toBeNull();
    expect(r.unreadCount).toBe(0);
  });

  /* ─── CHANNEL_HYDRATED (5.2.b.a) ─────────────────────────────── */
  it('CHANNEL_HYDRATED from clean with zero unread → clean state, lastReadAt recorded', () => {
    const r = unreadReducer(createInitialUnreadState(), {
      type: 'CHANNEL_HYDRATED',
      channelUrl: 'ch1',
      unreadCount: 0,
      firstUnreadMessageId: null,
      firstUnreadCreatedAt: null,
      unreadMessageIds: [],
      lastReadAt: 5000,
    });
    expect(r.mode).toBe('clean');
    expect(r.firstUnreadMessageId).toBeNull();
    expect(r.unreadCount).toBe(0);
    expect(r.unreadMessageIds.size).toBe(0);
    expect(r.lastReadAt).toBe(5000);
    expect(r.separatorVisible).toBe(false);
    expect(r.badgeVisible).toBe(false);
  });

  it('CHANNEL_HYDRATED from clean with N unread → tracking with seeded anchor + set', () => {
    const r = unreadReducer(createInitialUnreadState(), {
      type: 'CHANNEL_HYDRATED',
      channelUrl: 'ch1',
      unreadCount: 3,
      firstUnreadMessageId: 42,
      firstUnreadCreatedAt: 4200,
      unreadMessageIds: [42, 43, 44],
      lastReadAt: 4100,
    });
    expect(r.mode).toBe('tracking');
    expect(r.firstUnreadMessageId).toBe(42);
    expect(r.firstUnreadCreatedAt).toBe(4200);
    expect(r.unreadCount).toBe(3);
    expect(r.unreadMessageIds.size).toBe(3);
    expect(r.unreadMessageIds.has(42)).toBe(true);
    expect(r.unreadMessageIds.has(44)).toBe(true);
    expect(r.separatorVisible).toBe(true);
    expect(r.badgeVisible).toBe(true);
    expect(r.lastReadAt).toBe(4100);
  });

  it('CHANNEL_HYDRATED into marked-unread mode does NOT clobber the user pin', () => {
    const marked = unreadReducer(createInitialUnreadState(), {
      type: 'MARK_AS_UNREAD_SET',
      messageId: 99,
      createdAt: 9900,
    });
    expect(marked.mode).toBe('marked-unread');
    expect(marked.firstUnreadMessageId).toBe(99);

    const r = unreadReducer(marked, {
      type: 'CHANNEL_HYDRATED',
      channelUrl: 'ch1',
      unreadCount: 2,
      firstUnreadMessageId: 50,
      firstUnreadCreatedAt: 5000,
      unreadMessageIds: [50, 51],
      lastReadAt: 4500,
    });
    expect(r.mode).toBe('marked-unread');
    expect(r.firstUnreadMessageId).toBe(99); // user pin wins
    expect(r.lastReadAt).toBe(4500); // but lastReadAt does refresh
  });

  it('USER_REACHED_BOTTOM after CHANNEL_HYDRATED-tracking clears unread normally', () => {
    let s = unreadReducer(createInitialUnreadState(), {
      type: 'CHANNEL_HYDRATED',
      channelUrl: 'ch1',
      unreadCount: 2,
      firstUnreadMessageId: 10,
      firstUnreadCreatedAt: 1000,
      unreadMessageIds: [10, 11],
      lastReadAt: 999,
    });
    expect(s.mode).toBe('tracking');

    s = unreadReducer(s, { type: 'USER_REACHED_BOTTOM', at: 2000 });
    expect(s.mode).toBe('clean');
    expect(s.unreadCount).toBe(0);
    expect(s.shouldMarkAsRead).toBe(true);
    expect(s.firstUnreadMessageId).toBeNull();
  });

  /* ─── Exhaustiveness ──────────────────────────────────────────── */
  it('ALL_UNREAD_EVENT_TYPES enumerates the 8 documented variants', () => {
    expect(ALL_UNREAD_EVENT_TYPES.length).toBe(8);
    for (const t of ALL_UNREAD_EVENT_TYPES) {
      expect(t).toMatch(/^[A-Z_]+$/);
    }
  });
});
