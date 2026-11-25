# Composer above the message list

Recompose the stock group channel parts as header → composer → message list, in both DOM and visual order, while keeping the stock composer and its send path.

## Run it

From `samples/customization-recipes`, run `npm ci` and `npm run dev`, then open `http://127.0.0.1:5173/composer-above-message-list/`.

1. Turn on **Composer on top**.
2. Type a message and send it. **Local SDK calls** shows one `GroupChannel.sendUserMessage` call and the message appears in the list.
3. Use **Channel state** to see the loading, empty, error, offline and typing views in the reordered layout.

## Public API

Mount `ReorderedChannel` from [integration.tsx](integration.tsx) under your authenticated `SendbirdProvider`. The demo mounts it with synthetic SDK responses:

- The `GroupChannel` header renders `GroupChannelHeader` and `MessageInputWrapper`, or the replacements you pass. The bottom composer slot is empty, so there is only one editor.
- `GroupChannel` still renders the stock list, loading and error states, typing indicator and connection notice. Other public callbacks, including `renderMessageContent`, pass through.
- [layout.css](layout.css) sizes the shell. Give its parent a defined height.

## What the smoke test checks

At 1280px and 390px: stock order is header → list → composer and the reordered view is header → composer → list in DOM and on screen. The custom header and composer render once in the same order and replace their stock counterparts. A callback that returns `null` hides its section. The five states render, the list scrolls both ways, and one send adds exactly one message while all 36 history messages remain.

Fixture-only: [fixture.tsx](fixture.tsx) replaces the Chat SDK connection, channel lookup, message collection and send response through `configureSession`. Reconnection, persistence and delivery to other devices are not verified. Toggling **Composer on top** remounts the layout, so scroll position is not kept across the toggle.

[Group channel](https://sendbird.com/docs/chat/uikit/v3/react/modules/group-channel) · [Group channel migration guide](https://sendbird.com/docs/chat/uikit/v3/react/miscellaneous/group-channel-migration-guide)
