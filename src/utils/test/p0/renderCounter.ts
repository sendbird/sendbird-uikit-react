/**
 * Render-count instrumentation for Phase 0 characterization and refactor
 * verification tests.
 *
 * Test-only utility — production bundle never imports this. Lives outside
 * `__tests__/` so jest does not interpret it as a test suite.
 *
 * Usage:
 *   const counter = createRenderCounter();
 *   const Wrapped = withRenderCount('MessageList', MessageList, counter);
 *   render(<Wrapped {...props} />);
 *   expect(counter.count('MessageList')).toBe(1);
 *
 *   // act() — trigger an update
 *   expect(counter.deltaSince(snapshot)('MessageList')).toBe(1);
 */
import * as React from 'react';

export type RenderCounter = {
  count(name: string): number;
  reset(): void;
  snapshot(): Record<string, number>;
  deltaSince(prev: Record<string, number>): (name: string) => number;
  trackedNames(): string[];
};

export function createRenderCounter(): RenderCounter {
  const counts = new Map<string, number>();

  const increment = (name: string) => {
    counts.set(name, (counts.get(name) ?? 0) + 1);
  };

  const counter: RenderCounter & { __increment?: (name: string) => void } = {
    count: (name) => counts.get(name) ?? 0,
    reset: () => counts.clear(),
    snapshot: () => Object.fromEntries(counts.entries()),
    deltaSince: (prev) => (name) => (counts.get(name) ?? 0) - (prev[name] ?? 0),
    trackedNames: () => Array.from(counts.keys()),
  };

  // Internal hook for withRenderCount; not part of public API surface.
  (counter as { __increment: (name: string) => void }).__increment = increment;

  return counter;
}

/**
 * Wrap a component so every render increments the counter for `name`.
 *
 * Implementation notes:
 *   - Increments inside the render phase (synchronously). React 18 strict mode
 *     double-invokes function components during dev — characterization tests
 *     should account for this by measuring deltas and either disabling
 *     StrictMode in the test root or treating the doubled count as baseline.
 *   - Returns a memoization-free wrapper. If the wrapped component is memo'd,
 *     the counter still increments on every parent rerender attempt at the
 *     wrapper layer. To measure actual re-renders of a memoized child, wrap
 *     the inner component instead.
 */
export function withRenderCount<P>(
  name: string,
  Component: React.ComponentType<P>,
  counter: RenderCounter,
): React.ComponentType<P> {
  const Wrapped: React.FC<P> = (props) => {
    (counter as unknown as { __increment: (n: string) => void }).__increment(name);
    return React.createElement(Component as React.ComponentType<unknown>, props as unknown as object);
  };
  Wrapped.displayName = `WithRenderCount(${name})`;
  return Wrapped as React.ComponentType<P>;
}

/**
 * Hook-form counter for cases where wrapping is awkward (e.g. measuring a
 * hook consumer's render count without exporting a component).
 */
export function useRenderCountTracker(name: string, counter: RenderCounter): void {
  (counter as unknown as { __increment: (n: string) => void }).__increment(name);
}
