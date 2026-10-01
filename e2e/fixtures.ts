import { test as base, expect } from '@playwright/test';
import { E2E, hasCreds, runTag } from './utils/env';
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
  /** A throwaway user created for this test alone and deleted when it ends. */
  workerUser: WorkerUser;
  /** A second throwaway user for scenarios that need someone on the other side. */
  secondUser: WorkerUser;
  createChannel: (options?: CreateChannelOptions) => Promise<{ url: string }>;
  createOpenChannel: (options?: { name?: string }) => Promise<{ url: string }>;
  /**
   * A second Playwright Page for Tier-2 realtime/2-user scenarios.
   * The context is blank — callers MUST navigate it with `userId: secondUser.userId`
   * (e.g. `secondPage.goto(appPath('/group_channel', { userId: secondUser.userId }))`).
   */
  secondPage: import('@playwright/test').Page;
}

let userSeq = 0;

/**
 * A user that exists only for one test.
 *
 * A shared user carries whatever earlier tests did to it. Editing a profile renames it for good,
 * and member rows render a nickname — falling back to the id only when the nickname is empty — so
 * every later test looking a user up by id stops finding it. Scope the user to the test instead.
 */
async function useThrowawayUser(suffix: string, workerIndex: number, use: (user: WorkerUser) => Promise<void>): Promise<void> {
  userSeq += 1;
  const userId = `${E2E.userPrefix}-${runTag}-w${workerIndex}${suffix}-${userSeq}`;
  const user: WorkerUser = { userId, nickname: userId };
  await platform.ensureUser(userId, userId);
  await use(user);
  // Delete the user's channels first — including any made through the app UI, which carry no
  // runTag and so are missed by the global sweep — then the user itself.
  await platform.deleteUserChannels(userId).catch(() => {});
  await platform.deleteUser(userId).catch(() => {});
}

export const test = base.extend<E2EFixtures & { requireCreds: void }>({
  requireCreds: [
    // eslint-disable-next-line no-empty-pattern
    async ({}, use, testInfo) => {
      testInfo.skip(!hasCreds, 'Set E2E_APP_ID and E2E_PLATFORM_API_TOKEN to run E2E tests.');
      await use();
    },
    { auto: true },
  ],

  // eslint-disable-next-line no-empty-pattern
  workerUser: async ({}, use, testInfo) => { await useThrowawayUser('', testInfo.workerIndex, use); },

  // eslint-disable-next-line no-empty-pattern
  secondUser: async ({}, use, testInfo) => { await useThrowawayUser('-b', testInfo.workerIndex, use); },

  createChannel: async ({ workerUser }, use) => {
    const created: string[] = [];
    const factory = async (options: CreateChannelOptions = {}) => {
      const allMembers = [workerUser.userId, ...(options.memberIds ?? [])];
      const channel = await platform.createGroupChannel({
        userIds: allMembers,
        name: options.name,
      });
      created.push(channel.url);
      // Specs open the channel and assert on its members straight away; wait for the write to be
      // readable so a slow propagation fails the setup here instead of the assertion later.
      await platform.waitForChannelMembers(channel.url, allMembers);
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
    // eslint-disable-next-line no-void -- declares the secondUser dependency; the page is caller-navigated
    void secondUser;
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
