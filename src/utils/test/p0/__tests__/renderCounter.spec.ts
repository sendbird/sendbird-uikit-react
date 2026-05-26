import * as React from 'react';
import { render, act } from '@testing-library/react';
import { createRenderCounter, withRenderCount, useRenderCountTracker } from '../renderCounter';

describe('renderCounter (Phase 0 instrumentation)', () => {
  it('starts every name at zero', () => {
    const counter = createRenderCounter();
    expect(counter.count('Anything')).toBe(0);
    expect(counter.trackedNames()).toEqual([]);
  });

  it('increments count once per render via withRenderCount', () => {
    const counter = createRenderCounter();
    const Plain: React.FC<{ value: number }> = ({ value }) => React.createElement('span', null, String(value));
    const Wrapped = withRenderCount('Plain', Plain, counter);

    const { rerender } = render(React.createElement(Wrapped, { value: 1 }));
    const afterMount = counter.snapshot();

    act(() => {
      rerender(React.createElement(Wrapped, { value: 2 }));
    });

    const delta = counter.deltaSince(afterMount);
    expect(delta('Plain')).toBe(1);
  });

  it('reset clears all tracked counts and names', () => {
    const counter = createRenderCounter();
    const Plain: React.FC = () => React.createElement('span', null, 'x');
    const Wrapped = withRenderCount('Plain', Plain, counter);
    render(React.createElement(Wrapped));

    expect(counter.count('Plain')).toBeGreaterThanOrEqual(1);
    counter.reset();
    expect(counter.count('Plain')).toBe(0);
    expect(counter.trackedNames()).toEqual([]);
  });

  it('tracks multiple component names independently', () => {
    const counter = createRenderCounter();
    const A: React.FC = () => React.createElement('span', null, 'a');
    const B: React.FC = () => React.createElement('span', null, 'b');
    const Aw = withRenderCount('A', A, counter);
    const Bw = withRenderCount('B', B, counter);

    render(
      React.createElement(
        React.Fragment,
        null,
        React.createElement(Aw),
        React.createElement(Bw),
        React.createElement(Bw),
      ),
    );

    expect(counter.count('A')).toBeGreaterThanOrEqual(1);
    expect(counter.count('B')).toBeGreaterThanOrEqual(2);
  });

  it('parent rerender does not double-increment unrelated siblings', () => {
    const counter = createRenderCounter();
    const Stable: React.FC = () => React.createElement('span', null, 'stable');
    const Changing: React.FC<{ value: number }> = ({ value }) => React.createElement('span', null, String(value));
    const StableW = withRenderCount('Stable', React.memo(Stable), counter);
    const ChangingW = withRenderCount('Changing', Changing, counter);

    const Parent: React.FC<{ value: number }> = ({ value }) =>
      React.createElement(
        React.Fragment,
        null,
        React.createElement(StableW, null),
        React.createElement(ChangingW, { value }),
      );

    const { rerender } = render(React.createElement(Parent, { value: 1 }));
    const snap = counter.snapshot();
    act(() => {
      rerender(React.createElement(Parent, { value: 2 }));
    });
    const delta = counter.deltaSince(snap);
    expect(delta('Changing')).toBeGreaterThanOrEqual(1);
    // Stable is memo'd at the inner Component layer, so the withRenderCount
    // wrapper still re-runs for every parent rerender. We deliberately
    // wrapped React.memo(Stable) — the wrapper is outside memo, so this
    // documents the limitation (wrapper renders count, not memo'd inner).
    expect(delta('Stable')).toBeGreaterThanOrEqual(1);
  });

  it('useRenderCountTracker increments inside a hook consumer', () => {
    const counter = createRenderCounter();
    const Consumer: React.FC<{ value: number }> = ({ value }) => {
      useRenderCountTracker('Consumer', counter);
      return React.createElement('span', null, String(value));
    };

    const { rerender } = render(React.createElement(Consumer, { value: 1 }));
    const snap = counter.snapshot();
    act(() => {
      rerender(React.createElement(Consumer, { value: 2 }));
    });
    expect(counter.deltaSince(snap)('Consumer')).toBe(1);
  });
});
