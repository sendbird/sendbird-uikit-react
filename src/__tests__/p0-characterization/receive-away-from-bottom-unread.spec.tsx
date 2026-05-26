/**
 * Phase 0 characterization — scenario 11: receive away from bottom.
 *
 * Today's behavior: when a message arrives while the user is away from
 * bottom (`isScrollBottomReached === false`), the store-level setState
 * (e.g., appending to `messages`) does NOT auto-trigger:
 *   - `scrollPubSub.publish('scrollToBottom')` (no scroll)
 *   - `markAsReadScheduler.push(channel)` (no mark-as-read)
 *   - `state.resetNewMessages()` (no unread reset)
 *
 * These side effects only fire when `scrollToBottom` is explicitly invoked
 * (see useGroupChannel.ts:74-97). The unread *tracking* itself lives
 * outside this store path — in coreTs `useGroupChannelMessages.newMessages`
 * reducer — which is not directly observable in this characterization.
 * Phase 4's unread reducer must preserve the absence of these side effects
 * on message-receive when not at bottom.
 */
import { renderHook, act, render } from '@testing-library/react';
import * as React from 'react';
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

describe('Phase 0 — receive while away from bottom (scenario 11)', () => {
  beforeEach(() => {
    mockCfg.markAsReadScheduler.push.mockClear();
  });

  it('appending a message with isScrollBottomReached=false does NOT call markAsRead', () => {
    const channel = mockChannel();
    const store = createCharacterizationStore({
      currentChannel: channel,
      isScrollBottomReached: false,
      messages: [mockMessage({ messageId: 1, createdAt: 1 })],
    });
    renderHook(() => useGroupChannel(), { wrapper: createWrapper(store) });

    act(() => {
      store.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, mockMessage({ messageId: 2, createdAt: 2 })],
      }));
    });

    expect(mockCfg.markAsReadScheduler.push).not.toHaveBeenCalled();
  });

  it('appending a message with isScrollBottomReached=false does NOT publish scrollToBottom', () => {
    const channel = mockChannel();
    const store = createCharacterizationStore({
      currentChannel: channel,
      isScrollBottomReached: false,
      messages: [mockMessage({ messageId: 1, createdAt: 1 })],
    });
    renderHook(() => useGroupChannel(), { wrapper: createWrapper(store) });

    act(() => {
      store.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, mockMessage({ messageId: 2, createdAt: 2 })],
      }));
    });

    expect(store.getState().scrollPubSub.publish).not.toHaveBeenCalled();
  });

  it('appending a message with isScrollBottomReached=false does NOT call resetNewMessages', () => {
    const channel = mockChannel();
    const store = createCharacterizationStore({
      currentChannel: channel,
      isScrollBottomReached: false,
      messages: [mockMessage({ messageId: 1, createdAt: 1 })],
    });
    renderHook(() => useGroupChannel(), { wrapper: createWrapper(store) });

    act(() => {
      store.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, mockMessage({ messageId: 2, createdAt: 2 })],
      }));
    });
    expect(store.getState().resetNewMessages).not.toHaveBeenCalled();
  });

  it('appending a message away from bottom still re-renders every useGroupChannel consumer (baseline)', () => {
    // Whole-context subscription baseline — Phase 1 RV should narrow this.
    const counter = createRenderCounter();
    const store = createCharacterizationStore({
      currentChannel: mockChannel(),
      isScrollBottomReached: false,
      messages: [mockMessage({ messageId: 1, createdAt: 1 })],
    });
    const wrapper = createWrapper(store);

    const MessageList: React.FC = () => {
      const { state } = useGroupChannel();
      useRenderCountTracker('MessageList', counter);
      return <span data-testid="ml">{String(state.messages.length)}</span>;
    };
    const UnreadAffordance: React.FC = () => {
      const { state } = useGroupChannel();
      useRenderCountTracker('UnreadAffordance', counter);
      // Reads newMessageIds (today's unread tracking field).
      return <span data-testid="un">{(state.newMessageIds ?? []).length}</span>;
    };
    const Header: React.FC = () => {
      const { state } = useGroupChannel();
      useRenderCountTracker('Header', counter);
      return <span data-testid="hdr">{state.currentChannel?.url ?? '-'}</span>;
    };

    render(React.createElement(wrapper, null, (
      <>
        <MessageList />
        <UnreadAffordance />
        <Header />
      </>
    )));
    const afterMount = counter.snapshot();

    act(() => {
      store.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, mockMessage({ messageId: 2, createdAt: 2 })],
      }));
    });

    const delta = counter.deltaSince(afterMount);
    expect(delta('MessageList')).toBe(1);
    expect(delta('UnreadAffordance')).toBe(1);
    expect(delta('Header')).toBe(1);
  });

  it('explicit scrollToBottom from away-from-bottom does mark-as-read', async () => {
    // Sanity contrast — the absence of mark-as-read above is conditional on
    // NOT calling scrollToBottom. Once the user explicitly scrolls back to
    // bottom, markAsRead fires. Captures the action-vs-receive boundary.
    const channel = mockChannel();
    const container = document.createElement('div');
    const parent = document.createElement('div');
    parent.appendChild(container);
    document.body.appendChild(parent);
    try {
      const store = createCharacterizationStore({
        currentChannel: channel,
        isScrollBottomReached: false,
        scrollRef: { current: container },
        hasNext: () => false,
      });
      const { result } = renderHook(() => useGroupChannel(), { wrapper: createWrapper(store) });

      await act(async () => {
        await result.current.actions.scrollToBottom(true);
      });

      expect(mockCfg.markAsReadScheduler.push).toHaveBeenCalledTimes(1);
      expect(mockCfg.markAsReadScheduler.push).toHaveBeenCalledWith(channel);
    } finally {
      if (parent.parentNode) parent.parentNode.removeChild(parent);
    }
  });
});
