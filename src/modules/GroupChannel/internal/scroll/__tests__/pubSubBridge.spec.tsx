/**
 * Phase 3 sub-batch 2 — scrollPubSub → ScrollController bridge integration
 * (RV-3.1, RV-3.2).
 *
 * Mounts `useMessageListScroll` via renderHook, observes the controller via
 * the global instrumentation hook, then triggers `scrollPubSub.publish(...)`
 * and asserts the controller received the corresponding ScrollIntent.
 *
 * The legacy scrollPubSub handlers continue to run alongside the controller
 * path (verified indirectly by Phase 0 characterization specs which assert
 * the visible DOM/store behavior — they pass unmodified under this turn).
 */
import * as React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useMessageListScroll } from '../../../context/hooks/useMessageListScroll';
import {
  SCROLL_CONTROLLER_HOOK_GLOBAL_KEY,
  type ScrollControllerHookPayload,
} from '../controller';
import {
  createCharacterizationStore,
  createWrapper,
  makeSendbirdConfig,
} from '../../../../../utils/test/p0/characterization/storeHarness';

const mockCfg = makeSendbirdConfig();
jest.mock('../../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    state: { stores: { sdkStore: { sdk: {}, initialized: true } }, config: mockCfg },
  })),
}));
jest.mock('../../../context/utils', () => ({
  getMessageTopOffset: jest.fn().mockReturnValue(0),
}));

describe('Phase 3 sub-batch 2 — scrollPubSub → ScrollController bridge', () => {
  let captured: ScrollControllerHookPayload[];

  beforeEach(() => {
    captured = [];
    (globalThis as any)[SCROLL_CONTROLLER_HOOK_GLOBAL_KEY] = (p: ScrollControllerHookPayload) => captured.push(p);
  });

  afterEach(() => {
    delete (globalThis as any)[SCROLL_CONTROLLER_HOOK_GLOBAL_KEY];
  });

  it('RV-3.1  publish("scrollToBottom", {animated:true}) → controller.run(TO_BOTTOM) exactly once', () => {
    const store = createCharacterizationStore();
    const { result } = renderHook(() => useMessageListScroll('auto'), {
      wrapper: createWrapper(store),
    });
    captured.length = 0; // ignore any mount-time intents

    act(() => {
      result.current.scrollPubSub.publish('scrollToBottom', { animated: true });
    });

    const toBottoms = captured.filter((p) => p.intent.type === 'TO_BOTTOM');
    expect(toBottoms).toHaveLength(1);
    expect(toBottoms[0].intent).toMatchObject({
      type: 'TO_BOTTOM',
      animated: true,
      reason: 'button',
    });
  });

  it('RV-3.1  publish("scrollToBottom", {animated:false}) preserves animated=false', () => {
    const store = createCharacterizationStore();
    const { result } = renderHook(() => useMessageListScroll('auto'), {
      wrapper: createWrapper(store),
    });
    captured.length = 0;

    act(() => {
      result.current.scrollPubSub.publish('scrollToBottom', { animated: false });
    });

    const toBottoms = captured.filter((p) => p.intent.type === 'TO_BOTTOM');
    expect(toBottoms).toHaveLength(1);
    expect(toBottoms[0].intent).toMatchObject({ animated: false });
  });

  it('RV-3.2  publish("scroll", {top, animated, lazy}) → controller.run(TO_MESSAGE) with payload forwarded', () => {
    const store = createCharacterizationStore();
    const { result } = renderHook(() => useMessageListScroll('auto'), {
      wrapper: createWrapper(store),
    });
    captured.length = 0;

    act(() => {
      result.current.scrollPubSub.publish('scroll', { top: 250, animated: true, lazy: false });
    });

    const toMessages = captured.filter((p) => p.intent.type === 'TO_MESSAGE');
    expect(toMessages).toHaveLength(1);
    expect(toMessages[0].intent).toMatchObject({
      type: 'TO_MESSAGE',
      animated: true,
      top: 250,
      lazy: false,
      focus: false,
    });
  });

  it('controller and legacy handlers both observe each publish (parallel path)', () => {
    const store = createCharacterizationStore();
    const { result } = renderHook(() => useMessageListScroll('auto'), {
      wrapper: createWrapper(store),
    });
    captured.length = 0;

    // Two publishes — controller should see two intents, legacy DOM handlers
    // continue to run too (verified by Phase 0 characterization specs).
    act(() => {
      result.current.scrollPubSub.publish('scrollToBottom', { animated: false });
      result.current.scrollPubSub.publish('scroll', { top: 100, animated: false });
    });

    expect(captured.filter((p) => p.intent.type === 'TO_BOTTOM')).toHaveLength(1);
    expect(captured.filter((p) => p.intent.type === 'TO_MESSAGE')).toHaveLength(1);
  });

  it('unsubscribes the parallel subscribers on unmount', () => {
    const store = createCharacterizationStore();
    const { result, unmount } = renderHook(() => useMessageListScroll('auto'), {
      wrapper: createWrapper(store),
    });
    const pubSub = result.current.scrollPubSub;
    unmount();
    captured.length = 0;

    act(() => {
      pubSub.publish('scrollToBottom', { animated: false });
    });

    expect(captured.filter((p) => p.intent.type === 'TO_BOTTOM')).toHaveLength(0);
  });
});
