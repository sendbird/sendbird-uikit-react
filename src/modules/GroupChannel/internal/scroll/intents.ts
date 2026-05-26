/**
 * ScrollIntent + ScrollAnchor discriminated unions.
 *
 * Phase 3 of the P0 runtime-coupling refactor (Plan §6.3, §6.5).
 *
 * The ScrollController consumes ScrollIntent records — each one a
 * declarative statement of "where the viewport should land and why". The
 * Phase 3 scrollPubSub bridge translates `scrollPubSub.publish(...)` calls
 * into ScrollIntent records without changing the pubSub topic contract
 * (BC-6 invariant).
 *
 * Internal — gated from public dts by BC-4 / BC-5.
 */

/** Reasons a scroll-to-bottom intent might be emitted. */
export type ScrollToBottomReason =
  | 'send'
  | 'receive'
  | 'button'
  | 'typing'
  | 'init';

/** Reasons a preserve-anchor intent might be emitted. */
export type PreserveAnchorReason =
  | 'load-previous'
  | 'load-next'
  | 'message-height-change'
  | 'api-replace';

/** Reasons a restore-after-resize intent might be emitted. */
export type RestoreAfterResizeReason =
  | 'keyboard'
  | 'visualViewport'
  | 'orientation'
  | 'window';

/** Reasons a content-size change observer might fire. */
export type ContentSizeChangeReason =
  | 'message-added'
  | 'message-updated'
  | 'message-removed'
  | 'image-loaded'
  | 'attachment-loaded'
  | 'reaction-changed'
  | 'thread-expand'
  | 'unknown';

/** Reasons a viewport change observer might fire. */
export type ViewportChangeReason =
  | 'window'
  | 'keyboard'
  | 'orientation'
  | 'visualViewport';

/**
 * ScrollAnchor — a "where" reference that survives content-size changes.
 * Used by PRESERVE_ANCHOR and RESTORE_AFTER_RESIZE intents and by the
 * `getAnchor(strategy)` controller method.
 */
export type ScrollAnchor =
  | { kind: 'bottom' }
  | { kind: 'message'; messageId?: number; createdAt: number; offsetTop: number }
  | { kind: 'distanceFromBottom'; distance: number };

/**
 * Strategy hint for `controller.getAnchor()`. The controller chooses one
 * of the ScrollAnchor variants based on the current scroll position and
 * the strategy hint.
 */
export type AnchorStrategy =
  | 'auto'
  | 'force-bottom'
  | 'force-distance-from-bottom'
  | 'nearest-visible-message'
  | 'target-message';

/**
 * Snapshot of scroll measurements at a moment in time. Mirrored from
 * `internal/runtime/events.ts#ScrollMetrics` for module-local independence
 * (the runtime adapter consumes this same shape via SCROLL_POSITION_CHANGED).
 */
export type ScrollMetrics = {
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
  distanceFromBottom: number;
  position: 'top' | 'middle' | 'bottom';
  viewportHeight: number;
  visualViewportHeight?: number;
};

/**
 * ScrollIntent — the controller's request vocabulary. Every legacy
 * `scrollPubSub.publish` call translates to exactly one of these variants
 * (Phase 3 bridge). New phases may emit RESTORE_AFTER_RESIZE and
 * PRESERVE_ANCHOR variants that have no legacy pubSub equivalent.
 */
export type ScrollIntent =
  | {
      type: 'TO_BOTTOM';
      animated: boolean;
      reason: ScrollToBottomReason;
      /** Optional resolve callback — mirrors `scrollPubSub` payload contract. */
      resolve?: () => void;
    }
  | {
      type: 'TO_MESSAGE';
      createdAt: number;
      messageId?: number;
      animated: boolean;
      focus: boolean;
      /** Numeric scrollTop fallback (computed by the legacy publish path). */
      top?: number;
      /** Lazy flag — defers DOM write to a microtask boundary, matching the
       *  legacy `lazy: true` semantics for cache-miss scrollToMessage. */
      lazy?: boolean;
      resolve?: () => void;
    }
  | {
      type: 'PRESERVE_ANCHOR';
      anchor: ScrollAnchor;
      reason: PreserveAnchorReason;
    }
  | {
      type: 'RESTORE_AFTER_RESIZE';
      anchor: ScrollAnchor;
      reason: RestoreAfterResizeReason;
    }
  | {
      type: 'NONE';
      reason: string;
    };

/** Tag literals — useful for tests and exhaustiveness checks. */
export type ScrollIntentType = ScrollIntent['type'];

export const ALL_SCROLL_INTENT_TYPES: ReadonlyArray<ScrollIntentType> = [
  'NONE',
  'PRESERVE_ANCHOR',
  'RESTORE_AFTER_RESIZE',
  'TO_BOTTOM',
  'TO_MESSAGE',
] as const;
