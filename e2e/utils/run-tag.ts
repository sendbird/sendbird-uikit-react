/// <reference types="node" />
/**
 * A tag unique to this run and developer, shared across all workers so teardown removes only this
 * run's resources. Set once in the main process (imported by playwright.e2e.config.ts before workers
 * spawn) and inherited by worker processes via the environment. Depends only on the USER env var, so
 * it is safe to evaluate before .env.e2e is loaded.
 */
function compute(): string {
  const who = (process.env.USER || process.env.USERNAME || 'ci').replace(/[^a-zA-Z0-9]/g, '').slice(0, 12) || 'ci';
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${who}-${Date.now().toString(36)}-${suffix}`;
}

if (!process.env.E2E_RUN_TAG) process.env.E2E_RUN_TAG = compute();

export const runTag = process.env.E2E_RUN_TAG as string;
