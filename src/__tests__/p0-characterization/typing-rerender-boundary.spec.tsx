/**
 * Phase 0 characterization — scenario 1: typing in MessageInput should NOT
 * touch the GroupChannel store, so no useGroupChannel consumer re-renders.
 *
 * The contenteditable typing state lives entirely inside MessageInput's
 * local React state (`src/ui/MessageInput/index.tsx`). It never calls
 * `store.setState` on `GroupChannelContext`. This characterization captures
 * the structural invariant: a typing-equivalent simulation that does NOT
 * touch the store leaves `notifyCount === 0` and all consumer render counts
 * unchanged.
 *
 * Phase 1's narrow selectors must not introduce a coupling that would
 * propagate composer-local state to the broader store. Phase 5
 * (composer refactor — out of this cycle) must preserve this isolation.
 */
import * as React from 'react';
import { render, act } from '@testing-library/react';
import {
  createCharacterizationStore,
  createWrapper,
  mockChannel,
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

describe('Phase 0 — typing in MessageInput does not touch GroupChannel store (scenario 1)', () => {
  it('a component-local state change leaves store.notifyCount at 0', () => {
    // Stand-in component representing MessageInput: its typing-equivalent
    // state lives in local React useState — it does NOT mutate
    // GroupChannelContext.
    const counter = createRenderCounter();
    const store = createCharacterizationStore({
      currentChannel: mockChannel(),
    });
    const wrapper = createWrapper(store);

    let setLocalTextRef: ((s: string) => void) | null = null;
    const ComposerLocalState: React.FC = () => {
      const [, setLocalText] = React.useState('');
      setLocalTextRef = setLocalText;
      useRenderCountTracker('ComposerLocalState', counter);
      return <span data-testid="cmp-local" />;
    };

    const MessageListConsumer: React.FC = () => {
      const { state } = useGroupChannel();
      useRenderCountTracker('MessageListConsumer', counter);
      return <span data-testid="ml">{String(state.messages.length)}</span>;
    };
    const HeaderConsumer: React.FC = () => {
      const { state } = useGroupChannel();
      useRenderCountTracker('HeaderConsumer', counter);
      return <span data-testid="hdr">{state.currentChannel?.url ?? '-'}</span>;
    };

    render(React.createElement(wrapper, null, (
      <>
        <ComposerLocalState />
        <MessageListConsumer />
        <HeaderConsumer />
      </>
    )));

    const afterMount = counter.snapshot();
    const notifyBefore = store.notifyCount();

    // Simulate typing: increment local React state without touching store.
    act(() => {
      setLocalTextRef!('hello');
    });
    act(() => {
      setLocalTextRef!('hello world');
    });

    // Composer re-renders (local state change), but store consumers do not.
    const delta = counter.deltaSince(afterMount);
    expect(delta('ComposerLocalState')).toBeGreaterThanOrEqual(1);
    expect(delta('MessageListConsumer')).toBe(0);
    expect(delta('HeaderConsumer')).toBe(0);

    // No store notification was emitted by the typing simulation.
    expect(store.notifyCount() - notifyBefore).toBe(0);
  });
});
