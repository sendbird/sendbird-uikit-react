/**
 * Phase 4 — parity with legacy unread tracking (RV-4.9).
 *
 * Simulates the legacy 3-source pipeline (coreTs `newMessages`,
 * `MessageList.unreadSinceDate`, `GroupChannelState.firstUnreadMessageId`)
 * for a representative sequence of events and asserts the reducer's
 * derived equivalent matches.
 *
 * The legacy simulation here is a minimal hand-rolled model — it captures
 * the publicly observable values, not the implementation detail of when
 * each source updates. Phase 5+ (post-cycle) replaces these sources with
 * the reducer; the parity test acts as the migration safety net.
 */
import { unreadReducer, type UnreadMessage } from '../reducer';
import { createInitialUnreadState } from '../model';

type LegacyState = {
  newMessageIds: number[];
  unreadSinceDate: number | null;
  firstUnreadMessageId: number | null;
};

const initialLegacy = (): LegacyState => ({
  newMessageIds: [],
  unreadSinceDate: null,
  firstUnreadMessageId: null,
});

function legacyReceive(
  legacy: LegacyState,
  messages: ReadonlyArray<UnreadMessage>,
  fromCurrentUser: boolean,
  isAtBottom: boolean,
): LegacyState {
  if (fromCurrentUser) return legacy;
  if (messages.length === 0) return legacy;
  if (isAtBottom) return legacy;
  const ids = new Set(legacy.newMessageIds);
  let firstAnchor: UnreadMessage | null = null;
  for (const m of messages) {
    if (!ids.has(m.messageId)) {
      if (!firstAnchor) firstAnchor = m;
      ids.add(m.messageId);
    }
  }
  return {
    newMessageIds: Array.from(ids),
    unreadSinceDate: legacy.unreadSinceDate ?? firstAnchor?.createdAt ?? null,
    firstUnreadMessageId: legacy.firstUnreadMessageId ?? firstAnchor?.messageId ?? null,
  };
}

function legacyReachBottom(): LegacyState {
  return initialLegacy();
}

function legacyMarkAsUnread(legacy: LegacyState, messageId: number, createdAt: number): LegacyState {
  const ids = new Set(legacy.newMessageIds);
  ids.add(messageId);
  return {
    newMessageIds: Array.from(ids),
    unreadSinceDate: createdAt,
    firstUnreadMessageId: messageId,
  };
}

describe('Phase 4 — reducer parity with legacy unread tracking (RV-4.9)', () => {
  it('a typical "receive away from bottom" sequence produces matching counts and anchors', () => {
    let legacy = initialLegacy();
    let r = createInitialUnreadState();

    const burst1: UnreadMessage[] = [
      { messageId: 1, createdAt: 100 },
      { messageId: 2, createdAt: 200 },
    ];
    legacy = legacyReceive(legacy, burst1, false, false);
    r = unreadReducer(r, {
      type: 'MESSAGES_RECEIVED',
      messages: burst1,
      fromCurrentUser: false,
    }, { isAtBottom: false });

    expect(r.unreadCount).toBe(legacy.newMessageIds.length);
    expect(r.firstUnreadMessageId).toBe(legacy.firstUnreadMessageId);
    expect(r.firstUnreadCreatedAt).toBe(legacy.unreadSinceDate);

    const burst2: UnreadMessage[] = [{ messageId: 3, createdAt: 300 }];
    legacy = legacyReceive(legacy, burst2, false, false);
    r = unreadReducer(r, {
      type: 'MESSAGES_RECEIVED',
      messages: burst2,
      fromCurrentUser: false,
    }, { isAtBottom: false });

    expect(r.unreadCount).toBe(legacy.newMessageIds.length);
    expect(r.firstUnreadMessageId).toBe(legacy.firstUnreadMessageId);
  });

  it('reach bottom clears both legacy and reducer state', () => {
    let legacy = initialLegacy();
    let r = createInitialUnreadState();
    legacy = legacyReceive(legacy, [{ messageId: 1, createdAt: 100 }], false, false);
    r = unreadReducer(r, {
      type: 'MESSAGES_RECEIVED',
      messages: [{ messageId: 1, createdAt: 100 }],
      fromCurrentUser: false,
    }, { isAtBottom: false });

    legacy = legacyReachBottom();
    r = unreadReducer(r, { type: 'USER_REACHED_BOTTOM', at: 200 });

    expect(r.unreadCount).toBe(legacy.newMessageIds.length);
    expect(r.firstUnreadMessageId).toBe(legacy.firstUnreadMessageId);
    expect(r.firstUnreadCreatedAt).toBe(legacy.unreadSinceDate);
  });

  it('current-user messages do not move either source', () => {
    let legacy = initialLegacy();
    let r = createInitialUnreadState();
    legacy = legacyReceive(legacy, [{ messageId: 1, createdAt: 100 }], true, false);
    r = unreadReducer(r, {
      type: 'MESSAGES_RECEIVED',
      messages: [{ messageId: 1, createdAt: 100 }],
      fromCurrentUser: true,
    }, { isAtBottom: false });
    expect(r.unreadCount).toBe(legacy.newMessageIds.length);
    expect(r.unreadCount).toBe(0);
  });

  it('mark-as-unread sets the anchor in both legacy and reducer to the chosen message', () => {
    let legacy = initialLegacy();
    let r = createInitialUnreadState();
    legacy = legacyMarkAsUnread(legacy, 42, 4200);
    r = unreadReducer(r, { type: 'MARK_AS_UNREAD_SET', messageId: 42, createdAt: 4200 });

    expect(r.firstUnreadMessageId).toBe(legacy.firstUnreadMessageId);
    expect(r.firstUnreadCreatedAt).toBe(legacy.unreadSinceDate);
    expect(r.unreadCount).toBe(legacy.newMessageIds.length);
  });
});
