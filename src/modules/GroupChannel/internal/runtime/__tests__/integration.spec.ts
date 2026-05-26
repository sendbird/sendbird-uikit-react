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
});
