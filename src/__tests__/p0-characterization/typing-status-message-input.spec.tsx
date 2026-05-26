/**
 * Phase 0 characterization — scenario 2: typing-status updates (e.g., a
 * remote member starts typing) live OUTSIDE the GroupChannelContext store.
 *
 * In current code, typing status is read from the channel object directly
 * inside `src/modules/GroupChannel/components/TypingIndicator.tsx` and
 * `MessageList/index.tsx` — not from GroupChannel store state. So updating
 * the channel's typing members (without writing it to the store) does NOT
 * notify GroupChannel consumers.
 *
 * Captured invariant: a typing-status change that goes through the SDK
 * channel event system (not store.setState) leaves useGroupChannel
 * consumers unaffected. Phase 4 (unread reducer) must not introduce a
 * coupling that would forward typing-status into the store.
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

describe('Phase 0 — typing status update isolation (scenario 2)', () => {
  it('mutating channel.getTypingUsers without store.setState does not notify consumers', () => {
    const counter = createRenderCounter();
    // The mock channel exposes a getTypingUsers method that an external
    // typing-status component (e.g., TypingIndicator) would consult.
    const typingUsers: any[] = [];
    const channel = mockChannel({
      getTypingUsers: () => typingUsers,
    });
    const store = createCharacterizationStore({ currentChannel: channel });
    const wrapper = createWrapper(store);

    const MessageInputConsumer: React.FC = () => {
      const { state } = useGroupChannel();
      useRenderCountTracker('MessageInputConsumer', counter);
      // MessageInput reads quoteMessage and refs, NOT typing.
      return <span data-testid="msi">{state.quoteMessage ? 'q' : '-'}</span>;
    };
    const TypingIndicatorConsumer: React.FC = () => {
      // Stand-in for TypingIndicator: reads typing users via channel object
      // (not via store). Re-renders only if its own parent triggers it.
      const { state } = useGroupChannel();
      const users = state.currentChannel?.getTypingUsers?.() ?? [];
      useRenderCountTracker('TypingIndicatorConsumer', counter);
      return <span data-testid="ti">{users.length}</span>;
    };

    render(React.createElement(wrapper, null, (
      <>
        <MessageInputConsumer />
        <TypingIndicatorConsumer />
      </>
    )));

    const afterMount = counter.snapshot();
    const notifyBefore = store.notifyCount();

    // Mutate the SDK-side typing list — push a user. This simulates a
    // remote member starting to type. No setState involved.
    act(() => {
      typingUsers.push({ userId: 'remote', nickname: 'Remote User' });
    });

    // No store notification, no consumer re-render.
    expect(store.notifyCount() - notifyBefore).toBe(0);
    const delta = counter.deltaSince(afterMount);
    expect(delta('MessageInputConsumer')).toBe(0);
    expect(delta('TypingIndicatorConsumer')).toBe(0);

    // Sanity: a store.setState that does change state DOES notify (proves
    // the framework is wired correctly).
    act(() => {
      store.setState((prev) => ({ ...prev, quoteMessage: { messageId: 1 } as any }));
    });
    expect(store.notifyCount()).toBeGreaterThan(notifyBefore);
  });
});
