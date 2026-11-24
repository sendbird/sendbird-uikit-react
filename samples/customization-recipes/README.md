# UIKit for React customization recipes

Ten small recipes that customize Sendbird UIKit for React through published entry points. Each page renders the installed `@sendbird/uikit-react` components against local synthetic data, so you can run them without a Sendbird application or credentials.

## Requirements

| Package | Version |
| --- | --- |
| `@sendbird/uikit-react` | 3.20.1 |
| `@sendbird/chat` | 4.22.17 |
| React and React DOM | 19.3.1 |
| Vite / TypeScript | 8.3.8 / 7.0.2 |
| Playwright (smoke test only) | 1.65.1 |

Vite 8 requires Node.js `^20.19.0 || >=22.12.0`. The recipes were checked with Node.js 26.12.1 and npm 11.20.0. Dependencies are pinned and locked in `package-lock.json`.

## Run the recipes

```sh
cd samples/customization-recipes
npm ci
npm run dev
```

Open `http://127.0.0.1:5173/` and choose a recipe. Each recipe has its own README describing what to click.

## Verify the production build

```sh
npm run build            # tsc --noEmit, then vite build
npm run browser:install  # once, downloads Playwright's Chromium
npm run smoke
```

`npm run smoke` serves `dist/` on loopback and blocks every other request. It runs each recipe in Chromium at 1280px and 390px and asserts the behavior described in that recipe's README. It also checks that every `@sendbird/*` import is a published entry point of the installed package and that the installed SDK versions match the pins. Set `SMOKE_REPORT=<file>` to write the full JSON result. The UIKit stylesheet requests a Google Fonts stylesheet; the smoke test blocks it and the pages fall back to system fonts.

## Recipes

| Recipe | What it changes | Main public API |
| --- | --- | --- |
| [Message timestamp and reaction](message-timestamp-and-reaction/README.md) | Seconds in the message time and a single Like button | `stringSet`, `MessageContent.renderEmojiReactions` |
| [Composer above the message list](composer-above-message-list/README.md) | Header → composer → list layout | `GroupChannelProvider` with `MessageInputWrapper` and `MessageList` |
| [Theme variables and CSS](theme-variables-and-css/README.md) | Brand colors and font, then bubble and composer geometry | `--sendbird-*` variables, scoped CSS |
| [Jump to latest and Send icon](jump-to-latest-and-send-icon/README.md) | An app button that scrolls to the newest message, and a custom Send icon | `useGroupChannel`, `renderSendMessageIcon` |
| [Composer action button](composer-action-button/README.md) | An app button next to the stock composer | `renderMessageInput`, `MessageInputWrapper` |
| [Product message and channel preview](product-message-and-channel-preview/README.md) | One typed product payload drives a message card and a channel-list row | `renderMessageBody`, `renderChannelPreview` |
| [Per-screen channel options](per-screen-channel-options/README.md) | Different reaction, reply and emoji settings on two screens | `GroupChannelProvider` props |
| [Copy message ID menu](copy-message-id-menu/README.md) | One extra message menu item for supported messages | `renderMessageMenu`, `MessageMenu` |
| [Localized reply count](localized-reply-count/README.md) | Switch UIKit strings and format reply counts per language | `stringSet`, `useLocalization` |
| [Upgrade and migration](upgrade-and-migration/README.md) | Pin SDK versions, then migrate legacy channel modules separately | Published subpath imports, `GroupChannel` |

## How each recipe is organized

- `integration.tsx` is the code to copy. It imports only published entry points and expects to run under your app's existing, authenticated `SendbirdProvider`. The one exception is `ExistingAppChat` in the upgrade recipe, which shows that root provider itself.
- `fixture*.tsx` replaces the Chat SDK transport with synthetic users, channels and messages and records send and reaction calls in memory. It exists only to run the page locally; do not copy it into an app.
- `main.tsx`, `index.html` and `style.css` build the demo page.

Each page mounts one `SendbirdProvider`, as a real app should at its root. Because the fixtures replace the network layer, sign-in, persistence, delivery to other devices and other live service behavior are not exercised. Check those in an authorized test application before you ship a change.

[UIKit for React documentation](https://sendbird.com/docs/chat/uikit/v3/react/customization) · [SendbirdProvider](https://sendbird.com/docs/chat/uikit/v3/react/essentials/sendbirdprovider)
