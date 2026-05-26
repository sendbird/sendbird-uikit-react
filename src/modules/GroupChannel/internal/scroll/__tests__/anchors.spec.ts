/**
 * Phase 3 RV — anchor selection (RV-3.5).
 *
 * Table-driven assertion for the 5 documented strategies plus the 'auto'
 * default. Each case maps a (strategy, metrics, visibleMessages,
 * targetMessage) tuple to the expected ScrollAnchor variant.
 */
import { selectAnchor } from '../anchors';
import type { ScrollMetrics } from '../intents';

function metricsAt(position: 'top' | 'middle' | 'bottom', distanceFromBottom = 0): ScrollMetrics {
  return {
    scrollTop: position === 'top' ? 0 : 100,
    scrollHeight: 1000,
    clientHeight: 500,
    distanceFromBottom,
    position,
    viewportHeight: 500,
  };
}

const visibleSample = [
  { messageId: 11, createdAt: 110, offsetTop: 200 },
  { messageId: 12, createdAt: 120, offsetTop: 250 },
];

describe('Phase 3 — selectAnchor (RV-3.5)', () => {
  it('strategy=force-bottom returns { kind: "bottom" } regardless of metrics', () => {
    expect(
      selectAnchor({ strategy: 'force-bottom', metrics: null, visibleMessages: [] }),
    ).toEqual({ kind: 'bottom' });
    expect(
      selectAnchor({ strategy: 'force-bottom', metrics: metricsAt('top', 800), visibleMessages: [] }),
    ).toEqual({ kind: 'bottom' });
  });

  it('strategy=force-distance-from-bottom uses metrics.distanceFromBottom', () => {
    const anchor = selectAnchor({
      strategy: 'force-distance-from-bottom',
      metrics: metricsAt('middle', 350),
      visibleMessages: visibleSample,
    });
    expect(anchor).toEqual({ kind: 'distanceFromBottom', distance: 350 });
  });

  it('strategy=force-distance-from-bottom returns null without metrics', () => {
    expect(
      selectAnchor({ strategy: 'force-distance-from-bottom', metrics: null, visibleMessages: visibleSample }),
    ).toBeNull();
  });

  it('strategy=target-message returns a message-kind anchor for the supplied target', () => {
    const anchor = selectAnchor({
      strategy: 'target-message',
      metrics: null,
      visibleMessages: [],
      targetMessage: { messageId: 99, createdAt: 990, offsetTop: 480 },
    });
    expect(anchor).toEqual({
      kind: 'message',
      messageId: 99,
      createdAt: 990,
      offsetTop: 480,
    });
  });

  it('strategy=target-message returns null without targetMessage', () => {
    expect(
      selectAnchor({ strategy: 'target-message', metrics: null, visibleMessages: visibleSample }),
    ).toBeNull();
  });

  it('strategy=nearest-visible-message picks the first message with known offsetTop', () => {
    const anchor = selectAnchor({
      strategy: 'nearest-visible-message',
      metrics: null,
      visibleMessages: [
        { messageId: 1, createdAt: 10, offsetTop: null },
        { messageId: 2, createdAt: 20, offsetTop: 99 },
        { messageId: 3, createdAt: 30, offsetTop: 199 },
      ],
    });
    expect(anchor).toEqual({
      kind: 'message',
      messageId: 2,
      createdAt: 20,
      offsetTop: 99,
    });
  });

  it('strategy=nearest-visible-message returns null when no message has a known offsetTop', () => {
    expect(
      selectAnchor({
        strategy: 'nearest-visible-message',
        metrics: null,
        visibleMessages: [{ messageId: 1, createdAt: 10, offsetTop: null }],
      }),
    ).toBeNull();
  });

  it('strategy=auto at bottom returns { kind: "bottom" }', () => {
    expect(
      selectAnchor({
        strategy: 'auto',
        metrics: metricsAt('bottom', 0),
        visibleMessages: visibleSample,
      }),
    ).toEqual({ kind: 'bottom' });
  });

  it('strategy=auto in middle prefers nearest-visible-message when available', () => {
    expect(
      selectAnchor({
        strategy: 'auto',
        metrics: metricsAt('middle', 300),
        visibleMessages: visibleSample,
      }),
    ).toEqual({
      kind: 'message',
      messageId: 11,
      createdAt: 110,
      offsetTop: 200,
    });
  });

  it('strategy=auto in middle falls back to distance-from-bottom when no visible messages', () => {
    expect(
      selectAnchor({
        strategy: 'auto',
        metrics: metricsAt('middle', 300),
        visibleMessages: [],
      }),
    ).toEqual({ kind: 'distanceFromBottom', distance: 300 });
  });

  it('strategy=auto returns null when neither metrics nor visible messages are available', () => {
    expect(
      selectAnchor({ strategy: 'auto', metrics: null, visibleMessages: [] }),
    ).toBeNull();
  });
});
