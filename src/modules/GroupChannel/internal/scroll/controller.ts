/**
 * ScrollController — Phase 3 of the P0 runtime-coupling refactor.
 *
 * Plan §6.6. Encapsulates scroll state, anchor selection, and intent
 * execution behind a typed surface. Phase 3 instantiates the controller
 * in `useMessageListScroll.tsx` alongside the existing legacy
 * `scrollPubSub` subscribers — both run in parallel during the bridge
 * period. Phase 4+ may swap consumers to the controller path once the
 * characterization suite confirms the dual paths produce identical
 * visible behavior.
 *
 * The controller is intentionally minimal-doing in Phase 3 sub-batch 1:
 *   - `attach(element)` records the scroll container ref.
 *   - `measure()` computes ScrollMetrics from the attached element.
 *   - `getAnchor(strategy)` delegates to `anchors.ts#selectAnchor`.
 *   - `run(intent)` records the intent (visible to tests via the
 *     dispatch hook) and optionally invokes a pluggable executor. The
 *     default executor is no-op — Phase 3 sub-batch 2 will plug in the
 *     real DOM scroll executor inside `useMessageListScroll.tsx`.
 *   - `notifyContentSizeChanged` / `notifyViewportChanged` record the
 *     reason and emit a default PRESERVE_ANCHOR / RESTORE_AFTER_RESIZE
 *     intent. Phase 3 sub-batch 2 wires the actual callers.
 */
import {
  type ScrollIntent,
  type ScrollAnchor,
  type ScrollMetrics,
  type AnchorStrategy,
  type ContentSizeChangeReason,
  type ViewportChangeReason,
} from './intents';
import { selectAnchor, type AnchorMessage } from './anchors';

/**
 * Optional plug for routing intents into real DOM scroll operations.
 * Phase 3 sub-batch 2 supplies a concrete implementation in
 * `useMessageListScroll.tsx`. Returning a Promise lets callers `await`
 * scroll completion.
 */
export type ScrollExecutor = (intent: ScrollIntent) => Promise<void> | void;

/**
 * Optional inputs supplied per controller instance.
 *
 * `executor` defaults to no-op so the controller is fully constructible
 * (and unit-testable) without DOM. `visibleMessagesProvider` lets the
 * controller compute anchors against a live view of the current messages.
 */
export type ScrollControllerOptions = {
  executor?: ScrollExecutor;
  visibleMessagesProvider?: () => ReadonlyArray<AnchorMessage>;
};

/** Public ScrollController surface. */
export type ScrollController = {
  attach(element: HTMLDivElement | null): void;
  measure(): ScrollMetrics | null;
  getAnchor(strategy: AnchorStrategy, targetMessage?: AnchorMessage | null): ScrollAnchor | null;
  run(intent: ScrollIntent): Promise<void>;
  notifyContentSizeChanged(reason: ContentSizeChangeReason): void;
  notifyViewportChanged(reason: ViewportChangeReason): void;
  /** Inspect the most recent intent dispatched (test-only affordance). */
  lastIntent(): ScrollIntent | null;
  /** Inspect intents dispatched since the last reset (test-only). */
  intentLog(): ReadonlyArray<ScrollIntent>;
  /** Clear the intent log (test-only). */
  resetIntentLog(): void;
};

/** Global dev/test instrumentation hook key. */
export const SCROLL_CONTROLLER_HOOK_GLOBAL_KEY = '__GROUP_CHANNEL_SCROLL_CONTROLLER_HOOK__' as const;

export type ScrollControllerHookPayload = {
  intent: ScrollIntent;
  metrics: ScrollMetrics | null;
};

export type ScrollControllerHook = (payload: ScrollControllerHookPayload) => void;

/**
 * Construct a ScrollController. Idempotent — call once per
 * `useMessageListScroll` mount.
 */
export function createScrollController(options: ScrollControllerOptions = {}): ScrollController {
  let element: HTMLDivElement | null = null;
  const log: ScrollIntent[] = [];
  const executor: ScrollExecutor = options.executor ?? (() => {});
  const provider = options.visibleMessagesProvider ?? (() => []);

  const fireHook = (payload: ScrollControllerHookPayload) => {
    if (process.env.NODE_ENV === 'production') return;
    const hook = (globalThis as unknown as { [SCROLL_CONTROLLER_HOOK_GLOBAL_KEY]?: ScrollControllerHook })[
      SCROLL_CONTROLLER_HOOK_GLOBAL_KEY
    ];
    if (typeof hook === 'function') {
      try {
        hook(payload);
      } catch {
        // Hook exceptions never escape the controller.
      }
    }
  };

  const measure = (): ScrollMetrics | null => {
    if (!element) return null;
    const { scrollTop, scrollHeight, clientHeight } = element;
    const distanceFromBottom = Math.max(0, scrollHeight - scrollTop - clientHeight);
    const position: 'top' | 'middle' | 'bottom' = ((): 'top' | 'middle' | 'bottom' => {
      if (distanceFromBottom <= 1) return 'bottom';
      if (scrollTop <= 1) return 'top';
      return 'middle';
    })();
    return {
      scrollTop,
      scrollHeight,
      clientHeight,
      distanceFromBottom,
      position,
      viewportHeight: clientHeight,
    };
  };

  const getAnchor = (
    strategy: AnchorStrategy,
    targetMessage?: AnchorMessage | null,
  ): ScrollAnchor | null => {
    return selectAnchor({
      strategy,
      metrics: measure(),
      visibleMessages: provider(),
      targetMessage,
    });
  };

  const recordAndRun = async (intent: ScrollIntent): Promise<void> => {
    log.push(intent);
    fireHook({ intent, metrics: measure() });
    await executor(intent);
  };

  return {
    attach(next) {
      element = next;
    },
    measure,
    getAnchor,
    async run(intent) {
      await recordAndRun(intent);
    },
    notifyContentSizeChanged(reason) {
      const anchor = getAnchor('auto');
      if (!anchor) return;
      // eslint-disable-next-line no-void
      void recordAndRun({
        type: 'PRESERVE_ANCHOR',
        anchor,
        reason: contentSizeReasonToPreserveReason(reason),
      });
    },
    notifyViewportChanged(reason) {
      const anchor = getAnchor('auto');
      if (!anchor) return;
      // eslint-disable-next-line no-void
      void recordAndRun({
        type: 'RESTORE_AFTER_RESIZE',
        anchor,
        reason: viewportReasonToRestoreReason(reason),
      });
    },
    lastIntent() {
      return log.length === 0 ? null : log[log.length - 1];
    },
    intentLog() {
      return log.slice();
    },
    resetIntentLog() {
      log.length = 0;
    },
  };
}

function contentSizeReasonToPreserveReason(
  reason: ContentSizeChangeReason,
): 'load-previous' | 'load-next' | 'message-height-change' | 'api-replace' {
  switch (reason) {
    case 'message-added':
    case 'message-removed':
    case 'message-updated':
      return 'message-height-change';
    case 'image-loaded':
    case 'attachment-loaded':
    case 'reaction-changed':
    case 'thread-expand':
      return 'message-height-change';
    case 'unknown':
    default:
      return 'message-height-change';
  }
}

function viewportReasonToRestoreReason(
  reason: ViewportChangeReason,
): 'keyboard' | 'visualViewport' | 'orientation' | 'window' {
  switch (reason) {
    case 'keyboard':
      return 'keyboard';
    case 'visualViewport':
      return 'visualViewport';
    case 'orientation':
      return 'orientation';
    case 'window':
    default:
      return 'window';
  }
}
