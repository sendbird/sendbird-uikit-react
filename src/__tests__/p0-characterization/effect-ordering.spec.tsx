/**
 * Phase 0 characterization — effect ordering invariant (Plan Review M5).
 *
 * Captures the observable invocation order between scrollPubSub.publish,
 * markAsReadScheduler.push, and resetNewMessages when `scrollToBottom` is
 * invoked. Phase 1-4 RV tests must preserve this ordering.
 *
 * Source of truth: `src/modules/GroupChannel/context/hooks/useGroupChannel.ts`
 * §scrollToBottom (lines 74-97).
 *
 * Sequence in the no-next-page branch (verified against source):
 *   1. setAnimatedMessageId(null)                  // synchronous
 *   2. setIsScrollBottomReached(true)              // synchronous
 *   3. requestAnimationFrame(() => publish('...')) // schedule (callback async)
 *   4. resetNewMessages()                          // synchronous
 *   5. markAsReadScheduler.push(channel)           // synchronous
 *   6. (next frame) publish('scrollToBottom', ...) // rAF callback fires
 *
 * Invariants asserted here (must hold through phases 1-4):
 *   resetNewMessages < markAsReadScheduler.push        (sync ordering)
 *   resetNewMessages < scrollPubSub.publish            (publish via rAF)
 *   markAsReadScheduler.push < scrollPubSub.publish    (publish via rAF)
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

const mockSendbirdConfig = makeSendbirdConfig();

jest.mock('../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    state: {
      stores: { sdkStore: { sdk: {}, initialized: true } },
      config: mockSendbirdConfig,
    },
  })),
}));

jest.mock('../../modules/GroupChannel/context/utils', () => ({
  getMessageTopOffset: jest.fn().mockReturnValue(100),
}));

describe('Phase 0 — effect ordering for scrollToBottom', () => {
  let container: ReturnType<typeof createScrollContainer>;

  beforeEach(() => {
    container = createScrollContainer();
    mockSendbirdConfig.markAsReadScheduler.push.mockClear();
  });

  afterEach(() => {
    container.cleanup();
  });

  it('publishes scrollToBottom AFTER resetNewMessages and markAsRead when no next page', async () => {
    const channel = mockChannel({ myMemberState: 'joined' });
    const store = createCharacterizationStore({
      scrollRef: { current: container.current },
      hasNext: () => false,
      currentChannel: channel,
      disableMarkAsRead: false,
    });
    const { result } = renderHook(() => useGroupChannel(), { wrapper: createWrapper(store) });

    await act(async () => {
      await result.current.actions.scrollToBottom(true);
    });

    await waitFor(() => {
      expect(store.getState().resetNewMessages).toHaveBeenCalledTimes(1);
      expect(mockSendbirdConfig.markAsReadScheduler.push).toHaveBeenCalledTimes(1);
      expect(store.getState().scrollPubSub.publish).toHaveBeenCalledTimes(1);
    });

    expect(mockSendbirdConfig.markAsReadScheduler.push).toHaveBeenCalledWith(channel);
    expect(store.getState().scrollPubSub.publish).toHaveBeenCalledWith('scrollToBottom', { animated: true });

    const resetOrder = store.getState().resetNewMessages.mock.invocationCallOrder[0];
    const markOrder = mockSendbirdConfig.markAsReadScheduler.push.mock.invocationCallOrder[0];
    const publishOrder = store.getState().scrollPubSub.publish.mock.invocationCallOrder[0];

    // Synchronous side effects: reset before markAsRead
    expect(resetOrder).toBeLessThan(markOrder);
    // requestAnimationFrame ⇒ publish callback fires AFTER sync side effects.
    // This is the invariant Phase 1-4 must preserve when ScrollController
    // takes over the publish path: publish must still be the last observable
    // call in the sequence.
    expect(resetOrder).toBeLessThan(publishOrder);
    expect(markOrder).toBeLessThan(publishOrder);
  });

  it('does not call resetNewMessages or markAsRead when there is a next page', async () => {
    const channel = mockChannel({ myMemberState: 'joined' });
    const store = createCharacterizationStore({
      scrollRef: { current: container.current },
      hasNext: () => true,
      currentChannel: channel,
      resetWithStartingPoint: jest.fn().mockResolvedValue(undefined),
    });
    const { result } = renderHook(() => useGroupChannel(), { wrapper: createWrapper(store) });

    await act(async () => {
      await result.current.actions.scrollToBottom(true);
    });

    await waitFor(() => {
      expect(store.getState().resetWithStartingPoint).toHaveBeenCalledWith(Number.MAX_SAFE_INTEGER);
      expect(store.getState().scrollPubSub.publish).toHaveBeenCalledTimes(1);
    });
    expect(store.getState().scrollPubSub.publish).toHaveBeenCalledWith('scrollToBottom', { animated: true });
    expect(store.getState().resetNewMessages).not.toHaveBeenCalled();
    expect(mockSendbirdConfig.markAsReadScheduler.push).not.toHaveBeenCalled();
  });

  it('does not publish scrollToBottom if scrollRef is null', async () => {
    const channel = mockChannel({ myMemberState: 'joined' });
    const store = createCharacterizationStore({
      scrollRef: { current: null },
      currentChannel: channel,
    });
    const { result } = renderHook(() => useGroupChannel(), { wrapper: createWrapper(store) });

    await act(async () => {
      await result.current.actions.scrollToBottom(true);
    });

    expect(store.getState().scrollPubSub.publish).not.toHaveBeenCalled();
    expect(store.getState().resetNewMessages).not.toHaveBeenCalled();
    expect(mockSendbirdConfig.markAsReadScheduler.push).not.toHaveBeenCalled();
  });

  it('skips markAsRead when disableMarkAsRead is true', async () => {
    const channel = mockChannel({ myMemberState: 'joined' });
    const store = createCharacterizationStore({
      scrollRef: { current: container.current },
      hasNext: () => false,
      currentChannel: channel,
      disableMarkAsRead: true,
    });
    const { result } = renderHook(() => useGroupChannel(), { wrapper: createWrapper(store) });

    await act(async () => {
      await result.current.actions.scrollToBottom(true);
    });

    await waitFor(() => {
      expect(store.getState().resetNewMessages).toHaveBeenCalled();
    });
    expect(mockSendbirdConfig.markAsReadScheduler.push).not.toHaveBeenCalled();
  });
});
