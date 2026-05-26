/**
 * Phase 2 RV — coreTs callback → RuntimeEvent mapping table (RV-2.1, RV-2.2).
 *
 * Table-driven assertion: every coreTs callback path that Phase 2 wires has
 * a 1:1 mapping into the GroupChannelRuntimeEvent union with the expected
 * fields and discriminator. Unmapped sources are 0 (the
 * `_exhaustive: never` guard in `mapCollectionEvent` would tag any new
 * coreTs `kind` value at the type level).
 */
import {
  mapCollectionEvent,
  mapOnCacheResult,
  mapOnApiResult,
  mapOnMessagesReceived,
  mapOnMessagesUpdated,
  mapOnChannelDeleted,
  mapOnCurrentUserBanned,
  mapOnChannelUpdated,
  mapChannelReady,
  mapChannelFailed,
  mapBrowserResumed,
  mapScrollPositionChanged,
  toGroupChannelState,
} from '../adapter';
import { createInitialRuntimeState } from '../state';
import { groupChannelRuntimeReducer } from '../reducer';

function fakeMessage(id: number) {
  return { messageId: id, createdAt: id, message: `m${id}` } as any;
}

describe('Phase 2 — adapter mapping (RV-2.1, RV-2.2)', () => {
  /* ─── RV-2.2  coreTs initialized events → COLLECTION_*_RESULT ─── */
  describe('mapCollectionEvent — initialized variant (RV-2.2)', () => {
    it('initialized + cache → COLLECTION_CACHE_RESULT', () => {
      const events = mapCollectionEvent({
        kind: 'initialized',
        source: 'cache',
        messages: [fakeMessage(1), fakeMessage(2)],
      });
      expect(events).toHaveLength(1);
      expect(events[0]).toMatchObject({
        type: 'COLLECTION_CACHE_RESULT',
        error: null,
      });
      expect(events[0]).toMatchObject({ messages: expect.any(Array) });
      expect((events[0] as any).messages).toHaveLength(2);
    });

    it('initialized + api → COLLECTION_API_RESULT', () => {
      const events = mapCollectionEvent({
        kind: 'initialized',
        source: 'api',
        messages: [fakeMessage(3)],
      });
      expect(events).toHaveLength(1);
      expect(events[0]).toMatchObject({
        type: 'COLLECTION_API_RESULT',
        error: null,
      });
    });
  });

  /* ─── RV-2.1  mutation events → MESSAGES_* ───────────────────── */
  describe('mapCollectionEvent — mutation variants (RV-2.1)', () => {
    it.each([
      ['messagesAdded', 'MESSAGES_ADDED'],
      ['messagesUpdated', 'MESSAGES_UPDATED'],
      ['messagesDeleted', 'MESSAGES_DELETED'],
    ] as const)('%s → %s', (kind, expectedType) => {
      const events = mapCollectionEvent({
        kind: kind as any,
        source: 'EVENT_MESSAGE_RECEIVED' as any,
        messages: [fakeMessage(1)],
      });
      expect(events).toHaveLength(1);
      expect(events[0].type).toBe(expectedType);
      // payload includes `source`
      expect((events[0] as any).source).toBe('EVENT_MESSAGE_RECEIVED');
    });

    it('messagesDeleted extracts numeric messageIds from the deleted message objects', () => {
      const events = mapCollectionEvent({
        kind: 'messagesDeleted',
        source: 'EVENT_MESSAGE_DELETED' as any,
        messages: [fakeMessage(7), fakeMessage(8)],
      });
      expect(events).toHaveLength(1);
      expect(events[0]).toMatchObject({
        type: 'MESSAGES_DELETED',
        messageIds: [7, 8],
      });
    });
  });

  /* ─── Callback boundary mappers (RV-2.2 continued) ───────────── */
  it('mapOnCacheResult passes the error through and tags the result', () => {
    const error = new Error('cache miss');
    const event = mapOnCacheResult(error, []);
    expect(event).toMatchObject({
      type: 'COLLECTION_CACHE_RESULT',
      error,
      messages: [],
    });
  });

  it('mapOnApiResult passes the error through and tags the result', () => {
    const event = mapOnApiResult(null, [fakeMessage(1)]);
    expect(event).toMatchObject({
      type: 'COLLECTION_API_RESULT',
      error: null,
    });
    expect((event as any).messages).toHaveLength(1);
  });

  it('mapOnMessagesReceived defaults source to EVENT_MESSAGE_RECEIVED', () => {
    const event = mapOnMessagesReceived([fakeMessage(1)]);
    expect(event).toMatchObject({
      type: 'MESSAGES_ADDED',
      source: 'EVENT_MESSAGE_RECEIVED',
    });
  });

  it('mapOnMessagesUpdated defaults source to EVENT_MESSAGE_UPDATED', () => {
    const event = mapOnMessagesUpdated([fakeMessage(1)]);
    expect(event).toMatchObject({
      type: 'MESSAGES_UPDATED',
      source: 'EVENT_MESSAGE_UPDATED',
    });
  });

  it('mapOnChannelDeleted produces CHANNEL_CLEARED with reason=deleted', () => {
    expect(mapOnChannelDeleted()).toEqual({ type: 'CHANNEL_CLEARED', reason: 'deleted' });
  });

  it('mapOnCurrentUserBanned produces CHANNEL_CLEARED with reason=banned', () => {
    expect(mapOnCurrentUserBanned()).toEqual({ type: 'CHANNEL_CLEARED', reason: 'banned' });
  });

  it('mapOnChannelUpdated and mapChannelReady produce CHANNEL_READY with channel reference', () => {
    const channel = { url: 'ch-1' } as any;
    expect(mapOnChannelUpdated(channel)).toEqual({ type: 'CHANNEL_READY', channel });
    expect(mapChannelReady(channel)).toEqual({ type: 'CHANNEL_READY', channel });
  });

  it('mapChannelFailed wraps the SendbirdError into CHANNEL_FAILED', () => {
    const error = { message: 'fail' } as any;
    expect(mapChannelFailed(error)).toEqual({ type: 'CHANNEL_FAILED', error });
  });

  it('mapBrowserResumed accepts each BrowserResumeReason', () => {
    expect(mapBrowserResumed('visibility')).toEqual({ type: 'BROWSER_RESUMED', reason: 'visibility' });
    expect(mapBrowserResumed('online')).toEqual({ type: 'BROWSER_RESUMED', reason: 'online' });
    expect(mapBrowserResumed('focus')).toEqual({ type: 'BROWSER_RESUMED', reason: 'focus' });
  });

  it('mapScrollPositionChanged forwards position + metrics', () => {
    const metrics = {
      scrollTop: 100,
      scrollHeight: 1000,
      clientHeight: 400,
      distanceFromBottom: 500,
      position: 'middle' as const,
      viewportHeight: 400,
    };
    expect(mapScrollPositionChanged('middle', metrics)).toEqual({
      type: 'SCROLL_POSITION_CHANGED',
      position: 'middle',
      metrics,
    });
  });
});

describe('Phase 2 — toGroupChannelState parity (RV-2.7)', () => {
  it('initialized=false / loading=false when runtime collection.status is idle', () => {
    const s0 = createInitialRuntimeState();
    const patch = toGroupChannelState(s0);
    expect(patch.initialized).toBe(false);
    expect(patch.loading).toBe(false);
    expect(patch.messages).toBe(s0.messages.items);
    expect(patch.currentChannel).toBeNull();
    expect(patch.fetchChannelError).toBeNull();
    expect(patch.animatedMessageId).toBeNull();
    expect(patch.isScrollBottomReached).toBe(true);
  });

  it('initialized=true after COLLECTION_API_RESULT', () => {
    const s0 = createInitialRuntimeState();
    const after = groupChannelRuntimeReducer(s0, {
      type: 'COLLECTION_API_RESULT',
      messages: [fakeMessage(1)],
      error: null,
    }).state;
    const patch = toGroupChannelState(after);
    expect(patch.initialized).toBe(true);
    expect(patch.loading).toBe(false);
  });

  it('loading=true while in cache-loading or api-loading', () => {
    const s0 = createInitialRuntimeState();
    const afterInit = groupChannelRuntimeReducer(s0, {
      type: 'COLLECTION_INITIALIZING',
      startingPoint: 0,
    }).state;
    expect(toGroupChannelState(afterInit).loading).toBe(true);

    const afterCache = groupChannelRuntimeReducer(afterInit, {
      type: 'COLLECTION_CACHE_RESULT',
      messages: [fakeMessage(1)],
      error: null,
    }).state;
    // cache-result moves status to 'api-loading' → still loading
    expect(toGroupChannelState(afterCache).loading).toBe(true);
  });

  it('isScrollBottomReached reflects runtime.scroll.position === "bottom"', () => {
    const s0 = createInitialRuntimeState();
    expect(toGroupChannelState(s0).isScrollBottomReached).toBe(true);

    const after = groupChannelRuntimeReducer(s0, {
      type: 'SCROLL_POSITION_CHANGED',
      position: 'middle',
      metrics: {
        scrollTop: 0,
        scrollHeight: 1,
        clientHeight: 0,
        distanceFromBottom: 1,
        position: 'middle' as const,
        viewportHeight: 0,
      },
    }).state;
    expect(toGroupChannelState(after).isScrollBottomReached).toBe(false);
  });

  it('returned patch field set matches the legacy contract exactly', () => {
    const s0 = createInitialRuntimeState();
    const patch = toGroupChannelState(s0);
    expect(Object.keys(patch).sort()).toEqual(
      [
        'animatedMessageId',
        'currentChannel',
        'fetchChannelError',
        'initialized',
        'isScrollBottomReached',
        'loading',
        'messages',
      ].sort(),
    );
  });
});
