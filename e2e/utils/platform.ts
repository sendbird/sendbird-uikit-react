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
    headers: { 'Api-Token': E2E.platformApiToken, 'Content-Type': 'application/json; charset=utf-8' },
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
  operatorIds?: string[];
  name?: string;
  customType?: string;
}): Promise<CreatedChannel> {
  const data = await call('POST', '/group_channels', {
    user_ids: opts.userIds,
    operator_ids: opts.operatorIds ?? [opts.userIds[0]],
    name: opts.name ?? `[e2e] ${runTag}`,
    custom_type: opts.customType ?? runTag,
    is_distinct: false,
  });
  if (!data?.channel_url) throw new Error(`Platform API group_channels returned no channel_url: ${JSON.stringify(data)}`);
  return { url: data.channel_url };
}

export async function sendMessage(channelUrl: string, userId: string, message: string): Promise<number> {
  const data = await call('POST', `/group_channels/${encodeURIComponent(channelUrl)}/messages`, {
    message_type: 'MESG',
    user_id: userId,
    message,
  });
  if (!data?.message_id) throw new Error(`Platform API sendMessage returned no message_id: ${JSON.stringify(data)}`);
  return data.message_id;
}

/** Send a structured mention message so that UIKit renders mention badges. */
export async function sendMentionMessage(
  channelUrl: string,
  senderId: string,
  message: string,
  mentionedUserIds: string[],
): Promise<number> {
  const data = await call('POST', `/group_channels/${encodeURIComponent(channelUrl)}/messages`, {
    message_type: 'MESG',
    user_id: senderId,
    message,
    mention_type: 'USERS',
    mentioned_user_ids: mentionedUserIds,
  });
  if (!data?.message_id) throw new Error(`Platform API sendMentionMessage returned no message_id: ${JSON.stringify(data)}`);
  return data.message_id;
}

/** Seed multiple messages into a group channel; returns an array of { messageId, message }. */
export async function seedMessages(
  channelUrl: string,
  userId: string,
  count: number,
  prefix = '[seed]',
): Promise<Array<{ messageId: number; message: string }>> {
  const results: Array<{ messageId: number; message: string }> = [];
  for (let i = 1; i <= count; i++) {
    const message = `${prefix} ${i}`;
    const messageId = await sendMessage(channelUrl, userId, message);
    results.push({ messageId, message });
  }
  return results;
}

/** Send a thread reply to a parent message in a group channel. */
export async function replyToMessage(
  channelUrl: string,
  parentMessageId: number,
  userId: string,
  message: string,
): Promise<number> {
  const data = await call('POST', `/group_channels/${encodeURIComponent(channelUrl)}/messages`, {
    message_type: 'MESG',
    user_id: userId,
    message,
    parent_message_id: parentMessageId,
    is_reply_to_channel: false,
  });
  if (!data?.message_id) throw new Error(`Platform API replyToMessage returned no message_id: ${JSON.stringify(data)}`);
  return data.message_id;
}

/** Freeze or unfreeze a group channel. */
export async function freezeGroupChannel(channelUrl: string, freeze: boolean): Promise<void> {
  await call('PUT', `/group_channels/${encodeURIComponent(channelUrl)}/freeze`, { freeze });
}

/** Remove a user from a group channel (leave). */
export async function leaveGroupChannel(channelUrl: string, userId: string): Promise<void> {
  await call('PUT', `/group_channels/${encodeURIComponent(channelUrl)}/leave`, { user_ids: [userId] });
}

/** Invite additional users to a group channel. */
export async function inviteUsers(channelUrl: string, userIds: string[]): Promise<void> {
  await call('POST', `/group_channels/${encodeURIComponent(channelUrl)}/invite`, { user_ids: userIds });
}

/** Send a message to an open channel; returns message_id. */
export async function sendOpenChannelMessage(channelUrl: string, userId: string, message: string): Promise<number> {
  const data = await call('POST', `/open_channels/${encodeURIComponent(channelUrl)}/messages`, {
    message_type: 'MESG',
    user_id: userId,
    message,
  });
  if (!data?.message_id) throw new Error(`Platform API sendOpenChannelMessage returned no message_id: ${JSON.stringify(data)}`);
  return data.message_id;
}

/** Seed multiple messages into an open channel. */
export async function seedOpenChannelMessages(
  channelUrl: string,
  userId: string,
  count: number,
  prefix = '[seed]',
): Promise<void> {
  for (let i = 1; i <= count; i++) {
    await sendOpenChannelMessage(channelUrl, userId, `${prefix} ${i}`);
  }
}

/** Update an open channel's name. */
export async function updateOpenChannelName(channelUrl: string, name: string): Promise<void> {
  await call('PUT', `/open_channels/${encodeURIComponent(channelUrl)}`, { name });
}

/** Freeze or unfreeze an open channel. */
export async function freezeOpenChannel(channelUrl: string, freeze: boolean): Promise<void> {
  await call('PUT', `/open_channels/${encodeURIComponent(channelUrl)}/freeze`, { freeze });
}


export async function deleteGroupChannel(url: string): Promise<void> {
  await call('DELETE', `/group_channels/${encodeURIComponent(url)}`);
}

/** Delete every group channel the user belongs to — catches channels created through the app UI. */
export async function deleteUserChannels(userId: string): Promise<void> {
  let token = '';
  do {
    const data = await call('GET', `/users/${encodeURIComponent(userId)}/my_group_channels?limit=100&show_empty=true${token ? `&token=${token}` : ''}`);
    const channels: Array<{ channel_url: string }> = data?.channels ?? [];
    for (const channel of channels) {
      await deleteGroupChannel(channel.channel_url).catch(() => {});
    }
    token = data?.next ?? '';
  } while (token);
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

export async function createOpenChannel(opts: { name?: string; customType?: string; operatorIds?: string[] } = {}): Promise<CreatedChannel> {
  const data = await call('POST', '/open_channels', {
    name: opts.name ?? `[e2e] ${runTag}`,
    custom_type: opts.customType ?? runTag,
    ...(opts.operatorIds && opts.operatorIds.length > 0 ? { operator_ids: opts.operatorIds } : {}),
  });
  if (!data?.channel_url) throw new Error(`Platform API open_channels returned no channel_url: ${JSON.stringify(data)}`);
  return { url: data.channel_url };
}

export async function deleteOpenChannel(url: string): Promise<void> {
  await call('DELETE', `/open_channels/${encodeURIComponent(url)}`);
}

/** Delete every open channel tagged with this run's custom_type. */
export async function sweepRunOpenChannels(): Promise<number> {
  let deleted = 0;
  let token = '';
  do {
    // Send both singular and plural forms: open-channel API may use either depending on version.
    const query = `custom_type=${encodeURIComponent(runTag)}&custom_types=${encodeURIComponent(runTag)}&limit=100${token ? `&token=${token}` : ''}`;
    const data = await call('GET', `/open_channels?${query}`);
    // Client-side filter as safety net in case the server ignores the custom_type param.
    const channels: Array<{ channel_url: string; custom_type?: string }> = (data?.channels ?? [])
      .filter((c: { custom_type?: string }) => c.custom_type === runTag);
    for (const channel of channels) {
      await deleteOpenChannel(channel.channel_url).catch(() => {});
      deleted += 1;
    }
    token = data?.next ?? '';
  } while (token);
  return deleted;
}
