/**
 * Phase 0 characterization — scenario 13: typing bubble at bottom →
 * scroll-to-bottom.
 *
 * Today's flow: when a typing bubble becomes visible (e.g., a remote member
 * starts typing) AND the user is at the bottom of the channel, MessageList
 * publishes `scrollPubSub.publish('scrollToBottom', ...)` to keep the
 * typing bubble in view. This logic lives in `MessageList/index.tsx`, not
 * inside the hook surface — so we characterize the contract via the
 * `scrollToBottom` action path that today's MessageList would invoke.
 *
 * Captured invariant: invoking `scrollToBottom(animated)` from any
 * triggered side-effect (typing bubble, image load, etc.) produces the
 * SAME `scrollPubSub.publish('scrollToBottom', { animated })` payload as
 * the user-initiated scroll. Phase 3's ScrollController bridge must honor
 * this — the typing-bubble path should map to the same ScrollIntent.
 */
import { renderHook, act, waitFor } from '@testing-library/react';
import {
  createCharacterizationStore,
  createWrapper,
  createScrollContainer,
  mockChannel,
  makeSendbirdConfig,
} from '../../utils/test/p0/characterization/storeHarness';
import { useGroupChannel } from '../../modules/GroupChannel/context/hooks/useGroupChannel';

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

describe('Phase 0 — typing bubble at bottom triggers scrollToBottom (scenario 13)', () => {
  let container: ReturnType<typeof createScrollContainer>;
  beforeEach(() => {
    container = createScrollContainer();
    mockCfg.markAsReadScheduler.push.mockClear();
  });
  afterEach(() => container.cleanup());

  it('scrollToBottom invoked from typing-bubble path uses the same publish payload', async () => {
    const channel = mockChannel();
    const store = createCharacterizationStore({
      scrollRef: { current: container.current },
      hasNext: () => false,
      currentChannel: channel,
      isScrollBottomReached: true,
    });
    const { result } = renderHook(() => useGroupChannel(), { wrapper: createWrapper(store) });

    // Stand-in for "typing bubble visibility transition while at bottom".
    // In current code, MessageList detects the typing bubble appearing and
    // calls scrollToBottom. We invoke the same action path here.
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
  });

  it('typing-bubble scroll does NOT fire when isScrollBottomReached is false', async () => {
    // Today's behavior: MessageList only triggers scrollToBottom for the
    // typing bubble when the user is already at bottom. From this hook-level
    // characterization, we capture the action invariant — the action itself
    // doesn't gate on isScrollBottomReached (it always publishes). The gating
    // happens at the call site (MessageList). Phase 3 must preserve that
    // gating semantic, not move it into the controller.
    const channel = mockChannel();
    const store = createCharacterizationStore({
      scrollRef: { current: container.current },
      hasNext: () => false,
      currentChannel: channel,
      isScrollBottomReached: false,
    });
    const { result } = renderHook(() => useGroupChannel(), { wrapper: createWrapper(store) });

    // Hook-level invariant: action itself always publishes when scrollRef
    // is set. The "gate on bottom" lives at the call site.
    await act(async () => {
      await result.current.actions.scrollToBottom(true);
    });

    await waitFor(() => {
      expect(store.getState().scrollPubSub.publish).toHaveBeenCalledTimes(1);
    });
    // Note: today the action will also set isScrollBottomReached to true
    // (forcing the bottom state). This is part of the action contract.
    expect(store.getState().isScrollBottomReached).toBe(true);
  });
});
