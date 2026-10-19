/// <reference types="node" />
/**
 * Backstop teardown: after the run, delete any group and open channels still tagged with this run's
 * custom_type, open channels named with it (orphans left by crashed tests), and users this run created
 * along with their group channels. The per-test fixtures already clean their own channels/users; this
 * only catches leftovers. No-op without a Platform API token.
 */
import { hasPlatformToken, sweepRunChannels, sweepRunOpenChannels, sweepRunUsers } from './utils/platform';
import { runTag } from './utils/env';

export default async function globalTeardown(): Promise<void> {
  if (!hasPlatformToken()) return;
  const warn = (label: string, err: unknown) => {
    // eslint-disable-next-line no-console
    console.warn(`[e2e globalTeardown] ${label} sweep failed:`, err instanceof Error ? err.message : err);
  };
  const groupDeleted = await sweepRunChannels().catch((e) => { warn('group channel', e); return 0; });
  const openDeleted = await sweepRunOpenChannels().catch((e) => { warn('open channel', e); return 0; });
  const deleted = groupDeleted + openDeleted;
  if (deleted > 0) {
    // eslint-disable-next-line no-console
    console.log(`[e2e globalTeardown] swept ${deleted} leftover channel(s) for run ${runTag}`);
  }
  const usersDeleted = await sweepRunUsers().catch((e) => { warn('user', e); return 0; });
  if (usersDeleted > 0) {
    // eslint-disable-next-line no-console
    console.log(`[e2e globalTeardown] swept ${usersDeleted} leftover user(s) for run ${runTag}`);
  }
}
