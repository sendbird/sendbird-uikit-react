/**
 * Phase 2 RV — runtime integration smoke tests (RV-2.7 / RV-2.8 portion).
 *
 * These exercise the integration helpers (`createRuntimeStore`,
 * `dispatchToRuntime`) in isolation from the GroupChannelProvider mount.
 * A full provider-level integration assertion (where the runtime store
 * lives inside GroupChannelManager) is covered indirectly by the
 * unmodified Phase 0 characterization specs — if the additive dispatch
 * calls altered visible behavior, those specs would fail.
 */
import {
  createRuntimeStore,
  dispatchToRuntime,
  RUNTIME_DISPATCH_HOOK_GLOBAL_KEY,
  type RuntimeDispatchHookPayload,
} from '../integration';
import { mapOnMessagesReceived, mapChannelReady, mapOnChannelDeleted } from '../adapter';

function fakeChannel(url = 'ch1') {
  return { url, members: [] } as any;
}
function fakeMessage(id: number) {
  return { messageId: id, createdAt: id, message: `m${id}` } as any;
}

describe('Phase 2 — runtime integration (RV-2.7 partial)', () => {
  afterEach(() => {
    delete (globalThis as any)[RUNTIME_DISPATCH_HOOK_GLOBAL_KEY];
  });

  it('createRuntimeStore returns a store at the initial state', () => {
    const store = createRuntimeStore();
    const s = store.getState();
    expect(s.channel.status).toBe('idle');
    expect(s.collection.status).toBe('idle');
    expect(s.messages.items).toHaveLength(0);
    expect(s.scroll.position).toBe('bottom');
    expect(s.browser.visible).toBe(true);
  });

  it('dispatchToRuntime applies the reducer and updates the store state', () => {
    const store = createRuntimeStore();
    const channel = fakeChannel('ch-x');
    const effects = dispatchToRuntime(store, mapChannelReady(channel));
    expect(store.getState().channel.status).toBe('ready');
    expect(store.getState().channel.current).toBe(channel);
    expect(effects.map((e) => e.type)).toEqual(['REQUEST_INIT_COLLECTION']);
  });

  it('dispatchToRuntime fires the global hook with event/state/effects when set', () => {
    const store = createRuntimeStore();
    const captured: RuntimeDispatchHookPayload[] = [];
    (globalThis as any)[RUNTIME_DISPATCH_HOOK_GLOBAL_KEY] = (p: RuntimeDispatchHookPayload) => captured.push(p);

    dispatchToRuntime(store, mapChannelReady(fakeChannel()));
    dispatchToRuntime(store, mapOnMessagesReceived([fakeMessage(1)] as never));

    expect(captured).toHaveLength(2);
    expect(captured[0].event.type).toBe('CHANNEL_READY');
    expect(captured[1].event.type).toBe('MESSAGES_ADDED');
    // Effects from MESSAGES_ADDED at bottom (default scroll position).
    expect(captured[1].effects.map((e) => e.type)).toEqual([
      'REQUEST_SCROLL_TO_BOTTOM',
      'REQUEST_MARK_AS_READ',
    ]);
  });

  it('hook errors are swallowed so production callers are never affected', () => {
    const store = createRuntimeStore();
    (globalThis as any)[RUNTIME_DISPATCH_HOOK_GLOBAL_KEY] = () => { throw new Error('hook explode'); };
    expect(() => {
      dispatchToRuntime(store, mapChannelReady(fakeChannel()));
    }).not.toThrow();
    // State still updates despite hook error.
    expect(store.getState().channel.status).toBe('ready');
  });

  it('dispatchToRuntime returns the reducer effects so callers can route them', () => {
    const store = createRuntimeStore();
    const effects = dispatchToRuntime(store, mapOnChannelDeleted());
    // CHANNEL_CLEARED has no side-effect emissions in the reducer.
    expect(effects).toEqual([]);
    expect(store.getState().channel.status).toBe('cleared');
  });

  it('subscribers are notified on dispatch (via underlying createStore)', () => {
    const store = createRuntimeStore();
    const spy = jest.fn();
    store.subscribe(spy);
    dispatchToRuntime(store, mapChannelReady(fakeChannel()));
    expect(spy).toHaveBeenCalledTimes(1);
  });

  // Parallel-only invariant (Plan §2.4): a fault in the reducer or store
  // patch MUST NOT propagate to legacy callers. See review-checklist W1.
  // A malformed CHANNEL_READY event with `channel: null` provokes a real
  // throw at `event.channel.url` inside the reducer — the closest in-tree
  // stand-in for a production mapper bug that emits a degenerate payload.
  describe('parallel-only invariant (W1)', () => {
    const malformedChannelReady = { type: 'CHANNEL_READY', channel: null } as never;

    it('reducer exceptions are swallowed and onError is invoked with event context', () => {
      const store = createRuntimeStore();
      const onError = jest.fn();

      let effects: ReturnType<typeof dispatchToRuntime> | undefined;
      expect(() => {
        effects = dispatchToRuntime(store, malformedChannelReady, onError);
      }).not.toThrow();

      expect(effects).toEqual([]);
      expect(onError).toHaveBeenCalledTimes(1);
      const [errArg, eventArg] = onError.mock.calls[0];
      expect(errArg).toBeInstanceOf(TypeError);
      expect(eventArg).toBe(malformedChannelReady);
    });

    it('onError throwing does not propagate either', () => {
      const store = createRuntimeStore();
      const onError = () => {
        throw new Error('onError exploded');
      };
      expect(() => {
        dispatchToRuntime(store, malformedChannelReady, onError);
      }).not.toThrow();
    });

    it('runtime state is preserved when dispatch fails', () => {
      const store = createRuntimeStore();
      // Establish a known-good state first.
      dispatchToRuntime(store, mapChannelReady(fakeChannel('ch-keep')));
      const before = store.getState();

      dispatchToRuntime(store, malformedChannelReady, () => undefined);

      // Failed dispatch must not mutate the store.
      expect(store.getState()).toBe(before);
    });

    it('dispatch with no onError still swallows the exception', () => {
      // Production legacy callers may opt out of error observation —
      // the swallow MUST hold regardless.
      const store = createRuntimeStore();
      expect(() => {
        dispatchToRuntime(store, malformedChannelReady);
      }).not.toThrow();
    });
  });
});
