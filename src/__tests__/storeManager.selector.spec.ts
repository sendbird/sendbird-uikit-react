/**
 * Phase 1 — Refactor Verification for the store-level guardrails.
 *
 * Covers AC-3a / AC-3b / AC-3c (spec.md) and RV-1.1..1.7 (plan.md §1.1-1.3).
 *
 * Behaviors under test (NEW API surface):
 *   - `useStoreSelector(StoreContext, selector, equalityFn?)` — narrow
 *     subscription with stable identity when selector output is equal.
 *   - `applyStorePatch(store, patch, reason, opts?)` — equality-respecting
 *     patch with dev/test instrumentation and an explicit `bypassEquality`
 *     escape hatch.
 *
 * Invariants under test (EXISTING API surface — must not regress):
 *   - `useStore(StoreContext, selector, initialState)` unchanged.
 *   - `createStore`/`hasStateChanged`/`Store.setState(partial, force?)` unchanged.
 *   - Existing `setState(..., true)` call sites in the GroupChannel code are
 *     not converted; the literal `setState(...).*, true` pattern remains.
 */
import * as React from 'react';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { renderHook, render, act } from '@testing-library/react';
import { createStore, applyStorePatch, hasStateChanged } from '../utils/storeManager';
import { useStore, useStoreSelector } from '../hooks/useStore';

type Probe = {
  a: number;
  b: number;
  unrelated: string;
};

const Ctx = React.createContext<ReturnType<typeof createStore<Probe>> | null>(null);

function Wrapper(store: ReturnType<typeof createStore<Probe>>): React.FC<{ children: React.ReactNode }> {
  return ({ children }) => React.createElement(Ctx.Provider, { value: store }, children);
}

const initialProbe: Probe = { a: 0, b: 0, unrelated: 'start' };

describe('Phase 1 — applyStorePatch + useStoreSelector (RV-1.1 ... 1.7)', () => {
  /* ─── RV-1.5 — existing API surface unchanged ────────────────────── */
  it('RV-1.5  existing useStore signature returns { state, updateState }', () => {
    const store = createStore<Probe>({ ...initialProbe });
    const { result } = renderHook(
      () => useStore(Ctx, (s) => s, initialProbe),
      { wrapper: Wrapper(store) },
    );
    expect(typeof result.current.state).toBe('object');
    expect(typeof result.current.updateState).toBe('function');
    expect(result.current.state).toMatchObject(initialProbe);
  });

  it('RV-1.5  existing hasStateChanged still returns false for equivalent objects', () => {
    expect(hasStateChanged({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(false);
    expect(hasStateChanged({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(true);
  });

  it('RV-1.5  Store.setState(partial, force=true) still notifies even when state is unchanged', () => {
    const store = createStore<Probe>({ ...initialProbe });
    const spy = jest.fn();
    store.subscribe(spy);

    // Idempotent — no force → no notify
    store.setState((prev) => ({ ...prev }));
    expect(spy).not.toHaveBeenCalled();

    // Idempotent + force=true → notify
    store.setState((prev) => ({ ...prev }), true);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  /* ─── RV-1.6 — existing force=true call sites preserved ──────────── */
  it('RV-1.6  useGroupChannel.ts setCurrentChannel still uses setState(..., true)', () => {
    const filePath = path.resolve(
      __dirname,
      '../modules/GroupChannel/context/hooks/useGroupChannel.ts',
    );
    const content = fs.readFileSync(filePath, 'utf8');
    // Look for the closing `}), true);` of setCurrentChannel's setState call.
    // The exact line was useGroupChannel.ts:204 at base sha 2df7d140; we
    // assert the pattern still exists rather than tying to a line number.
    expect(content).toMatch(/\}\),\s*true\s*\);/);
  });

  it('RV-1.6  useGroupChannelList.ts still has at least one setState(..., true) call', () => {
    const filePath = path.resolve(
      __dirname,
      '../modules/GroupChannelList/context/useGroupChannelList.ts',
    );
    const content = fs.readFileSync(filePath, 'utf8');
    // Multiline pattern: setState(state => ({ ... }), true);
    expect(content).toMatch(/\}\),\s*true\s*\);/);
  });

  /* ─── RV-1.3 — applyStorePatch equality-respecting notify ────────── */
  it('RV-1.3  applyStorePatch with patch that does not change state does NOT notify subscribers', () => {
    const store = createStore<Probe>({ ...initialProbe });
    const spy = jest.fn();
    store.subscribe(spy);

    applyStorePatch(store, { a: 0 }, 'NO_OP_EVENT');
    expect(spy).not.toHaveBeenCalled();
    expect(store.getState().a).toBe(0);
  });

  it('RV-1.3  applyStorePatch with patch that changes state notifies subscribers exactly once', () => {
    const store = createStore<Probe>({ ...initialProbe });
    const spy = jest.fn();
    store.subscribe(spy);

    applyStorePatch(store, { a: 1 }, 'CHANGE_A');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(store.getState().a).toBe(1);
    expect(store.getState().b).toBe(0); // unchanged
  });

  /* ─── RV-1.4 — dev/test instrumentation hook ─────────────────────── */
  it('RV-1.4  applyStorePatch reports reason + keys + bypassEquality via global hook', () => {
    const hookSpy = jest.fn();
    (globalThis as any).__APPLY_STORE_PATCH_HOOK__ = hookSpy;
    try {
      const store = createStore<Probe>({ ...initialProbe });
      applyStorePatch(store, { a: 1, b: 2 }, 'CHANGE_A_AND_B');
      expect(hookSpy).toHaveBeenCalledTimes(1);
      const [payload] = hookSpy.mock.calls[0];
      expect(payload.reason).toBe('CHANGE_A_AND_B');
      expect(payload.keys.sort()).toEqual(['a', 'b']);
      expect(payload.bypassEquality).toBe(false);
    } finally {
      delete (globalThis as any).__APPLY_STORE_PATCH_HOOK__;
    }
  });

  it('RV-1.4  applyStorePatch hook fires even for no-op patches (for debugging visibility)', () => {
    const hookSpy = jest.fn();
    (globalThis as any).__APPLY_STORE_PATCH_HOOK__ = hookSpy;
    try {
      const store = createStore<Probe>({ ...initialProbe });
      applyStorePatch(store, { a: 0 }, 'NO_OP_EVENT');
      // The hook receives every call so developers can correlate event
      // names with state writes. The store still does not notify (above).
      expect(hookSpy).toHaveBeenCalledTimes(1);
    } finally {
      delete (globalThis as any).__APPLY_STORE_PATCH_HOOK__;
    }
  });

  /* ─── RV-1.7 — bypassEquality escape hatch ───────────────────────── */
  it('RV-1.7  applyStorePatch with bypassEquality=true notifies even on idempotent patch', () => {
    const store = createStore<Probe>({ ...initialProbe });
    const spy = jest.fn();
    store.subscribe(spy);

    applyStorePatch(store, { a: 0 }, 'FORCE_NOTIFY', { bypassEquality: true });
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('RV-1.7  applyStorePatch with bypassEquality=true reports bypassEquality:true via hook', () => {
    const hookSpy = jest.fn();
    (globalThis as any).__APPLY_STORE_PATCH_HOOK__ = hookSpy;
    try {
      const store = createStore<Probe>({ ...initialProbe });
      applyStorePatch(store, { a: 1 }, 'FORCE_A', { bypassEquality: true });
      expect(hookSpy).toHaveBeenCalledWith(
        expect.objectContaining({ reason: 'FORCE_A', bypassEquality: true }),
      );
    } finally {
      delete (globalThis as any).__APPLY_STORE_PATCH_HOOK__;
    }
  });

  /* ─── RV-1.1 — useStoreSelector narrow subscription ──────────────── */
  it('RV-1.1  useStoreSelector does NOT rerender when selector output is reference-equal', () => {
    const store = createStore<Probe>({ ...initialProbe });
    let renderCount = 0;

    const Probe: React.FC = () => {
      renderCount += 1;
      const a = useStoreSelector(Ctx, (s) => s.a);
      return React.createElement('span', null, String(a));
    };

    render(React.createElement(Wrapper(store), null, React.createElement(Probe)));
    expect(renderCount).toBe(1);

    // Patch a sibling field — selector output for `a` is unchanged.
    act(() => {
      applyStorePatch(store, { b: 1 }, 'CHANGE_B_ONLY');
    });
    expect(renderCount).toBe(1); // narrow subscription: no rerender
  });

  it('RV-1.1  useStoreSelector rerenders when selector output actually changes', () => {
    const store = createStore<Probe>({ ...initialProbe });
    let renderCount = 0;
    let lastValue = -1;

    const Probe: React.FC = () => {
      renderCount += 1;
      const a = useStoreSelector(Ctx, (s) => s.a);
      lastValue = a;
      return React.createElement('span', null, String(a));
    };

    render(React.createElement(Wrapper(store), null, React.createElement(Probe)));
    expect(renderCount).toBe(1);
    expect(lastValue).toBe(0);

    act(() => {
      applyStorePatch(store, { a: 5 }, 'CHANGE_A');
    });
    expect(renderCount).toBe(2);
    expect(lastValue).toBe(5);
  });

  /* ─── RV-1.2 — custom equalityFn ─────────────────────────────────── */
  it('RV-1.2  useStoreSelector with shallow-equal equalityFn does not rerender on equivalent object snapshots', () => {
    type ShallowProbe = { ab: { a: number; b: number }; c: string };
    const ShallowCtx = React.createContext<ReturnType<typeof createStore<ShallowProbe>> | null>(null);
    const store = createStore<ShallowProbe>({ ab: { a: 0, b: 0 }, c: 'x' });

    const shallow = (l: { a: number; b: number }, r: { a: number; b: number }) => l.a === r.a && l.b === r.b;

    let renderCount = 0;
    const Probe: React.FC = () => {
      renderCount += 1;
      const ab = useStoreSelector(ShallowCtx, (s) => s.ab, shallow);
      return React.createElement('span', null, `${ab.a},${ab.b}`);
    };

    const W: React.FC<{ children: React.ReactNode }> = ({ children }) => React.createElement(ShallowCtx.Provider, { value: store }, children);
    render(React.createElement(W, null, React.createElement(Probe)));
    expect(renderCount).toBe(1);

    // New reference for `ab`, same a/b values — shallow equality says equal.
    act(() => {
      applyStorePatch(store, { ab: { a: 0, b: 0 } }, 'SAME_AB');
    });
    expect(renderCount).toBe(1); // no rerender thanks to shallow equality

    // Now actually change a value.
    act(() => {
      applyStorePatch(store, { ab: { a: 1, b: 0 } }, 'CHANGE_AB');
    });
    expect(renderCount).toBe(2);
  });

  it('RV-1.2  default equality is Object.is (reference equality)', () => {
    const store = createStore<Probe>({ ...initialProbe });
    let renderCount = 0;
    const Probe: React.FC = () => {
      renderCount += 1;
      // Selector returns a NEW object each call — default Object.is sees
      // them as unequal, triggering rerender.
      const snapshot = useStoreSelector(Ctx, (s) => ({ a: s.a }));
      return React.createElement('span', null, String(snapshot.a));
    };
    render(React.createElement(Wrapper(store), null, React.createElement(Probe)));
    expect(renderCount).toBe(1);

    act(() => {
      // Trigger a notify (changes b) — selector output for `(s) => ({a: s.a})`
      // would be a new object reference. Default Object.is says not equal.
      applyStorePatch(store, { b: 1 }, 'NOTIFY');
    });
    // Note: even though `b` changed, the selector reads only `s.a`. But
    // because each call returns a NEW object literal, default Object.is
    // sees it as different → rerender. This is the documented baseline:
    // caller must supply a shallow/deep equality fn to avoid this.
    expect(renderCount).toBe(2);
  });

  /* ─── Selector boundary isolation across siblings ────────────────── */
  it('useStoreSelector subscribers reading different slices are independent', () => {
    const store = createStore<Probe>({ ...initialProbe });
    let renderA = 0;
    let renderB = 0;

    const ProbeA: React.FC = () => {
      renderA += 1;
      useStoreSelector(Ctx, (s) => s.a);
      return React.createElement('span', { 'data-testid': 'a' });
    };
    const ProbeB: React.FC = () => {
      renderB += 1;
      useStoreSelector(Ctx, (s) => s.b);
      return React.createElement('span', { 'data-testid': 'b' });
    };

    render(
      React.createElement(Wrapper(store), null, React.createElement(React.Fragment, null, React.createElement(ProbeA), React.createElement(ProbeB),
      ),
      ),
    );
    expect(renderA).toBe(1);
    expect(renderB).toBe(1);

    act(() => {
      applyStorePatch(store, { a: 1 }, 'CHANGE_A');
    });
    expect(renderA).toBe(2);
    expect(renderB).toBe(1); // sibling reading `b` is not woken
  });

  it('useStoreSelector throws when used without a provider', () => {
    const NoProviderCtx = React.createContext<ReturnType<typeof createStore<Probe>> | null>(null);
    const Probe: React.FC = () => {
      useStoreSelector(NoProviderCtx, (s) => s.a);
      return null;
    };
    // Suppress React's error boundary warning during this assertion.
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    try {
      expect(() => render(React.createElement(Probe))).toThrow();
    } finally {
      errorSpy.mockRestore();
    }
  });
});
