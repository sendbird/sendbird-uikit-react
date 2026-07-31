import { test as base, expect } from '@playwright/test';
import { E2E, runTag } from './utils/env';
import * as platform from './utils/platform';

export interface WorkerUser {
  userId: string;
  nickname: string;
}

export interface CreateChannelOptions {
  name?: string;
  invite?: string[];
  seedMessage?: string | null;
}

export interface E2EFixtures {
  createChannel: (options?: CreateChannelOptions) => Promise<{ url: string }>;
  createOpenChannel: (options?: { name?: string }) => Promise<{ url: string }>;
}

export interface E2EWorkerFixtures {
  workerUser: WorkerUser;
  secondUser: WorkerUser;
}

async function useThrowawayUser(suffix: string, workerIndex: number, use: (user: WorkerUser) => Promise<void>): Promise<void> {
  const userId = `${E2E.userPrefix}-${runTag}-w${workerIndex}${suffix}`;
  const user: WorkerUser = { userId, nickname: userId };
  if (platform.hasPlatformToken()) await platform.ensureUser(userId, userId).catch(() => {});
  await use(user);
  if (platform.hasPlatformToken()) {
    await platform.deleteUserChannels(userId).catch(() => {});
    await platform.deleteUser(userId).catch(() => {});
  }
}

export const test = base.extend<E2EFixtures, E2EWorkerFixtures>({
  // eslint-disable-next-line no-empty-pattern
  workerUser: [async ({}, use, workerInfo) => useThrowawayUser('', workerInfo.workerIndex, use), { scope: 'worker' }],

  // eslint-disable-next-line no-empty-pattern
  secondUser: [async ({}, use, workerInfo) => useThrowawayUser('-b', workerInfo.workerIndex, use), { scope: 'worker' }],

  createChannel: async ({ workerUser }, use) => {
    const created: string[] = [];
    const factory = async (options: CreateChannelOptions = {}) => {
      const channel = await platform.createGroupChannel({
        userIds: [workerUser.userId, ...(options.invite ?? [])],
        name: options.name,
      });
      created.push(channel.url);
      const seedMessage = options.seedMessage === undefined ? '[e2e] channel ready' : options.seedMessage;
      if (seedMessage) await platform.sendMessage(channel.url, workerUser.userId, seedMessage);
      return channel;
    };
    await use(factory);
    for (const url of created) {
      await platform.deleteGroupChannel(url).catch(() => {});
    }
  },

  // eslint-disable-next-line no-empty-pattern
  createOpenChannel: async ({}, use) => {
    const created: string[] = [];
    const factory = async (options: { name?: string } = {}) => {
      const channel = await platform.createOpenChannel({ name: options.name });
      created.push(channel.url);
      return channel;
    };
    await use(factory);
    for (const url of created) {
      await platform.deleteOpenChannel(url).catch(() => {});
    }
  },

  page: async ({ page }, use) => {
    if (E2E.accessToken) {
      await page.addInitScript({
        content: `try { sessionStorage.setItem('sb:e2e:accessToken', ${JSON.stringify(E2E.accessToken)}); } catch (e) {}`,
      });
    }
    await use(page);
  },
});

export { expect };
