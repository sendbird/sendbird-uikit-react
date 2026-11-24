# Copy message ID menu

Add **Copy message ID** to the message menu only for message types, states and channels the extension explicitly supports. Every other message keeps the stock UIKit menu.

## Run it

From `samples/customization-recipes`, run `npm ci` and `npm run dev`, then open `http://127.0.0.1:5173/copy-message-id-menu/`.

1. Select **Someone else’s delivered message** and click **Open menu**. You see Copy, Reply and **Copy message ID**; Edit and Delete are absent. Choose **Copy message ID** to copy `101` and close the menu.
2. Select **My delivered message** to see Edit and Delete next to the new item.
3. Select **Someone else’s reply**, **My pending message** or **My failed message** to see the stock menu without the new item.
4. Turn **Add ID action** off to compare with the stock menu.
5. Narrow the window below 600px and press and hold the message under **Message with the long-press menu**. UIKit opens its mobile menu, which shows the same new item under the same rules. Check **Reactions** to switch from the context menu to the bottom sheet.

## Public API

[integration.tsx](integration.tsx) has two menus, both passing UIKit's props through so the stock handlers stay connected:

- `CopyMessageIdMenu` wraps `MessageMenu` from `@sendbird/uikit-react/ui/MessageMenu`, the menu `MessageContent` shows on desktop.
- `CopyMessageIdMobileMenu` wraps `MobileMenu` from `@sendbird/uikit-react/ui/MobileMenu`, the long-press menu `MessageContent` shows instead when the provider's `breakpoint` makes the screen mobile.

`CopyIdMessageContent` passes them to `MessageContent` as `renderMessageMenu` and `renderMobileMenuOnLongPress`. `ChannelWithCopyMessageId` renders it from `GroupChannel` `renderMessageContent`, and the demo renders the same component.

The extension applies only when all of these hold. Other messages use the stock desktop `MessageMenu` or mobile `MobileMenu`.

- a user message with `sendingStatus === 'succeeded'` and a positive `messageId`
- a top-level message (no parent, not in a thread list) in a group channel that is not ephemeral or broadcast
- `replyType` is `QUOTE_REPLY`

The desktop menu also uses the stock rendering when UIKit supplies `onMoveToParentMessage`.

`renderMenuItems` receives stock item components. The extension keeps UIKit 3.20.1's order and visibility rules for the supported messages, including ownership for Edit and Delete and `enableMarkAsUnread` for Mark as unread. With reactions enabled, the mobile menu is a bottom sheet. Its new item is a native button that supports Enter and Space. [style.css](style.css), imported by the integration, lets the extended sheet scroll in a short viewport. Desktop and the mobile context menu use UIKit's `MenuItem`.

Pass an optional `onCopyResult` to `ChannelWithCopyMessageId` to show feedback in your app. It receives `{ messageId, copied }` from either menu. The browser Clipboard API needs HTTPS or localhost. If the write fails, the menu stays open and the callback receives `copied: false`.

## What the smoke test checks

At 1280px and 390px, for five message states: with the extension on, the menu equals the stock menu plus **Copy message ID** exactly for the two delivered top-level messages, and Edit never appears on someone else's message. The stock Edit, Reply and Resend callbacks still fire. Keyboard Enter on the new item writes `101` to the clipboard and closes the menu, which stays inside the viewport.

At 1280px, the `MessageContent` hover menu is compared with stock for both delivered messages and a failed message. At 390px, the smoke compares both mobile menus with stock across all five states and checks the Edit and Reply callbacks. Chromium touch opens both menus and taps **Copy message ID** in the context menu. In that touch run, releasing the press dismisses both the stock and extended bottom sheet. The bottom-sheet copy is verified with click, Enter and Space. The smoke also checks clipboard failure feedback and scroll access at 390×240.

Fixture-only: [fixture.ts](fixture.ts) builds the menu props and the synthetic message for each state; Edit, Reply and Resend stop at local callbacks. Server permissions and persistence are not verified.

[Customize the message menu](https://sendbird.com/docs/chat/uikit/v3/react/tutorial/customize-message-menu)
