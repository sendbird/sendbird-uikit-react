/**
 * ScrollAnchor selection logic.
 *
 * Phase 3 of the P0 runtime-coupling refactor (Plan §6.5).
 *
 * Pure functions over (messages, scroll metrics, strategy) → ScrollAnchor.
 * No DOM, no React hooks. The controller wraps these and the actual DOM
 * resolution happens in `controller.ts`.
 *
 * Strategy mapping (design §6.5):
 *   | Situation                                  | Anchor                    |
 *   | User at bottom                             | bottom                    |
 *   | User reading older messages                | nearest visible + offset  |
 *   | Loading previous messages                  | nearest first visible     |
 *   | Loading next messages while not bottom     | distance from bottom      |
 *   | Starting point navigation                  | target message            |
 *   | Keyboard resize                            | focused message/input     |
 */
import type { AnchorStrategy, ScrollAnchor, ScrollMetrics } from './intents';

/**
 * Lightweight message view used by anchor selection. Avoids importing
 * SendableMessageType to keep this module independent of coreTs types.
 */
export type AnchorMessage = {
  messageId?: number;
  createdAt: number;
  /**
   * Computed top-offset relative to the scroll container, when known.
   * `null`/`undefined` means "not yet measured" — selection should fall
   * back to a distance-from-bottom or bottom anchor.
   */
  offsetTop?: number | null;
};

export type AnchorSelectionInput = {
  strategy: AnchorStrategy;
  metrics: ScrollMetrics | null;
  visibleMessages: ReadonlyArray<AnchorMessage>;
  targetMessage?: AnchorMessage | null;
};

/**
 * Pick the appropriate ScrollAnchor variant. Returns `null` when the
 * inputs are insufficient (e.g., no metrics + no visible messages with
 * known offsetTop) — caller should treat this as "do nothing".
 */
export function selectAnchor(input: AnchorSelectionInput): ScrollAnchor | null {
  const { strategy, metrics, visibleMessages, targetMessage } = input;

  switch (strategy) {
    case 'force-bottom':
      return { kind: 'bottom' };

    case 'force-distance-from-bottom': {
      if (!metrics) return null;
      return { kind: 'distanceFromBottom', distance: metrics.distanceFromBottom };
    }

    case 'target-message': {
      if (!targetMessage) return null;
      return {
        kind: 'message',
        messageId: targetMessage.messageId,
        createdAt: targetMessage.createdAt,
        offsetTop: targetMessage.offsetTop ?? 0,
      };
    }

    case 'nearest-visible-message': {
      const candidate = pickNearestKnownVisible(visibleMessages);
      if (!candidate) return null;
      return {
        kind: 'message',
        messageId: candidate.messageId,
        createdAt: candidate.createdAt,
        offsetTop: candidate.offsetTop ?? 0,
      };
    }

    case 'auto':
    default: {
      // At bottom → use bottom anchor regardless of visible-message data.
      if (metrics && metrics.position === 'bottom') return { kind: 'bottom' };
      // Otherwise prefer a nearest-visible-message anchor when we have one.
      const candidate = pickNearestKnownVisible(visibleMessages);
      if (candidate) {
        return {
          kind: 'message',
          messageId: candidate.messageId,
          createdAt: candidate.createdAt,
          offsetTop: candidate.offsetTop ?? 0,
        };
      }
      // Last resort: distance-from-bottom if metrics are available.
      if (metrics) return { kind: 'distanceFromBottom', distance: metrics.distanceFromBottom };
      return null;
    }
  }
}

function pickNearestKnownVisible(messages: ReadonlyArray<AnchorMessage>): AnchorMessage | null {
  for (const m of messages) {
    if (typeof m.offsetTop === 'number') return m;
  }
  return null;
}
