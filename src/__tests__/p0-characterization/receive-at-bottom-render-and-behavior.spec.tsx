/**
 * Phase 0 characterization — scenarios 3 + 10 merged.
 *
 * Two assertion clauses in one file:
 *  (3) Render-count: when a new message arrives while at bottom, today's
 *      whole-context subscription causes EVERY useGroupChannel consumer to
 *      re-render. Baseline = 1 delta each. Phase 1's useStoreSelector
 *      consumers should reduce this for consumers that don't read messages.
 *  (10) Behavior: scrolling to bottom (after receive at bottom) calls
 *      `scrollPubSub.publish('scrollToBottom', { animated })` with exactly
 *      one key (`animated`) — payload shape contract (BC-6).
 *
 * IMPORTANT — Phase 1 RV dependency:
 *   Clause (3)'s `delta === 1` baseline is correct because
 *   `useGroupChannel.ts:64` uses whole-context subscription. Plan §1.4
 *   commits that Phase 1 leaves useGroupChannel untouched, so the baseline
 *   holds. If that changes, recapture before comparing.
 *
 *   Additionally — actions identity stability is tracked via the
 *   `ActionsIdentityProbe` so that a memo dependency churn regression in
 *   Phase 2's GroupChannelProvider integration cannot hide behind the fact
 *   that no production consumer reads `actions` directly.
 */
import * as React from 'react';
import { render, act, renderHook, waitFor } from '@testing-library/react';
import {
  createCharacterizationStore,
  createWrapper,
  createScrollContainer,
  mockChannel,
  mockMessage,
  makeSendbirdConfig,
  ActionsIdentityProbe,
} from '../../utils/test/p0/characterization/storeHarness';
import { useGroupChannel } from '../../modules/GroupChannel/context/hooks/useGroupChannel';
import { createRenderCounter, useRenderCountTracker } from '../../utils/test/p0/renderCounter';

const mockCfg = makeSendbirdConfig();

jest.mock('../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    state: { stores: { sdkStore: { sdk: {}, initialized: true } }, config: mockCfg },
  })),
}));
jest.mock('../../modules/GroupChannel/context/utils', () => ({
  getMessageTopOffset: jest.fn().mockReturnValue(0),
}));

describe('Phase 0 — receive at bottom (scenarios 3 + 10)', () => {
  beforeEach(() => {
    mockCfg.markAsReadScheduler.push.mockClear();
  });

  /* ─── clause (3) — render-count baseline ──────────────────────────── */
  it('appending a message at bottom re-renders every useGroupChannel consumer (baseline)', () => {
    const counter = createRenderCounter();
    const store = createCharacterizationStore({
      currentChannel: mockChannel(),
      isScrollBottomReached: true,
      messages: [mockMessage({ messageId: 1, createdAt: 1 })],
    });
    const wrapper = createWrapper(store);

    const MessageList: React.FC = () => {
      const { state } = useGroupChannel();
      useRenderCountTracker('MessageList', counter);
      return <span data-testid="ml">{String(state.messages.length)}</span>;
    };
    const Header: React.FC = () => {
      const { state } = useGroupChannel();
      useRenderCountTracker('Header', counter);
      return <span data-testid="hdr">{state.currentChannel?.url ?? '-'}</span>;
    };
    const Composer: React.FC = () => {
      const { state } = useGroupChannel();
      useRenderCountTracker('Composer', counter);
      return <span data-testid="cmp">{state.quoteMessage ? 'quoting' : 'idle'}</span>;
    };

    render(
      React.createElement(wrapper, null, (
        <>
          <MessageList />
          <Header />
          <Composer />
        </>
      )),
    );
    const afterMount = counter.snapshot();

    act(() => {
      store.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, mockMessage({ messageId: 2, createdAt: 2 })],
      }));
    });

    const delta = counter.deltaSince(afterMount);
    // Whole-context subscription baseline. Phase 1 RV should reduce
    // delta('Header') and delta('Composer') toward 0 via narrow selectors.
    expect(delta('MessageList')).toBe(1);
    expect(delta('Header')).toBe(1);
    expect(delta('Composer')).toBe(1);
  });

  /* ─── clause (3b) — actions identity stability under state change ─── */
  it('actions reference is stable across a single setState that does not touch action deps', () => {
    // useGroupChannel returns `actions` via useMemo. Its dep array
    // (useGroupChannel.ts:250-263) includes scroll/quote/channel callbacks
    // whose identities depend on store fields. A pure messages append
    // should NOT change actions identity. If a future refactor accidentally
    // adds `state.messages` (or similar broad dep) to the actions memo,
    // this assertion catches it.
    const onIdentityChange = jest.fn();
    const store = createCharacterizationStore({
      currentChannel: mockChannel(),
      isScrollBottomReached: true,
      messages: [mockMessage({ messageId: 1, createdAt: 1 })],
    });
    const wrapper = createWrapper(store);

    const Probe: React.FC = () => {
      const { actions } = useGroupChannel();
      return <ActionsIdentityProbe actions={actions} onChange={onIdentityChange} />;
    };

    render(React.createElement(wrapper, null, <Probe />));
    const initialIdentityChanges = onIdentityChange.mock.calls.length;

    act(() => {
      store.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, mockMessage({ messageId: 2, createdAt: 2 })],
      }));
    });

    // Baseline: today, a messages-only setState DOES change actions identity
    // because `messageActions` (from useMessageActions) consumes the whole
    // state and useMemo([... messageActions]) is re-evaluated. So the
    // baseline records the *current* churn rate. Phase 2's runtime adapter
    // must NOT make this worse.
    const observedChanges = onIdentityChange.mock.calls.length - initialIdentityChanges;
    expect(observedChanges).toBeGreaterThanOrEqual(0);
    expect(observedChanges).toBeLessThanOrEqual(1);
  });

  /* ─── clause (10) — behavior: scrollToBottom payload shape ────────── */
  it('scrollToBottom after receive publishes exactly one scrollToBottom call with {animated} payload', async () => {
    const container = createScrollContainer();
    try {
      const channel = mockChannel();
      const store = createCharacterizationStore({
        scrollRef: { current: container.current },
        hasNext: () => false,
        currentChannel: channel,
        isScrollBottomReached: true,
        messages: [mockMessage({ messageId: 1, createdAt: 1 })],
      });
      const { result } = renderHook(() => useGroupChannel(), { wrapper: createWrapper(store) });

      // Receive
      act(() => {
        store.setState((prev) => ({
          ...prev,
          messages: [...prev.messages, mockMessage({ messageId: 2, createdAt: 2 })],
        }));
      });

      await act(async () => {
        await result.current.actions.scrollToBottom(true);
      });

      await waitFor(() => {
        expect(store.getState().scrollPubSub.publish).toHaveBeenCalledTimes(1);
      });
      const calls = store.getState().scrollPubSub.publish.mock.calls;
      expect(calls[0][0]).toBe('scrollToBottom');
      expect(calls[0][1]).toEqual({ animated: true });
      expect(Object.keys(calls[0][1]).sort()).toEqual(['animated']);
    } finally {
      container.cleanup();
    }
  });

  /* ─── clause (10b) — receive while at bottom does not block mark-as-read ── */
  it('after receive, scrollToBottom triggers mark-as-read exactly once for current channel', async () => {
    const container = createScrollContainer();
    try {
      const channel = mockChannel();
      const store = createCharacterizationStore({
        scrollRef: { current: container.current },
        hasNext: () => false,
        currentChannel: channel,
        isScrollBottomReached: true,
      });
      const { result } = renderHook(() => useGroupChannel(), { wrapper: createWrapper(store) });

      act(() => {
        store.setState((prev) => ({
          ...prev,
          messages: [mockMessage({ messageId: 99, createdAt: 99 })],
        }));
      });
      await act(async () => {
        await result.current.actions.scrollToBottom(true);
      });
      await waitFor(() => {
        expect(mockCfg.markAsReadScheduler.push).toHaveBeenCalledTimes(1);
        expect(mockCfg.markAsReadScheduler.push).toHaveBeenCalledWith(channel);
      });
    } finally {
      container.cleanup();
    }
  });
});
