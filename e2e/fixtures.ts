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
}

export interface E2EWorkerFixtures {
  workerUser: WorkerUser;
}

export const test = base.extend<E2EFixtures, E2EWorkerFixtures>({
  // eslint-disable-next-line no-empty-pattern
  workerUser: [async ({}, use, workerInfo) => {
    const userId = `${E2E.userPrefix}-${runTag}-w${workerInfo.workerIndex}`;
    const workerUser: WorkerUser = { userId, nickname: userId };
    if (platform.hasPlatformToken()) {
      await platform.ensureUser(userId, userId).catch(() => {});
    }
    await use(workerUser);
    if (platform.hasPlatformToken()) {
      await platform.deleteUser(userId).catch(() => {});
    }
  }, { scope: 'worker' }],

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
