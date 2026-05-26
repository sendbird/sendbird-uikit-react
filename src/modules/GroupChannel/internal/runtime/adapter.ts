/**
 * Adapter between coreTs callbacks and the GroupChannel runtime reducer.
 *
 * Phase 2 of the P0 runtime-coupling refactor (Plan §2.1, §2.3).
 *
 * Two responsibilities, each kept narrow and testable in isolation:
 *
 *   1. **Inbound mapping** — translate coreTs callback signatures (from
 *      `useGroupChannelMessages` in `@sendbird/uikit-tools`) into typed
 *      `GroupChannelRuntimeEvent` records. This is what Phase 2's
 *      additive callbacks on the existing `useGroupChannelMessages` call
 *      flow into.
 *
 *   2. **Outbound derivation** — `toGroupChannelState(runtime, legacy)`
 *      derives the legacy `GroupChannelState`-compatible shape from the
 *      runtime state. Phase 2's GroupChannelProvider integration uses
 *      this to publish back to the existing `GroupChannelContext` store
 *      so the consumer-facing `useGroupChannelContext()` return shape
 *      remains identical.
 *
 * **Single source of truth invariant**: the adapter is one-directional.
 * The runtime reducer state is canonical; legacy state is derived from
 * it on every relevant transition. Writing back from legacy to runtime
 * is forbidden.
 */
import type { SendbirdError } from '@sendbird/chat';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import type { SendableMessageType } from '../../../../utils';
import type {
  GroupChannelRuntimeEvent,
  CollectionMutationSource,
  BrowserResumeReason,
  ScrollPosition,
  ScrollMetrics,
} from './events';
import type { GroupChannelRuntimeState } from './state';

/* ============================================================
 *  Inbound: coreTs callback → RuntimeEvent
 * ============================================================ */

/**
 * Shape of the `GroupChannelMessagesCollectionEvent` exported by coreTs
 * `useGroupChannelMessages`. Copied here (not imported) to keep the
 * adapter testable without a runtime coreTs dependency.
 * Reference: coreTs `useGroupChannelMessages/index.ts:40-50`.
 */
export type CoreCollectionEvent =
  | { kind: 'initialized'; source: 'cache' | 'api'; messages: SendableMessageType[] }
  | { kind: 'messagesAdded' | 'messagesUpdated' | 'messagesDeleted'; source: CollectionMutationSource; messages: SendableMessageType[] };

/**
 * Map a coreTs `GroupChannelMessagesCollectionEvent` to one or more
 * `GroupChannelRuntimeEvent` records. `initialized` events with source
 * `'cache'` or `'api'` map to COLLECTION_*_RESULT; mutation events map
 * one-to-one to MESSAGES_*.
 *
 * Note: `kind: 'messagesDeleted'` only carries the deleted SendbirdMessage
 * objects — we extract `messageId` from each so the runtime event uses
 * `number[]` for `messageIds` (matches `MESSAGES_DELETED`'s payload shape).
 */
export function mapCollectionEvent(event: CoreCollectionEvent): GroupChannelRuntimeEvent[] {
  switch (event.kind) {
    case 'initialized':
      return event.source === 'cache'
        ? [{ type: 'COLLECTION_CACHE_RESULT', messages: event.messages, error: null }]
        : [{ type: 'COLLECTION_API_RESULT', messages: event.messages, error: null }];
    case 'messagesAdded':
      return [{ type: 'MESSAGES_ADDED', source: event.source, messages: event.messages }];
    case 'messagesUpdated':
      return [{ type: 'MESSAGES_UPDATED', source: event.source, messages: event.messages }];
    case 'messagesDeleted':
      return [
        {
          type: 'MESSAGES_DELETED',
          source: event.source,
          messageIds: event.messages.map((m) => m.messageId),
        },
      ];
    default: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _exhaustive: never = event;
      return [];
    }
  }
}

/**
 * Map a coreTs `onCacheResult(error, messages)` invocation to a
 * COLLECTION_CACHE_RESULT event. Phase 2's adapter wires this as an
 * additive callback to `useGroupChannelMessages`.
 */
export function mapOnCacheResult(error: Error | null, messages: SendableMessageType[]): GroupChannelRuntimeEvent {
  return { type: 'COLLECTION_CACHE_RESULT', messages, error };
}

/**
 * Map a coreTs `onApiResult(error, messages)` invocation to a
 * COLLECTION_API_RESULT event.
 */
export function mapOnApiResult(error: Error | null, messages: SendableMessageType[]): GroupChannelRuntimeEvent {
  return { type: 'COLLECTION_API_RESULT', messages, error };
}

/**
 * Map `onMessagesReceived` to a MESSAGES_ADDED event with the standard
 * `EVENT_MESSAGE_RECEIVED` source label. The actual `CollectionEventSource`
 * enum value lives in `@sendbird/chat` — we pass the string here because
 * the reducer treats the source as opaque (only equality matters).
 */
export function mapOnMessagesReceived(
  messages: SendableMessageType[],
  source: CollectionMutationSource = 'EVENT_MESSAGE_RECEIVED' as CollectionMutationSource,
): GroupChannelRuntimeEvent {
  return { type: 'MESSAGES_ADDED', source, messages };
}

/**
 * Map `onMessagesUpdated` to a MESSAGES_UPDATED event.
 */
export function mapOnMessagesUpdated(
  messages: SendableMessageType[],
  source: CollectionMutationSource = 'EVENT_MESSAGE_UPDATED' as CollectionMutationSource,
): GroupChannelRuntimeEvent {
  return { type: 'MESSAGES_UPDATED', source, messages };
}

/**
 * Map `onChannelDeleted` to a CHANNEL_CLEARED event.
 */
export function mapOnChannelDeleted(): GroupChannelRuntimeEvent {
  return { type: 'CHANNEL_CLEARED', reason: 'deleted' };
}

/**
 * Map `onCurrentUserBanned` to a CHANNEL_CLEARED event.
 */
export function mapOnCurrentUserBanned(): GroupChannelRuntimeEvent {
  return { type: 'CHANNEL_CLEARED', reason: 'banned' };
}

/**
 * Map `onChannelUpdated(channel)` to a CHANNEL_READY event with the
 * updated channel. (The naming asymmetry is intentional — both initial
 * fetch and subsequent updates resolve to the same "channel is ready"
 * state; only the reducer needs to know it has the latest reference.)
 */
export function mapOnChannelUpdated(channel: GroupChannel): GroupChannelRuntimeEvent {
  return { type: 'CHANNEL_READY', channel };
}

/**
 * Map a successful `getChannel` resolve to CHANNEL_READY.
 */
export function mapChannelReady(channel: GroupChannel): GroupChannelRuntimeEvent {
  return { type: 'CHANNEL_READY', channel };
}

/**
 * Map a `getChannel` rejection to CHANNEL_FAILED.
 */
export function mapChannelFailed(error: SendbirdError): GroupChannelRuntimeEvent {
  return { type: 'CHANNEL_FAILED', error };
}

/**
 * Map a browser visibility/online/focus transition to BROWSER_RESUMED.
 */
export function mapBrowserResumed(reason: BrowserResumeReason): GroupChannelRuntimeEvent {
  return { type: 'BROWSER_RESUMED', reason };
}

/**
 * Map a scroll position change to SCROLL_POSITION_CHANGED.
 */
export function mapScrollPositionChanged(
  position: ScrollPosition,
  metrics: ScrollMetrics,
): GroupChannelRuntimeEvent {
  return { type: 'SCROLL_POSITION_CHANGED', position, metrics };
}

/* ============================================================
 *  Outbound: RuntimeState → legacy GroupChannelState slice
 * ============================================================ */

/**
 * Subset of the legacy `GroupChannelState` that the runtime adapter
 * derives. The full `GroupChannelState` has additional fields (callbacks,
 * refs, config) supplied directly by the provider; Phase 2 only derives
 * the fields whose values are determined by the runtime reducer.
 *
 * The adapter's caller (`GroupChannelProvider`) merges this partial with
 * the provider-owned fields before calling `applyStorePatch` on the
 * legacy store. This keeps the dual-source invariant: runtime owns state
 * decisions, provider owns refs/config.
 */
export type LegacyStatePatch = {
  currentChannel: GroupChannel | null;
  fetchChannelError: SendbirdError | null;
  initialized: boolean;
  loading: boolean;
  messages: SendableMessageType[];
  animatedMessageId: number | null;
  isScrollBottomReached: boolean;
};

/**
 * Derive a legacy-shape patch from the current runtime state. Per
 * design §5.5 — this is the single point of fan-out from the runtime
 * reducer back to the legacy `GroupChannelContext` store.
 *
 * The returned object is FRESHLY constructed; the caller is expected to
 * pass it through `applyStorePatch` which respects the equality
 * short-circuit and avoids spurious rerenders.
 */
export function toGroupChannelState(runtime: GroupChannelRuntimeState): LegacyStatePatch {
  const initialized = runtime.collection.status === 'ready';
  const loading = runtime.collection.status === 'cache-loading'
    || runtime.collection.status === 'api-loading';
  return {
    currentChannel: runtime.channel.current,
    fetchChannelError: runtime.channel.error,
    initialized,
    loading,
    messages: runtime.messages.items,
    animatedMessageId: runtime.messages.animatedMessageId,
    isScrollBottomReached: runtime.scroll.position === 'bottom',
  };
}
