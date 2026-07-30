import { test as base, expect } from '@playwright/test';
import { E2E } from './utils/env';

export const test = base.extend({
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
