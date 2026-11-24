# Upgrade and migration

Treat an SDK upgrade and a legacy channel-module migration as two separate changes. Upgrade first with pinned versions and published subpath imports, check the same app code still behaves the same, then move from `Channel`/`ChannelList` to `GroupChannel`/`GroupChannelList`.

## Run it

From `samples/customization-recipes`, run `npm ci` and `npm run dev`, then open `http://127.0.0.1:5173/upgrade-and-migration/`.

Click the **Upgrade Lab** channel preview, toggle the heart twice, then type a draft and send it with the stock composer. **Latest local action** shows the last call that reached the fixture.

## 1. Upgrade the dependency

1. In your existing app, install exact versions with the package manager and lockfile it already uses, for example `npm install --save-exact @sendbird/uikit-react@3.20.1 @sendbird/chat@4.22.17`. Keep the router, sign-in, layout and build setup. [Installation](https://sendbird.com/docs/chat/uikit/v3/react/essentials/installation) · [Integrate with an existing app](https://sendbird.com/docs/chat/uikit/v3/react/tutorial/integrate-with-existing-app)
2. Import `@sendbird/uikit-react/dist/index.css` once at your global CSS entry. In a Next.js App Router app, render the chat from a Client Component. [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
3. Import only the package's published subpaths, as in [integration.tsx](integration.tsx). For example, `MessageBody` is a named export of `@sendbird/uikit-react/ui/MessageContent`; there is no `ui/MessageBody` entry point.
4. Commit the dependency and lockfile change alone, then re-run your chat checks: channel preview selection, stock message rendering, reactions and send.

To compare two pins with this package, install the other pair with `--save-exact`, then run `npm run build` and `npm run smoke`. The smoke test fails if the installed versions differ from `package.json`.

## 2. Migrate legacy channel modules

| Legacy entry point | Replacement | Retest |
| --- | --- | --- |
| `@sendbird/uikit-react/Channel`, `Channel/context` | `@sendbird/uikit-react/GroupChannel`, `GroupChannel/context` | Provider scope, `useGroupChannel`, pagination, scroll position, send and retry |
| `@sendbird/uikit-react/ChannelList`, `ChannelList/context` | `@sendbird/uikit-react/GroupChannelList`, `GroupChannelList/context` | Selection, preview, unread count, ordering and filters |
| A custom message view through `renderMessage` | `GroupChannel` still supports `renderMessage`, but it now renders the whole message item: wrap custom children in `GroupChannel/components/Message`. For content-only changes, use `renderMessageContent` with `MessageContent`. | Sender, body, timestamp, reactions, menu, quotes and attachments |

If you use the all-in-one `App` and still need the legacy modules during the transition, `enableLegacyChannelModules` keeps them. When you move custom send code, use the params-based `sendUserMessage` and `updateUserMessage` actions, which return promises. [Repository migration notes](../../../MIGRATION_COLLECTION.md#migrate-channel-to-groupchannel) · [GroupChannel migration guide](https://sendbird.com/docs/chat/uikit/v3/react/miscellaneous/group-channel-migration-guide)

## Public API

[integration.tsx](integration.tsx) shows the migrated composition using `SendbirdProvider`, `GroupChannelList` and `GroupChannel`. It imports the companion [like.css](like.css) for its reaction button. The `renderMessageContent` callback forwards props to `MessageContent` and replaces only `renderEmojiReactions`. `ExistingAppChat` expects the `appId`, `userId` and `accessToken` your server issues for the signed-in user.

Register `like` in your application's emoji set or use a key you already registered. The button replaces the reaction row only when `like` is the sole reaction and UIKit supplies `toggleReaction`. It omits the stock add-reaction picker, the desktop tooltip and mobile long-press sheet for reacted members, and the filter check that can show "Add reaction failed" for an emoji outside the categories allowed by `filterEmojiCategoryIds`. Messages with no reaction, another key or mixed reactions keep UIKit's default behavior.

## What the smoke test checks

Before the browser runs, the smoke test asserts that every `@sendbird/*` import in these recipes is in the installed package's `exports` map, that the legacy `Channel`, `ChannelList`, their `context` subpaths and `App` are still published, that `ui/MessageBody` is not, and that the installed versions match the pins. At 1280px and 390px against the production build: the stock preview, body and timestamp render, the Like button adds and removes through `toggleReaction`, mixed and heart-only reactions keep the stock row, the stock preview selects, and the stock composer sends the draft.

Fixture-only: [fixture.tsx](fixture.tsx) supplies the channel, message and group channel store and records reaction, selection and send locally. The smoke exercises its preview and composer overrides, not the exported `ExistingAppChat` composition. That wrapper is type-checked but is not mounted with an authenticated session or run against a live service.

[Customization](https://sendbird.com/docs/chat/uikit/v3/react/customization) · [Reactions](https://sendbird.com/docs/chat/uikit/v3/react/features/reactions)
