/**
 * Phase 3 RV — ScrollController surface (RV-3.1..3.4 partial).
 *
 * Verifies controller construction, measure, attach, run, intent log,
 * notify callbacks, and the global instrumentation hook. Integration
 * with the actual scrollPubSub bridge in `useMessageListScroll.tsx`
 * lands in Phase 3 sub-batch 2 (next commit).
 */
import {
  createScrollController,
  SCROLL_CONTROLLER_HOOK_GLOBAL_KEY,
  type ScrollControllerHookPayload,
} from '../controller';
import type { ScrollIntent } from '../intents';

function makeScrollElement(): HTMLDivElement {
  const el = document.createElement('div');
  Object.defineProperty(el, 'scrollTop', { value: 100, writable: true, configurable: true });
  Object.defineProperty(el, 'scrollHeight', { value: 1000, writable: true, configurable: true });
  Object.defineProperty(el, 'clientHeight', { value: 500, writable: true, configurable: true });
  return el;
}

describe('Phase 3 — ScrollController', () => {
  afterEach(() => {
    delete (globalThis as any)[SCROLL_CONTROLLER_HOOK_GLOBAL_KEY];
  });

  it('createScrollController returns the documented surface', () => {
    const ctrl = createScrollController();
    expect(typeof ctrl.attach).toBe('function');
    expect(typeof ctrl.measure).toBe('function');
    expect(typeof ctrl.getAnchor).toBe('function');
    expect(typeof ctrl.run).toBe('function');
    expect(typeof ctrl.notifyContentSizeChanged).toBe('function');
    expect(typeof ctrl.notifyViewportChanged).toBe('function');
  });

  it('measure() returns null until attach() is called', () => {
    const ctrl = createScrollController();
    expect(ctrl.measure()).toBeNull();
    ctrl.attach(makeScrollElement());
    expect(ctrl.measure()).not.toBeNull();
  });

  it('measure() computes ScrollMetrics with distanceFromBottom and position', () => {
    const ctrl = createScrollController();
    const el = makeScrollElement();
    ctrl.attach(el);
    const m = ctrl.measure()!;
    expect(m.scrollTop).toBe(100);
    expect(m.scrollHeight).toBe(1000);
    expect(m.clientHeight).toBe(500);
    expect(m.distanceFromBottom).toBe(400);
    expect(m.position).toBe('middle');
  });

  it('measure() returns position=bottom when distanceFromBottom <= 1', () => {
    const ctrl = createScrollController();
    const el = document.createElement('div');
    Object.defineProperty(el, 'scrollTop', { value: 500, writable: true });
    Object.defineProperty(el, 'scrollHeight', { value: 1000, writable: true });
    Object.defineProperty(el, 'clientHeight', { value: 500, writable: true });
    ctrl.attach(el);
    expect(ctrl.measure()!.position).toBe('bottom');
  });

  it('measure() returns position=top when scrollTop <= 1', () => {
    const ctrl = createScrollController();
    const el = document.createElement('div');
    Object.defineProperty(el, 'scrollTop', { value: 0, writable: true });
    Object.defineProperty(el, 'scrollHeight', { value: 1000, writable: true });
    Object.defineProperty(el, 'clientHeight', { value: 500, writable: true });
    ctrl.attach(el);
    expect(ctrl.measure()!.position).toBe('top');
  });

  it('run() records the intent and fires the global hook', async () => {
    const ctrl = createScrollController();
    ctrl.attach(makeScrollElement());

    const captured: ScrollControllerHookPayload[] = [];
    (globalThis as any)[SCROLL_CONTROLLER_HOOK_GLOBAL_KEY] = (p: ScrollControllerHookPayload) => captured.push(p);

    await ctrl.run({ type: 'TO_BOTTOM', animated: true, reason: 'receive' });
    expect(ctrl.intentLog()).toHaveLength(1);
    expect(ctrl.lastIntent()).toMatchObject({ type: 'TO_BOTTOM', animated: true, reason: 'receive' });
    expect(captured).toHaveLength(1);
    expect(captured[0].intent.type).toBe('TO_BOTTOM');
  });

  it('run() invokes the executor when provided and awaits its result', async () => {
    const executor = jest.fn().mockResolvedValue(undefined);
    const ctrl = createScrollController({ executor });
    ctrl.attach(makeScrollElement());

    await ctrl.run({ type: 'TO_BOTTOM', animated: false, reason: 'send' });
    expect(executor).toHaveBeenCalledTimes(1);
    expect(executor).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'TO_BOTTOM', animated: false, reason: 'send' }),
    );
  });

  it('resetIntentLog clears recorded intents', async () => {
    const ctrl = createScrollController();
    ctrl.attach(makeScrollElement());
    await ctrl.run({ type: 'TO_BOTTOM', animated: true, reason: 'receive' });
    expect(ctrl.intentLog().length).toBe(1);
    ctrl.resetIntentLog();
    expect(ctrl.intentLog().length).toBe(0);
    expect(ctrl.lastIntent()).toBeNull();
  });

  it('notifyContentSizeChanged emits a PRESERVE_ANCHOR intent when an anchor is selectable (RV-3.3 partial)', () => {
    const ctrl = createScrollController({
      visibleMessagesProvider: () => [{ messageId: 1, createdAt: 10, offsetTop: 50 }],
    });
    const el = document.createElement('div');
    Object.defineProperty(el, 'scrollTop', { value: 100, writable: true });
    Object.defineProperty(el, 'scrollHeight', { value: 1000, writable: true });
    Object.defineProperty(el, 'clientHeight', { value: 500, writable: true });
    ctrl.attach(el);

    ctrl.notifyContentSizeChanged('message-added');
    const intent = ctrl.lastIntent() as Extract<ScrollIntent, { type: 'PRESERVE_ANCHOR' }> | null;
    expect(intent).not.toBeNull();
    expect(intent!.type).toBe('PRESERVE_ANCHOR');
    expect(intent!.reason).toBe('message-height-change');
    expect(intent!.anchor.kind).toBe('message');
  });

  it('notifyContentSizeChanged emits no intent when no anchor is selectable', () => {
    const ctrl = createScrollController({ visibleMessagesProvider: () => [] });
    // No attach() — measure() returns null and visible messages empty.
    ctrl.notifyContentSizeChanged('image-loaded');
    expect(ctrl.intentLog()).toEqual([]);
  });

  it('notifyViewportChanged emits a RESTORE_AFTER_RESIZE intent (RV-3.3 viewport)', () => {
    const ctrl = createScrollController({
      visibleMessagesProvider: () => [{ messageId: 1, createdAt: 10, offsetTop: 50 }],
    });
    ctrl.attach(makeScrollElement());
    ctrl.notifyViewportChanged('keyboard');
    const intent = ctrl.lastIntent() as Extract<ScrollIntent, { type: 'RESTORE_AFTER_RESIZE' }> | null;
    expect(intent).not.toBeNull();
    expect(intent!.type).toBe('RESTORE_AFTER_RESIZE');
    expect(intent!.reason).toBe('keyboard');
  });

  it('hook errors do not escape the controller', async () => {
    (globalThis as any)[SCROLL_CONTROLLER_HOOK_GLOBAL_KEY] = () => { throw new Error('boom'); };
    const ctrl = createScrollController();
    ctrl.attach(makeScrollElement());
    await expect(
      ctrl.run({ type: 'TO_BOTTOM', animated: false, reason: 'init' }),
    ).resolves.not.toThrow();
  });
});
