/**
 * Narrow-slice selectors over GroupChannelRuntimeState.
 *
 * Phase 2 of the P0 runtime-coupling refactor (Plan §2.1). Each selector
 * pulls the smallest meaningful slice so a Phase 1 `useStoreSelector`
 * consumer reading that slice does not rerender on unrelated transitions.
 *
 * All selectors are pure and reference-stable: passing the same state in
 * twice yields the same reference. This is the contract Phase 1's
 * `useStoreSelector` relies on to short-circuit rerenders.
 */
import type {
  GroupChannelRuntimeState,
  ChannelStatus,
  CollectionStatus,
} from './state';
import type {
  ScrollMetrics,
  ScrollPosition,
} from './events';

/* ─── channel slice ────────────────────────────────────────────── */
export const selectChannelStatus = (s: GroupChannelRuntimeState): ChannelStatus => s.channel.status;
export const selectChannel = (s: GroupChannelRuntimeState) => s.channel.current;
export const selectChannelUrl = (s: GroupChannelRuntimeState): string => s.channel.url;
export const selectChannelError = (s: GroupChannelRuntimeState) => s.channel.error;
export const selectChannelIsReady = (s: GroupChannelRuntimeState): boolean => s.channel.status === 'ready';
export const selectChannelIsCleared = (s: GroupChannelRuntimeState): boolean => s.channel.status === 'cleared';

/* ─── collection slice ─────────────────────────────────────────── */
export const selectCollectionStatus = (s: GroupChannelRuntimeState): CollectionStatus => s.collection.status;
export const selectCacheLoaded = (s: GroupChannelRuntimeState): boolean => s.collection.cacheLoaded;
export const selectApiLoaded = (s: GroupChannelRuntimeState): boolean => s.collection.apiLoaded;
export const selectCollectionInitialized = (s: GroupChannelRuntimeState): boolean => s.collection.status === 'ready';
export const selectCollectionLoading = (s: GroupChannelRuntimeState): boolean => s.collection.status === 'cache-loading' || s.collection.status === 'api-loading';
export const selectLastEventSource = (s: GroupChannelRuntimeState) => s.collection.lastEventSource;

/* ─── messages slice ───────────────────────────────────────────── */
export const selectMessages = (s: GroupChannelRuntimeState) => s.messages.items;
export const selectMessageCount = (s: GroupChannelRuntimeState): number => s.messages.items.length;
export const selectAnimatedMessageId = (s: GroupChannelRuntimeState): number | null => s.messages.animatedMessageId;
export const selectFocusedMessageId = (s: GroupChannelRuntimeState): number | null => s.messages.focusedMessageId;
export const selectPendingIds = (s: GroupChannelRuntimeState): ReadonlySet<string> => s.messages.pendingIds;
export const selectFailedIds = (s: GroupChannelRuntimeState): ReadonlySet<string> => s.messages.failedIds;

/* ─── scroll slice ─────────────────────────────────────────────── */
export const selectScrollPosition = (s: GroupChannelRuntimeState): ScrollPosition => s.scroll.position;
export const selectScrollMetrics = (s: GroupChannelRuntimeState): ScrollMetrics | null => s.scroll.metrics;
export const selectIsScrollAtBottom = (s: GroupChannelRuntimeState): boolean => s.scroll.position === 'bottom';
export const selectScrollTargetCreatedAt = (s: GroupChannelRuntimeState): number | null => s.scroll.targetCreatedAt;

/* ─── browser slice ────────────────────────────────────────────── */
export const selectBrowserVisible = (s: GroupChannelRuntimeState): boolean => s.browser.visible;
export const selectBrowserOnline = (s: GroupChannelRuntimeState): boolean => s.browser.online;
export const selectStaleReason = (s: GroupChannelRuntimeState) => s.browser.staleReason;
