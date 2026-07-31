/// <reference types="node" />
/**
 * Minimal Sendbird Platform API client for E2E setup/teardown — create/delete users and group
 * channels. App-scoped: needs E2E_PLATFORM_API_TOKEN (NOT an org key). Callers guard on
 * hasPlatformToken() so token-less runs simply skip isolation/teardown.
 */
import { E2E, runTag } from './env';

const BASE = `https://api-${E2E.appId}.sendbird.com/v3`;
const USER_ALREADY_EXISTS = '400202';

interface FetchResponse {
  ok: boolean;
  status: number;
  json(): Promise<any>;
  text(): Promise<string>;
}
const doFetch = (globalThis as unknown as {
  fetch: (url: string, init?: unknown) => Promise<FetchResponse>;
}).fetch;

export const hasPlatformToken = (): boolean => Boolean(E2E.appId && E2E.platformApiToken);

async function call(method: string, path: string, body?: unknown): Promise<any> {
  const res = await doFetch(`${BASE}${path}`, {
    method,
    headers: { 'Api-Token': E2E.platformApiToken, 'Content-Type': 'application/json; charset=utf8' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok && res.status !== 404) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Platform API ${method} ${path} -> ${res.status} ${detail}`);
  }
  return res.status === 404 ? null : res.json().catch(() => null);
}

export async function ensureUser(userId: string, nickname = userId): Promise<void> {
  try {
    await call('POST', '/users', { user_id: userId, nickname, profile_url: '' });
  } catch (error) {
    if (!String(error).includes(USER_ALREADY_EXISTS)) throw error;
  }
}

export async function deleteUser(userId: string): Promise<void> {
  await call('DELETE', `/users/${encodeURIComponent(userId)}`);
}

export interface CreatedChannel {
  url: string;
}

export async function createGroupChannel(opts: {
  userIds: string[];
  name?: string;
  customType?: string;
}): Promise<CreatedChannel> {
  const data = await call('POST', '/group_channels', {
    user_ids: opts.userIds,
    name: opts.name ?? `[e2e] ${runTag}`,
    custom_type: opts.customType ?? runTag,
    is_distinct: false,
  });
  return { url: data.channel_url };
}

export async function sendMessage(channelUrl: string, userId: string, message: string): Promise<void> {
  await call('POST', `/group_channels/${encodeURIComponent(channelUrl)}/messages`, {
    message_type: 'MESG',
    user_id: userId,
    message,
  });
}

export async function deleteGroupChannel(url: string): Promise<void> {
  await call('DELETE', `/group_channels/${encodeURIComponent(url)}`);
}

/** Delete every group channel tagged with this run's custom_type — backstop for orphaned channels. */
export async function sweepRunChannels(): Promise<number> {
  let deleted = 0;
  let token = '';
  do {
    const query = `custom_types=${encodeURIComponent(runTag)}&limit=100&show_empty=true${token ? `&token=${token}` : ''}`;
    const data = await call('GET', `/group_channels?${query}`);
    const channels: Array<{ channel_url: string }> = data?.channels ?? [];
    for (const channel of channels) {
      await deleteGroupChannel(channel.channel_url).catch(() => {});
      deleted += 1;
    }
    token = data?.next ?? '';
  } while (token);
  return deleted;
}
