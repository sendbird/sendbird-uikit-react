// Production smoke test for every recipe page.
// The npm smoke command builds first. This script serves ./dist on loopback, blocks all other network
// requests, and checks each recipe at 1280px and 390px in Chromium.
// Set SMOKE_REPORT=<file> to write the full JSON result.
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { preview, runnerImport } from 'vite';

const root = fileURLToPath(new URL('..', import.meta.url));
const require = createRequire(join(root, 'package.json'));
const widths = [1280, 390];
const report = { versions: {}, publicImports: [], scenarios: [], blocked: [] };
const recipesWithAppHeader = [
  'message-timestamp-and-reaction',
  'theme-variables-and-css',
  'jump-to-latest-and-send-icon',
];

// 1. Published entry points and pinned versions -------------------------------------------
const pkg = require('./package.json');
const installed = name => require(`${name}/package.json`);
for (const name of ['@sendbird/uikit-react', '@sendbird/chat', 'react', 'react-dom']) {
  report.versions[name] = installed(name).version;
  assert.equal(report.versions[name], pkg.dependencies[name], `${name} must match the pinned version`);
}

const requireFromUIKit = createRequire(require.resolve('@sendbird/uikit-react/package.json'));
report.versions['@sendbird/chat from UIKit'] = requireFromUIKit('@sendbird/chat/package.json').version;
assert.equal(report.versions['@sendbird/chat from UIKit'], pkg.dependencies['@sendbird/chat'],
  'UIKit must resolve the same pinned Chat SDK');

const loadRecipeSource = async path => (await runnerImport(join(root, path), { configFile: false, logLevel: 'silent' })).module;
const { readRecipeTopics } = await loadRecipeSource('scripts/recipe-topics.ts');
const topicDirs = readRecipeTopics(root);
const sourceFiles = [];
for (const dir of [...topicDirs, 'shared']) {
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
const { secondsFormat } = await loadRecipeSource('message-timestamp-and-reaction/timestamp-format.ts');
const groupingMessage = (second, millisecond = 0) => ({
  messageType: 'user', sendingStatus: 'succeeded', sender: { userId: 'other' },
  createdAt: new Date(2026, 10, 19, 13, 34, second, millisecond).getTime(),
});
const first = groupingMessage(5);
const laterSecond = groupingMessage(40);
const sameSecond = groupingMessage(5, 400);
report.messageGrouping = {
  stockFormat: isSameGroup(first, laterSecond, LabelStringSet),
  recipeFormat: isSameGroup(first, laterSecond, secondsFormat),
  recipeSameSecond: isSameGroup(first, sameSecond, secondsFormat),
};
assert.deepEqual(report.messageGrouping, { stockFormat: true, recipeFormat: false, recipeSameSecond: true });

const { decodeProduct, encodeProduct, PRODUCT_TYPE } = await loadRecipeSource('product-message-and-channel-preview/product.ts');
const maximumProduct = { sku: 'S'.repeat(64), title: 'T'.repeat(120) };
const paddedProduct = encodeProduct({ sku: ` ${maximumProduct.sku} `, title: ` ${maximumProduct.title} ` });
const boundaryProduct = paddedProduct.data.padEnd(2_048, ' ');
assert.deepEqual(decodeProduct(PRODUCT_TYPE, boundaryProduct), maximumProduct);
for (const [reason, data] of [
  ['payload exceeds 2048 characters', `${boundaryProduct} `],
  ['payload is an array', '[]'],
  ['SKU contains only whitespace', encodeProduct({ ...maximumProduct, sku: '   ' }).data],
  ['SKU exceeds 64 characters', encodeProduct({ ...maximumProduct, sku: `${maximumProduct.sku}S` }).data],
  ['title exceeds 120 characters', encodeProduct({ ...maximumProduct, title: `${maximumProduct.title}T` }).data],
]) {
  assert.equal(decodeProduct(PRODUCT_TYPE, data), undefined, reason);
}
report.productDecoder = { acceptedAtLimit: true, rejectedInvalidCases: 5 };

// 2. Browser scenarios against the production build ---------------------------------------
async function checkHeldReaction(page, button) {
  await button.scrollIntoViewIfNeeded();
  const bounds = await button.boundingBox();
  assert.ok(bounds);
  const x = bounds.x + bounds.width / 2;
  const y = bounds.y + bounds.height / 2;
  const noMessageMenu = async () => assert.equal(
    await page.locator('.sendbird-message__mobile-context-menu, .sendbird-message__bottomsheet').count(), 0,
  );
  await page.mouse.move(x, y);
  await page.mouse.down();
  try {
    // UIKit opens the message menu after a 300 ms hold.
    await page.waitForTimeout(400);
    await noMessageMenu();
  } finally {
    await page.mouse.move(2, 2);
    await page.mouse.up();
  }
  const session = await page.context().newCDPSession(page);
  let touching = false;
  try {
    await session.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 1 });
    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y, id: 1 }] });
    touching = true;
    await page.waitForTimeout(400);
    await noMessageMenu();
  } finally {
    if (touching) await session.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
    await session.send('Emulation.setTouchEmulationEnabled', { enabled: false });
    await session.detach();
  }
}

async function expectDarkBackground(locator, color = 'rgb(22, 22, 22)') {
  await locator.waitFor();
  assert.equal(await locator.evaluate(node => getComputedStyle(node).backgroundColor), color);
}

const scenarios = {
  'message-timestamp-and-reaction': async ({ page, url, width, step }) => {
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
      const button = preview.getByRole('button', { name: `Like ${count}`, exact: true });
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
    if (width === 390) {
      await step('holding the timestamp Like control keeps the mobile message menu closed', async () => {
        await page.goto(url);
        await page.getByLabel('Custom message details').check();
        await checkHeldReaction(page, page.locator('.recipe-reaction-chip'));
      });
    }
    await step('the copyable timestamp channel mounts with stock composer and Like enabled', async () => {
      await page.goto(`${url}?wrapper&localized`);
      await page.getByText('Original message A', { exact: true }).waitFor();
      const like = page.getByRole('button', { name: 'J’aime 1' });
      await like.waitFor();
      await page.getByText('12:01:41', { exact: true }).waitFor();
      await like.click();
      assert.equal(await page.getByRole('button', { name: 'J’aime 2' }).getAttribute('aria-pressed'), 'true');
      await page.locator('.sendbird-message-input--textarea').waitFor();
      assert.ok(await page.getByTestId('sendbird-message-list-container').evaluate(node => node.clientHeight > 100));
    });
    await step('sampled reaction members do not change the total or the current user’s state', async () => {
      await page.goto(`${url}?wrapper&sampled`);
      const liked = page.getByRole('button', { name: 'Like 20', exact: true, pressed: true });
      await liked.click();
      await page.getByRole('button', { name: 'Like 19', exact: true, pressed: false }).waitFor();
      assert.equal(await page.getByTestId('mounted-reactions').textContent(), 'deleteReaction');
    });
    await step('the copied reaction uses dark UIKit tokens before and after a Like', async () => {
      await page.goto(`${url}?wrapper&theme=dark`);
      const unliked = page.getByRole('button', { name: 'Like 1', pressed: false, exact: true });
      await expectDarkBackground(unliked);
      await unliked.click();
      await expectDarkBackground(page.getByRole('button', { name: 'Like 2', pressed: true, exact: true }), 'rgb(44, 44, 44)');
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
      await preview.getByTestId('custom-content').getByText(/History 36/).waitFor();
      assert.equal(await input.count(), 1);
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
    await step('app header and composer replace the stock components in the reordered layout', async () => {
      await page.goto(`${url}?custom-renderers`);
      const header = preview.getByRole('heading', { name: 'App channel header' });
      const composer = preview.getByRole('button', { name: 'App composer' });
      await header.waitFor();
      await composer.waitFor();
      await preview.getByText(/History 36/).waitFor();
      assert.equal(await composer.count(), 1);
      assert.equal(await preview.locator('.sendbird-conversation__channel-header').count(), 0);
      assert.equal(await input.count(), 0);
      const positions = await Promise.all([header.boundingBox(), composer.boundingBox(), list.boundingBox()]);
      const [headerBox, composerBox, listBox] = positions;
      assert.ok(headerBox && composerBox && listBox);
      assert.ok(headerBox.y < composerBox.y && composerBox.y < listBox.y);
      assert.equal(await preview.evaluate(node => {
        const header = node.querySelector('h2');
        const composer = node.querySelector('.recipe-channel-composer button');
        const list = node.querySelector('[data-testid="sendbird-message-list-container"]');
        return Boolean(header?.compareDocumentPosition(composer) & Node.DOCUMENT_POSITION_FOLLOWING)
          && Boolean(composer?.compareDocumentPosition(list) & Node.DOCUMENT_POSITION_FOLLOWING);
      }), true);
    });
    await step('empty app renderers leave the header and composer hidden', async () => {
      await page.goto(`${url}?hide-renderers`);
      await preview.getByText(/History 36/).waitFor();
      assert.equal(await preview.locator('.sendbird-conversation__channel-header').count(), 0);
      assert.equal(await input.count(), 0);
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
    await step('links, mentions and the edited label inherit the bubble typography', async () => {
      const first = page.locator('.sendbird-text-message-item-body').first();
      for (const fragment of [
        first.getByRole('link', { name: 'https://example.com/checklist' }).getByTestId('sendbird-link-label__label'),
        first.getByText('@Sam', { exact: true }),
        first.getByText('(edited)', { exact: true }),
      ]) {
        await fragment.waitFor();
        const { fontSize, lineHeight } = await style(fragment);
        assert.deepEqual([fontSize, lineHeight], ['16px', '24px']);
      }
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
      assert.equal(await unselected.evaluate(node => node.classList.contains('sendbird-reaction-badge--selected')), false);
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
    await step('the copied theme styles a real GroupChannel and keeps it scrollable', async () => {
      await page.goto(`${url}?wrapper`);
      const chat = page.getByRole('region', { name: 'Branded chat' });
      const bubble = chat.locator('.sendbird-text-message-item-body').filter({ hasText: /^History 25$/ });
      await bubble.waitFor();
      const geometry = await style(bubble);
      assert.deepEqual([geometry.radius, geometry.padding, geometry.fontSize, geometry.lineHeight],
        ['12px', '12px 16px', '16px', '24px']);
      assert.match(geometry.font, /Arial/);
      const list = chat.getByTestId('sendbird-message-list-container');
      const bounds = await list.evaluate(node => ({ height: node.clientHeight, content: node.scrollHeight }));
      const wrapper = await chat.evaluate(node => ({ height: node.clientHeight, viewport: innerHeight }));
      assert.ok(bounds.height > 150 && bounds.height < wrapper.height, JSON.stringify({ bounds, wrapper }));
      assert.ok(wrapper.height <= wrapper.viewport && bounds.content - bounds.height > 50, JSON.stringify({ bounds, wrapper }));
      assert.ok(await list.evaluate(node => {
        node.scrollTop = node.scrollHeight;
        return node.scrollTop;
      }) > 50);
    });
    await step('reactions and replies stay on the chosen message in the shared fixture', async () => {
      const chat = page.getByRole('region', { name: 'Branded chat' });
      const row = text => chat.locator('.sendbird-message-content').filter({ has: page.getByText(text, { exact: true }) });
      const first = row('Original message A');
      const latest = row('History 25');
      const reaction = latest.locator('.sendbird-reaction-badge--selected');

      await latest.getByText('History 25', { exact: true }).hover();
      await latest.locator('.sendbird-message-item-reaction-menu__trigger').click();
      await page.getByTestId('ui_emoji_reactions_menu_like').click();
      await reaction.waitFor();
      assert.equal(await first.locator('.sendbird-emoji-reactions__reaction-badge').count(), 0);
      await reaction.click();
      await reaction.waitFor({ state: 'detached' });

      await latest.getByText('History 25', { exact: true }).hover();
      await latest.locator('.sendbird-message-content-menu__normal-menu .sendbird-iconbutton').click();
      await page.getByRole('menuitem', { name: 'Reply', exact: true }).click();
      await chat.locator('.sendbird-quote_message_input').waitFor();
      await chat.locator('.sendbird-message-input--textarea').fill('Reply to the last message');
      await chat.getByTestId('sendbird-message-input-send-button').click();
      const quote = row('Reply to the last message').getByTestId('sendbird-message-content__middle__quote-message');
      await quote.getByText('History 25', { exact: true }).waitFor();
    });
    await step('RTL keeps left-side space for UIKit composer controls', async () => {
      await page.goto(`${url}?wrapper&rtl`);
      const editor = page.locator('[dir="rtl"] .sendbird-message-input--textarea');
      await editor.waitFor();
      const padding = () => editor.evaluate(node => {
        const style = getComputedStyle(node);
        return [style.paddingLeft, style.paddingRight];
      });
      assert.deepEqual(await padding(), ['64px', '16px']);
      await editor.fill('Draft text in a right-to-left layout');
      assert.deepEqual(await padding(), ['64px', '16px']);
      await editor.fill('رسالة من اليمين إلى اليسار');
      assert.deepEqual(await padding(), ['64px', '16px']);
    });
  },

  'jump-to-latest-and-send-icon': async ({ page, url, step, width }) => {
    const editor = page.locator('.sendbird-message-input--textarea');
    const send = page.locator('.sendbird-message-input--send');
    const list = page.getByTestId('sendbird-message-list-container');
    const jump = page.getByRole('button', { name: 'Jump to latest' });
    const record = async () => JSON.parse((await page.getByTestId('sent-record').textContent()) || '{}');
    const arrow = send.locator('.uikit-jump-send-icon');
    const verticalDirection = () => arrow.evaluate(icon => {
      const transforms = [icon, icon.closest('button')].map(node => getComputedStyle(node).transform)
        .filter(value => value !== 'none');
      return transforms.reduce((direction, value) => direction * new DOMMatrix(value).d, 1);
    });
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
      await jump.press('Enter');
      await atBottom();
      assert.equal(await jump.isDisabled(), true);
      assert.equal(await jump.evaluate(button => button === document.activeElement), true);
    });
    await step('branded Send icon submits text through the stock composer', async () => {
      assert.equal(await send.count(), 0);
      await editor.fill('Native Submit');
      assert.equal(await send.locator('.uikit-jump-send-icon').innerText(), '↑');
      await page.getByRole('button', { name: 'Send', exact: true }).click();
      await page.getByText('Native Submit', { exact: true }).waitFor();
      assert.deepEqual(await record(), { channel: 'fixture-channel', text: 'Native Submit', mentions: [] });
    });
    await step('the branded Send arrow stays upright in RTL with text or a staged file', async () => {
      await open();
      await page.evaluate(() => { document.documentElement.dir = 'rtl'; });
      await editor.fill('RTL text');
      assert.equal(await verticalDirection(), 1, 'the text Send arrow flipped');
      await send.click();
      await page.getByText('RTL text', { exact: true }).waitFor();
      assert.deepEqual(await record(), { channel: 'fixture-channel', text: 'RTL text', mentions: [] });
      await page.locator('input[type=file]').setInputFiles({ name: 'rtl.txt', mimeType: 'text/plain', buffer: Buffer.from('Local RTL file') });
      await page.getByText('rtl.txt', { exact: true }).waitFor();
      assert.equal(await verticalDirection(), 1, `the staged file Send arrow flipped at ${width}px`);
      await send.click();
      await page.getByTestId('sent-record').filter({ hasText: 'rtl.txt' }).waitFor();
      assert.deepEqual(await record(), { channel: 'fixture-channel', text: '', file: 'rtl.txt', mentions: [] });
      await open();
    });
    if (width === 390) {
      await step('the Send arrow stays upright in the installed mobile RTL file composer', async () => {
        await page.goto(`${url}?mobile`);
        await page.locator('.sendbird--mobile-mode').first().waitFor();
        await page.evaluate(() => { document.documentElement.dir = 'rtl'; });
        await page.locator('input[type=file]').setInputFiles({ name: 'mobile.txt', mimeType: 'text/plain', buffer: Buffer.from('Local RTL file') });
        await page.getByText('mobile.txt', { exact: true }).waitFor();
        await arrow.waitFor();
        assert.equal(await arrow.evaluate(node => getComputedStyle(node).transform), 'none');
        assert.equal(await verticalDirection(), 1);
        await send.click();
        await page.getByTestId('sent-record').filter({ hasText: 'mobile.txt' }).waitFor();
        assert.deepEqual(await record(), { channel: 'fixture-channel', text: '', file: 'mobile.txt', mentions: [] });
        await open();
      });
    }
    await step('copyable jump CSS hides the Send label and leaves host styles alone', async () => {
      const isolated = await page.context().newPage();
      try {
        await isolated.setContent(`
          <div class="conversation" style="height:30px">Host conversation</div>
          <div class="jump-row"><button>Host button</button></div>
          <button class="sendbird-message-input--send"><span class="uikit-jump-send-icon" aria-hidden="true">↑</span><span class="uikit-jump-visually-hidden">Send</span></button>
        `);
        const sheet = await isolated.addStyleTag({ content: await readFile(join(root, 'jump-to-latest-and-send-icon/jump.css'), 'utf8') });
        const selectors = await sheet.evaluate(node => [...node.sheet.cssRules].flatMap(rule => rule.selectorText?.split(',') ?? ['']));
        assert.ok(selectors.length && selectors.every(selector => selector.includes('.uikit-jump-')));
        assert.equal(await isolated.locator('.conversation').evaluate(node => getComputedStyle(node).borderTopWidth), '0px');
        assert.equal(await isolated.locator('.jump-row').evaluate(node => getComputedStyle(node).display), 'block');
        const button = isolated.getByRole('button', { name: 'Send', exact: true });
        await button.waitFor();
        assert.deepEqual(await button.locator('.uikit-jump-visually-hidden').evaluate(node => {
          const style = getComputedStyle(node);
          return [style.width, style.height, style.clipPath];
        }), ['1px', '1px', 'inset(50%)']);
      } finally {
        await isolated.close();
      }
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
    await step('the copied conversation inherits the provider when replies are disabled', async () => {
      await page.goto(`${url}?no-replies`);
      await page.getByText('History 24', { exact: true }).hover();
      await page.locator('.sendbird-message-content-menu__normal-menu .sendbird-iconbutton:visible').last().click();
      await page.getByRole('menuitem', { name: 'Copy', exact: true }).waitFor();
      assert.equal(await page.getByRole('menuitem', { name: 'Reply', exact: true }).count(), 0);
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
        const color = () => send.locator('.uikit-jump-send-icon').evaluate(node => getComputedStyle(node).color);
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
      await expectDarkBackground(page.locator('.uikit-jump-conversation'));
      await expectDarkBackground(page.getByRole('button', { name: 'Jump to latest' }));
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
      const status = page.locator('.composer-recipe [role="status"]');
      await status.waitFor({ state: 'attached' });
      assert.equal(await status.innerText(), '');
      await editor.fill('Existing');
      await page.getByRole('button', { name: 'Show writing tip' }).click();
      assert.equal(await page.locator('.composer-recipe [role="status"]').innerText(), 'Start with the action you want the recipient to take.');
      assert.equal(await page.getByRole('button', { name: 'Hide writing tip' }).getAttribute('aria-expanded'), 'true');
      assert.equal(await editor.innerText(), 'Existing');
      assert.equal(await log.getByRole('listitem').count(), 0);
    });
    await step('hiding the tip clears the live region and keeps the draft', async () => {
      await page.getByRole('button', { name: 'Hide writing tip' }).click();
      assert.equal(await page.locator('.composer-recipe [role="status"]').innerText(), '');
      assert.equal(await page.getByRole('button', { name: 'Show writing tip' }).getAttribute('aria-expanded'), 'false');
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
    await step('a broadcast member sees neither the composer nor the tip', async () => {
      await page.goto(`${url}?broadcast-member`);
      await page.locator('.composer-frame').waitFor();
      assert.equal(await page.locator('.sendbird-message-input--textarea').count(), 0);
      assert.equal(await page.getByRole('button', { name: 'Show writing tip' }).count(), 0);
    });
    await step('a broadcast operator sees the stock composer and the writing tip', async () => {
      await page.goto(`${url}?broadcast-operator`);
      await editor.waitFor();
      await page.getByRole('button', { name: 'Show writing tip' }).waitFor();
    });
    await step('the copied composer stylesheet leaves the host layout alone', async () => {
      const isolated = await page.context().newPage();
      try {
        await isolated.setContent('<main><button class="recipe-action">App action</button><div class="composer-recipe"><button class="recipe-action">Writing tip</button></div></main>');
        const sheet = await isolated.addStyleTag({ content: await readFile(join(root, 'composer-action-button/composer-tip.css'), 'utf8') });
        const selectors = await sheet.evaluate(node => [...node.sheet.cssRules].flatMap(rule => rule.selectorText?.split(',') ?? ['']));
        assert.ok(selectors.length && selectors.every(selector => selector.trim().startsWith('.composer-recipe')));
        assert.equal(await isolated.locator('main').evaluate(node => getComputedStyle(node).maxWidth), 'none');
        assert.equal(await isolated.getByRole('button', { name: 'App action' }).evaluate(node => getComputedStyle(node).marginTop), '0px');
        assert.equal(await isolated.getByRole('button', { name: 'Writing tip' }).evaluate(node => getComputedStyle(node).marginTop), '8px');
      } finally {
        await isolated.close();
      }
    });
    await step('the copyable composer channel mounts the stock list and writing tip together', async () => {
      await page.goto(`${url}?wrapper`);
      await page.getByText('Original message A', { exact: true }).waitFor();
      await page.locator('.sendbird-message-input--textarea').waitFor();
      const tip = page.getByRole('button', { name: 'Show writing tip' });
      const start = async locator => (await locator.boundingBox()).x;
      assert.ok(Math.abs(await start(tip) - await start(editor)) < 2, 'the tip aligns with the stock editor');
      await editor.fill('A draft with a custom send icon');
      await send.getByText('App send', { exact: true }).waitFor();
      await tip.click();
      await page.getByRole('status').getByText('Start with the action you want the recipient to take.').waitFor();
      assert.ok(await page.getByTestId('sendbird-message-list-container').evaluate(node => node.clientHeight > 100));
      await page.getByRole('button', { name: 'Switch fixture channel' }).click();
      await page.getByText('Original message B', { exact: true }).waitFor();
      await tip.waitFor();
      assert.equal(await tip.getAttribute('aria-expanded'), 'false');
      assert.equal(await page.locator('.composer-recipe [role="status"]').innerText(), '');
    });
    await step('the copied composer button uses the dark UIKit background', async () => {
      await page.goto(`${url}?wrapper&theme=dark`);
      await expectDarkBackground(page.getByRole('button', { name: 'Show writing tip' }));
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
      assert.ok(box && box.x >= 0 && box.x + box.width <= width, `the stock close button is reachable at ${width}px`);
      await close.click();
      await viewer.waitFor({ state: 'hidden' });
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
    await step('editing a product updates the preview and shows the stock edited label in the card', async () => {
      await productRow.getByText('Product: Desk lamp', { exact: true }).waitFor();
      assert.equal(await productRow.getAttribute('aria-current'), 'true');
      assert.equal(await productRow.getAttribute('tabindex'), '0');
      assert.equal(await card.getByText('(edited)', { exact: true }).count(), 0);
      await click('Edit product title');
      await productRow.getByText('Product: Reading lamp', { exact: true }).waitFor();
      await card.getByText('Reading lamp', { exact: true }).waitFor();
      await card.getByText('SKU DEMO-1', { exact: true }).waitFor();
      await card.getByText('(edited)', { exact: true }).waitFor();
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
    await step('the copyable ProductChat shares the product data between real list and channel UI', async () => {
      await page.goto(`${url}?wrapper`);
      const preview = page.getByRole('button', { name: /Conversation A, Product: Fixture lamp/ });
      await preview.waitFor();
      await page.getByText('SKU LAMP-01', { exact: true }).waitFor();
      await page.locator('.sendbird-message-input--textarea').waitFor();
      assert.ok(await page.getByTestId('sendbird-message-list-container').evaluate(node => node.clientHeight > 100));
      await page.getByText('Conversation B', { exact: true }).first().click();
      await page.locator('.sendbird-conversation').getByText('Original message B', { exact: true }).waitFor();
      await preview.click();
      await page.getByText('SKU LAMP-01', { exact: true }).waitFor();
    });
    await step('the copied product card and channel preview use dark UIKit backgrounds', async () => {
      await page.goto(`${url}?wrapper&theme=dark`);
      await expectDarkBackground(page.locator('.product-channel-entry'));
      const row = page.locator('.product-channel-row[aria-current="true"]');
      const card = page.locator('.product-card');
      await expectDarkBackground(row, 'rgb(44, 44, 44)');
      await expectDarkBackground(card);
      for (const element of [card, row]) {
        assert.equal(await element.evaluate(node => getComputedStyle(node).color), 'rgba(255, 255, 255, 0.88)');
      }
      assert.equal(await card.evaluate(node => getComputedStyle(node).borderTopColor), 'rgba(255, 255, 255, 0.12)');
    });
    const confirmation = page.getByText('Leave this channel?', { exact: true });
    async function holdProduct(preview, duringHold) {
      await preview.scrollIntoViewIfNeeded();
      const bounds = await preview.boundingBox();
      assert.ok(bounds);
      const session = await page.context().newCDPSession(page);
      try {
        await session.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 1 });
        await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{
          x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2, id: 1,
        }] });
        if (duringHold) {
          await duringHold();
          await session.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
        } else if (width === 390) {
          await confirmation.waitFor();
          await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        } else {
          // Wait past the one-second UIKit hold threshold before cancelling the desktop touch.
          await page.waitForTimeout(1100);
          assert.equal(await confirmation.count(), 0);
          await session.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
        }
      } finally {
        await session.send('Emulation.setTouchEmulationEnabled', { enabled: false });
        await session.detach();
      }
    }
    await step('the product row opens channel actions without selecting it and leaves once', async () => {
      await page.goto(`${url}?wrapper`);
      const preview = page.getByRole('button', { name: /Conversation A, Product: Fixture lamp/ });
      await preview.waitFor();
      await page.getByText('Conversation B', { exact: true }).first().click();
      const conversation = page.locator('.sendbird-conversation');
      await conversation.getByText('Original message B', { exact: true }).waitFor();
      const actions = page.getByRole('group', { name: 'Conversation A actions' });
      assert.equal(await actions.count(), width === 1280 ? 1 : 0);
      await holdProduct(preview);
      if (width === 1280) {
        await actions.locator('button').click();
        await page.getByText('Leave channel', { exact: true }).click();
      }
      await page.getByText('Leave this channel?', { exact: true }).waitFor();
      await conversation.getByText('Original message B', { exact: true }).waitFor();
      assert.equal(await page.getByTestId('product-operations').textContent(), '');
      await page.getByRole('button', { name: 'Leave', exact: true }).click();
      await page.getByText('Leave this channel?', { exact: true }).waitFor({ state: 'hidden' });
      assert.equal(await page.getByTestId('product-operations').textContent(), 'A: leaveChannel');
    });
    if (width === 390) {
      await step('the UIKit mobile back arrow returns to the list and another channel opens', async () => {
        await page.goto(`${url}?wrapper`);
        const conversation = page.locator('.sendbird-conversation');
        await conversation.getByText('SKU LAMP-01', { exact: true }).waitFor();
        await conversation.locator('.sendbird-chat-header__icon_back').click();
        await conversation.waitFor({ state: 'detached' });
        assert.ok(await page.locator('.product-chat > .sendbird-channel-list').evaluate(list =>
          list.getBoundingClientRect().height >= list.parentElement.getBoundingClientRect().height * .95),
        'the list should fill the chat after returning');
        const next = page.getByRole('link', { name: /Conversation B/ });
        await next.click();
        await conversation.getByText('Original message B', { exact: true }).waitFor();
      });
      await step('a new stock preview cancels the open leave dialog and any pending hold', async () => {
        await page.goto(url);
        const newProduct = page.getByRole('button', { name: 'New product card', exact: true });
        const plainText = page.getByRole('button', { name: 'Plain text', exact: true });
        await newProduct.click();
        await holdProduct(productRow);
        await plainText.evaluate(button => button.click());
        await stockWorkshop.waitFor();
        await confirmation.waitFor({ state: 'hidden' });
        await newProduct.click();
        await productRow.waitFor();
        assert.equal(await confirmation.count(), 0, 'the prior dialog must stay closed when the product row returns');
        await holdProduct(productRow, async () => {
          await plainText.evaluate(button => button.click());
          await stockWorkshop.waitFor();
          // Wait beyond the hold threshold before the next product message restores the row.
          await page.waitForTimeout(1100);
          await newProduct.click();
          await productRow.waitFor();
          assert.equal(await confirmation.count(), 0, 'the prior hold must stay cancelled when the product row returns');
        });
      });
      await step('a failed mobile leave keeps its dialog open and a double click retries once', async () => {
        await page.goto(`${url}?wrapper&leave-fails-once`);
        const preview = page.getByRole('button', { name: /Conversation A, Product: Fixture lamp/ });
        await preview.waitFor();
        await holdProduct(preview);
        const leave = page.getByRole('button', { name: 'Leave', exact: true });
        await leave.click();
        await page.getByRole('alert').getByText('Unable to leave this channel. Try again.', { exact: true }).waitFor();
        assert.equal(await confirmation.isVisible(), true);
        assert.equal(await page.getByTestId('product-operations').textContent(), '');
        const attempts = page.getByTestId('leave-attempts');
        assert.equal(await attempts.textContent(), '1', 'the initial attempt reached the SDK boundary');
        await leave.evaluate(button => { button.click(); button.click(); });
        assert.equal(await leave.isDisabled(), true);
        assert.equal(await attempts.textContent(), '2', 'only one retry may reach the SDK boundary');
        assert.equal(await page.getByTestId('product-operations').textContent(), '');
        await page.locator('button[hidden]').filter({ hasText: 'Complete synthetic leave' }).evaluate(button => button.click());
        await confirmation.waitFor({ state: 'hidden' });
        assert.equal(await page.getByTestId('product-operations').textContent(), 'A: leaveChannel');
      });
    }
    await step('product metadata on an admin message leaves the stock row and body alone', async () => {
      await page.goto(`${url}?wrapper&admin`);
      await page.getByRole('link', { name: /Conversation A/ }).waitFor();
      await page.getByText('A product in the installed UI', { exact: true }).last().waitFor();
      assert.equal(await page.locator('.product-channel-row').count(), 0);
      assert.equal(await page.getByRole('article', { name: 'Product card' }).count(), 0);
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
    await step('B disables reaction and reply even when the app enables both', async () => {
      await page.goto(`${url}?provider-enabled`);
      await message('B').hover();
      assert.equal(await reaction('B').count(), 0);
      await menu('B').click();
      await page.getByText('Copy', { exact: true }).waitFor();
      assert.equal(await page.getByText('Reply', { exact: true }).count(), 0);
    });
  },

  'copy-message-id-menu': async ({ page, url, width, step }) => {
    const resetClipboard = () => page.evaluate(() => navigator.clipboard.writeText('before'));
    const denyClipboard = () => page.evaluate(() => {
      navigator.clipboard.writeText = async () => { throw new DOMException('Clipboard denied by test', 'NotAllowedError'); };
    });
    const openLongPress = async (body, menuItem) => {
      await body.scrollIntoViewIfNeeded();
      const box = await body.boundingBox();
      assert.ok(box);
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      try {
        await menuItem.waitFor();
      } finally {
        await page.mouse.up();
      }
    };
    await step('copyable GroupChannel wrapper keeps the stock menu and adds Copy message ID', async () => {
      await page.goto(`${url}?wrapper`);
      const wrapper = page.getByRole('region', { name: 'Copy wrapper' });
      await wrapper.getByText('Original message A', { exact: true }).hover();
      await wrapper.locator('.sendbird-message-content-menu__normal-menu .sendbird-iconbutton').click();
      const items = await page.getByRole('menuitem').allInnerTexts();
      assert.ok(items.some(item => item.trim() === 'Copy'));
      assert.ok(items.some(item => item.trim() === 'Reply'));
      const copyId = page.getByRole('menuitem', { name: 'Copy message ID', exact: true });
      await resetClipboard();
      await copyId.click();
      await copyId.waitFor({ state: 'hidden' });
      assert.equal(await page.evaluate(() => navigator.clipboard.readText()), '101');
      await page.goto(url);
    });
    await step('thread mode forwards Reply in thread to the app callback', async () => {
      await page.goto(`${url}?wrapper&thread`);
      const wrapper = page.getByRole('region', { name: 'Copy wrapper' });
      const message = wrapper.getByText('Original message A', { exact: true });
      const thread = page.getByRole('menuitem', { name: 'Reply in thread' });
      if (width === 390) {
        await page.locator('.sendbird--mobile-mode').first().waitFor();
        await openLongPress(message, thread);
      } else {
        await message.hover();
        await wrapper.locator('.sendbird-message-content-menu__normal-menu .sendbird-iconbutton').click();
      }
      await thread.waitFor();
      assert.equal(await page.getByRole('menuitem', { name: 'Copy message ID' }).count(), 0);
      await thread.click();
      await page.getByRole('status').filter({ hasText: 'Opened thread for message 101' }).waitFor();
      await page.goto(url);
    });
    if (width === 390) {
      await step('the mounted mobile channel copies the ID of a delivered message sent with the stock composer', async () => {
        await page.goto(`${url}?wrapper&mobile-menu`);
        const wrapper = page.getByRole('region', { name: 'Copy wrapper' });
        await wrapper.locator('.sendbird-message-input--textarea').fill('Copy this delivered message');
        await wrapper.locator('.sendbird-message-input--send').click();
        const copyId = page.getByRole('menuitem', { name: 'Copy message ID', exact: true });
        await resetClipboard();
        await openLongPress(wrapper.getByText('Copy this delivered message', { exact: true }), copyId);
        await page.getByRole('menuitem', { name: 'Edit', exact: true }).waitFor();
        await copyId.click();
        await copyId.waitFor({ state: 'hidden' });
        assert.equal(await page.evaluate(() => navigator.clipboard.readText()), '102');
        await page.goto(url);
      });
    }
    const scenario = page.getByLabel('Message', { exact: true });
    const extended = page.getByRole('checkbox', { name: 'Add ID action' });
    const trigger = page.getByRole('button', { name: 'Open menu' });
    const menuItems = page.getByRole('menuitem');
    const names = (locator = menuItems) => locator.evaluateAll(nodes => nodes.map(node => node.textContent.trim()));
    const states = [['own', true], ['other', true], ['other-reply', false], ['pending', false], ['failed', false]];
    const excluded = ['other-parent-only', 'other-thread-only', 'other-ephemeral', 'other-broadcast', 'other-thread-mode'].map(value => [value, false]);
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
    const readDesktopMenu = async () => {
      await trigger.click();
      await menuItems.first().waitFor();
      const labels = await names();
      await page.mouse.click(4, 4);
      return labels;
    };
    await step('ID action is added only to delivered top-level messages; other items unchanged', async () => {
      await compareWithStock(states, readDesktopMenu);
    });
    await step('a sender mismatch keeps Edit and Delete hidden', async () => {
      await scenario.selectOption('mismatched-owner');
      const labels = await readDesktopMenu();
      assert.ok(labels.includes('Copy message ID'));
      assert.ok(!labels.includes('Edit') && !labels.includes('Delete'));
    });
    await step('parent, thread-list, channel and reply-mode exclusions each keep the stock menu', async () => {
      await compareWithStock(excluded, readDesktopMenu);
    });
    await step('the jump-to-parent callback keeps only the default desktop menu', async () => {
      await compareWithStock([['other-jump-parent', false]], readDesktopMenu);
    });
    await step('Mark as unread remains in the stock and extended menu when enabled', async () => {
      await page.goto(`${url}?mark-as-unread`);
      await scenario.selectOption('other');
      await extended.uncheck();
      await trigger.click();
      await menuItems.first().waitFor();
      const stock = await names();
      assert.ok(stock.includes('Mark as unread'));
      await page.mouse.click(4, 4);
      await extended.check();
      await trigger.click();
      await menuItems.first().waitFor();
      assert.deepEqual(await names(), [...stock, 'Copy message ID']);
      await page.goto(url);
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
      await resetClipboard();
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
      const readContentMenu = async () => {
        await body.hover();
        await content.locator('.sendbird-message-content-menu .sendbird-message-menu .sendbird-iconbutton').click();
        await menuItems.first().waitFor();
        const labels = await names();
        await page.mouse.click(4, 4);
        return labels;
      };
      await step('desktop MessageContent menu adds the ID action through the shared wiring', async () => {
        await reactions.uncheck();
        await compareWithStock([...states.filter(([value]) => value !== 'other-reply' && value !== 'pending'), ...excluded], readContentMenu);
      });
      await step('the mobile-only Delete override keeps both desktop actions available', async () => {
        await compareWithStock([['own-hide-delete', true]], async () => {
          const labels = await readContentMenu();
          assert.ok(labels.includes('Delete'));
          return labels;
        });
      });
      await step('desktop clipboard rejection reports failure and keeps the menu open', async () => {
        await scenario.selectOption('other');
        await extended.check();
        await denyClipboard();
        await body.hover();
        await content.locator('.sendbird-message-content-menu .sendbird-message-menu .sendbird-iconbutton').click();
        const item = page.getByRole('menuitem', { name: 'Copy message ID' });
        await item.click();
        await page.getByText('Clipboard is unavailable', { exact: true }).waitFor();
        assert.ok(await item.isVisible());
      });
      return;
    }
    const mobileItems = page.locator('.sendbird-message__mobile-context-menu [role="menuitem"], .sendbird-message__bottomsheet--action');
    const longPress = () => openLongPress(body, mobileItems.first());
    const closeMobileMenu = async () => {
      await page.locator('.sendbird-bottomsheet__backdrop, .sendbird-dropdown__menu-backdrop').first().click({ position: { x: 4, y: 4 } });
      await mobileItems.first().waitFor({ state: 'detached' });
    };
    const contextMenu = '.sendbird-message__mobile-context-menu';
    const bottomSheet = '.sendbird-message__bottomsheet';
    const readMobile = async () => {
      await longPress();
      const actualMode = await page.locator(bottomSheet).count() > 0 ? 'bottom sheet' : 'context menu';
      const labels = await names(mobileItems);
      await closeMobileMenu();
      return { actualMode, labels };
    };
    await step('mobile Delete visibility and thread-list exclusions keep stock behavior', async () => {
      for (const withReactions of [false, true]) {
        await reactions.setChecked(withReactions);
        for (const [value, hasId] of [['own-hide-delete', true], ['other-thread-only', false]]) {
          await scenario.selectOption(value);
          await extended.uncheck();
          const stock = await readMobile();
          if (value === 'own-hide-delete') assert.ok(!stock.labels.includes('Delete'));
          await extended.check();
          const after = await readMobile();
          assert.equal(after.actualMode, stock.actualMode, value);
          assert.deepEqual(after.labels, hasId ? [...stock.labels, 'Copy message ID'] : stock.labels, value);
        }
      }
    });
    for (const withReactions of [false, true]) {
      const name = withReactions ? 'bottom sheet (reactions on)' : 'context menu (reactions off)';
      await step(`long-press ${name}: ID action only on delivered top-level messages, stock items unchanged`, async () => {
        await reactions.setChecked(withReactions);
        for (const [value, hasId] of [...states, ...excluded.filter(([value]) => value !== 'other-thread-only')]) {
          await scenario.selectOption(value);
          await extended.uncheck();
          const stock = await readMobile();
          await extended.check();
          const after = await readMobile();
          assert.equal(after.actualMode, stock.actualMode, value);
          assert.deepEqual(after.labels, hasId ? [...stock.labels, 'Copy message ID'] : stock.labels, value);
          if (value === 'other') assert.equal(stock.actualMode, withReactions ? 'bottom sheet' : 'context menu');
        }
      });
      await step(`long-press ${name}: Copy message ID writes the ID and closes; stock Edit and Reply still run`, async () => {
        await reactions.setChecked(withReactions);
        await extended.check();
        await scenario.selectOption('other');
        await resetClipboard();
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
    await step('mobile Mark as unread keeps stock menu order in both presentations', async () => {
      await page.goto(`${url}?mark-as-unread`);
      for (const withReactions of [false, true]) {
        await reactions.setChecked(withReactions);
        await extended.uncheck();
        const stock = await readMobile();
        assert.ok(stock.labels.includes('Mark as unread'));
        await extended.check();
        const after = await readMobile();
        assert.equal(after.actualMode, stock.actualMode);
        assert.deepEqual(after.labels, [...stock.labels, 'Copy message ID']);
      }
      await page.goto(url);
    });
    const copyId = page.getByRole('menuitem', { name: 'Copy message ID', exact: true });
    const expectCopied = async () => {
      await page.getByText('Copied ID 101', { exact: true }).waitFor();
      await copyId.waitFor({ state: 'detached' });
      assert.equal(await page.evaluate(() => navigator.clipboard.readText()), '101');
    };
    await step('bottom-sheet ID copy responds to Enter and Space', async () => {
      await reactions.check();
      await scenario.selectOption('other');
      for (const key of ['Enter', 'Space']) {
        await resetClipboard();
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
        await resetClipboard();
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
        await resetClipboard();
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
      await denyClipboard();
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
          const appExpected = language === 'ko' ? labels[index].replace(' 개', '개') : labels[index];
          assert.equal(await app.textContent(), appExpected);
        }
      });
    }
    await step('stock and app reply labels call their respective handlers', async () => {
      await page.getByLabel('Language').selectOption('ru');
      const row = page.locator('tr[data-count="22"]');
      await row.locator('.sendbird-ui-thread-replies').click();
      await page.getByText('UIKit reply clicked for message 1022', { exact: true }).waitFor();
      await row.getByRole('button', { name: '22 ответа', exact: true }).click();
      await page.getByText('App reply clicked for message 1022', { exact: true }).waitFor();
    });
  },

  'upgrade-and-migration': async ({ page, url, width, step }) => {
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
    if (width === 390) {
      await step('holding the migrated Like control keeps the mobile message menu closed', async () => {
        await checkHeldReaction(page, message.getByRole('button', { name: 'Like 2' }));
      });
    }
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
    await step('mixed and heart-only reactions use the stock reaction row', async () => {
      for (const [mode, count] of [['mixed', 2], ['heart', 1]]) {
        await page.goto(`${url}?reactions=${mode}`);
        const badges = message.locator('.sendbird-reaction-badge');
        await badges.first().waitFor();
        assert.equal(await badges.count(), count);
        assert.equal(await message.locator('.recipe-like').count(), 0);
      }
      await page.goto(url);
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
    await step('the copied migration wrapper selects a channel and sends once from the stock composer', async () => {
      await page.goto(`${url}?wrapper`);
      await page.getByRole('button', { name: 'Like 1', exact: true }).click();
      await page.getByRole('button', { name: 'Like 2', exact: true, pressed: true }).waitFor();
      await page.goto(`${url}?wrapper`);
      await page.locator('.sendbird-message-input--textarea').waitFor();
      assert.ok(await page.getByTestId('sendbird-message-list-container').evaluate(node => node.clientHeight > 100));
      await page.getByText('Conversation B', { exact: true }).first().click();
      const conversation = page.locator('.sendbird-conversation');
      await conversation.getByText('Original message B', { exact: true }).waitFor();
      await conversation.locator('.sendbird-message-input--textarea').fill('Send after switching channels');
      await conversation.locator('.sendbird-message-input--send').click();
      await conversation.getByText('Send after switching channels', { exact: true }).waitFor();
      assert.deepEqual(JSON.parse(await page.getByTestId('mounted-operations').textContent()),
        [{ screen: 'B', operation: 'sendUserMessage', text: 'Send after switching channels' }]);
    });
    await step('the copied migration reaction uses dark UIKit tokens before and after a Like', async () => {
      await page.goto(`${url}?wrapper&theme=dark`);
      const unliked = page.getByRole('button', { name: 'Like 1', pressed: false, exact: true });
      await expectDarkBackground(unliked);
      await unliked.click();
      await expectDarkBackground(page.getByRole('button', { name: 'Like 2', pressed: true, exact: true }), 'rgb(44, 44, 44)');
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
    for (const [topic, run] of Object.entries(scenarios)) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, timezoneId: 'UTC', locale: 'en-US', serviceWorkers: 'block' });
      const browserErrors = [];
      context.on('weberror', error => browserErrors.push(error.error().message));
      context.on('console', message => {
        if (message.type() !== 'error') return;
        // The SDK stylesheet requests this blocked, optional font.
        if (message.location().url.startsWith('https://fonts.googleapis.com/') && message.text().includes('ERR_BLOCKED_BY_CLIENT')) return;
        browserErrors.push(message.text());
      });
      context.on('response', response => {
        if (new URL(response.url()).origin === origin && response.status() >= 400) {
          browserErrors.push(`${response.status()} ${response.url()}`);
        }
      });
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
      const page = await context.newPage();
      page.setDefaultTimeout(6_000);
      const result = { topic, width, checks: [] };
      let current = '';
      const step = async (name, fn) => {
        current = name;
        const evidence = await fn();
        result.checks.push(evidence === undefined ? name : { name, ...evidence });
      };
      try {
        const url = `${origin}/${topic}/`;
        await step('recipe entry renders without horizontal overflow', async () => {
          await page.goto(url);
          await page.getByRole('heading', { level: 1 }).waitFor();
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        });
        await run({ page, url, width, step });
        if (recipesWithAppHeader.includes(topic)) {
          await step('the mounted channel renders the app-provided header', async () => {
            await page.goto(`${url}?wrapper&app-header`);
            await page.getByRole('heading', { name: 'App channel header', exact: true }).waitFor();
          });
        }
        await step('no browser errors, local HTTP failures or horizontal overflow', async () => {
          assert.deepEqual(browserErrors, [], browserErrors[0]);
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        });
        result.status = 'PASS';
      } catch (error) {
        Object.assign(result, { status: 'FAIL', failedStep: current, error: error.message.split('\n')[0] });
      } finally {
        await context.close();
      }
      report.scenarios.push(result);
      console.log(`${result.status} ${width}px ${topic} (${result.checks.length} checks)${result.error ? ` — ${result.failedStep}: ${result.error}` : ''}`);
    }
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
