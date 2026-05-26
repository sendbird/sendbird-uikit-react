/**
 * Typed runtime events for the GroupChannel adapter.
 *
 * Phase 2 of the P0 runtime-coupling refactor (Plan §2). These events are
 * the SINGLE inbound boundary into the runtime reducer; every observable
 * SDK or UI change should be representable as one of these variants.
 *
 * Internal — not exported via `src/index.ts`. Phase 2's mini-gate enforces
 * this via `scripts/bc-check.sh` BC-4/BC-5.
 *
 * Sources (verified against coreTs at base sha — see .agentic/p0-impl/notes.md
 * "coreTs Contract Verification"):
 *   - `CHANNEL_*`           — GroupChannelProvider's getChannel effect +
 *                             onChannelDeleted/onCurrentUserBanned
 *   - `COLLECTION_*`        — new onCacheResult / onApiResult callbacks
 *                             added by Phase 2 (additive coreTs supply)
 *   - `MESSAGES_*`          — onMessagesReceived / onMessagesUpdated /
 *                             onCollectionEvent (additive)
 *   - `SCROLL_*` / `STARTING_POINT_*` / `MESSAGE_FOCUS_*`
 *                           — UI-side dispatches from useGroupChannel
 *   - `BROWSER_*` / `VIEWPORT_*`
 *                           — Phase 3+ browser lifecycle adapter
 */
import type { SendbirdError, CollectionEventSource } from '@sendbird/chat';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import type { SendableMessageType } from '../../../../utils';

/** Source identifier for collection mutation events. */
export type CollectionMutationSource = CollectionEventSource | 'cache' | 'api';

/**
 * Scroll position discriminator. The reducer reasons about "where is the user
 * relative to bottom" as a triadic categorical rather than a numeric distance,
 * to keep transitions deterministic.
 */
export type ScrollPosition = 'top' | 'middle' | 'bottom';

/** Numeric scroll measurements supplied by the ScrollController (Phase 3). */
export type ScrollMetrics = {
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
  distanceFromBottom: number;
  position: ScrollPosition;
  viewportHeight: number;
  visualViewportHeight?: number;
};

/** Reason tag for browser-resume transitions. */
export type BrowserResumeReason = 'visibility' | 'online' | 'focus';

/** Reason tag for viewport-resize transitions. */
export type ViewportResizeReason = 'window' | 'keyboard' | 'orientation' | 'visualViewport';

/** Reason tag for channel-clear transitions. */
export type ChannelClearReason = 'deleted' | 'banned' | 'back';

/**
 * Discriminated union of every event that may drive the GroupChannel runtime
 * reducer. Phase 2 maps each existing GroupChannelProvider callback to one
 * (or more) of these variants; new dispatches added during Phase 2 are
 * additive and do not alter legacy IO paths.
 */
export type GroupChannelRuntimeEvent =
  | { type: 'CHANNEL_REQUESTED'; channelUrl: string }
  | { type: 'CHANNEL_READY'; channel: GroupChannel }
  | { type: 'CHANNEL_FAILED'; error: SendbirdError }
  | { type: 'CHANNEL_CLEARED'; reason: ChannelClearReason }
  | { type: 'COLLECTION_INITIALIZING'; startingPoint: number }
  | { type: 'COLLECTION_CACHE_RESULT'; messages: SendableMessageType[]; error: Error | null }
  | { type: 'COLLECTION_API_RESULT'; messages: SendableMessageType[]; error: Error | null }
  | { type: 'MESSAGES_ADDED'; source: CollectionMutationSource; messages: SendableMessageType[] }
  | { type: 'MESSAGES_UPDATED'; source: CollectionMutationSource; messages: SendableMessageType[] }
  | { type: 'MESSAGES_DELETED'; source: CollectionMutationSource; messageIds: number[] }
  | { type: 'SCROLL_POSITION_CHANGED'; position: ScrollPosition; metrics: ScrollMetrics }
  | { type: 'STARTING_POINT_CHANGED'; createdAt: number }
  | { type: 'MESSAGE_FOCUS_REQUESTED'; createdAt: number; messageId?: number }
  | { type: 'BROWSER_RESUMED'; reason: BrowserResumeReason }
  | { type: 'VIEWPORT_RESIZED'; reason: ViewportResizeReason };

/** All event tag literals. Useful for exhaustiveness checks and tests. */
export type GroupChannelRuntimeEventType = GroupChannelRuntimeEvent['type'];

/**
 * Exhaustive constant array of event type tags. Sorted so test snapshots
 * and serialization remain stable across refactors.
 */
export const ALL_RUNTIME_EVENT_TYPES: ReadonlyArray<GroupChannelRuntimeEventType> = [
  'BROWSER_RESUMED',
  'CHANNEL_CLEARED',
  'CHANNEL_FAILED',
  'CHANNEL_READY',
  'CHANNEL_REQUESTED',
  'COLLECTION_API_RESULT',
  'COLLECTION_CACHE_RESULT',
  'COLLECTION_INITIALIZING',
  'MESSAGES_ADDED',
  'MESSAGES_DELETED',
  'MESSAGES_UPDATED',
  'MESSAGE_FOCUS_REQUESTED',
  'SCROLL_POSITION_CHANGED',
  'STARTING_POINT_CHANGED',
  'VIEWPORT_RESIZED',
] as const;
