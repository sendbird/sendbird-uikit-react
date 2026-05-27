/**
 * Integration glue for the GroupChannel runtime adapter.
 *
 * Phase 2 of the P0 runtime-coupling refactor (Plan §2.3-§2.4).
 *
 * Provides:
 *   - `createRuntimeRuntime(): Store<GroupChannelRuntimeState>` — produces
 *     a `createStore`-based handle with a `dispatch(event)` method.
 *   - `dispatchToRuntime(store, event)` — pure helper that runs the
 *     reducer, writes the new state via the production store, and fires
 *     the dev/test instrumentation hook so RV specs can observe.
 *
 * **Adapter-first invariant** (Plan §2.4):
 *   - Phase 2 wires events alongside the legacy `GroupChannelContext`
 *     store but does NOT yet drive any legacy state mutation. The runtime
 *     reducer's side effects array is recorded for parity assertions; the
 *     IO that consumes them remains in the legacy code path until Phase 3+.
 *
 * Internal — not exported via `src/index.ts`. BC-4/BC-5 verify.
 */
import { createStore, applyStorePatch, type Store } from '../../../../utils/storeManager';
import { groupChannelRuntimeReducer, type SideEffect } from './reducer';
import { createInitialRuntimeState, type GroupChannelRuntimeState } from './state';
import type { GroupChannelRuntimeEvent } from './events';

/** Shape of the global dev/test dispatch instrumentation hook. */
export type RuntimeDispatchHookPayload = {
  event: GroupChannelRuntimeEvent;
  state: GroupChannelRuntimeState;
  effects: ReadonlyArray<SideEffect>;
};

export type RuntimeDispatchHook = (payload: RuntimeDispatchHookPayload) => void;

/** Hook key on `globalThis` — read by tests to inspect dispatches. */
export const RUNTIME_DISPATCH_HOOK_GLOBAL_KEY = '__GROUP_CHANNEL_RUNTIME_DISPATCH_HOOK__' as const;

/**
 * Build the runtime store. Returns the underlying `Store` so consumers
 * can `subscribe` (Phase 3's ScrollController will).
 */
export function createRuntimeStore(seed?: Partial<GroupChannelRuntimeState>): Store<GroupChannelRuntimeState> {
  return createStore<GroupChannelRuntimeState>({ ...createInitialRuntimeState(), ...(seed ?? {}) });
}

/**
 * Apply a single event to the runtime store. Pure transition through
 * `groupChannelRuntimeReducer`, then `applyStorePatch` to write the new
 * state (equality short-circuit honored), then fire the instrumentation
 * hook if present.
 *
 * **Parallel-only invariant** (Plan §2.4): Phase 2 wires this alongside
 * existing legacy actions. A bug in the reducer, mappers, or store layer
 * MUST NOT prevent the legacy callback from continuing. Any exception
 * raised on the reducer/patch path is therefore caught here and surfaced
 * via the optional `onError` callback. Hook exceptions are likewise
 * caught (existing behavior). Returns an empty effect array on failure
 * so callers can route effects without null-checks.
 *
 * Returns the emitted `SideEffect[]` so the caller can route them to
 * Phase 3/4 controllers when those are wired up. Phase 2 simply collects
 * them for parity assertions.
 */
export function dispatchToRuntime(
  store: Store<GroupChannelRuntimeState>,
  event: GroupChannelRuntimeEvent,
  onError?: (error: unknown, event: GroupChannelRuntimeEvent) => void,
): ReadonlyArray<SideEffect> {
  let result: { state: GroupChannelRuntimeState; effects: ReadonlyArray<SideEffect> };
  try {
    result = groupChannelRuntimeReducer(store.getState(), event);
    // Patch the runtime store with the entire next state. The reducer
    // already preserves structural sharing on no-op transitions, so
    // applyStorePatch's equality check will short-circuit when nothing
    // actually changed.
    applyStorePatch(store, result.state as Partial<GroupChannelRuntimeState>, event.type);
  } catch (error) {
    if (onError) {
      try {
        onError(error, event);
      } catch {
        // onError must never propagate — that would defeat the
        // parallel-only invariant we just enforced above.
      }
    }
    return [];
  }
  if (process.env.NODE_ENV !== 'production') {
    const hook = (globalThis as unknown as { [RUNTIME_DISPATCH_HOOK_GLOBAL_KEY]?: RuntimeDispatchHook })[
      RUNTIME_DISPATCH_HOOK_GLOBAL_KEY
    ];
    if (typeof hook === 'function') {
      try {
        hook({ event, state: result.state, effects: result.effects });
      } catch {
        // Swallow hook errors so they never affect production callers.
      }
    }
  }
  return result.effects;
}
