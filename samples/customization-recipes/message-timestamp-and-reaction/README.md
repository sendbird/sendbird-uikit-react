# Message timestamp and reaction

Show seconds in the message time and replace a single-type reaction row with a Like button, while UIKit keeps rendering the sender, body and timestamp element.

## Run it

From `samples/customization-recipes`, run `npm ci` and `npm run dev`, then open `http://127.0.0.1:5173/message-timestamp-and-reaction/`.

1. Turn on **Custom message details**. The time changes from `12:34` to `12:34:56` in the same element.
2. Click the heart, or focus it and press Enter or Space. The count toggles between 2 and 3 and **Local SDK calls** lists `addReaction` and `deleteReaction`.
3. Turn on **Long message** to check the wrapped layout, and **Mixed reactions** to see the stock reaction row return.

## Public API

[integration.tsx](integration.tsx) shows the change inside a `GroupChannel` (`ChannelWithMessageDetails`):

- `secondsFormat` (`DATE_FORMAT__MESSAGE_CREATED_AT: 'HH:mm:ss'`) for the `stringSet` of your root `SendbirdProvider`. Merge it into your existing string overrides.
- `GroupChannel` `renderMessageContent` → `MessageContent` from `@sendbird/uikit-react/ui/MessageContent` with `renderEmojiReactions`.
- The custom button calls the supplied `toggleReaction(message, key, selected)`. Any other reaction combination is handed to `EmojiReactions` from `@sendbird/uikit-react/ui/EmojiReactions`. Copy [reaction.css](reaction.css) with the component.

Use the reaction key your application has registered. The button covers count and add/remove for an existing `like` reaction. Adding the first reaction, reaction details and participant tooltips stay with the stock UI.

## What the smoke test checks

At 1280px and 390px: the timestamp element and its parent are unchanged after the format switch, click/Enter/Space produce `add → delete → add → delete`, the long body does not overlap the time and button, and mixed reactions render two stock badges.

Fixture-only: [fixture.tsx](fixture.tsx) supplies the message, channel and group channel store, and its `addReaction`/`deleteReaction` only update local state. Server persistence and delivery to other users are not verified.

[Reactions](https://sendbird.com/docs/chat/uikit/v3/react/features/reactions) · [Text localization](https://sendbird.com/docs/chat/uikit/v3/react/theme-and-style-resources/localization-resources/text) · [Group channel](https://sendbird.com/docs/chat/uikit/v3/react/modules/group-channel)
