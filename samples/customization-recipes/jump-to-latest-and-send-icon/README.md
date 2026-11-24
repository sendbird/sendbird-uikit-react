# Jump to latest and Send icon

Add an app-owned **Jump to latest** button and change the icon inside the stock Send button, while the stock composer keeps handling empty input, quotes, mentions and staged files.

## Run it

From `samples/customization-recipes`, run `npm ci` and `npm run dev`, then open `http://127.0.0.1:5173/jump-to-latest-and-send-icon/`.

1. Scroll the list up. **Jump to latest** becomes enabled; click it to return to the newest message.
2. Type a message and send it with the arrow button.
3. Open a message's menu and choose **Reply**, type `@Al` to mention Alex, or attach a file. **Last local send call** shows what reached the send boundary.

## Public API

[integration.tsx](integration.tsx):

- `JumpToLatest` reads `state.isScrollBottomReached` and calls `actions.scrollToBottom(false)` from `useGroupChannel` (`@sendbird/uikit-react/GroupChannel/context`). Render it inside the `GroupChannelProvider` that owns the message list.
- `BrandedComposer` passes `renderSendMessageIcon` to `MessageInputWrapper`. The renderer supplies only the button's contents, so include accessible text such as the visually hidden "Send". Copy `.visually-hidden` from [../shared/page.css](../shared/page.css).
- `StockConversation` mounts both through `GroupChannelUI` `renderMessageInput`.

In UIKit 3.20.1, `MessageInputWrapper` exposes no handle for submitting its draft from a separate button, and `actions.sendUserMessage` takes `UserMessageCreateParams`, not the draft. If you need your own submit button, own the composer and send with the Chat SDK's `channel.sendUserMessage`, including your own pending, retry, reply and mention handling.

## What the smoke test checks

At 1280px and 390px: the jump button is disabled at the bottom, enabled after scrolling up, and returns the list to the bottom. The branded Send button submits text, a quote reply carries the parent message ID, a mention carries the mentioned user ID, and a staged file is sent as a file message.

Fixture-only: [fixture.tsx](fixture.tsx) replaces the connection, history and send responses through `configureSession`. Upload, persistence and other clients are not verified. The checks cover the latest loaded page of messages.

[Group channel](https://sendbird.com/docs/chat/uikit/v3/react/modules/group-channel) · [Send a message with the Chat SDK](https://sendbird.com/docs/chat/sdk/v4/javascript/message/sending-a-message/send-a-message)
