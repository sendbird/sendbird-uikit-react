# Jump to latest and Send icon

Add an app-owned **Jump to latest** button and change the icon inside the stock Send button, while the stock composer keeps handling empty input, quotes, mentions and staged files.

## Run it

From `samples/customization-recipes`, run `npm ci` and `npm run dev`, then open `http://127.0.0.1:5173/jump-to-latest-and-send-icon/`.
Add `?theme=dark` to open the fixture with a dark UIKit provider. Both history links keep the current theme.

1. Scroll the list up. **Jump to latest** becomes enabled; click it to return to the newest message.
2. Choose **At History 12** to open the channel at an older message, as a search result or quote does, and scroll to the bottom. Newer messages are still unloaded, so **Jump to latest** stays enabled and loads the newest page.
3. Type a message and send it with the arrow button.
4. Open a message's menu and choose **Reply**, type `@Al` to mention Alex, or attach a file. **Last local send call** shows what reached the send boundary.

## Public API

[integration.tsx](integration.tsx):

- `JumpToLatest` reads `state.isScrollBottomReached` and `state.hasNext()` and calls `actions.scrollToBottom(false)` from `useGroupChannel` (`@sendbird/uikit-react/GroupChannel/context`). Like the stock scroll button, it is disabled only at the bottom when no newer messages remain. The button keeps keyboard focus and uses `aria-disabled` with a guarded click. `hasNext` joins the context state after the provider's first render, so the example calls it as `state.hasNext?.()`. Render it inside the `GroupChannelProvider` that owns the message list.
- `BrandedComposer` passes `renderSendMessageIcon` to `MessageInputWrapper`. The renderer supplies only the button's contents, so include accessible text such as the visually hidden "Send". Copy [jump.css](jump.css) with `integration.tsx`; the integration imports it for the icon, hidden label, disabled colors and conversation layout. The renderer takes no arguments, so the CSS uses the native `:disabled` state. UIKit can disable Send in a frozen or muted channel, or when offline with SDK caching disabled.
- `StockConversation` mounts both through `GroupChannelUI` `renderMessageInput` and passes an optional `startingPoint` to `GroupChannelProvider`. It inherits the app’s reply mode from `SendbirdProvider`. The demo provider enables quotation replies.

In UIKit 3.20.1, `MessageInputWrapper` exposes no handle for submitting its draft from a separate button, and `actions.sendUserMessage` takes `UserMessageCreateParams`, not the draft. If you need your own submit button, own the composer and send with the Chat SDK's `channel.sendUserMessage`, including your own pending, retry, reply and mention handling.

## What the smoke test checks

At 1280px and 390px: the jump button is disabled at the bottom, enabled after scrolling up, and returns the list to the bottom. The history links preserve the dark theme. When the channel opens at History 12, the button stays enabled at the bottom of the loaded messages while newer pages remain. Clicking it loads all 24 messages and disables it. After scrolling through all pages, sending a message at the bottom keeps the jump button disabled. The branded icon matches the disabled stock button's computed color via `--sendbird-light-onlight-02` and `--sendbird-dark-ondark-02`. An isolated browser check loads only `jump.css` to verify that the accessible Send label is clipped without demo styles. The arrow points up in RTL for both text and staged-file sends, including UIKit’s mobile file composer at 390px. The branded Send button submits text, a quote reply carries the parent message ID, a mention carries the mentioned user ID, and a staged file is sent as a file message.

Fixture-only: [fixture.tsx](fixture.tsx) replaces the connection, history and send responses through `configureSession`. Upload, persistence and other clients are not verified. The older-page fixture serves newer messages in pages of four. The disabled Send button is set directly on the element; the fixture does not freeze, mute or disconnect the channel.

[Group channel](https://sendbird.com/docs/chat/uikit/v3/react/modules/group-channel) · [Send a message with the Chat SDK](https://sendbird.com/docs/chat/sdk/v4/javascript/message/sending-a-message/send-a-message)
