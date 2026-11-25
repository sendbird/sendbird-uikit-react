# Message timestamp and reaction

Show seconds in the message time and replace a single-type reaction row with a Like button, while UIKit keeps rendering the sender, body and timestamp element.

## Run it

From `samples/customization-recipes`, run `npm ci` and `npm run dev`, then open `http://127.0.0.1:5173/message-timestamp-and-reaction/`.

1. Turn on **Custom message details**. In a UTC browser the time changes from `12:34` to `12:34:56` in the same place in the message row. The fixture displays the same instant in your browser’s time zone. The page's baseline is `HH:mm`; UIKit's own default, `p`, shows a locale time such as `12:34 PM`.
2. Click the heart, or focus it and press Enter or Space. The count toggles between 2 and 3 and **Local SDK calls** lists `addReaction` and `deleteReaction`.
3. Turn on **Long message** to check the wrapped layout, and **Mixed reactions** to see the stock reaction row return.

## Public API

[integration.tsx](integration.tsx) shows the change inside a `GroupChannel` (`ChannelWithMessageDetails`):

- `secondsFormat` (`DATE_FORMAT__MESSAGE_CREATED_AT: 'HH:mm:ss'`) for the `stringSet` of your root `SendbirdProvider`. Merge it into your existing string overrides.
  - The format applies across the provider. UIKit uses the formatted time to group consecutive messages from the same sender. When the other grouping conditions match, messages sent in different seconds of the same minute split into separate groups. UIKit still decides which sender names, avatars and timestamps to display for each group. Messages with the same formatted second still group together, even if their timestamps differ by milliseconds.
  - `HH` is a 24-hour clock, so users who saw `1:05 PM` see `13:05:09`. Use `pp` for seconds in the `dateLocale` you pass to `SendbirdProvider`. The default date locale is en-US.
- `GroupChannel` `renderMessageContent` → `MessageContent` from `@sendbird/uikit-react/ui/MessageContent` with `renderEmojiReactions`.
- The custom button calls the supplied `toggleReaction(message, key, selected)`. Any other reaction combination is handed to `EmojiReactions` from `@sendbird/uikit-react/ui/EmojiReactions`. Copy [reaction.css](reaction.css) and [timestamp-format.ts](timestamp-format.ts) with the component.

To translate the Like button’s accessible name, set `FEEDBACK_LIKE` in the provider’s `stringSet`. The name includes the current count.

Register `like` in your application's emoji set or use a key you already registered. The button replaces the reaction row only when `like` is the sole reaction and UIKit supplies `toggleReaction`. It omits the stock add-reaction picker, the desktop tooltip and mobile long-press sheet for reacted members, and the filter check that can show "Add reaction failed" for an emoji outside the categories allowed by `filterEmojiCategoryIds`. Messages with no reaction, another key or mixed reactions keep UIKit's default behavior.

## What the smoke test checks

A synthetic SDK session also mounts `ChannelWithMessageDetails` and checks the stock composer, seconds on the rendered timestamp and the Like button’s count and pressed state.

Before the browser runs, UIKit's published `isSameGroup` (`@sendbird/uikit-react/Channel/utils/compareMessagesForGrouping`) confirms that different seconds in one minute group with the default `p` format and split with this recipe's format. The recipe format still groups timestamps within the same second.

At 1280px and 390px: the timestamp element and its parent are unchanged after the format switch, click/Enter/Space produce `add → delete → add → delete`, the long body does not overlap the time and button, and mixed reactions render two stock badges.

Fixture-only: [fixture.tsx](fixture.tsx) supplies the message, channel and group channel store, and its `addReaction`/`deleteReaction` only update local state. The smoke mounts both the content override and `ChannelWithMessageDetails` with local data. Authentication, persistence and delivery to other users require a connected test app.

[Reactions](https://sendbird.com/docs/chat/uikit/v3/react/features/reactions) · [Text localization](https://sendbird.com/docs/chat/uikit/v3/react/theme-and-style-resources/localization-resources/text) · [Group channel](https://sendbird.com/docs/chat/uikit/v3/react/modules/group-channel)
