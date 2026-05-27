/**
 * Selectors over UnreadState.
 *
 * Phase 4 of the P0 runtime-coupling refactor (Plan §4.1 / Design §7.5).
 *
 * Five selectors are exposed:
 *   - selectUnreadCount(state)
 *   - selectShouldShowSeparator(state, message)
 *   - selectShouldShowUnreadBadge(state)
 *   - selectShouldShowScrollToBottomButton(state, scroll)
 *   - selectShouldMarkAsRead(state, scroll, config)
 *
 * Internal — gated from public dts.
 */
import type { UnreadState } from './model';

/** Lightweight message shape — selectors only inspect messageId/createdAt. */
export type SelectorMessage = {
  messageId: number;
  createdAt?: number;
};

/** Scroll-position view (matches `internal/scroll/intents.ts#ScrollPosition`). */
export type SelectorScrollPosition = 'top' | 'middle' | 'bottom';

/** Config view — only fields relevant to mark-as-read decisions. */
export type SelectorMarkAsReadConfig = {
  /** When true, mark-as-read is fully suppressed (legacy `disableMarkAsRead`). */
  disableMarkAsRead?: boolean;
  /** When true, the explicit mark-as-unread feature is enabled. */
  enableMarkAsUnread?: boolean;
  /**
   * Member state for the current channel — when 'none', the user has left
   * the channel and mark-as-read MUST be skipped (matches legacy gate in
   * `useGroupChannel.scrollToBottom`).
   */
  myMemberState?: 'joined' | 'invited' | 'none' | undefined;
};

export const selectUnreadCount = (s: UnreadState): number => s.unreadCount;

export const selectUnreadMode = (s: UnreadState): UnreadState['mode'] => s.mode;

export const selectFirstUnreadMessageId = (s: UnreadState): number | null => s.firstUnreadMessageId;

export const selectFirstUnreadCreatedAt = (s: UnreadState): number | null => s.firstUnreadCreatedAt;

export const selectLastReadAt = (s: UnreadState): number | null => s.lastReadAt;

/**
 * True when the given message contributes to the unread count — i.e. it
 * is one of the messages received while the user was away from the
 * bottom (or pinned via mark-as-unread). Replaces the legacy
 * `newMessageIds?.includes(message.messageId)` check at MessageView and
 * is identity-stable per `Object.is` (returns a primitive).
 *
 * Phase 5.1.b — consumed by `MessageView` via `useUnreadSelector`.
 */
export function selectIsMessageUnread(s: UnreadState, message: SelectorMessage): boolean {
  return s.unreadMessageIds.has(message.messageId);
}

/**
 * The separator renders ABOVE the first unread message — so for a given
 * candidate message, return true iff its id matches the anchor.
 */
export function selectShouldShowSeparator(s: UnreadState, message: SelectorMessage): boolean {
  if (!s.separatorVisible) return false;
  if (s.firstUnreadMessageId === null) return false;
  return message.messageId === s.firstUnreadMessageId;
}

export function selectShouldShowUnreadBadge(s: UnreadState): boolean {
  return s.badgeVisible && s.unreadCount > 0;
}

/**
 * Scroll-to-bottom button shows when the user has scrolled away from
 * bottom regardless of unread state — but the badge ON the button is
 * driven by the unread count.
 */
export function selectShouldShowScrollToBottomButton(
  s: UnreadState,
  scroll: { position: SelectorScrollPosition },
): boolean {
  if (scroll.position === 'bottom') return false;
  // Always show the button when not at bottom; unread badge is separate.
  return true;
}

/**
 * Mark-as-read decision combines: pending request flag, config gates,
 * and the user's member state in the channel.
 */
export function selectShouldMarkAsRead(
  s: UnreadState,
  scroll: { position: SelectorScrollPosition },
  config: SelectorMarkAsReadConfig,
): boolean {
  if (config.disableMarkAsRead === true) return false;
  // Legacy gate — mark-as-read in mark-as-unread-enabled channels is
  // suppressed (the user must explicitly clear).
  if (config.enableMarkAsUnread === true) return false;
  if (config.myMemberState === 'none') return false;
  // Marked-unread mode pins the separator until the user explicitly
  // returns; we don't auto-clear on reaching bottom.
  if (s.mode === 'marked-unread') return false;
  // Otherwise, the reducer's `shouldMarkAsRead` flag plus a bottom
  // position together schedule the mark-as-read effect.
  return s.shouldMarkAsRead && scroll.position === 'bottom';
}
