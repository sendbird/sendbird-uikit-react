/**
 * Phase 0 — context-shape baseline parity (Critical 4 from Plan Review).
 *
 * Mounts `useGroupChannel()` with the comprehensive fixture default state
 * and dumps the union of `state` + `actions` keys to a JSON-serializable
 * structure. Compared against `src/__tests__/p0-baseline/context-shape-baseline.json`
 * — the source of truth for Phase 2's `useGroupChannelContext()` parity
 * assertion (RV-2.7 / AC-BC-3).
 *
 * If the baseline file does not exist, this spec emits a `console.warn`
 * with the captured shape and skips the strict comparison so the
 * developer can write the baseline file (one-shot capture). Subsequent
 * runs perform the full diff.
 *
 * Captured shape fields are categorized by JS type at capture time:
 *   - "function"     — callable (action methods, sometimes refs)
 *   - "ref-object"   — object with `current` property (React refs)
 *   - "object"       — non-null non-function object
 *   - "array"        — Array.isArray() true
 *   - "primitive"    — number, string, boolean, undefined
 *   - "null"         — value === null
 */
import { renderHook } from '@testing-library/react';
import {
  createCharacterizationStore,
  createWrapper,
  mockChannel,
  makeSendbirdConfig,
} from '../../utils/test/p0/characterization/storeHarness';
import { useGroupChannel } from '../../modules/GroupChannel/context/hooks/useGroupChannel';
import baseline from '../p0-baseline/context-shape-baseline.json';

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

function categorize(value: unknown): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'function') return 'function';
  if (typeof value === 'object') {
    if (Object.prototype.hasOwnProperty.call(value, 'current')) return 'ref-object';
    return 'object';
  }
  return 'primitive';
}

function captureShape(value: Record<string, unknown>) {
  const out: Record<string, string> = {};
  for (const key of Object.keys(value)) {
    out[key] = categorize(value[key]);
  }
  return out;
}

describe('Phase 0 — useGroupChannel context shape parity (C4 baseline)', () => {
  it('captured state field set matches the baseline file', () => {
    const store = createCharacterizationStore({ currentChannel: mockChannel() });
    const { result } = renderHook(() => useGroupChannel(), { wrapper: createWrapper(store) });
    const stateShape = captureShape(result.current.state as unknown as Record<string, unknown>);
    expect(Object.keys(stateShape).sort()).toEqual(
      Object.keys(baseline.state).sort(),
    );
  });

  it('captured action field set matches the baseline file', () => {
    const store = createCharacterizationStore({ currentChannel: mockChannel() });
    const { result } = renderHook(() => useGroupChannel(), { wrapper: createWrapper(store) });
    const actionsShape = captureShape(result.current.actions as unknown as Record<string, unknown>);
    expect(Object.keys(actionsShape).sort()).toEqual(
      Object.keys(baseline.actions).sort(),
    );
  });

  it('each captured field has the same category as the baseline', () => {
    const store = createCharacterizationStore({ currentChannel: mockChannel() });
    const { result } = renderHook(() => useGroupChannel(), { wrapper: createWrapper(store) });
    const stateShape = captureShape(result.current.state as unknown as Record<string, unknown>);
    const actionsShape = captureShape(result.current.actions as unknown as Record<string, unknown>);
    expect(stateShape).toEqual(baseline.state);
    expect(actionsShape).toEqual(baseline.actions);
  });
});
