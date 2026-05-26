/**
 * Phase 0 characterization — scenario 4: scroll position transition render
 * boundary baseline.
 *
 * Captures the *current* render fan-out when only `isScrollBottomReached`
 * changes. The §5.8 design hypothesis: today's whole-context subscription
 * makes every useGroupChannel consumer re-render on any setState.
 *
 * IMPORTANT — Phase 1 RV dependency:
 *   This baseline (`delta === 1` for every consumer) is correct *because*
 *   `useGroupChannel.ts:64` reads the entire store snapshot via
 *   `useSyncExternalStore(store.subscribe, store.getState)`. Plan §1.4
 *   commits that Phase 1 does not modify `useGroupChannel`, so the baseline
 *   survives. If a future phase rewrites useGroupChannel to use
 *   `useStoreSelector`, this baseline MUST be recaptured.
 *
 * Phase 1 RV will assert delta('Header') < this baseline's delta('Header')
 * for consumers that opt into narrow selectors via `useStoreSelector`.
 */
import * as React from 'react';
import { render, act } from '@testing-library/react';
import {
  createCharacterizationStore,
  createWrapper,
  makeSendbirdConfig,
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

describe('Phase 0 — scroll position render boundary (scenario 4)', () => {
  describe('render fan-out baseline', () => {
    it('toggling isScrollBottomReached re-renders every useGroupChannel consumer (baseline)', () => {
      const counter = createRenderCounter();
      const store = createCharacterizationStore({ isScrollBottomReached: true });
      const wrapper = createWrapper(store);

      const ScrollAffordance: React.FC = () => {
        const { state } = useGroupChannel();
        useRenderCountTracker('ScrollAffordance', counter);
        return <span data-testid="scroll-pos">{String(state.isScrollBottomReached)}</span>;
      };
      const HeaderConsumer: React.FC = () => {
        const { state } = useGroupChannel();
        useRenderCountTracker('HeaderConsumer', counter);
        return <span data-testid="hdr">{state.currentChannel?.url ?? 'no-channel'}</span>;
      };
      const MessageListConsumer: React.FC = () => {
        const { state } = useGroupChannel();
        useRenderCountTracker('MessageListConsumer', counter);
        return <span data-testid="msglist">{String(state.messages.length)}</span>;
      };

      render(
        React.createElement(wrapper, null, (
          <>
            <ScrollAffordance />
            <HeaderConsumer />
            <MessageListConsumer />
          </>
        )),
      );
      const afterMount = counter.snapshot();

      act(() => {
        store.setState((prev) => ({ ...prev, isScrollBottomReached: false }));
      });

      const delta = counter.deltaSince(afterMount);
      // Baseline: today every consumer re-renders exactly once. Phase 1's
      // useStoreSelector consumers MUST NOT exceed these deltas; ideally
      // they reduce delta('HeaderConsumer') and delta('MessageListConsumer')
      // to 0 because those consumers do not read isScrollBottomReached.
      expect(delta('ScrollAffordance')).toBe(1);
      expect(delta('HeaderConsumer')).toBe(1);
      expect(delta('MessageListConsumer')).toBe(1);
    });

    it('idempotent setState does NOT re-render (real createStore equality short-circuit)', () => {
      // Sanity: confirms the fixture uses the production createStore's
      // hasStateChanged short-circuit. If a future refactor of storeManager
      // removes this short-circuit, this assertion fires.
      const counter = createRenderCounter();
      const store = createCharacterizationStore({ isScrollBottomReached: true });
      const wrapper = createWrapper(store);

      const Probe: React.FC = () => {
        useGroupChannel();
        useRenderCountTracker('Probe', counter);
        return <span data-testid="p" />;
      };

      render(React.createElement(wrapper, null, <Probe />));
      const after = counter.snapshot();

      act(() => {
        // Set to the SAME value — should not notify under real createStore.
        store.setState((prev) => ({ ...prev, isScrollBottomReached: true }));
      });

      expect(counter.deltaSince(after)('Probe')).toBe(0);
    });
  });

  describe('state propagation snapshot', () => {
    // Note: this block is a state-value snapshot, not a render-count test.
    // Kept here for related coverage but conceptually separate.
    it('reading isScrollBottomReached reflects the latest setState', () => {
      const store = createCharacterizationStore({ isScrollBottomReached: true });
      const wrapper = createWrapper(store);

      const Probe: React.FC = () => {
        const { state } = useGroupChannel();
        return <span data-testid="pos">{String(state.isScrollBottomReached)}</span>;
      };
      const { getByTestId } = render(React.createElement(wrapper, null, <Probe />));
      expect(getByTestId('pos').textContent).toBe('true');

      act(() => {
        store.setState((prev) => ({ ...prev, isScrollBottomReached: false }));
      });
      expect(getByTestId('pos').textContent).toBe('false');
    });
  });
});
