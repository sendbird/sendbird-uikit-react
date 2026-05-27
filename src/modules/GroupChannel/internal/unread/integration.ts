/**
 * Integration glue for the GroupChannel unread reducer.
 *
 * Phase 5.1 of the P0 runtime-coupling refactor (Plan §5.1.a).
 *
 * Provides:
 *   - `createUnreadStore(): Store<UnreadState>` — produces a
 *     `createStore`-based handle seeded with `createInitialUnreadState()`.
 *   - `dispatchToUnreadStore(store, event, context?, onError?)` — pure
 *     helper that runs the reducer with the optional context hint, writes
 *     the new state via `applyStorePatch`, and fires the dev/test
 *     instrumentation hook so consumer specs can observe.
 *
 * **Parallel-only invariant** (inherited from W1, Plan §2.4 + spec §AC-8):
 * A fault in the reducer or store layer MUST NOT prevent the legacy
 * GroupChannelProvider callback from continuing. Any exception is caught
 * here and surfaced via the optional `onError` callback. Hook exceptions
 * are likewise caught.
 *
 * Internal — not exported via `src/index.ts`. BC-4 / BC-5 verify.
 */
import { createStore, applyStorePatch, type Store } from '../../../../utils/storeManager';
import { unreadReducer, type UnreadEvent, type UnreadReducerContext } from './reducer';
import { createInitialUnreadState, type UnreadState } from './model';

/** Shape of the global dev/test dispatch instrumentation hook. */
export type UnreadDispatchHookPayload = {
  event: UnreadEvent;
  context: UnreadReducerContext;
  state: UnreadState;
};

export type UnreadDispatchHook = (payload: UnreadDispatchHookPayload) => void;

/** Hook key on `globalThis` — read by tests to inspect dispatches. */
export const UNREAD_DISPATCH_HOOK_GLOBAL_KEY = '__GROUP_CHANNEL_UNREAD_DISPATCH_HOOK__' as const;

const DEFAULT_CONTEXT: UnreadReducerContext = { isAtBottom: true };

/**
 * Build the unread store. Returns the underlying `Store` so consumers
 * can `subscribe` (the read hook in Phase 5.1.b will).
 */
export function createUnreadStore(seed?: Partial<UnreadState>): Store<UnreadState> {
  return createStore<UnreadState>({ ...createInitialUnreadState(), ...(seed ?? {}) });
}

/**
 * Apply a single event to the unread store. Pure transition through
 * `unreadReducer`, then `applyStorePatch` to write the new state
 * (equality short-circuit honored), then fire the instrumentation hook
 * if present.
 *
 * Returns the resulting `UnreadState` so the caller can route effects
 * synchronously without an extra `store.getState()`. On failure returns
 * the unchanged previous state.
 */
export function dispatchToUnreadStore(
  store: Store<UnreadState>,
  event: UnreadEvent,
  context: UnreadReducerContext = DEFAULT_CONTEXT,
  onError?: (error: unknown, event: UnreadEvent) => void,
): UnreadState {
  const before = store.getState();
  let next: UnreadState;
  try {
    next = unreadReducer(before, event, context);
    applyStorePatch(store, next as Partial<UnreadState>, event.type);
  } catch (error) {
    if (onError) {
      try {
        onError(error, event);
      } catch {
        // onError must never propagate — see Plan §5.1.a / W1 rationale.
      }
    }
    return before;
  }
  if (process.env.NODE_ENV !== 'production') {
    const hook = (globalThis as unknown as { [UNREAD_DISPATCH_HOOK_GLOBAL_KEY]?: UnreadDispatchHook })[
      UNREAD_DISPATCH_HOOK_GLOBAL_KEY
    ];
    if (typeof hook === 'function') {
      try {
        hook({ event, context, state: next });
      } catch {
        // Swallow hook errors so they never affect production callers.
      }
    }
  }
  return next;
}
