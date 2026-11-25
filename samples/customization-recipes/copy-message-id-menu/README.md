# Copy message ID menu

Add **Copy message ID** to the message menu only for message types, states and channels the extension explicitly supports. Every other message keeps the stock UIKit menu.

## Run it

From `samples/customization-recipes`, run `npm ci` and `npm run dev`, then open `http://127.0.0.1:5173/copy-message-id-menu/`.

1. Select **Someone else’s delivered message** and click **Open menu**. You see Copy, Reply and **Copy message ID**; Edit and Delete are absent. Choose **Copy message ID** to copy `101` and close the menu.
2. Select **My delivered message** to see Edit and Delete next to the new item.
3. Select a reply, a message in a thread list, an ephemeral or broadcast channel, `THREAD` reply mode, a pending message or a failed message to see the stock menu without the new item.
4. Turn **Add ID action** off to compare with the stock menu.
5. Narrow the window below 600px and press and hold the message under **Message with the long-press menu**. UIKit opens its mobile menu, which shows the same new item under the same rules. Check **Reactions** to switch from the context menu to the bottom sheet.

## Public API

[integration.tsx](integration.tsx) has two menus, both passing UIKit's props through so the stock handlers stay connected:

- `CopyMessageIdMenu` wraps `MessageMenu` from `@sendbird/uikit-react/ui/MessageMenu`, the menu `MessageContent` shows on desktop.
- `CopyMessageIdMobileMenu` wraps `MobileMenu` from `@sendbird/uikit-react/ui/MobileMenu`, the long-press menu `MessageContent` shows instead when the provider's `breakpoint` makes the screen mobile.

`CopyIdMessageContent` passes them to `MessageContent` as `renderMessageMenu` and `renderMobileMenuOnLongPress`. `ChannelWithCopyMessageId` renders it from `GroupChannel` `renderMessageContent`, and the normal demo cases render the same component. For the fixture-only thread-list and hidden-Delete cases, the demo supplies menu props through both render callbacks because `MessageContent` does not expose those options directly.

The extension applies only when all of these hold. Other messages use the stock desktop `MessageMenu` or mobile `MobileMenu`.

- a user message with `sendingStatus === 'succeeded'` and a positive `messageId`
- a top-level message (no parent, not in a thread list) in a group channel that is not ephemeral or broadcast
- `replyType` is `QUOTE_REPLY`

The wrapper inherits the provider's reply mode. You can pass `replyType` to set a mode for this channel explicitly. Pass your app’s `onReplyInThreadClick` callback to keep **Reply in thread** wired to its thread view. The wrapper forwards channel props and supplies `renderMessageContent` itself.

The desktop menu also uses the stock rendering when UIKit supplies `onMoveToParentMessage`.

`renderMenuItems` receives stock item components. The extension keeps UIKit 3.20.1's order and visibility rules for the supported messages, including ownership for Edit and Delete and `enableMarkAsUnread` for Mark as unread. With reactions enabled, the mobile menu is a bottom sheet. Its new item is a native button that supports Enter and Space. Copy [copy-id.css](copy-id.css) with `integration.tsx`; the integration imports it to keep the extended sheet scrollable in a short viewport. Desktop and the mobile context menu use UIKit's `MenuItem`.

Pass an optional `onCopyResult` to `ChannelWithCopyMessageId` to show feedback in your app. It receives `{ messageId, copied }` from either menu. The browser Clipboard API needs HTTPS or localhost. If the write fails, the menu stays open and the callback receives `copied: false`.

## What the smoke test checks

At 1280px and 390px, the smoke mounts `ChannelWithCopyMessageId` with the existing synthetic session fixture, opens its message menu and checks the stock Copy and Reply items beside **Copy message ID**. The focused menu compares the extension with stock for delivered messages and independently excluded parent, thread-list, channel and reply-mode cases; Edit never appears on someone else's message. With `enableMarkAsUnread` enabled, the stock and extended menus both retain **Mark as unread**. A jump-to-parent callback keeps the stock desktop menu. The stock Edit, Reply and Resend callbacks still fire. Keyboard Enter on the new item writes `101` to the clipboard and closes the menu, which stays inside the viewport.

At 1280px, the `MessageContent` hover menu is compared with stock for supported and excluded states. At 390px, the smoke compares both mobile menus with stock, including their order with Mark as unread enabled, across supported and independently excluded states, including UIKit's chosen context-menu or bottom-sheet mode. It also checks a hidden Delete action, a top-level message in a thread list, and the Edit and Reply callbacks. Chromium touch opens both menus and taps **Copy message ID** in the context menu. In that touch run, releasing the press dismisses both the stock and extended bottom sheet. The bottom-sheet copy is verified with click, Enter and Space. The smoke also checks clipboard failure feedback and scroll access at 390×240.

Fixture-only: [fixture.ts](fixture.ts) builds the menu props and synthetic messages for each state. The wrapper check uses the [shared synthetic session adapter](../shared/group-channel-fixture.tsx); it does not connect to a service. Edit, Reply and Resend stop at local callbacks. Server permissions and persistence are not verified.

[Customize the message menu](https://sendbird.com/docs/chat/uikit/v3/react/tutorial/customize-message-menu)
