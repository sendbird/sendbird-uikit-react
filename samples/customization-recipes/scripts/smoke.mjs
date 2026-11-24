// Production smoke test for every recipe page.
// Run `npm run build` first. The script serves ./dist on loopback, blocks all other network
// requests, and checks each recipe at 1280px and 390px in Chromium.
// Set SMOKE_REPORT=<file> to write the full JSON result.
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { preview } from 'vite';

const root = fileURLToPath(new URL('..', import.meta.url));
const require = createRequire(join(root, 'package.json'));
const widths = [1280, 390];
const report = { versions: {}, publicImports: [], scenarios: [], blocked: [] };

// 1. Published entry points and pinned versions -------------------------------------------
const pkg = require('./package.json');
const installed = name => require(`${name}/package.json`);
for (const name of ['@sendbird/uikit-react', '@sendbird/chat', 'react', 'react-dom']) {
  report.versions[name] = installed(name).version;
  assert.equal(report.versions[name], pkg.dependencies[name], `${name} must match the pinned version`);
}

const topicDirs = (await readdir(root, { withFileTypes: true }))
  .filter(entry => entry.isDirectory() && entry.name !== 'dist' && existsSync(join(root, entry.name, 'index.html')))
  .map(entry => entry.name).sort();
const sourceFiles = [];
for (const dir of topicDirs) {
  for (const file of await readdir(join(root, dir), { recursive: true })) {
    if (/\.tsx?$/.test(file)) sourceFiles.push(join(dir, file));
  }
}
const specifiers = new Set();
for (const file of sourceFiles) {
  const text = await readFile(join(root, file), 'utf8');
  for (const [, specifier] of text.matchAll(/(?:from|import)\s+'(@sendbird\/[^']+)'/g)) specifiers.add(specifier);
}
function exportedSubpath(specifier) {
  const [scope, name, ...rest] = specifier.split('/');
  const exports = installed(`${scope}/${name}`).exports;
  const subpath = rest.length ? `./${rest.join('/')}` : '.';
  return { exports, subpath };
}
for (const specifier of [...specifiers].sort()) {
  const { exports, subpath } = exportedSubpath(specifier);
  assert.ok(exports[subpath], `${specifier} is not a published entry point`);
  report.publicImports.push(specifier);
}
// Legacy modules that the upgrade recipe tells readers to migrate are still published in 3.20.1,
// and MessageBody is only reachable as a named export of ui/MessageContent.
const uikitExports = installed('@sendbird/uikit-react').exports;
for (const legacy of ['./Channel', './Channel/context', './ChannelList', './ChannelList/context', './App']) {
  assert.ok(uikitExports[legacy], `legacy entry ${legacy} should be published`);
}
assert.equal(uikitExports['./ui/MessageBody'], undefined);

// UIKit groups consecutive messages by their formatted DATE_FORMAT__MESSAGE_CREATED_AT, so the timestamp
// recipe's provider-wide format splits two same-minute messages that the stock format groups.
const { isSameGroup } = await import('@sendbird/uikit-react/Channel/utils/compareMessagesForGrouping');
const { LabelStringSet } = await import('@sendbird/uikit-react/ui/Label');
const timestampSource = await readFile(join(root, 'message-timestamp-and-reaction/integration.tsx'), 'utf8');
const timeFormatMatch = /DATE_FORMAT__MESSAGE_CREATED_AT:\s*(['"\x60])([^'"\x60\r\n]+)\1/.exec(timestampSource);
assert.ok(timeFormatMatch, 'timestamp recipe must provide a literal DATE_FORMAT__MESSAGE_CREATED_AT');
const groupingMessage = (second, millisecond = 0) => ({
  messageType: 'user', sendingStatus: 'succeeded', sender: { userId: 'other' },
  createdAt: new Date(2026, 10, 19, 13, 34, second, millisecond).getTime(),
});
const first = groupingMessage(5);
const laterSecond = groupingMessage(40);
const sameSecond = groupingMessage(5, 400);
const recipeStringSet = { DATE_FORMAT__MESSAGE_CREATED_AT: timeFormatMatch[2] };
report.messageGrouping = {
  stockFormat: isSameGroup(first, laterSecond, LabelStringSet),
  recipeFormat: isSameGroup(first, laterSecond, recipeStringSet),
  recipeSameSecond: isSameGroup(first, sameSecond, recipeStringSet),
};
assert.deepEqual(report.messageGrouping, { stockFormat: true, recipeFormat: false, recipeSameSecond: true });

// 2. Browser scenarios against the production build ---------------------------------------
const scenarios = {
  'message-timestamp-and-reaction': async ({ page, url, step }) => {
    await page.goto(url);
    const preview = page.getByRole('region', { name: 'Message preview' });
    const placement = element => ({ tag: element.tagName, className: element.className, parentClass: element.parentElement.className });
    let before;
    await step('default HH:mm timestamp, sender and body', async () => {
      const time = preview.getByText('12:34', { exact: true });
      await time.waitFor();
      await preview.getByText('Alex', { exact: true }).waitFor();
      await preview.getByText('See you at the demo.', { exact: true }).waitFor();
      before = await time.evaluate(placement);
    });
    const changedTime = preview.getByText('12:34:56', { exact: true });
    await step('stringSet seconds format renders in the same SDK element', async () => {
      await page.getByLabel('Custom message details').check();
      await changedTime.waitFor();
      assert.deepEqual(await changedTime.evaluate(placement), before);
      assert.ok(await preview.getByText('See you at the demo.', { exact: true }).isVisible());
    });
    const like = async (count, pressed) => {
      const button = preview.getByRole('button', { name: `Like, ${count} reactions`, exact: true });
      await button.waitFor();
      assert.equal(await button.getAttribute('aria-pressed'), String(pressed));
      return button;
    };
    await step('click, Enter and Space toggle through toggleReaction', async () => {
      await (await like(2, false)).click();
      await (await like(3, true)).click();
      await (await like(2, false)).focus();
      await page.keyboard.press('Enter');
      await like(3, true);
      await page.keyboard.press('Space');
      await like(2, false);
      const pair = ['addReaction(101, like)', 'deleteReaction(101, like)'];
      assert.deepEqual(await page.getByTestId('operations').locator('li').allInnerTexts(), [...pair, ...pair]);
    });
    await step('long body keeps timestamp and button apart', async () => {
      await page.getByLabel('Long message').check();
      const timer = await changedTime.boundingBox();
      const chip = await (await like(2, false)).boundingBox();
      const overlap = timer.x < chip.x + chip.width && timer.x + timer.width > chip.x
        && timer.y < chip.y + chip.height && timer.y + timer.height > chip.y;
      assert.equal(overlap, false);
    });
    await step('mixed reactions fall back to the stock EmojiReactions', async () => {
      await page.getByLabel('Mixed reactions').check();
      const badges = preview.locator('.sendbird-emoji-reactions .sendbird-reaction-badge:visible');
      await badges.nth(1).waitFor();
      assert.deepEqual((await badges.allInnerTexts()).map(text => text.trim()).sort(), ['1', '2']);
      assert.equal(await preview.locator('.recipe-reaction-chip').count(), 0);
    });
  },

  'composer-above-message-list': async ({ page, url, width, step }) => {
    await page.goto(url);
    const preview = page.getByRole('region', { name: 'Channel preview' });
    const list = preview.getByTestId('sendbird-message-list-container');
    const input = preview.locator('.sendbird-message-input--textarea');
    const history = preview.getByText(/^History \d{2} · Message loaded/);
    const order = () => preview.evaluate(node => {
      const selectors = {
        header: '.sendbird-conversation__channel-header',
        composer: '.sendbird-message-input--textarea',
        messages: '[data-testid="sendbird-message-list-container"]',
      };
      const parts = Object.entries(selectors).map(([name, selector]) => [name, node.querySelector(selector)]);
      const visual = parts.toSorted((a, b) => a[1].getBoundingClientRect().top - b[1].getBoundingClientRect().top);
      const dom = parts.toSorted((a, b) => a[1].compareDocumentPosition(b[1]) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);
      return { visual: visual.map(([name]) => name), dom: dom.map(([name]) => name) };
    });
    await step('stock layout is header, list, composer', async () => {
      await preview.getByText(/History 36/).waitFor();
      assert.equal(await history.count(), 36);
      assert.deepEqual(await order(), { dom: ['header', 'messages', 'composer'], visual: ['header', 'messages', 'composer'] });
    });
    await step('reordered layout is header, composer, list in DOM and on screen', async () => {
      await page.getByLabel('Composer on top').check();
      await input.waitFor();
      await preview.getByText(/History 36/).waitFor();
      assert.deepEqual(await order(), { dom: ['header', 'composer', 'messages'], visual: ['header', 'composer', 'messages'] });
    });
    await step('loading, empty, error, offline and typing states render', async () => {
      const state = page.getByLabel('Channel state');
      for (const [name, view] of [
        ['loading', preview.locator('.sendbird-loader')],
        ['empty', preview.getByText('No messages', { exact: true })],
        ['error', preview.getByText('Something went wrong', { exact: true })],
        ['offline', preview.getByText('Trying to connect…', { exact: true })],
        ['typing', preview.locator('.sendbird-conversation__footer__typing-indicator__text').filter({ hasText: 'Alex is typing' })],
      ]) {
        await state.selectOption(name);
        await view.first().waitFor();
      }
      await state.selectOption('ready');
      await preview.getByText(/History 36/).waitFor();
    });
    await step('message list scrolls both ways', async () => {
      assert.ok(await list.evaluate(node => node.scrollHeight - node.clientHeight) > 100);
      await list.evaluate(node => { node.scrollTop = node.scrollHeight; });
      await list.hover();
      const bottom = await list.evaluate(node => node.scrollTop);
      await page.mouse.wheel(0, -320);
      await page.waitForFunction(b => document.querySelector('[data-testid="sendbird-message-list-container"]').scrollTop < b - 30, bottom);
      const up = await list.evaluate(node => node.scrollTop);
      await page.mouse.wheel(0, 160);
      await page.waitForFunction(u => document.querySelector('[data-testid="sendbird-message-list-container"]').scrollTop > u + 30, up);
    });
    await step('stock composer sends once and keeps history', async () => {
      const text = `Test after reorder ${width}`;
      await input.fill(text);
      if (width > 600) await input.press('Enter');
      else await preview.locator('.sendbird-message-input--send').click();
      await preview.getByText(text, { exact: true }).waitFor();
      assert.equal(await preview.getByText(text, { exact: true }).count(), 1);
      assert.equal(await history.count(), 36);
      assert.deepEqual(await page.getByTestId('operations').locator('li').allInnerTexts(), [`GroupChannel.sendUserMessage: ${text}`]);
    });
  },

  'theme-variables-and-css': async ({ page, url, step, width }) => {
    const style = locator => locator.evaluate(element => {
      const css = getComputedStyle(element);
      return { background: css.backgroundColor, font: css.fontFamily, fontSize: css.fontSize,
        lineHeight: css.lineHeight, radius: css.borderRadius, padding: css.padding };
    });
    const accent = key => page.getByTestId(key).evaluate(element =>
      getComputedStyle(element).getPropertyValue('--sendbird-light-primary-300').trim());
    const read = async () => {
      const incoming = page.locator('[data-who="other"] .sendbird-text-message-item-body').first();
      const outgoing = page.locator('[data-who="self"] .sendbird-text-message-item-body');
      await incoming.waitFor();
      return {
        incoming: await style(incoming), outgoing: await style(outgoing),
        inside: await accent('inside-accent'), outside: await accent('outside-accent'),
        count: await page.locator('.sendbird-text-message-item-body').count(),
        timestamps: await page.locator('.sendbird-message-content__middle__body-container__created-at').allTextContents(),
      };
    };
    let baseline;
    await step('UIKit default renders three messages', async () => {
      const fixtureSource = await readFile(join(root, 'theme-variables-and-css/fixture.tsx'), 'utf8');
      const integrationSource = await readFile(join(root, 'theme-variables-and-css/integration.tsx'), 'utf8');
      const mainSource = await readFile(join(root, 'theme-variables-and-css/main.tsx'), 'utf8');
      assert.match(fixtureSource, /import\s*\{[^}]*\bBrandedConversation\b[^}]*\}\s*from\s*['"]\.\/integration['"]/);
      assert.match(fixtureSource, /<BrandedConversation\b/);
      assert.match(integrationSource, /import\s*['"]\.\/theme\.css['"]/);
      assert.doesNotMatch(mainSource, /import\s*['"]\.\/theme\.css['"]/);
      await page.goto(`${url}?mode=default`);
      baseline = await read();
      assert.equal(baseline.count, 3);
    });
    const assertPalette = styles => {
      assert.equal(styles.outgoing.background, 'rgb(22, 101, 52)');
      assert.equal(styles.incoming.background, 'rgb(226, 232, 240)');
      assert.match(styles.incoming.font, /Arial/);
      assert.equal(styles.inside, '#166534');
      assert.equal(styles.outside, baseline.outside);
      assert.deepEqual(styles.timestamps, baseline.timestamps);
    };
    await step('variables change color and font inside the scope only, not geometry', async () => {
      await page.goto(`${url}?mode=tokens`);
      const styles = await read();
      assertPalette(styles);
      assert.equal(styles.incoming.radius, baseline.incoming.radius);
      assert.equal(styles.incoming.padding, baseline.incoming.padding);
    });
    await step('scoped CSS sets bubble radius, padding and type size', async () => {
      await page.goto(`${url}?mode=target`);
      const styles = await read();
      assertPalette(styles);
      assert.deepEqual([styles.incoming.radius, styles.incoming.padding, styles.incoming.fontSize, styles.incoming.lineHeight],
        ['12px', '12px 16px', '16px', '24px']);
    });
    await step('reacted bubble keeps a flat bottom edge and the placeholder stays readable', async () => {
      const reacted = page.locator('.sendbird-text-message-item-body.reactions');
      assert.equal(await reacted.count(), 1);
      assert.equal(await reacted.evaluate(node => getComputedStyle(node).borderRadius), '12px 12px 0px 0px');
      const luminance = color => {
        const channels = color.match(/[\d.]+/g).slice(0, 3).map(value => value / 255)
          .map(value => value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
        return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
      };
      const text = await page.locator('.sendbird-message-input--placeholder').evaluate(node => getComputedStyle(node).color);
      const background = await page.locator('.sendbird-message-input--textarea').evaluate(node => getComputedStyle(node).backgroundColor);
      assert.equal(background, 'rgb(255, 255, 255)');
      assert.match(text, /^rgb\(/);
      assert.ok((1.05 / (luminance(text) + 0.05)) >= 4.5, `placeholder ${text} on ${background}`);
    });
    await step('stock heart adds and removes the local user reaction', async () => {
      const reaction = page.locator('.sendbird-message-content-reactions');
      const unselected = reaction.getByRole('button', { name: '1', exact: true });
      const selected = reaction.getByRole('button', { name: '2', exact: true });
      await unselected.click();
      await selected.waitFor();
      assert.ok(await selected.evaluate(node => node.classList.contains('sendbird-reaction-badge--selected')));
      await selected.click();
      await unselected.waitFor();
      assert.ok(await unselected.evaluate(node => node.classList.contains('sendbird-reaction-badge')));
    });
    await step('fixture keyboard handling toggles the stock heart; the tooltip names the reacting member', async () => {
      const reaction = page.locator('.sendbird-message-content-reactions');
      const unselected = reaction.getByRole('button', { name: '1', exact: true });
      const selected = reaction.getByRole('button', { name: '2', exact: true });
      if (width === 1280) {
        await unselected.hover();
        await reaction.getByText('Alex', { exact: true }).waitFor();
      }
      await unselected.press('Enter');
      await selected.press('Space');
      await unselected.waitFor();
    });
    await step('composer keeps 56px height, focus accent and native send', async () => {
      const editor = page.locator('.sendbird-message-input--textarea');
      assert.equal(await editor.evaluate(node => node.getBoundingClientRect().height), 56);
      await editor.focus();
      await page.waitForFunction(() => getComputedStyle(document.querySelector('.sendbird-message-input--textarea')).borderColor === 'rgb(22, 101, 52)');
      await editor.fill('Keep the native composer');
      assert.equal(await editor.evaluate(node => node.getBoundingClientRect().height), 56);
      await page.locator('.sendbird-message-input--send').click();
      await page.getByText('Fixture received: Keep the native composer', { exact: true }).waitFor();
    });
    await step('a staged file keeps the stock pending composer geometry', async () => {
      const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGMQSzUBAAFEALBsWfmKAAAAAElFTkSuQmCC', 'base64');
      const stagePhoto = async mode => {
        await page.goto(`${url}?mode=${mode}`);
        await page.locator('input[type="file"]').first().setInputFiles({ name: 'photo.png', mimeType: 'image/png', buffer: png });
        const thumbnail = page.locator('.sendbird-message-input--has-pending').getByRole('img', { name: 'photo.png', exact: true });
        const dimensions = await thumbnail.evaluate(async image => {
          await image.decode();
          return [image.naturalWidth, image.naturalHeight];
        });
        assert.deepEqual(dimensions, [1, 1]);
        await page.locator('.sendbird-message-input__pending-file__image-placeholder').waitFor({ state: 'detached' });
        return page.locator('.sendbird-message-input--has-pending').evaluate(root => {
          const base = root.querySelector('.sendbird-message-input--textarea').getBoundingClientRect();
          const rect = selector => {
            const box = root.querySelector(selector).getBoundingClientRect();
            return [box.top - base.top, box.bottom - base.top, box.left - base.left, box.right - base.left].map(Math.round);
          };
          return { height: Math.round(base.height), preview: rect('.sendbird-message-input__pending-preview'),
            placeholder: rect('.sendbird-message-input--placeholder'), send: rect('.sendbird-message-input--send') };
        });
      };
      const stock = await stagePhoto('default');
      const branded = await stagePhoto('target');
      assert.deepEqual(branded, stock);
      assert.ok(branded.placeholder[0] >= branded.preview[1], `placeholder ${branded.placeholder} under preview ${branded.preview}`);
      await page.locator('.sendbird-message-input--send').click();
      await page.getByText('Fixture received: file photo.png', { exact: true }).waitFor();
      return { thumbnail: 'decoded 1×1 PNG', stock, branded };
    });
  },

  'jump-to-latest-and-send-icon': async ({ page, url, step }) => {
    const editor = page.locator('.sendbird-message-input--textarea');
    const send = page.locator('.sendbird-message-input--send');
    const list = page.getByTestId('sendbird-message-list-container');
    const jump = page.getByRole('button', { name: 'Jump to latest' });
    const record = async () => JSON.parse((await page.getByTestId('sent-record').textContent()) || '{}');
    const open = async () => { await page.goto(url); await page.getByText('History 24', { exact: true }).waitFor(); };
    const atBottom = () => page.waitForFunction(() => {
      const el = document.querySelector('[data-testid="sendbird-message-list-container"]');
      return el && el.scrollHeight > el.clientHeight && el.scrollHeight - el.clientHeight - el.scrollTop <= 1;
    });
    await step('Jump to latest is disabled at the bottom and scrolls back down', async () => {
      await open();
      await atBottom();
      assert.equal(await jump.isDisabled(), true);
      await list.hover();
      await page.mouse.wheel(0, -400);
      await page.getByRole('button', { name: 'Jump to latest', disabled: false }).waitFor();
      assert.ok(await list.evaluate(el => el.scrollHeight - el.clientHeight - el.scrollTop) > 100);
      await jump.click();
      await atBottom();
    });
    await step('branded Send icon submits text through the stock composer', async () => {
      assert.equal(await send.count(), 0);
      await editor.fill('Native Submit');
      assert.equal(await send.locator('.send-icon').innerText(), '↑');
      await page.getByRole('button', { name: 'Send', exact: true }).click();
      await page.getByText('Native Submit', { exact: true }).waitFor();
      assert.deepEqual(await record(), { channel: 'fixture-channel', text: 'Native Submit', mentions: [] });
    });
    await step('quote reply keeps the parent message ID', async () => {
      await open();
      await page.getByText('History 24', { exact: true }).hover();
      await page.locator('.sendbird-message-content-menu__normal-menu .sendbird-iconbutton:visible').last().click();
      await page.getByText('Reply', { exact: true }).click();
      await page.locator('.sendbird-message-input-wrapper__quote-message-input').waitFor();
      await editor.fill('Native quote');
      await send.click();
      await page.getByText('Native quote', { exact: true }).waitFor();
      assert.deepEqual(await record(), { channel: 'fixture-channel', text: 'Native quote', parent: 124, mentions: [] });
    });
    await step('mention suggestion adds the mentioned user', async () => {
      await open();
      await editor.pressSequentially('@Al', { delay: 50 });
      await page.getByTestId('sendbird-mention-suggest-list').getByText('Alex', { exact: true }).click();
      await send.click();
      await page.getByTestId('sent-record').filter({ hasText: 'other' }).waitFor();
      assert.deepEqual((await record()).mentions, ['other']);
    });
    await step('staged file preview sends a file message', async () => {
      await open();
      await page.locator('input[type="file"]').setInputFiles({ name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('local only') });
      const staged = page.getByTestId('sendbird-pending-files-preview');
      await staged.getByText('notes.txt', { exact: true }).waitFor();
      await send.click();
      await page.getByTestId('sent-record').filter({ hasText: 'notes.txt' }).waitFor();
      assert.deepEqual(await record(), { channel: 'fixture-channel', text: '', file: 'notes.txt', mentions: [] });
      await staged.waitFor({ state: 'hidden' });
    });
    await step('branded Send icon dims inside the native disabled Send button in both themes', async () => {
      const examples = [
        ['light', url, 'rgb(22, 84, 140)', 'rgba(0, 0, 0, 0.5)'],
        ['dark', `${url}?theme=dark`, 'rgb(194, 169, 250)', 'rgba(255, 255, 255, 0.5)'],
      ];
      for (const [theme, themeUrl, activeColor, disabledColor] of examples) {
        await page.goto(themeUrl);
        await page.locator(`body.sendbird-theme--${theme}`).waitFor();
        await page.getByText('History 24', { exact: true }).waitFor();
        await editor.fill('Disabled draft');
        const color = () => send.locator('.send-icon').evaluate(node => getComputedStyle(node).color);
        assert.equal(await color(), activeColor, `${theme} active Send icon`);
        // Set the native button state to isolate the icon's disabled styling.
        await send.evaluate(node => { node.disabled = true; });
        assert.equal(await color(), disabledColor, `${theme} disabled Send icon`);
      }
    });
    await step('history links keep the dark provider theme in both directions', async () => {
      await page.goto(`${url}?theme=dark`);
      const dark = page.locator('body.sendbird-theme--dark');
      await dark.waitFor();
      const navigate = async (name, older) => {
        const link = page.getByRole('link', { name, exact: true });
        await link.click();
        assert.equal(new URL(page.url()).searchParams.has('older'), older);
        assert.equal(new URL(page.url()).searchParams.get('theme'), 'dark');
        await dark.waitFor();
        assert.equal(await link.getAttribute('aria-current'), 'page');
      };
      await navigate('At History 12', true);
      await navigate('At the latest message', false);
    });
    await step('Jump to latest stays enabled at the bottom of an older page and loads the newest page', async () => {
      await page.goto(`${url}?older`);
      await page.getByText('History 12', { exact: true }).waitFor();
      const loaded = () => page.locator('.sendbird-text-message-item-body').count();
      const before = await loaded();
      await list.evaluate(el => { el.scrollTop = el.scrollHeight; });
      // Reaching the bottom loads one page of four below the viewport; at least one newer page stays unloaded.
      await page.waitForFunction(count => document.querySelectorAll('.sendbird-text-message-item-body').length > count, before);
      assert.equal(await page.getByText('History 24', { exact: true }).count(), 0);
      await page.locator('.sendbird-conversation__scroll-bottom-button').waitFor();
      assert.equal(await jump.isDisabled(), false);
      await jump.click();
      await page.getByText('History 24', { exact: true }).waitFor();
      await atBottom();
      await page.getByRole('button', { name: 'Jump to latest', disabled: true }).waitFor();
      assert.equal(await loaded(), 24);
    });
    await step('sending after paging to the latest message leaves Jump to latest disabled', async () => {
      await page.goto(`${url}?older`);
      await page.getByText('History 12', { exact: true }).waitFor();
      const messages = list.locator('.sendbird-text-message-item-body');
      for (let pageIndex = 0; pageIndex < 3; pageIndex += 1) {
        const before = await messages.count();
        if (before === 24) break;
        await list.evaluate(el => { el.scrollTop = el.scrollHeight; });
        await messages.nth(before).waitFor();
      }
      await page.getByText('History 24', { exact: true }).waitFor();
      await list.evaluate(el => { el.scrollTop = el.scrollHeight; });
      await atBottom();
      await page.getByRole('button', { name: 'Jump to latest', disabled: true }).waitFor();
      await editor.fill('Sent after paging');
      await send.click();
      await list.getByText('Sent after paging', { exact: true }).waitFor();
      await atBottom();
      assert.equal(await jump.isDisabled(), true, 'the sent message is already loaded');
    });
  },

  'composer-action-button': async ({ page, url, step }) => {
    const editor = page.locator('.sendbird-message-input--textarea');
    const send = page.locator('button.sendbird-message-input--send');
    const log = page.getByRole('region', { name: 'Local send log' });
    await step('action leaves the draft untouched and sends nothing', async () => {
      await page.goto(url);
      await editor.fill('Existing');
      await page.getByRole('button', { name: 'Show writing tip' }).click();
      assert.equal(await page.locator('.composer-recipe [role="status"]').innerText(), 'Start with the action you want the recipient to take.');
      assert.equal(await page.getByRole('button', { name: 'Hide writing tip' }).getAttribute('aria-expanded'), 'true');
      assert.equal(await editor.innerText(), 'Existing');
      assert.equal(await log.getByRole('listitem').count(), 0);
    });
    await step('stock Send delivers the unchanged draft once', async () => {
      await send.click();
      await log.getByText('Existing', { exact: true }).waitFor();
      assert.equal(await log.getByRole('listitem').count(), 1);
    });
    await step('stock attachment preview and file send still work', async () => {
      await page.goto(url);
      await page.locator('button.sendbird-message-input--attach').waitFor();
      await page.locator('input[type=file]').setInputFiles({ name: 'fixture.txt', mimeType: 'text/plain', buffer: Buffer.from('Synthetic attachment.') });
      await page.locator('.composer-frame').getByText('fixture.txt', { exact: true }).waitFor();
      await send.click();
      await log.getByText('fixture.txt', { exact: true }).waitFor();
    });
  },

  'product-message-and-channel-preview': async ({ page, url, step, width }) => {
    await page.goto(url);
    const row = heading => page.getByRole('region', { name: heading, exact: true });
    const image = row('Card with an image').locator('.sendbird-thumbnail-message-item-body');
    await step('product text message renders the card in the stock wrapper', async () => {
      const card = row('Product text message').getByRole('article', { name: 'Product card' });
      await card.getByText('SKU DEMO-1', { exact: true }).waitFor();
      assert.ok(await card.getByText('Desk lamp', { exact: true }).isVisible());
      assert.ok(await row('Product text message').getByText('Alex', { exact: true }).isVisible());
      assert.ok(await row('Product text message').getByText('12:34 PM', { exact: true }).isVisible());
    });
    await step('unknown type, malformed JSON and invalid field fall back to the stock body', async () => {
      for (const [heading, fallback] of [
        ['Unknown type', 'Regular message for an unknown type.'],
        ['Malformed JSON', 'Regular message for malformed JSON.'],
        ['Invalid field type', 'Regular message for an invalid SKU.'],
      ]) {
        assert.ok(await row(heading).getByText(fallback, { exact: true }).isVisible());
        assert.equal(await row(heading).getByRole('article', { name: 'Product card' }).count(), 0);
      }
    });
    await step('card sits above the stock image and file bodies', async () => {
      await image.locator('.sendbird-image-renderer__image').waitFor();
      assert.ok(await row('Card with an image').getByText('SKU DEMO-1', { exact: true }).isVisible());
      assert.ok(await row('Card with a file').getByText('SKU DEMO-1', { exact: true }).isVisible());
      assert.ok(await row('Card with a file').getByText('details.txt', { exact: true }).isVisible());
      assert.ok(await row('Malformed card with a file').getByText('details.txt', { exact: true }).isVisible());
      assert.equal(await row('Malformed card with a file').getByRole('article', { name: 'Product card' }).count(), 0);
    });
    await step('stock file action opens the local file', async () => {
      const [popup] = await Promise.all([page.waitForEvent('popup'), row('Card with a file').getByText('details.txt', { exact: true }).click()]);
      await popup.waitForLoadState();
      assert.equal((await popup.locator('body').innerText()).trim(), 'Synthetic product details for the local recipe.');
      await popup.close();
    });
    await step('stock image viewer opens from the product message and closes', async () => {
      const viewer = page.getByTestId('sendbird-fileviewer');
      await image.click();
      await viewer.locator('img:visible').first().waitFor();
      const close = viewer.locator('.sendbird-fileviewer__header__right__actions__close [role="button"]');
      const box = await close.boundingBox();
      const nativeCloseVisible = Boolean(box && box.x >= 0 && box.x + box.width <= width);
      if (nativeCloseVisible) await close.click();
      else await page.getByRole('button', { name: 'Exit demo viewer' }).click();
      await viewer.waitFor({ state: 'hidden' });
      return { nativeCloseVisible };
    });

    const list = page.getByRole('region', { name: 'Channel previews' });
    const body = page.getByRole('region', { name: 'Message body' });
    const click = name => page.getByRole('button', { name, exact: true }).click();
    const productRow = list.getByRole('button', { name: /^Workshop, Product: / });
    const stockWorkshop = list.getByRole('link').filter({ hasText: 'Workshop' });
    const general = list.getByRole('link').filter({ hasText: 'General' });
    const card = body.getByRole('article', { name: 'Product card' });
    const heading = text => body.getByRole('heading', { name: text, exact: true }).waitFor();
    const bodyOnly = page.getByLabel('Customize the body only');
    await step('plain text keeps the stock channel row and body', async () => {
      await stockWorkshop.getByText('Meeting at nine', { exact: true }).waitFor();
      await body.getByText('Meeting at nine', { exact: true }).waitFor();
      assert.equal(await card.count(), 0);
    });
    await step('body-only customization leaves the stock preview text', async () => {
      await bodyOnly.check();
      await click('New product card');
      await card.getByText('Desk lamp', { exact: true }).waitFor();
      await stockWorkshop.getByText('Product information', { exact: true }).waitFor();
      assert.equal(await productRow.count(), 0);
      await bodyOnly.uncheck();
    });
    await step('new and edited product update row and body for one message ID', async () => {
      await productRow.getByText('Product: Desk lamp', { exact: true }).waitFor();
      assert.equal(await productRow.getAttribute('aria-current'), 'true');
      const id = await body.getAttribute('data-message-id');
      await click('Edit product title');
      await productRow.getByText('Product: Reading lamp', { exact: true }).waitFor();
      await card.getByText('Reading lamp', { exact: true }).waitFor();
      await card.getByText('SKU DEMO-1', { exact: true }).waitFor();
      assert.equal(await body.getAttribute('data-message-id'), id);
    });
    await step('file, unknown and malformed last messages use the stock row and body', async () => {
      for (const [variant, previewText, message] of [
        ['Plain text', 'Meeting at nine', 'Meeting at nine'],
        ['Unknown type', 'Unknown category fallback', 'Unknown category fallback'],
        ['Malformed product', 'Malformed product fallback', 'Malformed product fallback'],
        ['File', 'File', 'details.txt'],
      ]) {
        await click(variant);
        await stockWorkshop.getByText(previewText, { exact: true }).waitFor();
        await body.getByText(message, { exact: true }).waitFor();
        assert.equal(await card.count(), 0);
      }
    });
    await step('product row shows unread count and opens with Enter and Space', async () => {
      await click('New product card');
      await general.click();
      await heading('General');
      await click('Unread badge');
      const button = list.getByRole('button', { name: 'Workshop, Product: Desk lamp, 1 unread', exact: true });
      await button.waitFor();
      await bodyOnly.focus();
      await page.keyboard.press('Tab');
      assert.equal(await button.evaluate(node => node === document.activeElement), true);
      assert.equal(await button.evaluate(node => getComputedStyle(node).outlineStyle), 'solid');
      await page.keyboard.press('Enter');
      await heading('Workshop');
      await general.click();
      await heading('General');
      await bodyOnly.focus();
      await page.keyboard.press('Tab');
      await page.keyboard.press('Space');
      await heading('Workshop');
    });
    const unreadMarks = async row => ({
      badge: (await row.locator('.sendbird-badge').allInnerTexts()).map(text => text.trim()),
      mention: await row.locator('.sendbird-mention-user-label:visible').allInnerTexts(),
    });
    const plainName = 'Workshop, Product: Desk lamp';
    const unreadName = 'Workshop, Product: Desk lamp, 1 unread';
    const mentionedName = 'Workshop, Product: Desk lamp, unread mention, 1 unread';
    const expectUnread = async (count, name, mention = false) => {
      const expected = { badge: count ? [String(count)] : [], mention: mention ? ['@'] : [] };
      await productRow.waitFor();
      assert.deepEqual(await unreadMarks(productRow), expected);
      await list.getByRole('button', { name, exact: true }).waitFor();
      // The stock row is the oracle and only renders in body-only mode.
      await bodyOnly.check();
      await stockWorkshop.waitFor();
      assert.deepEqual(await unreadMarks(stockWorkshop), expected);
      await bodyOnly.uncheck();
      await productRow.waitFor();
    };
    const appOptions = { enableMarkAsUnread: 'mark-as-unread', enableMention: 'mention' };
    const reloadWith = async options => {
      for (const [label, on] of Object.entries(options)) await page.getByLabel(label, { exact: true }).setChecked(on);
      await click('Reload with options');
      await page.waitForURL(link => Object.entries(options).every(([label, on]) => link.searchParams.has(appOptions[label]) === on));
      await click('New product card');
      await click('Unread badge');
      await productRow.waitFor();
    };
    const workshopOption = label => page.getByRole('group', { name: 'Workshop channel' }).getByLabel(label, { exact: true });
    await step('mark as unread off: selected product row hides unread like the stock row', async () => {
      assert.equal(await productRow.getAttribute('aria-current'), 'true');
      await expectUnread(0, plainName);
    });
    await step('mark as unread on: selected product row keeps the badge and unread name', async () => {
      await reloadWith({ enableMarkAsUnread: true, enableMention: false });
      assert.equal(await productRow.getAttribute('aria-current'), 'true');
      await expectUnread(1, unreadName);
    });
    await step('mark as unread on: ephemeral channel hides unread when selected and unselected', async () => {
      await workshopOption('Make Workshop ephemeral').check();
      await expectUnread(0, plainName);
      await general.click();
      await heading('General');
      assert.equal(await productRow.getAttribute('aria-current'), null);
      await expectUnread(0, plainName);
    });
    await step('unread mention mark needs enableMention and follows the same unread rule', async () => {
      await workshopOption('Make Workshop ephemeral').uncheck();
      await workshopOption('Mention me in Workshop').check();
      await expectUnread(1, unreadName);
      await reloadWith({ enableMarkAsUnread: true, enableMention: true });
      await workshopOption('Mention me in Workshop').check();
      await expectUnread(1, mentionedName, true);
      await workshopOption('Make Workshop ephemeral').check();
      await expectUnread(0, plainName);
      await reloadWith({ enableMarkAsUnread: false, enableMention: true });
      await workshopOption('Mention me in Workshop').check();
      await expectUnread(0, plainName);
      await general.click();
      await heading('General');
      await expectUnread(1, mentionedName, true);
    });
    await step('a default channel name keeps the stock row and its member title', async () => {
      await workshopOption('Use the default channel name').check();
      const stockTitle = list.locator('.sendbird-channel-preview__content__upper__header__channel-name');
      await stockTitle.filter({ hasText: 'Alex' }).waitFor();
      assert.equal(await list.locator('.product-channel-row').count(), 0);
      assert.equal(await list.getByText('Group Channel', { exact: true }).count(), 0);
    });
    await step('a default-named product channel still opens with Enter and Space', async () => {
      const fallback = list.getByRole('link', { name: /Alex/ });
      await fallback.press('Enter');
      await heading('Workshop');
      await general.click();
      await heading('General');
      await fallback.press('Space');
      await heading('Workshop');
    });
  },

  'per-screen-channel-options': async ({ page, url, step }) => {
    await page.goto(url);
    const panel = side => page.getByRole('region', { name: `Screen ${side}` });
    const message = side => panel(side).getByText(`Original message ${side}`, { exact: true }).first();
    const reaction = side => panel(side).locator('.sendbird-message-item-reaction-menu__trigger').first();
    const menu = side => panel(side).locator('.sendbird-message-content-menu__normal-menu .sendbird-iconbutton').first();
    const input = side => panel(side).locator('.sendbird-message-input--textarea');
    const operations = async () => JSON.parse(await page.getByTestId('operations').textContent());
    const options = side => panel(side).getByTestId('resolved-options').evaluate(node => ({ ...node.dataset }));
    const dismiss = async () => {
      const backdrop = page.locator('.sendbird-dropdown__menu-backdrop:visible');
      if (await backdrop.count()) await backdrop.click({ position: { x: 4, y: 4 } });
    };
    const pick = async key => {
      await message('A').hover();
      await reaction('A').click();
      const choices = page.locator('[data-testid^="ui_emoji_reactions_menu_"]:visible');
      await choices.first().waitFor();
      assert.deepEqual(await choices.evaluateAll(nodes => nodes.map(node => node.dataset.testid)), [`ui_emoji_reactions_menu_${key}`]);
      return choices.first();
    };
    const send = async (side, text) => {
      await input(side).fill(text);
      await panel(side).getByTestId('sendbird-message-input-send-button').click();
      await panel(side).getByText(text, { exact: true }).waitFor();
      return (await operations()).find(event => event.text === text);
    };
    await step('one user, two resolved screen policies', async () => {
      await message('A').waitFor();
      await message('B').waitFor();
      assert.deepEqual(await options('A'), { testid: 'resolved-options', reactions: 'true', reply: 'QUOTE_REPLY', mention: 'true', user: 'self' });
      assert.deepEqual(await options('B'), { testid: 'resolved-options', reactions: 'false', reply: 'NONE', mention: 'true', user: 'self' });
    });
    await step('A picker shows only the Gesture category and calls addReaction', async () => {
      await (await pick('like')).click();
      assert.deepEqual((await operations()).find(item => item.emoji === 'like'), { screen: 'A', operation: 'addReaction', messageId: 101, emoji: 'like' });
      await dismiss();
    });
    await step('A quote reply sends the parent message ID', async () => {
      await message('A').hover();
      await menu('A').click();
      await page.getByText('Reply', { exact: true }).click();
      await panel('A').locator('.sendbird-quote_message_input').waitFor();
      assert.deepEqual(await send('A', 'Quote in A'), { screen: 'A', operation: 'sendUserMessage', text: 'Quote in A', replyTo: 101 });
    });
    await step('B hides reaction and reply, keeps Copy and send', async () => {
      await message('B').hover();
      assert.equal(await reaction('B').count(), 0);
      await menu('B').click();
      await page.getByText('Copy', { exact: true }).waitFor();
      assert.equal(await page.getByText('Reply', { exact: true }).count(), 0);
      await dismiss();
      assert.deepEqual(await send('B', 'Message in B'), { screen: 'B', operation: 'sendUserMessage', text: 'Message in B' });
    });
    await step('remounting only A applies the Celebrate category', async () => {
      const aBefore = await panel('A').getByTestId('resolved-options').elementHandle();
      const bBefore = await panel('B').getByTestId('resolved-options').elementHandle();
      await page.getByRole('button', { name: 'Remount A with Celebrate' }).click();
      await message('A').waitFor();
      assert.equal(await panel('A').getByTestId('resolved-options').evaluate((node, old) => node === old, aBefore), false);
      assert.equal(await panel('B').getByTestId('resolved-options').evaluate((node, old) => node === old, bBefore), true);
      await (await pick('celebrate')).click();
      assert.deepEqual((await operations()).find(item => item.emoji === 'celebrate'), { screen: 'A', operation: 'addReaction', messageId: 101, emoji: 'celebrate' });
      await dismiss();
      await panel('B').getByText('Message in B', { exact: true }).waitFor();
    });
  },

  'copy-message-id-menu': async ({ page, url, width, step }) => {
    await page.goto(url);
    const scenario = page.getByLabel('Message', { exact: true });
    const extended = page.getByRole('checkbox', { name: 'Add ID action' });
    const trigger = page.getByRole('button', { name: 'Open menu' });
    const menuItems = page.getByRole('menuitem');
    const names = (locator = menuItems) => locator.evaluateAll(nodes => nodes.map(node => node.textContent.trim()));
    const states = [['own', true], ['other', true], ['other-reply', false], ['pending', false], ['failed', false]];
    const compareWithStock = async (cases, readMenu) => {
      for (const [value, hasId] of cases) {
        await scenario.selectOption(value);
        await extended.uncheck();
        const stock = await readMenu();
        await extended.check();
        const after = await readMenu();
        assert.deepEqual(after, hasId ? [...stock, 'Copy message ID'] : stock, value);
        if (value.startsWith('other')) assert.equal(after.includes('Edit'), false, value);
      }
    };
    await step('ID action is added only to delivered top-level messages; other items unchanged', async () => {
      await compareWithStock(states, async () => {
        await trigger.click();
        await menuItems.first().waitFor();
        const labels = await names();
        await page.mouse.click(4, 4);
        return labels;
      });
    });
    await step('stock Edit, Reply and Resend callbacks still run', async () => {
      for (const [value, label, expected] of [
        ['own', 'Edit', 'UIKit opened edit'],
        ['own', 'Reply', 'UIKit requested quote reply'],
        ['failed', 'Resend', 'UIKit requested retry'],
      ]) {
        await scenario.selectOption(value);
        await trigger.click();
        await page.getByRole('menuitem', { name: label }).click();
        await page.getByText(expected, { exact: true }).waitFor();
      }
    });
    await step('keyboard copy writes the ID and closes the menu', async () => {
      await scenario.selectOption('other');
      await trigger.press('Enter');
      const copy = page.getByRole('menuitem', { name: 'Copy message ID' });
      await copy.waitFor();
      const box = await copy.boundingBox();
      assert.ok(box.x >= 0 && box.x + box.width <= width);
      await copy.press('Enter');
      await page.getByText('Copied ID 101', { exact: true }).waitFor();
      await copy.waitFor({ state: 'hidden' });
      assert.equal(await page.evaluate(() => navigator.clipboard.readText()), '101');
    });
    // The second demo renders MessageContent with the same wiring as ChannelWithCopyMessageId.
    const content = page.getByTestId('message-content');
    const body = content.getByText('A sample message', { exact: true });
    const reactions = page.getByRole('checkbox', { name: 'Reactions' });
    if (width >= 600) {
      await step('desktop MessageContent menu adds the ID action through the shared wiring', async () => {
        await reactions.uncheck();
        await compareWithStock(states.filter(([value]) => value !== 'other-reply' && value !== 'pending'), async () => {
          await body.hover();
          await content.locator('.sendbird-message-content-menu .sendbird-message-menu .sendbird-iconbutton').click();
          await page.getByRole('menuitem').first().waitFor();
          const labels = await names();
          await page.mouse.click(4, 4);
          return labels;
        });
      });
      return;
    }
    const mobileItems = page.locator('.sendbird-message__mobile-context-menu [role="menuitem"], .sendbird-message__bottomsheet--action');
    const longPress = async () => {
      await body.scrollIntoViewIfNeeded();
      const box = await body.boundingBox();
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      try {
        await mobileItems.first().waitFor();
      } finally {
        await page.mouse.up();
      }
    };
    const closeMobileMenu = async () => {
      await page.locator('.sendbird-bottomsheet__backdrop, .sendbird-dropdown__menu-backdrop').first().click({ position: { x: 4, y: 4 } });
      await mobileItems.first().waitFor({ state: 'detached' });
    };
    const contextMenu = '.sendbird-message__mobile-context-menu';
    const bottomSheet = '.sendbird-message__bottomsheet';
    for (const [withReactions, menu, otherMenu] of [[false, contextMenu, bottomSheet], [true, bottomSheet, contextMenu]]) {
      const name = withReactions ? 'bottom sheet (reactions on)' : 'context menu (reactions off)';
      await step(`long-press ${name}: ID action only on delivered top-level messages, stock items unchanged`, async () => {
        await reactions.setChecked(withReactions);
        await compareWithStock(states, async () => {
          await longPress();
          assert.ok(await page.locator(menu).count() > 0 && await page.locator(otherMenu).count() === 0, `uses the ${name}`);
          const labels = await names(mobileItems);
          await closeMobileMenu();
          return labels;
        });
      });
      await step(`long-press ${name}: Copy message ID writes the ID and closes; stock Edit and Reply still run`, async () => {
        await reactions.setChecked(withReactions);
        await extended.check();
        await scenario.selectOption('other');
        await page.evaluate(() => navigator.clipboard.writeText('before'));
        await longPress();
        await mobileItems.filter({ hasText: 'Copy message ID' }).click();
        await page.getByText('Copied ID 101', { exact: true }).waitFor();
        await mobileItems.first().waitFor({ state: 'detached' });
        assert.equal(await page.evaluate(() => navigator.clipboard.readText()), '101');
        await scenario.selectOption('own');
        for (const [label, expected] of [['Edit', 'UIKit opened edit'], ['Reply', 'UIKit requested quote reply']]) {
          await longPress();
          await mobileItems.filter({ hasText: new RegExp(`^${label}$`) }).click();
          await page.getByText(expected, { exact: true }).waitFor();
        }
      });
    }
    const copyId = page.getByRole('menuitem', { name: 'Copy message ID', exact: true });
    const expectCopied = async () => {
      await page.getByText('Copied ID 101', { exact: true }).waitFor();
      await copyId.waitFor({ state: 'detached' });
      assert.equal(await page.evaluate(() => navigator.clipboard.readText()), '101');
    };
    await step('bottom-sheet ID copy responds to Enter and Space', async () => {
      await scenario.selectOption('other');
      for (const key of ['Enter', 'Space']) {
        await page.evaluate(() => navigator.clipboard.writeText('before'));
        await longPress();
        await copyId.press(key);
        await expectCopied();
      }
    });
    await step('the extended bottom sheet keeps reactions and ID copy reachable at 390×240', async () => {
      const viewport = page.viewportSize();
      await scenario.selectOption('own');
      await page.setViewportSize({ width, height: 240 });
      const sheet = page.locator(bottomSheet);
      const heart = page.getByTestId('ui_mobile_emoji_reactions_menu_heart');
      try {
        await longPress();
        const reactionBox = await heart.boundingBox();
        assert.ok(reactionBox.y >= 0 && reactionBox.y + reactionBox.height <= 240, 'reaction stays in the viewport');
        const dimensions = await sheet.evaluate(node => ({ height: node.clientHeight, scrollHeight: node.scrollHeight }));
        assert.ok(dimensions.height <= 240 && dimensions.scrollHeight > dimensions.height);
        await copyId.scrollIntoViewIfNeeded();
        assert.ok(await sheet.evaluate(node => node.scrollTop > 0), 'sheet scrolls to the added item');
        await page.evaluate(() => navigator.clipboard.writeText('before'));
        await copyId.click();
        await expectCopied();
        return { reactionTop: reactionBox.y, ...dimensions };
      } finally {
        await page.setViewportSize(viewport);
      }
    });
    await step('Chromium touch opens both mobile menus and taps Copy message ID in the context menu', async () => {
      const cdp = await page.context().newCDPSession(page);
      const touch = (type, touchPoints = []) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints });
      const touchStart = async locator => {
        await locator.scrollIntoViewIfNeeded();
        const box = await locator.boundingBox();
        await touch('touchStart', [{ x: box.x + box.width / 2, y: box.y + box.height / 2 }]);
      };
      const hold = async menu => {
        await touchStart(body);
        try {
          await page.locator(menu).getByRole('menuitem').first().waitFor();
          return await names(mobileItems);
        } finally {
          await touch('touchEnd');
        }
      };
      try {
        await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: true });
        await scenario.selectOption('other');
        await reactions.uncheck();
        await page.evaluate(() => navigator.clipboard.writeText('before'));
        assert.ok((await hold(contextMenu)).includes('Copy message ID'));
        await touchStart(copyId);
        await touch('touchEnd');
        await expectCopied();
        await reactions.check();
        await extended.uncheck();
        const stock = await hold(bottomSheet);
        // In this Chromium touch path, letting go over the backdrop dismisses the stock sheet.
        await page.locator(bottomSheet).waitFor({ state: 'detached' });
        await extended.check();
        assert.deepEqual(await hold(bottomSheet), [...stock, 'Copy message ID']);
        await page.locator(bottomSheet).waitFor({ state: 'detached' });
      } finally {
        await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: false });
        await cdp.detach();
      }
    });
    await step('clipboard rejection reports failure and keeps the bottom sheet open', async () => {
      await page.evaluate(() => {
        navigator.clipboard.writeText = async () => { throw new DOMException('Clipboard denied by test', 'NotAllowedError'); };
      });
      await longPress();
      await copyId.press('Enter');
      await page.getByText('Clipboard is unavailable', { exact: true }).waitFor();
      await copyId.waitFor();
      await closeMobileMenu();
    });
  },

  'localized-reply-count': async ({ page, url, step }) => {
    await page.goto(url);
    const counts = [0, 1, 2, 5, 21, 22, 100];
    const expected = {
      en: ['Enter message', ['', '1 reply', '2 replies', '5 replies', '21 replies', '22 replies', '100 replies']],
      ko: ['메시지 보내기', ['', '1 개의 답글', '2 개의 답글', '5 개의 답글', '21 개의 답글', '22 개의 답글', '100 개의 답글']],
      ru: ['Отправить сообщение', ['', '1 ответ', '2 ответа', '5 ответов', '21 ответ', '22 ответа', '100 ответов']],
    };
    // UIKit 3.20.1 has one singular and one plural reply string; this is its expected Russian output.
    const stockRussian = ['', '1 ответ', '2 ответов', '5 ответов', '21 ответов', '22 ответов', '99+ ответов'];
    const table = await page.locator('table').elementHandle();
    for (const language of ['en', 'ko', 'ru', 'en']) {
      await step(`${language}: stringSet, fallback and plural labels update in place`, async () => {
        await page.getByLabel('Language').selectOption(language);
        const [placeholder, labels] = expected[language];
        assert.equal(await page.getByTestId('input-placeholder').textContent(), placeholder);
        assert.equal(await page.getByTestId('fallback-string').textContent(), 'Copy');
        assert.equal(await page.evaluate(node => node === document.querySelector('table'), table), true);
        for (const [index, count] of counts.entries()) {
          const row = page.locator(`tr[data-count="${count}"]`);
          const stock = row.locator('.sendbird-ui-thread-replies');
          const app = row.locator('td').last().locator('button');
          if (count === 0) {
            assert.equal(await stock.count(), 0);
            assert.equal(await app.count(), 0);
            continue;
          }
          const stockExpected = language === 'ru' ? stockRussian[index] : labels[index].replace(/^100 /, '99+ ');
          assert.equal((await stock.innerText()).trim().replace(/\s+/g, ' '), stockExpected);
          assert.equal(await app.textContent(), labels[index]);
        }
      });
    }
    await step('stock and app reply controls report the same message ID', async () => {
      await page.getByLabel('Language').selectOption('ru');
      const row = page.locator('tr[data-count="22"]');
      await row.locator('.sendbird-ui-thread-replies').click();
      await page.getByText('UIKit reply clicked for message 1022', { exact: true }).waitFor();
      await row.getByRole('button', { name: '22 ответа' }).click();
      await page.getByText('App reply clicked for message 1022', { exact: true }).waitFor();
    });
  },

  'upgrade-and-migration': async ({ page, url, step }) => {
    await page.goto(url);
    const message = page.getByTestId('message');
    const preview = page.getByTestId('preview');
    const composer = page.getByTestId('composer');
    const latest = async () => JSON.parse(await page.getByTestId('observations').textContent());
    const text = 'Meet at the upgrade lab at noon.';
    await step('stock preview, body and timestamp render from public entry points', async () => {
      await message.getByRole('button', { name: 'Like 2' }).waitFor();
      assert.ok(await message.getByText(text, { exact: true }).isVisible());
      assert.ok(await message.locator('.sendbird-message-content__middle__body-container__created-at').isVisible());
      assert.ok(await preview.getByText('Upgrade Lab', { exact: true }).isVisible());
      assert.ok(await preview.getByText(text, { exact: true }).isVisible());
    });
    await step('custom reaction button adds and removes through toggleReaction', async () => {
      await message.getByRole('button', { name: 'Like 2' }).click();
      const added = message.getByRole('button', { name: 'Like 3' });
      await added.waitFor();
      assert.equal(await added.getAttribute('aria-pressed'), 'true');
      assert.deepEqual(await latest(), { action: 'reaction-added', messageId: 101, key: 'like' });
      await added.click();
      await message.getByRole('button', { name: 'Like 2' }).waitFor();
      assert.deepEqual(await latest(), { action: 'reaction-removed', messageId: 101, key: 'like' });
    });
    await step('stock channel preview selects', async () => {
      await preview.getByText('Upgrade Lab', { exact: true }).click();
      assert.deepEqual(await latest(), { action: 'preview-selected' });
    });
    await step('stock composer sends a draft', async () => {
      const send = composer.locator('.sendbird-message-input--send');
      assert.equal(await send.count(), 0);
      await composer.locator('.sendbird-message-input--textarea').fill('Same draft in the existing app.');
      await send.click();
      assert.deepEqual(await latest(), { action: 'send', text: 'Same draft in the existing app.' });
    });
  },
};

assert.deepEqual(Object.keys(scenarios).sort(), topicDirs, 'every topic needs a smoke scenario');
for (const topic of topicDirs) assert.ok(existsSync(join(root, 'dist', topic, 'index.html')), `run npm run build first (${topic})`);

const server = await preview({ root, preview: { host: '127.0.0.1', port: 4317, strictPort: false } });
const origin = new URL(server.resolvedUrls.local[0]).origin;
const browser = await chromium.launch();
report.browser = browser.version();
try {
  for (const width of widths) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, timezoneId: 'UTC', locale: 'en-US', serviceWorkers: 'block' });
    await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin });
    await context.route('**/*', route => {
      const request = route.request();
      const target = new URL(request.url());
      if (target.origin === origin || target.protocol === 'data:' || target.protocol === 'blob:') return route.continue();
      report.blocked.push({ origin: target.origin, type: request.resourceType() });
      return route.abort('blockedbyclient');
    });
    await context.routeWebSocket(/.*/, socket => {
      report.blocked.push({ origin: new URL(socket.url()).origin, type: 'websocket' });
      socket.close();
    });
    for (const [topic, run] of Object.entries(scenarios)) {
      const page = await context.newPage();
      page.setDefaultTimeout(6_000);
      const pageErrors = [];
      page.on('pageerror', error => pageErrors.push(error.message));
      const result = { topic, width, checks: [] };
      let current = '';
      const step = async (name, fn) => {
        current = name;
        const evidence = await fn();
        result.checks.push(evidence === undefined ? name : { name, ...evidence });
      };
      try {
        await run({ page, url: `${origin}/${topic}/`, width, step });
        await step('no page errors or horizontal overflow', async () => {
          assert.deepEqual(pageErrors, []);
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        });
        result.status = 'PASS';
      } catch (error) {
        Object.assign(result, { status: 'FAIL', failedStep: current, error: error.message.split('\n')[0] });
      } finally {
        await page.close();
      }
      report.scenarios.push(result);
      console.log(`${result.status} ${width}px ${topic} (${result.checks.length} checks)${result.error ? ` — ${result.failedStep}: ${result.error}` : ''}`);
    }
    await context.close();
  }
} finally {
  await browser.close();
  await server.close();
}

// UIKit's stylesheet imports a Google Fonts stylesheet; every other request must stay local.
const unexpected = report.blocked.filter(({ origin: blocked, type }) => !(blocked === 'https://fonts.googleapis.com' && type === 'stylesheet'));
const failed = report.scenarios.filter(({ status }) => status !== 'PASS');
report.summary = {
  scenarios: report.scenarios.length,
  passed: report.scenarios.length - failed.length,
  checks: report.scenarios.reduce((sum, { checks }) => sum + checks.length, 0),
  publicImports: report.publicImports.length,
  unexpectedRequests: unexpected.length,
};
if (process.env.SMOKE_REPORT) await writeFile(process.env.SMOKE_REPORT, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ browser: report.browser, versions: report.versions, ...report.summary }));
if (failed.length || unexpected.length) process.exitCode = 1;
