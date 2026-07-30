/// <reference types="node" />
/**
 * E2E credentials + URL helpers.
 *
 * apps/testing reads all connection + feature config from URL query params
 * (apps/testing/src/utils/paramsBuilder.ts), so E2E drives the app entirely via the URL and never
 * modifies it. Credentials come from env (loaded in playwright.e2e.config.ts).
 */

export const E2E = {
  appId: process.env.E2E_APP_ID ?? '',
  userId: process.env.E2E_USER_ID ?? '',
  accessToken: process.env.E2E_ACCESS_TOKEN ?? '',
  /** Second user (seeded in global-setup) for invite/create and send/receive scenarios. */
  userId2: process.env.E2E_USER_ID_2 || 'e2e-user-2',
};

/** Minimum credentials to hit a real backend are present. */
export const hasCreds = Boolean(E2E.appId && E2E.userId);

type AppRoute = '/' | '/group_channel' | '/open_channel';

/**
 * Build an apps/testing URL with connection params (+ optional feature flags) as a query string.
 * Feature-flag keys match apps/testing/src/utils/paramsBuilder.ts, e.g.
 * { groupChannel_enableReactions: 'true', groupChannel_replyType: 'QUOTE_REPLY' }.
 */
export function appPath(route: AppRoute, params: Record<string, string | undefined> = {}): string {
  const query = new URLSearchParams();
  if (E2E.appId) query.set('appId', E2E.appId);
  if (E2E.userId) query.set('userId', E2E.userId);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) query.set(key, value);
  }
  const qs = query.toString();
  return qs ? `${route}?${qs}` : route;
}
