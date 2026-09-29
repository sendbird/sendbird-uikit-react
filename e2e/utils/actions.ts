import { expect, Locator, Page } from '@playwright/test';
import { appPath } from './env';
import { OPERATOR_ROLE_TIMEOUT, SERVER_RESPONSE_TIMEOUT } from './constants';

/** Open /group_channel and enter the first channel; resolves once the conversation is visible. */
export async function openFirstGroupChannel(page: Page, params: Record<string, string | undefined> = {}) {
  await page.goto(appPath('/group_channel', params));
  await page.locator('.sendbird-channel-preview').first().click({ timeout: 30_000 });
  await expect(page.locator('.sendbird-conversation')).toBeVisible({ timeout: 15_000 });
}

/**
 * Locate a *confirmed* message bubble by its (unique) text. Pending copies carry
 * data-sb-message-id="0" and have no edit/delete menu, so they are excluded.
 */
export function messageByText(page: Page, text: string): Locator {
  return page
    .locator('[data-testid="sendbird-message-view"][data-sb-message-id]:not([data-sb-message-id="0"])')
    .filter({ hasText: text });
}

/** Type text into the conversation composer, send it, and wait until the server confirms it.
 *  Works for both group channels (uses sendbird-message-view testid) and open channels (fallback).
 *  ALWAYS ensures the message is confirmed (non-pending) before returning for GC messages. */
export async function sendText(page: Page, text: string) {
  const input = page.locator('.sendbird-message-input [role="textbox"]').first();
  await input.click();
  await input.pressSequentially(text);
  await input.press('Enter');
  const gcMsg = messageByText(page, text);
  // Check for GC confirmation (data-sb-message-id != 0); keep short to avoid test timeout
  const isGC = await gcMsg.isVisible({ timeout: 5_000 }).catch(() => false);
  if (!isGC) {
    // Open channel message or GC message still pending — confirm via visible text
    await expect(page.getByText(text).first()).toBeVisible({ timeout: 5_000 });
    // An open channel message keeps a pending tail until the server confirms it, and its context
    // menu offers Edit/Delete only after that clears. Callers act on the message straight away.
    await expect(
      page.locator('.sendbird-openchannel-user-message').filter({ hasText: text })
        .locator('.sendbird-openchannel-user-message__right__tail__pending'),
    ).toHaveCount(0, { timeout: SERVER_RESPONSE_TIMEOUT });
  }
}

/**
 * Hover a user-list row and open its action menu.
 *
 * The trigger only mounts on hover, so clicking straight after the hover races the render — and a
 * swallowed miss surfaces later as a confusing failure on the menu item instead.
 */
export async function openUserRowMenu(row: Locator) {
  await row.hover();
  const trigger = row.locator(
    '.sendbird-user-list-item--small__action, .sendbird-user-list-item__action',
  ).first();
  await expect(trigger).toBeVisible({ timeout: 10_000 });
  await trigger.click();
}

/** Hover a confirmed message and open its action menu (kebab). Works for both GC and OC. */
export async function openMessageMenu(page: Page, text: string) {
  const gcMsg = messageByText(page, text);
  // sendText guarantees GC messages are confirmed — short check should succeed immediately
  const isGC = await gcMsg.isVisible({ timeout: 3_000 }).catch(() => false);
  if (isGC) {
    await gcMsg.hover();
    await gcMsg.locator('.sendbird-message-menu').getByRole('button').first().click();
    return;
  }
  // Check open channel container (longer timeout for parallel execution)
  const ocMsg = page.locator('.sendbird-openchannel-user-message').filter({ hasText: text }).first();
  const isOC = await ocMsg.isVisible({ timeout: 8_000 }).catch(() => false);
  if (isOC) {
    await ocMsg.hover();
    // The trigger only mounts on hover; clicking before it paints leaves the menu closed.
    const trigger = ocMsg.locator(
      '.sendbird-openchannel-user-message__context-menu--icon, .sendbird-openchannel-user-message__context-menu button, .sendbird-message-menu button',
    ).first();
    await expect(trigger).toBeVisible({ timeout: 10_000 });
    await trigger.click();
    return;
  }
  // GC message still pending confirmation — hover text and find menu at page level
  const textEl = page.getByText(text).first();
  await expect(textEl).toBeVisible({ timeout: 10_000 });
  await textEl.hover();
  await page.locator('.sendbird-message-menu').getByRole('button').first().click({ timeout: 5_000 });
}

/** Open the message search panel (click the search icon in the chat header). */
export async function openSearch(page: Page) {
  await page.locator('.sendbird-chat-header__right__search').click();
  await expect(page.locator('.sendbird-message-search')).toBeVisible({ timeout: 10_000 });
}

/** Type a keyword into the search box and wait for results (or empty state). */
export async function searchFor(page: Page, keyword: string, timeoutMs = 30_000) {
  const input = page.locator('.sendbird-message-search-pannel__input__container input');
  await input.fill(keyword);
  await input.press('Enter');
  // wait for either results or the no-result placeholder
  await page.locator('.sendbird-message-search-pannel__list, .sendbird-message-search-pannel__placeholder')
    .first()
    .waitFor({ timeout: timeoutMs });
}

/** Open the thread panel from a confirmed message by clicking the Reply (thread) menu item. */
export async function openThread(page: Page, messageText: string) {
  await openMessageMenu(page, messageText);
  await page.getByRole('menuitem', { name: /reply in thread/i }).click();
  await expect(page.locator('.sendbird-thread-ui')).toBeVisible({ timeout: 10_000 });
}

/** Open the channel settings panel. */
export async function openChannelSettings(page: Page) {
  await page.locator('.sendbird-chat-header__right__info').click();
  await expect(page.locator('.sendbird-channel-settings')).toBeVisible({ timeout: 10_000 });
}

/**
 * Navigate to /open_channel and click the first preview matching `channelName`.
 * Resolves once the open-channel conversation header is visible.
 */
export async function openNamedOpenChannel(page: Page, channelName: string, params: Record<string, string | undefined> = {}) {
  await page.goto(appPath('/open_channel', params));
  await page.getByText(channelName).first().click({ timeout: 30_000 });
  await expect(page.locator('.sendbird-openchannel-conversation-header')).toBeVisible({ timeout: 15_000 });
  // The header paints before the history arrives, so callers that read messages would be looking
  // at a list that has not loaded yet.
  await expect(page.locator('.sendbird-openchannel-conversation-scroll__container')).toBeVisible({ timeout: 15_000 });
}

/** Accordion panel ids rendered by the open channel settings operator view. */
type OperatorAccordionId = 'operators' | 'participants' | 'mutedMembers' | 'bannedUsers';

/**
 * Drive one accordion panel header to `open`.
 *
 * The header toggles, so clicking one that is already open collapses it. The chevron carries the
 * state — its `--open` class is in the DOM only while the panel is expanded — so read that first.
 */
async function setAccordion(header: Locator, open: boolean) {
  const openChevron = header.locator('.sendbird-accordion__panel-icon--open');

  for (let attempt = 0; attempt < 3; attempt++) {
    const isOpen = await openChevron.isVisible({ timeout: 1_000 }).catch(() => false);
    if (isOpen === open) return;
    await header.click();
  }

  if (open) {
    await expect(openChevron).toBeVisible({ timeout: 5_000 });
  } else {
    await expect(openChevron).toBeHidden({ timeout: 5_000 });
  }
}

/** Close the open channel settings panel through its own close icon. Escape does not close it. */
async function closeOpenChannelSettings(page: Page) {
  const close = page.locator('.sendbird-openchannel-settings__close-icon');
  if (await close.isVisible({ timeout: 1_000 }).catch(() => false)) await close.click();
  await expect(page.locator('.sendbird-openchannel-settings')).toBeHidden({ timeout: 5_000 });
}

/**
 * Open an open channel's settings panel as its operator and expand one of its accordions.
 *
 * The operator view renders only once the client has the operator role, which arrives after the
 * panel first paints. The conversation header trigger only opens the panel — it is not a toggle —
 * so forcing that re-read means closing the panel from its own close icon. The final state is
 * asserted, so a role that never arrives fails the test instead of passing it quietly.
 */
export async function openOperatorAccordion(page: Page, id: OperatorAccordionId) {
  const settings = page.locator('.sendbird-openchannel-settings');
  const header = page.locator(`#${id}`);

  // Closing happens at the top of the next pass, never after the last one, so the panel is open
  // when the assertion below runs — a wait against a closed panel could only ever time out.
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) {
      await closeOpenChannelSettings(page);
      await page.waitForTimeout(1_500);
    }
    const panelOpen = await settings.isVisible({ timeout: 1_000 }).catch(() => false);
    if (!panelOpen) {
      await page.locator('.sendbird-openchannel-conversation-header__right__trigger').click();
      await expect(settings).toBeVisible({ timeout: 5_000 });
    }
    if (await header.isVisible({ timeout: 5_000 }).catch(() => false)) break;
  }

  await expect(header).toBeVisible({ timeout: OPERATOR_ROLE_TIMEOUT });
  await setAccordion(header, true);
}

export async function openOperatorParticipants(page: Page) {
  await openOperatorAccordion(page, 'participants');
}

/**
 * Open one of the channel-settings accordions and leave it open.
 *
 * Only one accordion is open at a time and its panel item toggles, so clicking the one already
 * open collapses it. The row locators are not scoped to a panel and cannot tell one accordion's
 * rows from another's; the chevron on the item itself carries the state, so read that.
 *
 * `label` is anchored because the panel items match loosely — "Members" is a substring of both
 * "Muted members" and "Banned users" is not, but the first two would otherwise collide.
 */
export async function openSettingsAccordion(page: Page, label: RegExp) {
  const item = page.locator('.sendbird-channel-settings__panel-item').filter({ hasText: label }).first();
  await expect(item).toBeVisible({ timeout: 10_000 });
  await setAccordion(item, true);
}

/**
 * Read one channel-settings accordion's list again.
 *
 * Collapsing unmounts the list and expanding mounts a fresh one that runs its own query, so the
 * pair is what picks up a moderation change the panel has not been told about.
 */
export async function refreshSettingsAccordion(page: Page, label: RegExp) {
  const item = page.locator('.sendbird-channel-settings__panel-item').filter({ hasText: label }).first();
  await expect(item).toBeVisible({ timeout: 10_000 });
  await setAccordion(item, false);
  await setAccordion(item, true);
}

/**
 * Type an @mention in the composer, pick `targetUserId` from the suggestion list, and send.
 *
 * A mention sent through the Platform API reaches the client without `mentioned_users`, and UIKit
 * renders a mention only when the message carries both the template and the users — so a mention
 * has to come from the composer to render at all.
 */
export async function sendMentionFromComposer(page: Page, targetUserId: string, text: string) {
  const input = page.locator('.sendbird-message-input [role="textbox"]').first();
  await input.click();
  await input.pressSequentially('@');

  const suggestion = page
    .locator('.sendbird-mention-suggest-list__user-item, [class*="mention-suggest"] [class*="item"]')
    .filter({ hasText: targetUserId })
    .first();
  await expect(suggestion).toBeVisible({ timeout: 10_000 });
  await suggestion.click();

  await input.pressSequentially(` ${text}`);
  await input.press('Enter');
}

export interface AttachedFile {
  name: string;
  mimeType: string;
  buffer: Buffer;
}

/**
 * Attach files through the composer's attach button and send them.
 *
 * Writing straight to the hidden input races the handler behind it: the change handler stages
 * files in composer mode and uploads them otherwise, and drops them without a word when neither
 * branch is ready. Going through the attach button means the picker only opens once the composer
 * is wired. A composer that stages shows a send button; one that uploads on pick shows none.
 */
export async function attachFiles(page: Page, files: AttachedFile[]) {
  const attach = page.locator('.sendbird-message-input--attach');
  await expect(attach).toBeVisible({ timeout: 15_000 });

  const [chooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    attach.click(),
  ]);
  await chooser.setFiles(files);

  const send = page.locator('.sendbird-message-input--send');
  if (await send.isVisible({ timeout: 5_000 }).catch(() => false)) await send.click();
}

/**
 * Open the participants accordion and return the row for `userId`.
 *
 * The list is read when the accordion mounts and the settings panel does not watch for anyone
 * entering, so somebody who joined moments ago shows up only once the list is read again.
 */
export async function openParticipantRow(page: Page, userId: string): Promise<Locator> {
  const row = page.locator('.sendbird-participants-accordion__member').filter({ hasText: userId }).first();
  await openOperatorParticipants(page);

  for (let attempt = 0; attempt < 3; attempt++) {
    if (await row.isVisible({ timeout: 5_000 }).catch(() => false)) return row;
    await refreshParticipants(page);
  }

  await expect(row).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
  return row;
}

/**
 * Read one operator accordion's list again.
 *
 * Collapsing an accordion unmounts its list; expanding it mounts a fresh one that runs its own
 * query. The collapse/expand pair is what picks up a change, and it leaves the panel open, so the
 * rows are on screen when this returns.
 */
export async function refreshOperatorAccordion(page: Page, id: OperatorAccordionId) {
  await openOperatorAccordion(page, id);
  const header = page.locator(`#${id}`);
  await setAccordion(header, false);
  await setAccordion(header, true);
}

export async function refreshParticipants(page: Page) {
  await refreshOperatorAccordion(page, 'participants');
}

/**
 * Create an open channel through the app and wait until it is the channel on screen.
 *
 * The open channel list API leaves operators out unless the application asks for them, and the SDK
 * caches what it got — so a channel first seen through the list carries an empty operator list and
 * the settings panel offers the participant view. A channel created here comes back complete, which
 * is what an operator's own session looks like. Cases that need the operator view start from here.
 */
export async function createOpenChannelViaUI(page: Page, name: string) {
  await page.locator('.sendbird-open-channel-list-ui__header__button-create-channel').click({ timeout: 15_000 });

  const nameInput = page
    .locator('[name="sendbird-create-open-channel-ui__profile-input__name-section__input"]')
    .first();
  await expect(nameInput).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
  await nameInput.fill(name);
  await page.getByRole('button', { name: /^create$/i }).last().click();

  await expect(page.locator('.sendbird-openchannel-conversation-header').getByText(name))
    .toBeVisible({ timeout: 15_000 });
}
