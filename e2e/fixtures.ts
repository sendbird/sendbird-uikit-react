import { test as base, expect } from '@playwright/test';
import { E2E, runTag } from './utils/env';
import * as platform from './utils/platform';

export interface WorkerUser {
  userId: string;
  nickname: string;
}

export interface CreateChannelOptions {
  name?: string;
  /** Seed message sent after channel creation. Pass `null` to skip. Defaults to '[e2e] channel ready'. */
  seedMessage?: string | null;
  /** Freeze the channel after creation. */
  freeze?: boolean;
  /** Additional member user IDs to invite (beyond workerUser). */
  memberIds?: string[];
}

export interface E2EFixtures {
  createChannel: (options?: CreateChannelOptions) => Promise<{ url: string }>;
  createOpenChannel: (options?: { name?: string }) => Promise<{ url: string }>;
  /**
   * A second Playwright Page for Tier-2 realtime/2-user scenarios.
   * The context is blank — callers MUST navigate it with `userId: secondUser.userId`
   * (e.g. `secondPage.goto(appPath('/group_channel', { userId: secondUser.userId }))`).
   */
  secondPage: import('@playwright/test').Page;
}

export interface E2EWorkerFixtures {
  workerUser: WorkerUser;
  secondUser: WorkerUser;
}

async function useThrowawayUser(suffix: string, workerIndex: number, use: (user: WorkerUser) => Promise<void>): Promise<void> {
  const userId = `${E2E.userPrefix}-${runTag}-w${workerIndex}${suffix}`;
  const user: WorkerUser = { userId, nickname: userId };
  if (platform.hasPlatformToken()) await platform.ensureUser(userId, userId);
  await use(user);
  if (platform.hasPlatformToken()) {
    // Delete the user's channels first — including any made through the app UI, which carry no
    // runTag and so are missed by the global sweep — then the user itself.
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
      const allMembers = [workerUser.userId, ...(options.memberIds ?? [])];
      const channel = await platform.createGroupChannel({
        userIds: allMembers,
        name: options.name,
      });
      created.push(channel.url);
      const seedMessage = options.seedMessage === undefined ? '[e2e] channel ready' : options.seedMessage;
      if (seedMessage) await platform.sendMessage(channel.url, workerUser.userId, seedMessage);
      if (options.freeze) await platform.freezeGroupChannel(channel.url, true);
      return channel;
    };
    await use(factory);
    for (const url of created) {
      await platform.deleteGroupChannel(url).catch(() => {});
    }
  },

  secondPage: async ({ browser, secondUser }, use) => {
    const ctx = await browser.newContext();
    const pg = await ctx.newPage();
    await use(pg);
    // Give the secondUser page a chance to navigate before closing
    await ctx.close().catch(() => {});
    void secondUser; // referenced for type resolution
  },

  createOpenChannel: async ({ workerUser }, use) => {
    const created: string[] = [];
    const factory = async (options: { name?: string } = {}) => {
      const channel = await platform.createOpenChannel({
        name: options.name,
        operatorIds: [workerUser.userId],
      });
      created.push(channel.url);
      return channel;
    };
    await use(factory);
    for (const url of created) {
      await platform.deleteOpenChannel(url).catch(() => {});
    }
  },
});

export { expect };
