/**
 * UnreadState — model shape for the unread/separator/mark-as-read domain.
 *
 * Phase 4 of the P0 runtime-coupling refactor (Plan §4.1 / Design §7.3).
 *
 * Today's UIKit React splits unread tracking across three sources:
 *   - coreTs `useGroupChannelMessages.newMessages` (the "new messages
 *     button" counter).
 *   - `MessageList` local React state `unreadSinceDate` (the separator
 *     timestamp).
 *   - `GroupChannelState.firstUnreadMessageId` (mark-as-unread anchor).
 *
 * Phase 4 introduces a SINGLE typed model + reducer so all three derive
 * from the same authoritative state. Phase 5+ (post-cycle) will migrate
 * consumers — Phase 4 itself only ships the model + reducer + selectors
 * + parity tests against the legacy three-source behavior. No legacy
 * code path is modified in this cycle (Plan §4.2).
 *
 * Internal — gated from public dts via BC-4 / BC-5.
 */

/**
 * `mode` discriminates the three legitimate states of unread tracking:
 *   - `'clean'`:        no unread state to display; user is fully caught up.
 *   - `'tracking'`:     normal received-while-away-from-bottom path —
 *                       count grows as messages arrive, separator anchors
 *                       to the first unread message.
 *   - `'marked-unread'`: explicit user action (`markAsUnread`) — the
 *                       separator is stable on the marked message even if
 *                       further messages arrive or are deleted.
 */
export type UnreadMode = 'clean' | 'tracking' | 'marked-unread';

export type UnreadState = {
  mode: UnreadMode;
  /** Message id anchoring the separator. Null when mode === 'clean'. */
  firstUnreadMessageId: number | null;
  /** createdAt of the anchor message (matches `MessageList.unreadSinceDate`). */
  firstUnreadCreatedAt: number | null;
  /** Ids of messages contributing to the unread count. */
  unreadMessageIds: ReadonlySet<number>;
  /** Cached count — equal to `unreadMessageIds.size`. */
  unreadCount: number;
  /** Whether separator UI should render (derived; cached for selector parity). */
  separatorVisible: boolean;
  /** Whether the "new messages" badge UI should render. */
  badgeVisible: boolean;
  /** Whether the next `bottom` reach should schedule mark-as-read. */
  shouldMarkAsRead: boolean;
  /** Wall clock of the most recent confirmed read; null if never. */
  lastReadAt: number | null;
};

/** Shared frozen empty Set — preserves identity across no-op transitions. */
const EMPTY_NUMBER_SET: ReadonlySet<number> = Object.freeze(new Set<number>());

/**
 * Initial unread state — `mode = 'clean'`, no anchor, no count. Phase 5+
 * consumers create one per channel mount via the same factory.
 */
export function createInitialUnreadState(): UnreadState {
  return {
    mode: 'clean',
    firstUnreadMessageId: null,
    firstUnreadCreatedAt: null,
    unreadMessageIds: EMPTY_NUMBER_SET,
    unreadCount: 0,
    separatorVisible: false,
    badgeVisible: false,
    shouldMarkAsRead: false,
    lastReadAt: null,
  };
}

export const UNREAD_STATE_SENTINELS = {
  EMPTY_NUMBER_SET,
} as const;
