import { expect, type Page, type WebSocketRoute } from '@playwright/test';
import { test } from '../fixtures';
import { appPath } from '../utils/env';

const RETRY_AFTER = 4;
const BUSY = `BUSY${JSON.stringify({ retry_after: RETRY_AFTER, reason_code: 0, message: 'Connection delayed.' })}\n`;
const SOCKET = /^wss:\/\/ws-[^/]+\.sendbird\.com\//;
const MIN_GAP_MS = (RETRY_AFTER - 0.5) * 1000;

type Answer = 'busy' | 'server';

interface Sockets {
  attempts: { at: number; answer: Answer }[];
  pageSides: WebSocketRoute[];
  serverSides: (WebSocketRoute | undefined)[];
}

async function routeSockets(page: Page, answerFor: (attempt: number) => Answer): Promise<Sockets> {
  const sockets: Sockets = { attempts: [], pageSides: [], serverSides: [] };
  await page.routeWebSocket(SOCKET, (ws) => {
    const answer = answerFor(sockets.attempts.length + 1);
    sockets.attempts.push({ at: Date.now(), answer });
    sockets.pageSides.push(ws);
    if (answer === 'server') {
      sockets.serverSides.push(ws.connectToServer());
      return;
    }
    sockets.serverSides.push(undefined);
    ws.onClose((code, reason) => ws.close({ code, reason }));
    setTimeout(() => ws.send(BUSY), 300);
  });
  return sockets;
}

const gapsAfterBusy = ({ attempts }: Sockets) => attempts
  .map((attempt, index) => ({ attempt, next: attempts[index + 1] }))
  .filter(({ attempt, next }) => attempt.answer === 'busy' && next)
  .map(({ attempt, next }) => next.at - attempt.at);

test.describe('connection delayed by the server', () => {
  test('shows a countdown that cannot be dismissed, then loads once the delayed first connection lands', async ({ page, workerUser, createChannel }) => {
    await createChannel();
    const sockets = await routeSockets(page, (attempt) => (attempt === 1 ? 'busy' : 'server'));
    await page.goto(appPath('/group_channel', { userId: workerUser.userId }));

    const modal = page.locator('.sendbird-connection-delayed-modal');
    const time = modal.locator('.sendbird-connection-delayed-modal__time');
    await expect(modal).toBeVisible({ timeout: 30_000 });
    await expect(modal.locator('.sendbird-connection-delayed-modal__title')).toContainText('You\'ll be reconnected shortly.');
    await expect(time).toHaveText(/^00:0[2-4]$/);

    await page.keyboard.press('Escape');
    await page.mouse.click(5, 5);
    await page.waitForTimeout(300);
    await expect(modal).toBeVisible();

    await expect(time).toHaveText('00:01', { timeout: RETRY_AFTER * 1000 });
    await expect(modal).toBeHidden({ timeout: 30_000 });
    await expect(page.locator('.sendbird-channel-preview').first()).toBeVisible({ timeout: 30_000 });
    await expect(
      page.locator('.sendbird-channel-header__title__right__user-id').filter({ hasText: workerUser.userId }),
    ).toBeVisible();
    expect(gapsAfterBusy(sockets)).toHaveLength(1);
    expect(gapsAfterBusy(sockets)[0]).toBeGreaterThanOrEqual(MIN_GAP_MS);
  });

  test('keeps the countdown up while the reconnect is delayed again, and waits out every delay', async ({ page, workerUser, createChannel }) => {
    await createChannel();
    const sockets = await routeSockets(page, (attempt) => (attempt <= 2 ? 'busy' : 'server'));
    await page.goto(appPath('/group_channel', { userId: workerUser.userId }));

    const modal = page.locator('.sendbird-connection-delayed-modal');
    await expect(modal).toBeVisible({ timeout: 30_000 });
    await expect.poll(() => sockets.attempts.length, { timeout: 30_000 }).toBe(2);
    await expect(modal).toBeVisible();
    await expect(modal.locator('.sendbird-connection-delayed-modal__time')).toHaveText(/^00:0[1-4]$/);

    await expect(modal).toBeHidden({ timeout: 30_000 });
    await expect(page.locator('.sendbird-channel-preview').first()).toBeVisible({ timeout: 30_000 });
    expect(gapsAfterBusy(sockets)).toHaveLength(2);
    for (const gap of gapsAfterBusy(sockets)) expect(gap).toBeGreaterThanOrEqual(MIN_GAP_MS);
  });

  test('shows the countdown when a connected user\'s reconnect is delayed, and closes once it lands', async ({ page, workerUser, createChannel }) => {
    await createChannel();
    const sockets = await routeSockets(page, (attempt) => (attempt === 2 ? 'busy' : 'server'));
    await page.goto(appPath('/group_channel', { userId: workerUser.userId }));
    await expect(page.locator('.sendbird-channel-preview').first()).toBeVisible({ timeout: 30_000 });

    await sockets.pageSides[0].close({ code: 4000, reason: 'dropped' });
    await sockets.serverSides[0]?.close();

    const modal = page.locator('.sendbird-connection-delayed-modal');
    await expect(modal).toBeVisible({ timeout: 30_000 });
    await expect(modal).toBeHidden({ timeout: 30_000 });
    await expect(page.locator('.sendbird-channel-preview').first()).toBeVisible();
    expect(gapsAfterBusy(sockets)).toHaveLength(1);
    expect(gapsAfterBusy(sockets)[0]).toBeGreaterThanOrEqual(MIN_GAP_MS);
  });
});
