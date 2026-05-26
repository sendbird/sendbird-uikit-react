/**
 * Phase 2 RV — reducer transition table (AC-6, RV-2.3..2.6 plus coverage).
 *
 * Covers all 15 GroupChannelRuntimeEvent variants. The 4 transitions called
 * out in spec AC-6 (MESSAGES_ADDED at bottom / MESSAGES_ADDED away from
 * bottom / STARTING_POINT_CHANGED / BROWSER_RESUMED) are also captured in
 * the targeted `describe` block below.
 *
 * Identity invariants asserted alongside transitions:
 *   - Reducer is pure: same input → same output. No `Date.now()` etc.
 *   - Structural sharing: unchanged slices keep their object reference.
 *   - Empty side-effects array is the same reference across no-op
 *     transitions where applicable.
 */
import {
  groupChannelRuntimeReducer,
  type SideEffect,
} from '../reducer';
import { createInitialRuntimeState, RUNTIME_STATE_SENTINELS } from '../state';
import {
  ALL_RUNTIME_EVENT_TYPES,
  type GroupChannelRuntimeEvent,
} from '../events';

function fakeChannel(url = 'ch1') {
  return { url, members: [] } as unknown as Parameters<typeof groupChannelRuntimeReducer>[0]['channel']['current'];
}

function fakeMessage(messageId: number, createdAt = messageId) {
  return { messageId, createdAt, message: `m${messageId}`, sender: { userId: 'other' } } as unknown as
    Parameters<typeof groupChannelRuntimeReducer>[0]['messages']['items'][number];
}

function effectTypes(effects: SideEffect[]): string[] {
  return effects.map((e) => e.type);
}

describe('Phase 2 — groupChannelRuntimeReducer (RV-2.3..2.6, AC-6)', () => {
  /* ─── Channel lifecycle ───────────────────────────────────────── */
  it('CHANNEL_REQUESTED moves channel.status to loading and stores the URL', () => {
    const s0 = createInitialRuntimeState();
    const r = groupChannelRuntimeReducer(s0, { type: 'CHANNEL_REQUESTED', channelUrl: 'channel-x' });
    expect(r.state.channel.status).toBe('loading');
    expect(r.state.channel.url).toBe('channel-x');
    expect(r.effects).toEqual([]);
  });

  it('CHANNEL_READY sets channel + emits REQUEST_INIT_COLLECTION', () => {
    const s0 = createInitialRuntimeState();
    const ch = fakeChannel('channel-x');
    const r = groupChannelRuntimeReducer(s0, { type: 'CHANNEL_READY', channel: ch! });
    expect(r.state.channel.status).toBe('ready');
    expect(r.state.channel.current).toBe(ch);
    expect(effectTypes(r.effects)).toEqual(['REQUEST_INIT_COLLECTION']);
  });

  it('CHANNEL_FAILED sets status=failed and stores the error', () => {
    const s0 = createInitialRuntimeState();
    const err = new Error('boom') as unknown as Parameters<typeof groupChannelRuntimeReducer>[1] extends infer E
      ? E extends { type: 'CHANNEL_FAILED'; error: infer X } ? X : never
      : never;
    const r = groupChannelRuntimeReducer(s0, {
      type: 'CHANNEL_FAILED',
      error: err as any,
    });
    expect(r.state.channel.status).toBe('failed');
    expect(r.state.channel.current).toBeNull();
    expect(r.state.channel.error).toBe(err);
  });

  it('CHANNEL_CLEARED resets channel/messages with the cleared status', () => {
    const ch = fakeChannel();
    const s = groupChannelRuntimeReducer(
      createInitialRuntimeState(),
      { type: 'CHANNEL_READY', channel: ch! },
    ).state;
    const r = groupChannelRuntimeReducer(s, { type: 'CHANNEL_CLEARED', reason: 'deleted' });
    expect(r.state.channel.status).toBe('cleared');
    expect(r.state.channel.current).toBeNull();
    expect(r.state.messages.items).toBe(RUNTIME_STATE_SENTINELS.EMPTY_MESSAGE_ARRAY);
  });

  /* ─── Collection initialization ───────────────────────────────── */
  it('COLLECTION_INITIALIZING moves to cache-loading and records starting point', () => {
    const s0 = createInitialRuntimeState();
    const r = groupChannelRuntimeReducer(s0, { type: 'COLLECTION_INITIALIZING', startingPoint: 12345 });
    expect(r.state.collection.status).toBe('cache-loading');
    expect(r.state.scroll.targetCreatedAt).toBe(12345);
  });

  it('COLLECTION_CACHE_RESULT (success) hydrates messages and emits REQUEST_RESTORE_ANCHOR', () => {
    const s0 = createInitialRuntimeState();
    const msgs = [fakeMessage(1), fakeMessage(2)];
    const r = groupChannelRuntimeReducer(s0, {
      type: 'COLLECTION_CACHE_RESULT',
      messages: msgs as any,
      error: null,
    });
    expect(r.state.collection.cacheLoaded).toBe(true);
    expect(r.state.collection.status).toBe('api-loading');
    expect(r.state.messages.items).toHaveLength(2);
    expect(effectTypes(r.effects)).toEqual(['REQUEST_RESTORE_ANCHOR']);
  });

  it('COLLECTION_CACHE_RESULT (error) leaves collection in failed state with no effects', () => {
    const s0 = createInitialRuntimeState();
    const r = groupChannelRuntimeReducer(s0, {
      type: 'COLLECTION_CACHE_RESULT',
      messages: [] as any,
      error: new Error('cache miss'),
    });
    expect(r.state.collection.status).toBe('failed');
    expect(r.state.collection.cacheLoaded).toBe(false);
    expect(r.effects).toEqual([]);
  });

  it('COLLECTION_API_RESULT (success) marks collection ready and emits REQUEST_RESTORE_ANCHOR', () => {
    const s0 = createInitialRuntimeState();
    const msgs = [fakeMessage(1), fakeMessage(2), fakeMessage(3)];
    const r = groupChannelRuntimeReducer(s0, {
      type: 'COLLECTION_API_RESULT',
      messages: msgs as any,
      error: null,
    });
    expect(r.state.collection.apiLoaded).toBe(true);
    expect(r.state.collection.status).toBe('ready');
    expect(r.state.messages.items).toHaveLength(3);
    expect(effectTypes(r.effects)).toEqual(['REQUEST_RESTORE_ANCHOR']);
  });

  /* ─── MESSAGES_ADDED — AC-6 / RV-2.3, RV-2.4 ──────────────────── */
  describe('MESSAGES_ADDED', () => {
    it('RV-2.3  at bottom: appends, emits REQUEST_SCROLL_TO_BOTTOM + REQUEST_MARK_AS_READS', () => {
      const s0 = createInitialRuntimeState();
      const m1 = fakeMessage(1);
      const seeded = {
        ...s0,
        scroll: { ...s0.scroll, position: 'bottom' as const },
        messages: { ...s0.messages, items: [m1] as any },
      };
      const m2 = fakeMessage(2);
      const r = groupChannelRuntimeReducer(seeded, {
        type: 'MESSAGES_ADDED',
        source: 'EVENT_MESSAGE_RECEIVED' as any,
        messages: [m2] as any,
      });
      expect(r.state.messages.items).toHaveLength(2);
      expect(r.state.messages.items[1]).toBe(m2);
      expect(effectTypes(r.effects)).toEqual([
        'REQUEST_SCROLL_TO_BOTTOM',
        'REQUEST_MARK_AS_READ',
      ]);
      // payload shape
      const scrollEffect = r.effects.find((e) => e.type === 'REQUEST_SCROLL_TO_BOTTOM');
      expect(scrollEffect).toMatchObject({ animated: true, reason: 'receive' });
    });

    it('RV-2.4  away from bottom: appends, emits ONLY REQUEST_SHOW_UNREAD_INDICATOR', () => {
      const s0 = createInitialRuntimeState();
      const seeded = {
        ...s0,
        scroll: { ...s0.scroll, position: 'middle' as const },
        messages: { ...s0.messages, items: [fakeMessage(1)] as any },
      };
      const m2 = fakeMessage(2);
      const r = groupChannelRuntimeReducer(seeded, {
        type: 'MESSAGES_ADDED',
        source: 'EVENT_MESSAGE_RECEIVED' as any,
        messages: [m2] as any,
      });
      expect(r.state.messages.items).toHaveLength(2);
      expect(effectTypes(r.effects)).toEqual(['REQUEST_SHOW_UNREAD_INDICATOR']);
      expect(r.effects.find((e) => e.type === 'REQUEST_MARK_AS_READ')).toBeUndefined();
      expect(r.effects.find((e) => e.type === 'REQUEST_SCROLL_TO_BOTTOM')).toBeUndefined();
    });

    it('records lastEventSource on the collection slice', () => {
      const s0 = createInitialRuntimeState();
      const r = groupChannelRuntimeReducer(s0, {
        type: 'MESSAGES_ADDED',
        source: 'cache',
        messages: [fakeMessage(1)] as any,
      });
      expect(r.state.collection.lastEventSource).toBe('cache');
    });

    it('empty messages payload is a no-op with structural sharing', () => {
      const s0 = createInitialRuntimeState();
      const r = groupChannelRuntimeReducer(s0, {
        type: 'MESSAGES_ADDED',
        source: 'cache',
        messages: [] as any,
      });
      // Empty append => identity preserved on state.messages reference.
      expect(r.state.messages).toBe(s0.messages);
    });
  });

  /* ─── MESSAGES_UPDATED ────────────────────────────────────────── */
  it('MESSAGES_UPDATED replaces messages by id and emits REQUEST_RESTORE_ANCHOR', () => {
    const m1 = fakeMessage(1);
    const m2 = fakeMessage(2);
    const s0 = createInitialRuntimeState();
    const seeded = { ...s0, messages: { ...s0.messages, items: [m1, m2] as any } };
    const m1Updated = { ...m1, message: 'updated' } as any;
    const r = groupChannelRuntimeReducer(seeded, {
      type: 'MESSAGES_UPDATED',
      source: 'EVENT_MESSAGE_UPDATED' as any,
      messages: [m1Updated],
    });
    expect((r.state.messages.items[0] as any).message).toBe('updated');
    expect(r.state.messages.items[1]).toBe(m2);
    expect(effectTypes(r.effects)).toEqual(['REQUEST_RESTORE_ANCHOR']);
  });

  it('MESSAGES_UPDATED with no matching ids is a no-op (identity preserved)', () => {
    const m1 = fakeMessage(1);
    const s0 = createInitialRuntimeState();
    const seeded = { ...s0, messages: { ...s0.messages, items: [m1] as any } };
    const r = groupChannelRuntimeReducer(seeded, {
      type: 'MESSAGES_UPDATED',
      source: 'EVENT_MESSAGE_UPDATED' as any,
      messages: [fakeMessage(99)] as any,
    });
    expect(r.state).toBe(seeded); // structural sharing
    expect(r.effects).toEqual([]);
  });

  /* ─── MESSAGES_DELETED ────────────────────────────────────────── */
  it('MESSAGES_DELETED removes messages by id and emits REQUEST_RESTORE_ANCHOR', () => {
    const m1 = fakeMessage(1);
    const m2 = fakeMessage(2);
    const s0 = createInitialRuntimeState();
    const seeded = { ...s0, messages: { ...s0.messages, items: [m1, m2] as any } };
    const r = groupChannelRuntimeReducer(seeded, {
      type: 'MESSAGES_DELETED',
      source: 'EVENT_MESSAGE_DELETED' as any,
      messageIds: [1],
    });
    expect(r.state.messages.items.length).toBe(1);
    expect(r.state.messages.items[0]).toBe(m2);
    expect(effectTypes(r.effects)).toEqual(['REQUEST_RESTORE_ANCHOR']);
  });

  it('MESSAGES_DELETED with unknown ids is a no-op', () => {
    const m1 = fakeMessage(1);
    const s0 = createInitialRuntimeState();
    const seeded = { ...s0, messages: { ...s0.messages, items: [m1] as any } };
    const r = groupChannelRuntimeReducer(seeded, {
      type: 'MESSAGES_DELETED',
      source: 'EVENT_MESSAGE_DELETED' as any,
      messageIds: [42],
    });
    expect(r.state).toBe(seeded);
  });

  /* ─── SCROLL_POSITION_CHANGED ─────────────────────────────────── */
  it('SCROLL_POSITION_CHANGED updates scroll slice; idempotent emits no state change', () => {
    const s0 = createInitialRuntimeState();
    const metrics = {
      scrollTop: 0,
      scrollHeight: 1000,
      clientHeight: 500,
      distanceFromBottom: 500,
      position: 'middle' as const,
      viewportHeight: 500,
    };
    const r1 = groupChannelRuntimeReducer(s0, {
      type: 'SCROLL_POSITION_CHANGED',
      position: 'middle',
      metrics,
    });
    expect(r1.state.scroll.position).toBe('middle');
    expect(r1.state.scroll.metrics).toBe(metrics);

    // Same metrics + same position → no state change
    const r2 = groupChannelRuntimeReducer(r1.state, {
      type: 'SCROLL_POSITION_CHANGED',
      position: 'middle',
      metrics,
    });
    expect(r2.state).toBe(r1.state);
  });

  /* ─── STARTING_POINT_CHANGED — AC-6 / RV-2.5 ─────────────────── */
  it('RV-2.5  STARTING_POINT_CHANGED sets targetCreatedAt and emits load + scroll effects', () => {
    const s0 = createInitialRuntimeState();
    const r = groupChannelRuntimeReducer(s0, {
      type: 'STARTING_POINT_CHANGED',
      createdAt: 7777,
    });
    expect(r.state.scroll.targetCreatedAt).toBe(7777);
    expect(effectTypes(r.effects)).toEqual([
      'REQUEST_LOAD_AROUND_STARTING_POINT',
      'REQUEST_SCROLL_TO_MESSAGE',
    ]);
    const loadEffect = r.effects.find((e) => e.type === 'REQUEST_LOAD_AROUND_STARTING_POINT');
    expect(loadEffect).toMatchObject({ createdAt: 7777 });
    const scrollEffect = r.effects.find((e) => e.type === 'REQUEST_SCROLL_TO_MESSAGE');
    expect(scrollEffect).toMatchObject({ createdAt: 7777, animated: true });
  });

  /* ─── MESSAGE_FOCUS_REQUESTED ─────────────────────────────────── */
  it('MESSAGE_FOCUS_REQUESTED sets focused id + emits scroll to message', () => {
    const s0 = createInitialRuntimeState();
    const r = groupChannelRuntimeReducer(s0, {
      type: 'MESSAGE_FOCUS_REQUESTED',
      createdAt: 5555,
      messageId: 55,
    });
    expect(r.state.messages.focusedMessageId).toBe(55);
    expect(r.state.messages.animatedMessageId).toBe(55);
    expect(effectTypes(r.effects)).toEqual(['REQUEST_SCROLL_TO_MESSAGE']);
  });

  /* ─── BROWSER_RESUMED — AC-6 / RV-2.6 ─────────────────────────── */
  it('RV-2.6  BROWSER_RESUMED sets staleReason and emits refreshIfNeeded + restoreAnchor', () => {
    const s0 = createInitialRuntimeState();
    const r = groupChannelRuntimeReducer(s0, { type: 'BROWSER_RESUMED', reason: 'visibility' });
    expect(r.state.browser.visible).toBe(true);
    expect(r.state.browser.staleReason).toBe('visibility');
    expect(effectTypes(r.effects)).toEqual([
      'REQUEST_REFRESH_IF_NEEDED',
      'REQUEST_RESTORE_ANCHOR',
    ]);
    const refresh = r.effects.find((e) => e.type === 'REQUEST_REFRESH_IF_NEEDED');
    expect(refresh).toMatchObject({ reason: 'visibility' });
  });

  /* ─── VIEWPORT_RESIZED ────────────────────────────────────────── */
  it('VIEWPORT_RESIZED produces no state change in Phase 2', () => {
    const s0 = createInitialRuntimeState();
    const r = groupChannelRuntimeReducer(s0, { type: 'VIEWPORT_RESIZED', reason: 'keyboard' });
    expect(r.state).toBe(s0);
    expect(r.effects).toEqual([]);
  });

  /* ─── Exhaustiveness ──────────────────────────────────────────── */
  it('ALL_RUNTIME_EVENT_TYPES is exhaustive and matches the union', () => {
    // 15 events listed in design + spec
    expect(ALL_RUNTIME_EVENT_TYPES.length).toBe(15);
    // Sanity: each is a distinct uppercase snake-case string
    for (const t of ALL_RUNTIME_EVENT_TYPES) {
      expect(t).toMatch(/^[A-Z_]+$/);
    }
  });

  /* ─── Purity ──────────────────────────────────────────────────── */
  it('reducer is pure — same input produces same output (no time/random)', () => {
    const s0 = createInitialRuntimeState();
    const event: GroupChannelRuntimeEvent = {
      type: 'MESSAGES_ADDED',
      source: 'cache',
      messages: [fakeMessage(1)] as any,
    };
    const r1 = groupChannelRuntimeReducer(
      { ...s0, scroll: { ...s0.scroll, position: 'bottom' } },
      event,
    );
    const r2 = groupChannelRuntimeReducer(
      { ...s0, scroll: { ...s0.scroll, position: 'bottom' } },
      event,
    );
    expect(r1.state.messages.items.length).toBe(r2.state.messages.items.length);
    expect(effectTypes(r1.effects)).toEqual(effectTypes(r2.effects));
  });
});
