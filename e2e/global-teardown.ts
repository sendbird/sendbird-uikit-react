/// <reference types="node" />
/**
 * Backstop teardown: after the run, delete any group channels still tagged with this run's
 * custom_type (orphans left by crashed tests). The per-test and per-worker fixtures already clean
 * their own channels/users; this only catches leftovers. No-op without a Platform API token.
 */
import { hasPlatformToken, sweepRunChannels } from './utils/platform';
import { runTag } from './utils/env';

export default async function globalTeardown(): Promise<void> {
  if (!hasPlatformToken()) return;
  try {
    const deleted = await sweepRunChannels();
    if (deleted > 0) {
      // eslint-disable-next-line no-console
      console.log(`[e2e globalTeardown] swept ${deleted} leftover channel(s) for run ${runTag}`);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('[e2e globalTeardown] sweep skipped:', error instanceof Error ? error.message : error);
  }
}
