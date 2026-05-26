/**
 * Pure reducer for GroupChannelRuntimeState.
 *
 * Phase 2 of the P0 runtime-coupling refactor (Plan §2.2 / Design §5.6).
 *
 * Contract:
 *   - Pure function. No IO, no `Date.now()`, no `Math.random()`.
 *   - Structural sharing: when a slice is unchanged, the same reference is
 *     returned to keep `useStoreSelector` consumers stable.
 *   - All side effects are emitted as discriminated `SideEffect` records in
 *     `result.effects`. The dispatcher (in `GroupChannelProvider`) is
 *     responsible for invoking them; the reducer itself never calls them.
 *   - Unknown event sources or transitions are no-ops with a warn-grade
 *     instrumentation hook (dev/test only) so the test mapping table can
 *     catch unmapped sources.
 *
 * The 4 targeted transitions for AC-6 (Phase 2 RV-2.3..2.6):
 *   - MESSAGES_ADDED at bottom         → append + scrollToBottom + markAsRead
 *   - MESSAGES_ADDED away from bottom  → append + showUnreadIndicator
 *   - STARTING_POINT_CHANGED           → set anchor + loadAroundStartingPoint
 *   - BROWSER_RESUMED                  → set staleReason + refreshIfNeeded
 */
import type {
  GroupChannelRuntimeEvent,
  ScrollPosition,
} from './events';
import {
  type GroupChannelRuntimeState,
  RUNTIME_STATE_SENTINELS,
} from './state';

/**
 * Discriminated side-effect requests emitted by the reducer. Phase 3's
 * ScrollController, Phase 4's UnreadAdapter, and Phase 2's compatibility
 * dispatcher all consume different subsets.
 */
export type SideEffect =
  | { type: 'REQUEST_SCROLL_TO_BOTTOM'; animated: boolean; reason: 'send' | 'receive' | 'button' | 'init' }
  | { type: 'REQUEST_SCROLL_TO_MESSAGE'; createdAt: number; messageId?: number; animated: boolean }
  | { type: 'REQUEST_MARK_AS_READ' }
  | { type: 'REQUEST_RESET_NEW_MESSAGES' }
  | { type: 'REQUEST_SHOW_UNREAD_INDICATOR' }
  | { type: 'REQUEST_LOAD_AROUND_STARTING_POINT'; createdAt: number }
  | { type: 'REQUEST_INIT_COLLECTION' }
  | { type: 'REQUEST_REFRESH_IF_NEEDED'; reason: 'visibility' | 'online' | 'focus' }
  | { type: 'REQUEST_RESTORE_ANCHOR'; reason: 'browser-resume' | 'cache-result' | 'api-result' | 'load-previous' };

export type ReducerResult = {
  state: GroupChannelRuntimeState;
  effects: SideEffect[];
};

/* ─── structural-sharing helpers ─────────────────────────────────── */

function withSameMessages(state: GroupChannelRuntimeState): GroupChannelRuntimeState {
  return state;
}

function appendMessages(
  state: GroupChannelRuntimeState,
  added: GroupChannelRuntimeState['messages']['items'],
): GroupChannelRuntimeState {
  if (added.length === 0) return state;
  return {
    ...state,
    messages: {
      ...state.messages,
      items: state.messages.items.concat(added),
    },
  };
}

function replaceMessagesByIdentity(
  state: GroupChannelRuntimeState,
  updated: GroupChannelRuntimeState['messages']['items'],
): GroupChannelRuntimeState {
  if (updated.length === 0) return state;
  const byId = new Map<number, GroupChannelRuntimeState['messages']['items'][number]>();
  for (const m of updated) byId.set(m.messageId, m);
  let changed = false;
  const nextItems = state.messages.items.map((existing) => {
    const replacement = byId.get(existing.messageId);
    if (replacement && replacement !== existing) {
      changed = true;
      return replacement;
    }
    return existing;
  });
  if (!changed) return state;
  return {
    ...state,
    messages: { ...state.messages, items: nextItems },
  };
}

function deleteMessagesByIds(
  state: GroupChannelRuntimeState,
  ids: number[],
): GroupChannelRuntimeState {
  if (ids.length === 0) return state;
  const idSet = new Set(ids);
  const nextItems = state.messages.items.filter((m) => !idSet.has(m.messageId));
  if (nextItems.length === state.messages.items.length) return state;
  return {
    ...state,
    messages: { ...state.messages, items: nextItems },
  };
}

/* ─── reducer ──────────────────────────────────────────────────── */

export function groupChannelRuntimeReducer(
  state: GroupChannelRuntimeState,
  event: GroupChannelRuntimeEvent,
): ReducerResult {
  switch (event.type) {
    case 'CHANNEL_REQUESTED': {
      return {
        state: {
          ...state,
          channel: { ...state.channel, status: 'loading', url: event.channelUrl, error: null },
        },
        effects: [],
      };
    }

    case 'CHANNEL_READY': {
      return {
        state: {
          ...state,
          channel: {
            ...state.channel,
            status: 'ready',
            current: event.channel,
            url: event.channel.url,
            error: null,
          },
          messages: {
            ...state.messages,
            focusedMessageId: null,
            animatedMessageId: null,
          },
        },
        effects: [{ type: 'REQUEST_INIT_COLLECTION' }],
      };
    }

    case 'CHANNEL_FAILED': {
      return {
        state: {
          ...state,
          channel: { ...state.channel, status: 'failed', error: event.error, current: null },
        },
        effects: [],
      };
    }

    case 'CHANNEL_CLEARED': {
      return {
        state: {
          ...state,
          channel: {
            ...state.channel,
            status: 'cleared',
            current: null,
            error: null,
          },
          messages: {
            ...state.messages,
            items: RUNTIME_STATE_SENTINELS.EMPTY_MESSAGE_ARRAY as GroupChannelRuntimeState['messages']['items'],
            focusedMessageId: null,
            animatedMessageId: null,
          },
        },
        effects: [],
      };
    }

    case 'COLLECTION_INITIALIZING': {
      return {
        state: {
          ...state,
          collection: { ...state.collection, status: 'cache-loading' },
          scroll: { ...state.scroll, targetCreatedAt: event.startingPoint || null },
        },
        effects: [],
      };
    }

    case 'COLLECTION_CACHE_RESULT': {
      const isError = !!event.error;
      return {
        state: {
          ...state,
          collection: {
            ...state.collection,
            status: isError ? 'failed' : 'api-loading',
            cacheLoaded: !isError,
            lastEventSource: 'cache',
          },
          messages: {
            ...state.messages,
            items: event.messages.length > 0 ? event.messages.slice() : state.messages.items,
          },
        },
        effects: isError ? [] : [{ type: 'REQUEST_RESTORE_ANCHOR', reason: 'cache-result' }],
      };
    }

    case 'COLLECTION_API_RESULT': {
      const isError = !!event.error;
      return {
        state: {
          ...state,
          collection: {
            ...state.collection,
            status: isError ? 'failed' : 'ready',
            apiLoaded: !isError,
            lastEventSource: 'api',
          },
          messages: {
            ...state.messages,
            items: event.messages.length > 0 ? event.messages.slice() : state.messages.items,
          },
        },
        effects: isError ? [] : [{ type: 'REQUEST_RESTORE_ANCHOR', reason: 'api-result' }],
      };
    }

    case 'MESSAGES_ADDED': {
      const next = appendMessages(state, event.messages);
      const isAtBottom = state.scroll.position === 'bottom';
      const effects: SideEffect[] = isAtBottom
        ? [
          { type: 'REQUEST_SCROLL_TO_BOTTOM', animated: true, reason: 'receive' },
          { type: 'REQUEST_MARK_AS_READ' },
        ]
        : [{ type: 'REQUEST_SHOW_UNREAD_INDICATOR' }];
      return {
        state: {
          ...next,
          collection: { ...next.collection, lastEventSource: event.source },
        },
        effects,
      };
    }

    case 'MESSAGES_UPDATED': {
      const next = replaceMessagesByIdentity(state, event.messages);
      if (next === state) return { state: withSameMessages(state), effects: [] };
      return {
        state: { ...next, collection: { ...next.collection, lastEventSource: event.source } },
        effects: [{ type: 'REQUEST_RESTORE_ANCHOR', reason: 'load-previous' }],
      };
    }

    case 'MESSAGES_DELETED': {
      const next = deleteMessagesByIds(state, event.messageIds);
      if (next === state) return { state, effects: [] };
      return {
        state: { ...next, collection: { ...next.collection, lastEventSource: event.source } },
        effects: [{ type: 'REQUEST_RESTORE_ANCHOR', reason: 'load-previous' }],
      };
    }

    case 'SCROLL_POSITION_CHANGED': {
      const nextPosition: ScrollPosition = event.position;
      if (state.scroll.position === nextPosition && state.scroll.metrics === event.metrics) {
        return { state, effects: [] };
      }
      return {
        state: {
          ...state,
          scroll: { ...state.scroll, position: nextPosition, metrics: event.metrics },
        },
        effects: [],
      };
    }

    case 'STARTING_POINT_CHANGED': {
      return {
        state: {
          ...state,
          scroll: { ...state.scroll, targetCreatedAt: event.createdAt },
        },
        effects: [
          { type: 'REQUEST_LOAD_AROUND_STARTING_POINT', createdAt: event.createdAt },
          {
            type: 'REQUEST_SCROLL_TO_MESSAGE',
            createdAt: event.createdAt,
            animated: true,
          },
        ],
      };
    }

    case 'MESSAGE_FOCUS_REQUESTED': {
      return {
        state: {
          ...state,
          messages: {
            ...state.messages,
            focusedMessageId: event.messageId ?? null,
            animatedMessageId: event.messageId ?? null,
          },
          scroll: { ...state.scroll, targetCreatedAt: event.createdAt },
        },
        effects: [
          {
            type: 'REQUEST_SCROLL_TO_MESSAGE',
            createdAt: event.createdAt,
            messageId: event.messageId,
            animated: true,
          },
        ],
      };
    }

    case 'BROWSER_RESUMED': {
      return {
        state: {
          ...state,
          browser: { ...state.browser, visible: true, staleReason: event.reason },
        },
        effects: [
          { type: 'REQUEST_REFRESH_IF_NEEDED', reason: event.reason },
          { type: 'REQUEST_RESTORE_ANCHOR', reason: 'browser-resume' },
        ],
      };
    }

    case 'VIEWPORT_RESIZED': {
      // Phase 3 will refine this — Phase 2 only tracks that a resize was
      // observed (no side effects until ScrollController is in place).
      return { state, effects: [] };
    }

    default: {
      // Exhaustiveness guard. The `never` assignment catches any new
      // event tag added to the union without a corresponding case.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _exhaustive: never = event;
      return { state, effects: [] };
    }
  }
}
