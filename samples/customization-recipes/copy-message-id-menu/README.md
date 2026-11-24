# Copy message ID menu

Add **Copy message ID** to the message menu only for message types, states and channels the extension explicitly supports. Every other message keeps the stock UIKit menu.

## Run it

From `samples/customization-recipes`, run `npm ci` and `npm run dev`, then open `http://127.0.0.1:5173/copy-message-id-menu/`.

1. Select **Someone else’s delivered message** and click **Open menu**. You see Copy, Reply and **Copy message ID**; Edit and Delete are absent. Choose **Copy message ID** to copy `101` and close the menu.
2. Select **My delivered message** to see Edit and Delete next to the new item.
3. Select **Someone else’s reply**, **My pending message** or **My failed message** to see the stock menu without the new item.
4. Turn **Add ID action** off to compare with the stock menu.

## Public API

[integration.tsx](integration.tsx) wraps `MessageMenu` from `@sendbird/uikit-react/ui/MessageMenu`. `ChannelWithCopyMessageId` shows the wiring: `GroupChannel` `renderMessageContent` → `MessageContent` `renderMessageMenu` → `CopyMessageIdMenu`, passing UIKit's props through so the stock handlers stay connected.

The extension applies only when all of these hold; otherwise it renders the stock `MessageMenu` unchanged:

- a user message with `sendingStatus === 'succeeded'` and a positive `messageId`
- a top-level message (no parent, not in a thread list) in a group channel that is not ephemeral or broadcast
- `replyType` is `QUOTE_REPLY`

`renderMenuItems` receives every stock item component, so the extension re-applies the stock visibility rules it renders: Edit and Delete only for the current user's own message, Mark as unread only when `enableMarkAsUnread` is on. The new item uses `MenuItem` and `useMessageMenuContext().hideMenu`. The browser Clipboard API needs HTTPS or localhost; on failure the menu stays open and `onCopyResult` reports `copied: false`.

## What the smoke test checks

At 1280px and 390px, for five message states: with the extension on, the menu equals the stock menu plus **Copy message ID** exactly for the two delivered top-level messages, and Edit never appears on someone else's message. The stock Edit, Reply and Resend callbacks still fire. Keyboard Enter on the new item writes `101` to the clipboard and closes the menu, which stays inside the viewport.

Fixture-only: [fixture.ts](fixture.ts) builds the menu props for each state; Edit, Reply and Resend stop at local callbacks. Server permissions, persistence and the mobile long-press menu are not verified.

[Customize the message menu](https://sendbird.com/docs/chat/uikit/v3/react/tutorial/customize-message-menu)
