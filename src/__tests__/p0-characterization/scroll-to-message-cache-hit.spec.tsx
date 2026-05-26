/**
 * Phase 0 characterization — scenario 8: scrollToMessage when the target
 * message is already in the messages array (cache hit).
 *
 * Source of truth: `src/modules/GroupChannel/context/hooks/useGroupChannel.ts:105-172`.
 * In the cache-hit branch (line 132-135):
 *   1. `state.scrollPubSub.publish('scroll', { top, animated })` is called
 *      where `top` comes from `getMessageTopOffset(createdAt)`.
 *   2. If `messageFocusAnimated` is undefined or true, `setAnimatedMessageId(messageId)`
 *      is invoked, mutating `state.animatedMessageId`.
 *
 * resetWithStartingPoint is NOT called in this branch.
 *
 * BC-6 payload-shape: `scroll` topic must use exactly `{ top, animated }`
 * (no `lazy` key — that's the cache-miss branch).
 */
import { renderHook, act, waitFor } from '@testing-library/react';
import {
  createCharacterizationStore,
  createWrapper,
  createScrollContainer,
  mockChannel,
  mockMessage,
  makeSendbirdConfig,
} from '../../utils/test/p0/characterization/storeHarness';
import { useGroupChannel } from '../../modules/GroupChannel/context/hooks/useGroupChannel';

const mockCfg = makeSendbirdConfig();
const mockGetMessageTopOffset = jest.fn().mockReturnValue(100);

jest.mock('../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    state: { stores: { sdkStore: { sdk: {}, initialized: true } }, config: mockCfg },
  })),
}));
jest.mock('../../modules/GroupChannel/context/utils', () => ({
  getMessageTopOffset: (...args: unknown[]) => mockGetMessageTopOffset(...args),
}));

describe('Phase 0 — scrollToMessage cache hit (scenario 8)', () => {
  let container: ReturnType<typeof createScrollContainer>;

  beforeEach(() => {
    container = createScrollContainer();
    mockGetMessageTopOffset.mockClear();
    mockGetMessageTopOffset.mockReturnValue(100);
  });

  afterEach(() => container.cleanup());

  it('publishes scroll with { top, animated } when message exists in cache', async () => {
    const target = mockMessage({ messageId: 42, createdAt: 4242 });
    const store = createCharacterizationStore({
      scrollRef: { current: container.current },
      messages: [target, mockMessage({ messageId: 99, createdAt: 9999 })],
      currentChannel: mockChannel(),
    });
    const { result } = renderHook(() => useGroupChannel(), { wrapper: createWrapper(store) });

    await act(async () => {
      await result.current.actions.scrollToMessage(4242, 42, true, true);
    });

    await waitFor(() => {
      expect(store.getState().scrollPubSub.publish).toHaveBeenCalledTimes(1);
    });
    const calls = store.getState().scrollPubSub.publish.mock.calls;
    expect(calls[0][0]).toBe('scroll');
    expect(calls[0][1]).toEqual({ top: 100, animated: true });
    // BC-6 payload-shape: cache-hit shape is exactly `{top, animated}` — no
    // `lazy` key (that's reserved for cache-miss).
    expect(Object.keys(calls[0][1]).sort()).toEqual(['animated', 'top']);
  });

  it('sets animatedMessageId to target when messageFocusAnimated is true', async () => {
    const target = mockMessage({ messageId: 42, createdAt: 4242 });
    const store = createCharacterizationStore({
      scrollRef: { current: container.current },
      messages: [target],
    });
    const { result } = renderHook(() => useGroupChannel(), { wrapper: createWrapper(store) });

    await act(async () => {
      await result.current.actions.scrollToMessage(4242, 42, true, true);
    });

    expect(store.getState().animatedMessageId).toBe(42);
  });

  it('does NOT call resetWithStartingPoint when message is in cache', async () => {
    const target = mockMessage({ messageId: 42, createdAt: 4242 });
    const store = createCharacterizationStore({
      scrollRef: { current: container.current },
      messages: [target],
    });
    const { result } = renderHook(() => useGroupChannel(), { wrapper: createWrapper(store) });

    await act(async () => {
      await result.current.actions.scrollToMessage(4242, 42, true, true);
    });
    expect(store.getState().resetWithStartingPoint).not.toHaveBeenCalled();
  });

  it('does not publish if getMessageTopOffset returns null', async () => {
    mockGetMessageTopOffset.mockReturnValue(null);
    const target = mockMessage({ messageId: 42, createdAt: 4242 });
    const store = createCharacterizationStore({
      scrollRef: { current: container.current },
      messages: [target],
    });
    const { result } = renderHook(() => useGroupChannel(), { wrapper: createWrapper(store) });

    await act(async () => {
      await result.current.actions.scrollToMessage(4242, 42, true, true);
    });
    expect(store.getState().scrollPubSub.publish).not.toHaveBeenCalled();
  });

  it('clears animatedMessageId synchronously at action entry before setting target', async () => {
    // useGroupChannel.ts:128 calls setAnimatedMessageId(null) at entry, then
    // sets it to messageId at the end. Phase 1-4 must preserve this so
    // re-triggering with the same id produces a fresh animation cycle.
    const target = mockMessage({ messageId: 42, createdAt: 4242 });
    const store = createCharacterizationStore({
      scrollRef: { current: container.current },
      messages: [target],
      animatedMessageId: 42, // previous animation still set
    });
    const { result } = renderHook(() => useGroupChannel(), { wrapper: createWrapper(store) });

    await act(async () => {
      await result.current.actions.scrollToMessage(4242, 42, true, true);
    });
    // End state: animatedMessageId reset to messageId (42 again, but via
    // null → 42 path).
    expect(store.getState().animatedMessageId).toBe(42);
  });
});
