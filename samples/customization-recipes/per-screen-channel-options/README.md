# Per-screen channel options

Give two conversation screens different reaction, reply and emoji-category settings under one `SendbirdProvider`.

## Run it

From `samples/customization-recipes`, run `npm ci` and `npm run dev`, then open `http://127.0.0.1:5173/per-screen-channel-options/`.

1. In **Screen A**, hover the message and open the reaction picker. Only the Gesture category (👍) is offered. Open the message menu and choose **Reply**; the quote is sent with the original message ID.
2. In **Screen B**, the reaction button and **Reply** are hidden. **Copy** and sending still work.
3. Click **Remount A with Celebrate**. Screen A remounts with the Celebrate category (🎉); Screen B stays mounted.

## Public API

[integration.tsx](integration.tsx) renders each screen as a `GroupChannelProvider` from `@sendbird/uikit-react/GroupChannel/context` with its own `isReactionEnabled`, `replyType` and `filterEmojiCategoryIds`, plus `GroupChannelUI`. Keep one `SendbirdProvider` at your app root; mentions and other app-level options still come from it.

Known limits in UIKit 3.20.1: changing `filterEmojiCategoryIds` on a mounted screen does not refresh that screen's reaction picker. Treat each category preset as static per mount. To apply a new preset, change the screen's `key`, as `ChannelScreen` does. Remounting resets that screen's draft and scroll position. When `SendbirdProvider` has a `breakpoint` that activates mobile mode, the mobile message and emoji bottom sheets offer the full emoji catalog instead of applying `filterEmojiCategoryIds`. The message sheet initially shows one row, with More revealing the rest. This fixture does not set `breakpoint`, so its picker stays on the desktop path at both tested widths. The provider settings also depend on the reactions feature of your application and on the message and channel permissions. Use category IDs that exist in your application's emoji catalog.

## What the smoke test checks

At 1280px and 390px, with mobile mode off: both screens resolve the same user with different options; A's desktop picker lists only `like` and calls `addReaction`; A's quote reply sends `parentMessageId` 101; B has no reaction trigger and no Reply but keeps Copy and send; remounting A replaces only A and its picker then lists only `celebrate`.

Fixture-only: [The shared group-channel fixture](../shared/group-channel-fixture.tsx) supplies synthetic users, three registered emoji categories, messages and in-memory send/reaction callbacks through `configureSession`. The mobile long-press menu, persistence and other clients are not verified.

[Group channel](https://sendbird.com/docs/chat/uikit/v3/react/modules/group-channel) · [Reactions](https://sendbird.com/docs/chat/uikit/v3/react/features/reactions)
