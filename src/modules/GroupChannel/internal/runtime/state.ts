/**
 * GroupChannelRuntimeState shape and initial-state factory.
 *
 * The runtime state is the SINGLE source of truth for the adapter; legacy
 * `GroupChannelState` is derived from this via `adapter.ts#toGroupChannelState`.
 * Write-back from legacy to runtime is forbidden (Plan §"Behavior Preservation
 * Strategy" — dual-write race mitigation).
 *
 * Identity invariants:
 *   - `messages.items` array reference must NOT change when no event
 *     modified the messages slice. Reducer enforces this via structural
 *     sharing in `reducer.ts`.
 *   - Empty `pendingIds` / `failedIds` use a shared frozen Set to keep
 *     identity stable across no-op transitions (helps downstream
 *     `useStoreSelector` consumers avoid spurious rerenders).
 */
import type { SendbirdError } from '@sendbird/chat';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import type { SendableMessageType } from '../../../../utils';
import type {
  CollectionMutationSource,
  ScrollMetrics,
  ScrollPosition,
} from './events';

export type ChannelStatus = 'idle' | 'loading' | 'ready' | 'failed' | 'cleared';
export type CollectionStatus =
  | 'idle'
  | 'cache-loading'
  | 'api-loading'
  | 'ready'
  | 'failed';

export type GroupChannelRuntimeState = {
  channel: {
    status: ChannelStatus;
    url: string;
    current: GroupChannel | null;
    error: SendbirdError | null;
  };
  collection: {
    status: CollectionStatus;
    cacheLoaded: boolean;
    apiLoaded: boolean;
    hasPrevious: boolean;
    hasNext: boolean;
    lastEventSource: CollectionMutationSource | null;
  };
  messages: {
    items: SendableMessageType[];
    pendingIds: ReadonlySet<string>;
    failedIds: ReadonlySet<string>;
    focusedMessageId: number | null;
    animatedMessageId: number | null;
  };
  scroll: {
    position: ScrollPosition;
    metrics: ScrollMetrics | null;
    /**
     * Anchor target requested by `STARTING_POINT_CHANGED` /
     * `MESSAGE_FOCUS_REQUESTED`. Cleared once the scroll effect resolves
     * (in a future phase — Phase 3 ScrollController).
     */
    targetCreatedAt: number | null;
  };
  browser: {
    visible: boolean;
    online: boolean;
    /** Set when a BROWSER_RESUMED arrives; cleared after refresh. */
    staleReason: 'visibility' | 'online' | 'focus' | null;
  };
};

/** Shared frozen empty Set — preserves identity across no-op transitions. */
const EMPTY_STRING_SET: ReadonlySet<string> = Object.freeze(new Set<string>()) as ReadonlySet<string>;

/** Shared frozen empty array — preserves identity across no-op transitions. */
const EMPTY_MESSAGE_ARRAY: ReadonlyArray<SendableMessageType> = Object.freeze([]) as ReadonlyArray<SendableMessageType>;

/**
 * Initial state factory. Optionally seeds with a known channel URL so the
 * adapter can be mounted with the eventual channel target before
 * CHANNEL_REQUESTED fires.
 */
export function createInitialRuntimeState(seed?: { channelUrl?: string }): GroupChannelRuntimeState {
  return {
    channel: {
      status: 'idle',
      url: seed?.channelUrl ?? '',
      current: null,
      error: null,
    },
    collection: {
      status: 'idle',
      cacheLoaded: false,
      apiLoaded: false,
      hasPrevious: false,
      hasNext: false,
      lastEventSource: null,
    },
    messages: {
      items: EMPTY_MESSAGE_ARRAY as SendableMessageType[],
      pendingIds: EMPTY_STRING_SET,
      failedIds: EMPTY_STRING_SET,
      focusedMessageId: null,
      animatedMessageId: null,
    },
    scroll: {
      position: 'bottom',
      metrics: null,
      targetCreatedAt: null,
    },
    browser: {
      visible: true,
      online: true,
      staleReason: null,
    },
  };
}

/**
 * Export the shared empty sentinels so the reducer can return them for
 * identity preservation across no-op transitions and so tests can
 * `expect(result.state.messages.items).toBe(EMPTY_MESSAGE_ARRAY)`.
 */
export const RUNTIME_STATE_SENTINELS = {
  EMPTY_STRING_SET,
  EMPTY_MESSAGE_ARRAY,
} as const;
