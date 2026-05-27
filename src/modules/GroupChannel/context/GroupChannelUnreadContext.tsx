/**
 * React context for the GroupChannel unread reducer store.
 *
 * Phase 5.1.b of the P0 runtime-coupling refactor (Plan §5.1.b).
 *
 * The store itself lives in `GroupChannelManager` (see
 * `GroupChannelProvider.tsx`) — this context is the read boundary:
 * consumers subscribe via `useUnreadSelector` rather than touching the
 * store directly.
 *
 * Module-private — NOT re-exported from `src/index.ts`. BC-2 verifies the
 * public dts export set is unchanged.
 */
import { createContext } from 'react';
import type { Store } from '../../../utils/storeManager';
import type { UnreadState } from '../internal/unread/model';

export const GroupChannelUnreadContext = createContext<Store<UnreadState> | null>(null);
