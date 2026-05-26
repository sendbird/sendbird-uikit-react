/**
 * Phase 2 — selector unit tests. Verify each selector returns the expected
 * slice and preserves reference stability across no-op transitions.
 */
import * as sel from '../selectors';
import { createInitialRuntimeState } from '../state';
import { groupChannelRuntimeReducer } from '../reducer';

function fakeMessage(id: number) {
  return { messageId: id, createdAt: id, message: `m${id}` } as any;
}

describe('Phase 2 — runtime selectors', () => {
  it('channel selectors read the channel slice', () => {
    const s0 = createInitialRuntimeState({ channelUrl: 'ch-x' });
    expect(sel.selectChannelStatus(s0)).toBe('idle');
    expect(sel.selectChannelUrl(s0)).toBe('ch-x');
    expect(sel.selectChannel(s0)).toBeNull();
    expect(sel.selectChannelError(s0)).toBeNull();
    expect(sel.selectChannelIsReady(s0)).toBe(false);
    expect(sel.selectChannelIsCleared(s0)).toBe(false);

    const after = groupChannelRuntimeReducer(s0, { type: 'CHANNEL_READY', channel: { url: 'ch-x' } as any }).state;
    expect(sel.selectChannelStatus(after)).toBe('ready');
    expect(sel.selectChannelIsReady(after)).toBe(true);
  });

  it('collection selectors read the collection slice', () => {
    const s0 = createInitialRuntimeState();
    expect(sel.selectCollectionStatus(s0)).toBe('idle');
    expect(sel.selectCollectionLoading(s0)).toBe(false);
    expect(sel.selectCollectionInitialized(s0)).toBe(false);
    expect(sel.selectCacheLoaded(s0)).toBe(false);
    expect(sel.selectApiLoaded(s0)).toBe(false);

    const after = groupChannelRuntimeReducer(s0, {
      type: 'COLLECTION_API_RESULT',
      messages: [fakeMessage(1)],
      error: null,
    }).state;
    expect(sel.selectCollectionInitialized(after)).toBe(true);
    expect(sel.selectApiLoaded(after)).toBe(true);
    expect(sel.selectLastEventSource(after)).toBe('api');
  });

  it('messages selectors preserve identity across no-op transitions', () => {
    const s0 = createInitialRuntimeState();
    const messagesRef = sel.selectMessages(s0);
    expect(sel.selectMessageCount(s0)).toBe(0);
    expect(sel.selectAnimatedMessageId(s0)).toBeNull();
    expect(sel.selectFocusedMessageId(s0)).toBeNull();

    // VIEWPORT_RESIZED is a no-op for messages.
    const after = groupChannelRuntimeReducer(s0, { type: 'VIEWPORT_RESIZED', reason: 'window' }).state;
    expect(sel.selectMessages(after)).toBe(messagesRef);
  });

  it('scroll selectors read the scroll slice', () => {
    const s0 = createInitialRuntimeState();
    expect(sel.selectScrollPosition(s0)).toBe('bottom');
    expect(sel.selectIsScrollAtBottom(s0)).toBe(true);
    expect(sel.selectScrollMetrics(s0)).toBeNull();
    expect(sel.selectScrollTargetCreatedAt(s0)).toBeNull();

    const metrics = {
      scrollTop: 0,
      scrollHeight: 1,
      clientHeight: 0,
      distanceFromBottom: 1,
      position: 'middle' as const,
      viewportHeight: 0,
    };
    const after = groupChannelRuntimeReducer(s0, {
      type: 'SCROLL_POSITION_CHANGED',
      position: 'middle',
      metrics,
    }).state;
    expect(sel.selectScrollPosition(after)).toBe('middle');
    expect(sel.selectIsScrollAtBottom(after)).toBe(false);
    expect(sel.selectScrollMetrics(after)).toBe(metrics);
  });

  it('browser selectors read the browser slice', () => {
    const s0 = createInitialRuntimeState();
    expect(sel.selectBrowserVisible(s0)).toBe(true);
    expect(sel.selectBrowserOnline(s0)).toBe(true);
    expect(sel.selectStaleReason(s0)).toBeNull();

    const after = groupChannelRuntimeReducer(s0, { type: 'BROWSER_RESUMED', reason: 'visibility' }).state;
    expect(sel.selectStaleReason(after)).toBe('visibility');
  });
});
