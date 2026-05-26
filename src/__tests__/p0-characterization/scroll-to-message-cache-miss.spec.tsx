/**
 * Phase 0 characterization — scenario 9: scrollToMessage when the target
 * message is not in the messages array (cache miss).
 *
 * Source of truth: `src/modules/GroupChannel/context/hooks/useGroupChannel.ts:136-164`.
 *
 * Sequence (cache miss + state.initialized):
 *   1. setAnimatedMessageId(null)            // entry
 *   2. await state.resetWithStartingPoint(createdAt)
 *   3. setTimeout(() => { ... }, 500)
 *   4. (after 500ms) read store.getState().messages — pick nearest message
 *      by createdAt, publish('scroll', { top, lazy: false, animated })
 *   5. setAnimatedMessageId(messageId)
 *
 * BC-6 payload shape for cache-miss `scroll` topic: `{ top, lazy, animated }`
 * — DIFFERENT from cache-hit shape (`{ top, animated }`). The `lazy: false`
 * key is the discriminator.
 */
import { renderHook, act, waitFor } from '@testing-library/react';
import {
  createCharacterizationStore,
  createWrapper,
  createScrollContainer,
  mockChannel,
  mockMessage,
  makeSendbirdConfig,
  type CharacterizationStore,
} from '../../utils/test/p0/characterization/storeHarness';
import { useGroupChannel } from '../../modules/GroupChannel/context/hooks/useGroupChannel';

const mockCfg = makeSendbirdConfig();
const mockGetMessageTopOffset = jest.fn().mockReturnValue(250);

jest.mock('../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    state: { stores: { sdkStore: { sdk: {}, initialized: true } }, config: mockCfg },
  })),
}));
jest.mock('../../modules/GroupChannel/context/utils', () => ({
  getMessageTopOffset: (...args: unknown[]) => mockGetMessageTopOffset(...args),
}));

describe('Phase 0 — scrollToMessage cache miss (scenario 9)', () => {
  let container: ReturnType<typeof createScrollContainer>;

  beforeEach(() => {
    jest.useFakeTimers();
    container = createScrollContainer();
    mockGetMessageTopOffset.mockClear();
    mockGetMessageTopOffset.mockReturnValue(250);
  });
  afterEach(() => {
    jest.useRealTimers();
    container.cleanup();
  });

  function makeStoreWithLazyHydrate(target: any): CharacterizationStore {
    const store = createCharacterizationStore({
      scrollRef: { current: container.current },
      messages: [],
      initialized: true,
      currentChannel: mockChannel(),
    });
    // Mock `resetWithStartingPoint` to populate messages within the same tick.
    (store.getState().resetWithStartingPoint as jest.Mock).mockImplementation(async (createdAt: number) => {
      store.setState((prev) => ({ ...prev, messages: [target] }));
    });
    return store;
  }

  it('calls resetWithStartingPoint with the requested createdAt', async () => {
    const target = mockMessage({ messageId: 77, createdAt: 7777 });
    const store = makeStoreWithLazyHydrate(target);
    const { result } = renderHook(() => useGroupChannel(), { wrapper: createWrapper(store) });

    await act(async () => {
      await result.current.actions.scrollToMessage(7777, 77, true, true);
    });

    expect(store.getState().resetWithStartingPoint).toHaveBeenCalledWith(7777);
  });

  it('publishes scroll with { top, lazy: false, animated } after the 500ms timer', async () => {
    const target = mockMessage({ messageId: 77, createdAt: 7777 });
    const store = makeStoreWithLazyHydrate(target);
    const { result } = renderHook(() => useGroupChannel(), { wrapper: createWrapper(store) });

    await act(async () => {
      await result.current.actions.scrollToMessage(7777, 77, true, true);
    });

    // Pre-timer: publish not yet called.
    expect(store.getState().scrollPubSub.publish).not.toHaveBeenCalled();

    // Flush the 500ms timer in the action.
    await act(async () => {
      jest.runAllTimers();
      await waitFor(() => {
        expect(store.getState().scrollPubSub.publish).toHaveBeenCalledTimes(1);
      });
    });

    const calls = store.getState().scrollPubSub.publish.mock.calls;
    expect(calls[0][0]).toBe('scroll');
    expect(calls[0][1]).toEqual({ top: 250, lazy: false, animated: true });
    // BC-6 payload-shape: cache-miss shape includes `lazy` key (false).
    expect(Object.keys(calls[0][1]).sort()).toEqual(['animated', 'lazy', 'top']);
  });

  it('sets animatedMessageId after the 500ms timer when messageFocusAnimated is true', async () => {
    const target = mockMessage({ messageId: 77, createdAt: 7777 });
    const store = makeStoreWithLazyHydrate(target);
    const { result } = renderHook(() => useGroupChannel(), { wrapper: createWrapper(store) });

    await act(async () => {
      await result.current.actions.scrollToMessage(7777, 77, true, true);
    });
    expect(store.getState().animatedMessageId).toBeNull(); // entry clear

    await act(async () => {
      jest.runAllTimers();
    });
    expect(store.getState().animatedMessageId).toBe(77);
  });

  it('does nothing inside the timer callback if the channel is empty after reset', async () => {
    const store = createCharacterizationStore({
      scrollRef: { current: container.current },
      messages: [],
      initialized: true,
    });
    // resetWithStartingPoint resolves WITHOUT hydrating messages.
    (store.getState().resetWithStartingPoint as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useGroupChannel(), { wrapper: createWrapper(store) });
    await act(async () => {
      await result.current.actions.scrollToMessage(7777, 77, true, true);
    });

    await act(async () => {
      jest.runAllTimers();
    });

    expect(store.getState().scrollPubSub.publish).not.toHaveBeenCalled();
  });

  it('does nothing when state.initialized is false', async () => {
    const store = createCharacterizationStore({
      scrollRef: { current: container.current },
      messages: [],
      initialized: false,
    });
    const { result } = renderHook(() => useGroupChannel(), { wrapper: createWrapper(store) });

    await act(async () => {
      await result.current.actions.scrollToMessage(7777, 77, true, true);
    });
    expect(store.getState().resetWithStartingPoint).not.toHaveBeenCalled();
    expect(store.getState().scrollPubSub.publish).not.toHaveBeenCalled();
  });
});
