/**
 * Narrow-slice subscription hook over the unread reducer store.
 *
 * Phase 5.1.b of the P0 runtime-coupling refactor (Plan §5.1.b).
 *
 * Wraps `useStoreSelector` with the module-private
 * `GroupChannelUnreadContext`. Selectors should be **module-level
 * functions or `useCallback`-stabilized** — inline arrow selectors that
 * close over render-scope variables can produce stale-on-first-commit
 * results because the memo cache only re-runs the selector when the raw
 * snapshot reference changes (see `useStoreSelector` JSDoc).
 *
 * Internal — NOT re-exported from `src/index.ts`.
 */
import { useStoreSelector, type EqualityFn } from '../../../../hooks/useStore';
import type { UnreadState } from '../../internal/unread/model';
import { GroupChannelUnreadContext } from '../GroupChannelUnreadContext';

export function useUnreadSelector<TSelected>(
  selector: (state: UnreadState) => TSelected,
  equalityFn?: EqualityFn<TSelected>,
): TSelected {
  return useStoreSelector(GroupChannelUnreadContext, selector, equalityFn);
}
