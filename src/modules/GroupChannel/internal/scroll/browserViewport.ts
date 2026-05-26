/**
 * browserViewport — feature-detected observer for `window.visualViewport`
 * resize events.
 *
 * Phase 3 of the P0 runtime-coupling refactor (Plan §6.7).
 *
 * Produces a small adapter that subscribes to viewport changes and
 * forwards them to a controller's `notifyViewportChanged` method. iOS
 * Safari's keyboard-open behavior surfaces here as a `visualViewport`
 * resize; desktop browsers only emit `window.resize`.
 *
 * Internal — gated from public dts by BC-4 / BC-5.
 */
import type { ScrollController } from './controller';
import type { ViewportChangeReason } from './intents';

export type ViewportObserver = {
  /** Detach listeners. Idempotent — safe to call multiple times. */
  dispose(): void;
};

export type AttachViewportObserverOptions = {
  /** Override hooks for testing in jsdom (which lacks visualViewport). */
  windowObj?: Window & typeof globalThis;
};

/**
 * Attach window + visualViewport listeners that forward to the controller.
 * Feature-detects visualViewport; falls back to plain `window.resize` if
 * unavailable.
 */
export function attachViewportObserver(
  controller: Pick<ScrollController, 'notifyViewportChanged'>,
  options: AttachViewportObserverOptions = {},
): ViewportObserver {
  const w = options.windowObj ?? (typeof window === 'undefined' ? undefined : window);
  if (!w) {
    return { dispose: () => {} };
  }

  const handlers: Array<() => void> = [];

  const subscribe = (
    target: EventTarget | undefined,
    eventName: string,
    reason: ViewportChangeReason,
  ) => {
    if (!target) return;
    const handler = () => {
      controller.notifyViewportChanged(reason);
    };
    target.addEventListener(eventName, handler);
    handlers.push(() => target.removeEventListener(eventName, handler));
  };

  subscribe(w, 'resize', 'window');
  subscribe(w, 'orientationchange', 'orientation');

  const vv = (w as Window & { visualViewport?: VisualViewport }).visualViewport;
  if (vv) {
    subscribe(vv as unknown as EventTarget, 'resize', 'visualViewport');
    subscribe(vv as unknown as EventTarget, 'scroll', 'visualViewport');
  }

  return {
    dispose() {
      while (handlers.length > 0) {
        const off = handlers.pop();
        if (off) off();
      }
    },
  };
}
