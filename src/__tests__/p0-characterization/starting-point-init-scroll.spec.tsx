/**
 * Phase 0 characterization — scenario 12: starting-point initialization
 * scroll.
 *
 * The `startingPoint` prop (GroupChannelProviderProps.startingPoint) drives
 * the initial scroll to a target message via `scrollToMessage(createdAt, id)`.
 * The exact bind of prop → scrollToMessage lives inside GroupChannelProvider,
 * which we do not mount in this characterization. Instead we characterize
 * the *contract* that startingPoint navigation must satisfy:
 *
 *   1. If the target message is already in the messages array, calling
 *      `scrollToMessage(createdAt, messageId)` immediately publishes
 *      `scroll` with `{ top, animated }` (cache-hit shape).
 *   2. If the target message is NOT in the array but state.initialized is
 *      true, `resetWithStartingPoint(createdAt)` is awaited, then after the
 *      500ms timer, publish('scroll', { top, lazy:false, animated }) fires.
 *   3. Animation state is set on the target message id.
 *
 * Phase 2's runtime adapter must preserve this contract — the
 * `STARTING_POINT_CHANGED` event must map to the same effect chain.
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
const mockGetMessageTopOffset = jest.fn().mockReturnValue(500);

jest.mock('../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    state: { stores: { sdkStore: { sdk: {}, initialized: true } }, config: mockCfg },
  })),
}));
jest.mock('../../modules/GroupChannel/context/utils', () => ({
  getMessageTopOffset: (...args: unknown[]) => mockGetMessageTopOffset(...args),
}));

describe('Phase 0 — startingPoint initialization (scenario 12)', () => {
  let container: ReturnType<typeof createScrollContainer>;

  beforeEach(() => {
    container = createScrollContainer();
    mockGetMessageTopOffset.mockClear();
    mockGetMessageTopOffset.mockReturnValue(500);
  });
  afterEach(() => container.cleanup());

  it('scrolls to a starting-point message that is already in the cache (immediate publish)', async () => {
    const target = mockMessage({ messageId: 555, createdAt: 5555 });
    const store = createCharacterizationStore({
      scrollRef: { current: container.current },
      messages: [mockMessage({ messageId: 100, createdAt: 1000 }), target],
      initialized: true,
      currentChannel: mockChannel(),
    });
    const { result } = renderHook(() => useGroupChannel(), { wrapper: createWrapper(store) });

    await act(async () => {
      await result.current.actions.scrollToMessage(5555, 555, true, true);
    });

    await waitFor(() => {
      expect(store.getState().scrollPubSub.publish).toHaveBeenCalledTimes(1);
    });
    const calls = store.getState().scrollPubSub.publish.mock.calls;
    expect(calls[0][0]).toBe('scroll');
    expect(calls[0][1]).toEqual({ top: 500, animated: true });
    expect(store.getState().resetWithStartingPoint).not.toHaveBeenCalled();
    expect(store.getState().animatedMessageId).toBe(555);
  });

  it('hydrates and scrolls to a starting-point message that is NOT yet in the cache', async () => {
    jest.useFakeTimers();
    try {
      const target = mockMessage({ messageId: 555, createdAt: 5555 });
      const store = createCharacterizationStore({
        scrollRef: { current: container.current },
        messages: [],
        initialized: true,
        currentChannel: mockChannel(),
      });
      (store.getState().resetWithStartingPoint as jest.Mock).mockImplementation(async () => {
        store.setState((prev) => ({ ...prev, messages: [target] }));
      });
      const { result } = renderHook(() => useGroupChannel(), { wrapper: createWrapper(store) });

      await act(async () => {
        await result.current.actions.scrollToMessage(5555, 555, true, true);
      });
      expect(store.getState().resetWithStartingPoint).toHaveBeenCalledWith(5555);

      await act(async () => {
        jest.runAllTimers();
        await waitFor(() => {
          expect(store.getState().scrollPubSub.publish).toHaveBeenCalledTimes(1);
        });
      });

      const calls = store.getState().scrollPubSub.publish.mock.calls;
      expect(calls[0][0]).toBe('scroll');
      expect(calls[0][1]).toEqual({ top: 500, lazy: false, animated: true });
      expect(store.getState().animatedMessageId).toBe(555);
    } finally {
      jest.useRealTimers();
    }
  });

  it('startingPoint navigation respects messageFocusAnimated=false (no animation)', async () => {
    const target = mockMessage({ messageId: 555, createdAt: 5555 });
    const store = createCharacterizationStore({
      scrollRef: { current: container.current },
      messages: [target],
      initialized: true,
    });
    const { result } = renderHook(() => useGroupChannel(), { wrapper: createWrapper(store) });

    await act(async () => {
      // messageFocusAnimated=false explicitly
      await result.current.actions.scrollToMessage(5555, 555, false, true);
    });

    // animatedMessageId should NOT be set when messageFocusAnimated is false.
    // useGroupChannel.ts:135 — `if (messageFocusAnimated ?? true) setAnimatedMessageId(messageId);`
    expect(store.getState().animatedMessageId).toBeNull();
  });
});
