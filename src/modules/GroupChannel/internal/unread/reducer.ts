/**
 * UnreadReducer — pure transitions over UnreadState.
 *
 * Phase 4 of the P0 runtime-coupling refactor (Plan §4.1 / Design §7.4).
 *
 * Contract:
 *   - Pure function. No IO, no `Date.now()` — the caller supplies `at`
 *     timestamps on events that need them.
 *   - Structural sharing: identity is preserved when a transition does
 *     not change the meaningful slice.
 *   - All visibility decisions (separatorVisible / badgeVisible /
 *     shouldMarkAsRead) are derived inside the reducer so the state
 *     object is a single self-consistent snapshot.
 *
 * Rule summary (design §7.6):
 *   - Sender filtering: messages from `fromCurrentUser` do NOT increment
 *     unreadCount or change mode.
 *   - Bottom behavior: USER_REACHED_BOTTOM clears tracking-mode unread
 *     and schedules mark-as-read. marked-unread mode is preserved.
 *   - Mark-as-unread: explicit MARK_AS_UNREAD_SET pins the separator on
 *     a specific message regardless of received/delete events.
 *   - Delete: deleting the anchor message clears or advances the
 *     separator depending on remaining unread messages.
 */
import {
  type UnreadState,
  UNREAD_STATE_SENTINELS,
  createInitialUnreadState,
} from './model';

/**
 * Lightweight message shape consumed by the reducer. The full
 * `SendableMessageType` is broader; we only need messageId + createdAt
 * + sender attribution.
 */
export type UnreadMessage = {
  messageId: number;
  createdAt: number;
};

export type UnreadEvent =
  | { type: 'USER_LEFT_BOTTOM'; at: number }
  | { type: 'USER_REACHED_BOTTOM'; at: number }
  | { type: 'MESSAGES_RECEIVED'; messages: ReadonlyArray<UnreadMessage>; fromCurrentUser: boolean }
  | { type: 'MESSAGES_DELETED'; messageIds: ReadonlyArray<number> }
  | { type: 'MARK_AS_UNREAD_SET'; messageId: number; createdAt: number }
  | { type: 'READ_CONFIRMED'; channelUrl: string; at: number }
  | { type: 'CHANNEL_CHANGED'; channelUrl: string };

export type UnreadEventType = UnreadEvent['type'];

export const ALL_UNREAD_EVENT_TYPES: ReadonlyArray<UnreadEventType> = [
  'CHANNEL_CHANGED',
  'MARK_AS_UNREAD_SET',
  'MESSAGES_DELETED',
  'MESSAGES_RECEIVED',
  'READ_CONFIRMED',
  'USER_LEFT_BOTTOM',
  'USER_REACHED_BOTTOM',
] as const;

/** Caller hint — only relevant for USER_REACHED_BOTTOM. */
export type UnreadReducerContext = {
  /**
   * Whether the user is currently at the bottom of the message list.
   * Used by MESSAGES_RECEIVED to decide between tracking (away) and
   * clean-with-mark-as-read (at bottom).
   */
  isAtBottom: boolean;
};

const DEFAULT_CONTEXT: UnreadReducerContext = { isAtBottom: true };

/**
 * Apply one UnreadEvent to UnreadState. Returns the same reference on
 * no-op transitions for identity preservation.
 */
export function unreadReducer(
  state: UnreadState,
  event: UnreadEvent,
  context: UnreadReducerContext = DEFAULT_CONTEXT,
): UnreadState {
  switch (event.type) {
    case 'USER_LEFT_BOTTOM': {
      // Leaving bottom is a context change, not a state change in itself.
      // The next MESSAGES_RECEIVED will see context.isAtBottom=false and
      // enter tracking mode if applicable. We do not mutate state here.
      return state;
    }

    case 'USER_REACHED_BOTTOM': {
      // Reaching bottom clears tracking-mode unread and schedules
      // mark-as-read. marked-unread mode is preserved (explicit user
      // intent overrides scroll position).
      if (state.mode === 'marked-unread') {
        if (state.shouldMarkAsRead) return state;
        return { ...state, shouldMarkAsRead: true };
      }
      if (state.mode === 'clean' && state.unreadCount === 0 && state.shouldMarkAsRead) {
        return state;
      }
      return {
        ...state,
        mode: 'clean',
        firstUnreadMessageId: null,
        firstUnreadCreatedAt: null,
        unreadMessageIds: UNREAD_STATE_SENTINELS.EMPTY_NUMBER_SET,
        unreadCount: 0,
        separatorVisible: false,
        badgeVisible: false,
        shouldMarkAsRead: true,
      };
    }

    case 'MESSAGES_RECEIVED': {
      if (event.fromCurrentUser) return state;
      if (event.messages.length === 0) return state;
      // Mark-as-unread mode is sticky — receives do not advance the
      // anchor, but the counter still grows so the badge reflects "new
      // since you marked unread".
      if (state.mode === 'marked-unread') {
        const next = addUnread(state, event.messages);
        return next;
      }
      // At bottom + clean → stay clean and schedule mark-as-read.
      if (context.isAtBottom && state.mode !== 'tracking') {
        if (state.shouldMarkAsRead) return state;
        return { ...state, shouldMarkAsRead: true };
      }
      // Away from bottom OR already tracking → grow the tracking set.
      return enterOrGrowTracking(state, event.messages);
    }

    case 'MESSAGES_DELETED': {
      if (event.messageIds.length === 0) return state;
      const idSet = new Set(event.messageIds);
      let removed = 0;
      const nextIds = new Set<number>();
      state.unreadMessageIds.forEach((id) => {
        if (idSet.has(id)) {
          removed += 1;
        } else {
          nextIds.add(id);
        }
      });
      if (removed === 0 && (state.firstUnreadMessageId === null || !idSet.has(state.firstUnreadMessageId))) {
        return state;
      }
      const anchorRemoved = state.firstUnreadMessageId !== null && idSet.has(state.firstUnreadMessageId);
      if (state.mode === 'marked-unread' && anchorRemoved) {
        // Marked-unread anchor was deleted — separator clears, unread
        // tracking reverts to clean if the count is now zero.
        const nextCount = nextIds.size;
        if (nextCount === 0) {
          return {
            ...state,
            mode: 'clean',
            firstUnreadMessageId: null,
            firstUnreadCreatedAt: null,
            unreadMessageIds: UNREAD_STATE_SENTINELS.EMPTY_NUMBER_SET,
            unreadCount: 0,
            separatorVisible: false,
            badgeVisible: false,
          };
        }
        return {
          ...state,
          firstUnreadMessageId: null,
          firstUnreadCreatedAt: null,
          unreadMessageIds: nextIds,
          unreadCount: nextCount,
          separatorVisible: false,
        };
      }
      // Tracking mode: if anchor removed, advance to the next earliest
      // unread (we approximate "next earliest" as just clearing — full
      // ordering reconciliation is out of scope here since the reducer
      // doesn't carry message createdAt for each id).
      const nextCount = nextIds.size;
      if (nextCount === 0) {
        return {
          ...state,
          mode: 'clean',
          firstUnreadMessageId: null,
          firstUnreadCreatedAt: null,
          unreadMessageIds: UNREAD_STATE_SENTINELS.EMPTY_NUMBER_SET,
          unreadCount: 0,
          separatorVisible: false,
          badgeVisible: false,
        };
      }
      return {
        ...state,
        firstUnreadMessageId: anchorRemoved ? null : state.firstUnreadMessageId,
        firstUnreadCreatedAt: anchorRemoved ? null : state.firstUnreadCreatedAt,
        unreadMessageIds: nextIds,
        unreadCount: nextCount,
        separatorVisible: !anchorRemoved && state.separatorVisible,
      };
    }

    case 'MARK_AS_UNREAD_SET': {
      const ids = new Set(state.unreadMessageIds);
      ids.add(event.messageId);
      return {
        ...state,
        mode: 'marked-unread',
        firstUnreadMessageId: event.messageId,
        firstUnreadCreatedAt: event.createdAt,
        unreadMessageIds: ids,
        unreadCount: ids.size,
        separatorVisible: true,
        badgeVisible: true,
        shouldMarkAsRead: false,
      };
    }

    case 'READ_CONFIRMED': {
      // SDK confirmed the read for this channel at `at`.
      return {
        ...state,
        shouldMarkAsRead: false,
        lastReadAt: event.at,
      };
    }

    case 'CHANNEL_CHANGED': {
      // Re-initialize for the new channel.
      return createInitialUnreadState();
    }

    default: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _exhaustive: never = event;
      return state;
    }
  }
}

/* ─── helpers ─────────────────────────────────────────────────── */

function enterOrGrowTracking(
  state: UnreadState,
  messages: ReadonlyArray<UnreadMessage>,
): UnreadState {
  const nextIds = new Set(state.unreadMessageIds);
  let anchorMsg: UnreadMessage | null = null;
  for (const m of messages) {
    if (!nextIds.has(m.messageId)) {
      if (!anchorMsg) anchorMsg = m;
      nextIds.add(m.messageId);
    }
  }
  if (nextIds.size === state.unreadMessageIds.size) return state;

  const firstUnreadMessageId = state.firstUnreadMessageId ?? anchorMsg?.messageId ?? null;
  const firstUnreadCreatedAt = state.firstUnreadCreatedAt ?? anchorMsg?.createdAt ?? null;

  return {
    ...state,
    mode: 'tracking',
    firstUnreadMessageId,
    firstUnreadCreatedAt,
    unreadMessageIds: nextIds,
    unreadCount: nextIds.size,
    separatorVisible: firstUnreadMessageId !== null,
    badgeVisible: nextIds.size > 0,
  };
}

function addUnread(state: UnreadState, messages: ReadonlyArray<UnreadMessage>): UnreadState {
  const nextIds = new Set(state.unreadMessageIds);
  for (const m of messages) nextIds.add(m.messageId);
  if (nextIds.size === state.unreadMessageIds.size) return state;
  return {
    ...state,
    unreadMessageIds: nextIds,
    unreadCount: nextIds.size,
    badgeVisible: true,
  };
}
