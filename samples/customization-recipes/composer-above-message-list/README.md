# Composer above the message list

Recompose the stock group channel parts as header → composer → message list, in both DOM and visual order, while keeping the stock composer and its send path.

## Run it

From `samples/customization-recipes`, run `npm ci` and `npm run dev`, then open `http://127.0.0.1:5173/composer-above-message-list/`.

1. Turn on **Composer on top**.
2. Type a message and send it. **Local SDK calls** shows one `GroupChannel.sendUserMessage` call and the message appears in the list.
3. Use **Channel state** to see the loading, empty, error, offline and typing views in the reordered layout.

## Public API

Mount `ReorderedChannel` from [integration.tsx](integration.tsx) under your authenticated `SendbirdProvider`. The demo uses its `ReorderedChannelContent` inside a group channel provider with synthetic SDK responses:

- One `GroupChannelProvider` from `@sendbird/uikit-react/GroupChannel/context` wraps `GroupChannelHeader`, `MessageInputWrapper` and `MessageList` from `@sendbird/uikit-react/GroupChannel/components/*`.
- When you compose the parts yourself, you also render the surrounding states. The example reads `fetchChannelError` from `useGroupChannel` and `isOnline` and the typing options from `useSendbird`, then mounts `PlaceHolder`, `TypingIndicator` and `ConnectionStatus`.
- [layout.css](layout.css) gives the list the remaining height. The shell needs a defined height.

## What the smoke test checks

At 1280px and 390px: stock order is header → list → composer and the reordered view is header → composer → list in DOM and on screen. The five states render, the list scrolls both ways, and one send adds exactly one message while all 36 history messages remain.

Fixture-only: [fixture.tsx](fixture.tsx) replaces the Chat SDK connection, channel lookup, message collection and send response through `configureSession`. Reconnection, persistence and delivery to other devices are not verified. Toggling **Composer on top** remounts the layout, so scroll position is not kept across the toggle.

[Group channel](https://sendbird.com/docs/chat/uikit/v3/react/modules/group-channel) · [Group channel migration guide](https://sendbird.com/docs/chat/uikit/v3/react/miscellaneous/group-channel-migration-guide)
