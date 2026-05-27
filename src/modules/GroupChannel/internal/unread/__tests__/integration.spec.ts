/**
 * Phase 5.1.a — unread integration smoke tests.
 *
 * Mirrors `internal/runtime/__tests__/integration.spec.ts` for the
 * unread store. Covers the basic dispatch path plus the parallel-only
 * (W1) invariant inherited from Phase 2.
 */
import {
  createUnreadStore,
  dispatchToUnreadStore,
  UNREAD_DISPATCH_HOOK_GLOBAL_KEY,
  type UnreadDispatchHookPayload,
} from '../integration';

describe('Phase 5.1.a — unread integration', () => {
  afterEach(() => {
    delete (globalThis as any)[UNREAD_DISPATCH_HOOK_GLOBAL_KEY];
  });

  it('createUnreadStore returns a store at the initial state', () => {
    const store = createUnreadStore();
    const s = store.getState();
    expect(s.mode).toBe('clean');
    expect(s.firstUnreadMessageId).toBeNull();
    expect(s.firstUnreadCreatedAt).toBeNull();
    expect(s.unreadCount).toBe(0);
    expect(s.unreadMessageIds.size).toBe(0);
  });

  it('dispatchToUnreadStore applies the reducer and updates the store state', () => {
    const store = createUnreadStore();
    const next = dispatchToUnreadStore(
      store,
      { type: 'MESSAGES_RECEIVED', messages: [{ messageId: 1, createdAt: 100 }], fromCurrentUser: false },
      { isAtBottom: false },
    );
    expect(next.unreadCount).toBe(1);
    expect(next.firstUnreadMessageId).toBe(1);
    // applyStorePatch spreads into a new object, so the store reference
    // differs from the reducer output — assert structural parity instead.
    expect(store.getState()).toEqual(next);
  });

  it('dispatchToUnreadStore fires the global hook with event/context/state', () => {
    const store = createUnreadStore();
    const captured: UnreadDispatchHookPayload[] = [];
    (globalThis as any)[UNREAD_DISPATCH_HOOK_GLOBAL_KEY] = (p: UnreadDispatchHookPayload) => captured.push(p);

    dispatchToUnreadStore(store, { type: 'CHANNEL_CHANGED', channelUrl: 'ch-x' });
    dispatchToUnreadStore(
      store,
      { type: 'MESSAGES_RECEIVED', messages: [{ messageId: 1, createdAt: 100 }], fromCurrentUser: false },
      { isAtBottom: false },
    );

    expect(captured).toHaveLength(2);
    expect(captured[0].event.type).toBe('CHANNEL_CHANGED');
    expect(captured[1].event.type).toBe('MESSAGES_RECEIVED');
    expect(captured[1].context.isAtBottom).toBe(false);
  });

  it('hook errors are swallowed so production callers are never affected', () => {
    const store = createUnreadStore();
    (globalThis as any)[UNREAD_DISPATCH_HOOK_GLOBAL_KEY] = () => { throw new Error('hook explode'); };
    expect(() => {
      dispatchToUnreadStore(store, { type: 'CHANNEL_CHANGED', channelUrl: 'ch-x' });
    }).not.toThrow();
  });

  it('subscribers are notified on state-changing dispatch', () => {
    const store = createUnreadStore();
    const spy = jest.fn();
    store.subscribe(spy);
    dispatchToUnreadStore(
      store,
      { type: 'MESSAGES_RECEIVED', messages: [{ messageId: 1, createdAt: 100 }], fromCurrentUser: false },
      { isAtBottom: false },
    );
    expect(spy).toHaveBeenCalledTimes(1);
  });

  // Inherits the W1 parallel-only invariant from Phase 2 (runtime). A
  // malformed MARK_AS_UNREAD_SET event with `messageId: undefined` would
  // not throw at the reducer (it just stores it). We instead pass an
  // event with `type` outside the union and force the reducer through
  // its default branch (still does not throw — same shape as runtime).
  // To provoke a real throw we Object.freeze the store and then dispatch:
  // applyStorePatch's hasStateChanged path runs lodash isEqual on the
  // result, which is safe; but `applyStorePatch` itself calls
  // `store.setState` which we can monkey-patch to throw — covered by a
  // jest.spyOn on the store helper.
  describe('parallel-only invariant (W1)', () => {
    it('reducer/patch exceptions are swallowed and onError is invoked', () => {
      const store = createUnreadStore();
      const realSetState = store.setState;
      // Force the patch path to throw — simulates a future bug where
      // a downstream notifier mutates and breaks.
      store.setState = jest.fn(() => { throw new Error('forced setState failure'); }) as any;
      const onError = jest.fn();

      const before = store.getState();
      let returned: ReturnType<typeof dispatchToUnreadStore> | undefined;
      expect(() => {
        returned = dispatchToUnreadStore(
          store,
          { type: 'CHANNEL_CHANGED', channelUrl: 'ch-x' },
          undefined,
          onError,
        );
      }).not.toThrow();

      // Return value is the unchanged prior state.
      expect(returned).toBe(before);
      expect(onError).toHaveBeenCalledTimes(1);
      const [errArg, eventArg] = onError.mock.calls[0];
      expect(errArg).toBeInstanceOf(Error);
      expect((errArg as Error).message).toBe('forced setState failure');
      expect(eventArg).toEqual({ type: 'CHANNEL_CHANGED', channelUrl: 'ch-x' });

      store.setState = realSetState;
    });

    it('onError throwing does not propagate either', () => {
      const store = createUnreadStore();
      store.setState = jest.fn(() => { throw new Error('boom'); }) as any;
      expect(() => {
        dispatchToUnreadStore(
          store,
          { type: 'CHANNEL_CHANGED', channelUrl: 'ch-x' },
          undefined,
          () => { throw new Error('onError exploded'); },
        );
      }).not.toThrow();
    });

    it('dispatch with no onError still swallows', () => {
      const store = createUnreadStore();
      store.setState = jest.fn(() => { throw new Error('boom'); }) as any;
      expect(() => {
        dispatchToUnreadStore(store, { type: 'CHANNEL_CHANGED', channelUrl: 'ch-x' });
      }).not.toThrow();
    });
  });
});
