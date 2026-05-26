/**
 * Phase 0 characterization — scenario 7 from the design.
 *
 * `scrollToBottom` invocation, when there is no next page, must (a) reset
 * the new-messages list and (b) schedule mark-as-read for the current channel.
 *
 * Source of truth: `src/modules/GroupChannel/context/hooks/useGroupChannel.ts:74-97`.
 *
 * Also captures the `scrollToBottom` payload SHAPE (BC-6): exactly one key
 * (`animated`), with the boolean value reflected from the caller.
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
  getMessageTopOffset: jest.fn().mockReturnValue(100),
}));

describe('Phase 0 — scrollToBottom clears new messages and schedules mark-as-read (scenario 7)', () => {
  let container: ReturnType<typeof createScrollContainer>;

  beforeEach(() => {
    container = createScrollContainer();
    mockCfg.markAsReadScheduler.push.mockClear();
  });
  afterEach(() => container.cleanup());

  it('clears new-messages list exactly once when at bottom with no next page', async () => {
    const channel = mockChannel();
    const store = createCharacterizationStore({
      scrollRef: { current: container.current },
      hasNext: () => false,
      currentChannel: channel,
    });
    const { result } = renderHook(() => useGroupChannel(), { wrapper: createWrapper(store) });

    await act(async () => {
      await result.current.actions.scrollToBottom(true);
    });

    await waitFor(() => {
      expect(store.getState().resetNewMessages).toHaveBeenCalledTimes(1);
    });
  });

  it('schedules mark-as-read with the current channel exactly once', async () => {
    const channel = mockChannel();
    const store = createCharacterizationStore({
      scrollRef: { current: container.current },
      hasNext: () => false,
      currentChannel: channel,
    });
    const { result } = renderHook(() => useGroupChannel(), { wrapper: createWrapper(store) });

    await act(async () => {
      await result.current.actions.scrollToBottom(false);
    });

    await waitFor(() => {
      expect(mockCfg.markAsReadScheduler.push).toHaveBeenCalledTimes(1);
      expect(mockCfg.markAsReadScheduler.push).toHaveBeenCalledWith(channel);
    });
  });

  it('publishes scrollToBottom exactly once with the expected payload shape', async () => {
    const channel = mockChannel();
    const store = createCharacterizationStore({
      scrollRef: { current: container.current },
      hasNext: () => false,
      currentChannel: channel,
    });
    const { result } = renderHook(() => useGroupChannel(), { wrapper: createWrapper(store) });

    await act(async () => {
      await result.current.actions.scrollToBottom(true);
    });

    await waitFor(() => {
      expect(store.getState().scrollPubSub.publish).toHaveBeenCalledTimes(1);
    });

    // BC-6 payload-shape characterization: exactly one topic call with
    // payload keys = ['animated']. Any future extra key triggers regression.
    const calls = store.getState().scrollPubSub.publish.mock.calls.filter(
      (c) => c[0] === 'scrollToBottom',
    );
    expect(calls.length).toBe(1);
    const payload = calls[0][1];
    expect(payload).toEqual({ animated: true });
    expect(Object.keys(payload).sort()).toEqual(['animated']);
  });

  it('passes animated=false through to the publish payload', async () => {
    const channel = mockChannel();
    const store = createCharacterizationStore({
      scrollRef: { current: container.current },
      hasNext: () => false,
      currentChannel: channel,
    });
    const { result } = renderHook(() => useGroupChannel(), { wrapper: createWrapper(store) });

    await act(async () => {
      await result.current.actions.scrollToBottom(false);
    });

    await waitFor(() => {
      expect(store.getState().scrollPubSub.publish).toHaveBeenCalledWith('scrollToBottom', { animated: false });
    });
  });

  it('sets isScrollBottomReached to true after the action resolves', async () => {
    const channel = mockChannel();
    const store = createCharacterizationStore({
      scrollRef: { current: container.current },
      hasNext: () => false,
      currentChannel: channel,
      isScrollBottomReached: false,
    });
    const { result } = renderHook(() => useGroupChannel(), { wrapper: createWrapper(store) });

    await act(async () => {
      await result.current.actions.scrollToBottom(true);
    });
    expect(store.getState().isScrollBottomReached).toBe(true);
  });

  it('clears animatedMessageId after the action resolves', async () => {
    const channel = mockChannel();
    const store = createCharacterizationStore({
      scrollRef: { current: container.current },
      hasNext: () => false,
      currentChannel: channel,
      animatedMessageId: 42,
    });
    const { result } = renderHook(() => useGroupChannel(), { wrapper: createWrapper(store) });

    await act(async () => {
      await result.current.actions.scrollToBottom(true);
    });
    expect(store.getState().animatedMessageId).toBeNull();
  });
});
