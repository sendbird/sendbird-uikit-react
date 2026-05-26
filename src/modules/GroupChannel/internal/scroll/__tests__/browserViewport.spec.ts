/**
 * Phase 3 — viewport observer (feature-detected). Verifies that
 * `attachViewportObserver` subscribes to window.resize,
 * window.orientationchange, and (if present) visualViewport resize/scroll,
 * forwarding each to the controller with the appropriate reason.
 */
import { attachViewportObserver } from '../browserViewport';
import type { ScrollController } from '../controller';

type Handler = (event: Event) => void;

function makeFakeWindow(withVisualViewport = false): Window & typeof globalThis {
  const listeners = new Map<EventTarget, Map<string, Set<Handler>>>();
  const make = (): EventTarget => ({
    addEventListener(name: string, listener: Handler) {
      if (!listeners.has(this)) listeners.set(this, new Map());
      const evMap = listeners.get(this)!;
      if (!evMap.has(name)) evMap.set(name, new Set());
      evMap.get(name)!.add(listener);
    },
    removeEventListener(name: string, listener: Handler) {
      listeners.get(this)?.get(name)?.delete(listener);
    },
    dispatchEvent(event: Event) {
      const set = listeners.get(this)?.get(event.type);
      set?.forEach((l) => l(event));
      return true;
    },
  } as EventTarget);

  const w = make() as any;
  if (withVisualViewport) {
    w.visualViewport = make();
  }
  return w as Window & typeof globalThis;
}

function fireOn(target: EventTarget, name: string) {
  (target as any).dispatchEvent(new Event(name));
}

describe('Phase 3 — attachViewportObserver', () => {
  it('returns a disposer when no window is available (SSR safety)', () => {
    const ctrl: Pick<ScrollController, 'notifyViewportChanged'> = { notifyViewportChanged: jest.fn() };
    const observer = attachViewportObserver(ctrl, { windowObj: undefined as any });
    expect(typeof observer.dispose).toBe('function');
    expect(() => observer.dispose()).not.toThrow();
    expect(ctrl.notifyViewportChanged).not.toHaveBeenCalled();
  });

  it('window resize forwards to controller with reason="window"', () => {
    const spy = jest.fn();
    const ctrl: Pick<ScrollController, 'notifyViewportChanged'> = { notifyViewportChanged: spy };
    const w = makeFakeWindow(false);
    const observer = attachViewportObserver(ctrl, { windowObj: w });
    fireOn(w, 'resize');
    expect(spy).toHaveBeenCalledWith('window');
    observer.dispose();
  });

  it('window orientationchange forwards with reason="orientation"', () => {
    const spy = jest.fn();
    const ctrl: Pick<ScrollController, 'notifyViewportChanged'> = { notifyViewportChanged: spy };
    const w = makeFakeWindow(false);
    const observer = attachViewportObserver(ctrl, { windowObj: w });
    fireOn(w, 'orientationchange');
    expect(spy).toHaveBeenCalledWith('orientation');
    observer.dispose();
  });

  it('visualViewport resize forwards with reason="visualViewport" when feature-detected', () => {
    const spy = jest.fn();
    const ctrl: Pick<ScrollController, 'notifyViewportChanged'> = { notifyViewportChanged: spy };
    const w = makeFakeWindow(true);
    const observer = attachViewportObserver(ctrl, { windowObj: w });
    fireOn((w as any).visualViewport, 'resize');
    expect(spy).toHaveBeenCalledWith('visualViewport');
    observer.dispose();
  });

  it('dispose() detaches all listeners so subsequent events do nothing', () => {
    const spy = jest.fn();
    const ctrl: Pick<ScrollController, 'notifyViewportChanged'> = { notifyViewportChanged: spy };
    const w = makeFakeWindow(true);
    const observer = attachViewportObserver(ctrl, { windowObj: w });
    observer.dispose();
    fireOn(w, 'resize');
    fireOn((w as any).visualViewport, 'resize');
    expect(spy).not.toHaveBeenCalled();
  });
});
