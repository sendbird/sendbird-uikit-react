/**
 * Phase 0 characterization — scenario 5: reaction update render boundary.
 *
 * When a message's reactions change (in-place mutation via the messages
 * array), today's whole-context subscription causes ALL useGroupChannel
 * consumers to re-render. Phase 1's `useStoreSelector` should narrow this
 * so only consumers reading the affected message re-render.
 *
 * Captured baseline: delta === 1 for every consumer (whole-context fan-out).
 *
 * IMPORTANT — Phase 1 RV dependency:
 *   This baseline holds because `useGroupChannel.ts:64` uses
 *   `useSyncExternalStore(store.subscribe, store.getState)`. Plan §1.4
 *   commits Phase 1 leaves useGroupChannel untouched.
 */
import * as React from 'react';
import { render, act } from '@testing-library/react';
import {
  createCharacterizationStore,
  createWrapper,
  mockChannel,
  mockMessage,
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

describe('Phase 0 — reaction update render boundary (scenario 5)', () => {
  it('updating a message reactions re-renders every useGroupChannel consumer (baseline)', () => {
    const counter = createRenderCounter();
    const msg1 = mockMessage({ messageId: 1, createdAt: 1, reactions: [] });
    const msg2 = mockMessage({ messageId: 2, createdAt: 2, reactions: [] });
    const store = createCharacterizationStore({
      currentChannel: mockChannel(),
      messages: [msg1, msg2],
    });
    const wrapper = createWrapper(store);

    const MessageItem1: React.FC = () => {
      const { state } = useGroupChannel();
      useRenderCountTracker('MessageItem1', counter);
      const m = state.messages.find((x: any) => x.messageId === 1);
      return <span data-testid="m1-r">{m?.reactions?.length ?? 0}</span>;
    };
    const MessageItem2: React.FC = () => {
      const { state } = useGroupChannel();
      useRenderCountTracker('MessageItem2', counter);
      const m = state.messages.find((x: any) => x.messageId === 2);
      return <span data-testid="m2-r">{m?.reactions?.length ?? 0}</span>;
    };
    const Composer: React.FC = () => {
      const { state } = useGroupChannel();
      useRenderCountTracker('Composer', counter);
      return <span data-testid="cmp">{state.quoteMessage ? 'q' : 'i'}</span>;
    };
    const Header: React.FC = () => {
      const { state } = useGroupChannel();
      useRenderCountTracker('Header', counter);
      return <span data-testid="hdr">{state.currentChannel?.url ?? '-'}</span>;
    };

    render(React.createElement(wrapper, null, (
      <>
        <MessageItem1 />
        <MessageItem2 />
        <Composer />
        <Header />
      </>
    )));
    const afterMount = counter.snapshot();

    // Update msg1's reactions: this models a reaction add. Real coreTs reducer
    // produces a new messages array with a new reference for the updated
    // message (and same references for unchanged messages). We mirror that
    // shape here.
    act(() => {
      store.setState((prev) => ({
        ...prev,
        messages: prev.messages.map((m: any) =>
          m.messageId === 1
            ? { ...m, reactions: [{ key: 'thumbsup', userIds: ['u1'] }] }
            : m,
        ),
      }));
    });

    const delta = counter.deltaSince(afterMount);
    // Baseline: every consumer re-renders once. Phase 1 RV target is
    // delta('MessageItem2') === 0 and delta('Composer') === 0 once narrow
    // selectors are in place.
    expect(delta('MessageItem1')).toBe(1);
    expect(delta('MessageItem2')).toBe(1);
    expect(delta('Composer')).toBe(1);
    expect(delta('Header')).toBe(1);
  });

  it('reactions array reference on the changed message updates as expected', () => {
    const msg1 = mockMessage({ messageId: 1, createdAt: 1, reactions: [] });
    const store = createCharacterizationStore({ messages: [msg1] });
    const wrapper = createWrapper(store);

    const Probe: React.FC = () => {
      const { state } = useGroupChannel();
      const m = state.messages.find((x: any) => x.messageId === 1);
      return <span data-testid="cnt">{m?.reactions?.length ?? 0}</span>;
    };
    const { getByTestId } = render(React.createElement(wrapper, null, <Probe />));
    expect(getByTestId('cnt').textContent).toBe('0');

    act(() => {
      store.setState((prev) => ({
        ...prev,
        messages: prev.messages.map((m: any) =>
          m.messageId === 1 ? { ...m, reactions: [{ key: 'thumbsup', userIds: ['u1'] }] } : m,
        ),
      }));
    });
    expect(getByTestId('cnt').textContent).toBe('1');
  });
});
