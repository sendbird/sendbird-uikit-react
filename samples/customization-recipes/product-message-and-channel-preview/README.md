# Product message and channel preview

Send product data as a typed `customType` + `data` payload and decode it once. The same decoder drives a product card in the message body and a product row in the channel list. Anything that does not decode keeps the stock UIKit rendering.

## Run it

From `samples/customization-recipes`, run `npm ci` and `npm run dev`, then open `http://127.0.0.1:5173/product-message-and-channel-preview/`.

**1. Message bodies**

- **Product text message** shows a card with **Desk lamp** and **SKU DEMO-1** inside the stock sender, avatar and timestamp.
- **Unknown type**, **Malformed JSON** and **Invalid field type** show the original text.
- **Card with an image** and **Card with a file** show the card above the stock attachment. Click the image to open the stock viewer, or the file name to open the file.
- **Show default message bodies** switches every row back to the stock renderer for comparison.

**2. Channel list preview**

1. Select **New product card**. The Workshop row shows `Product: Desk lamp` and the body shows the card.
2. Select **Edit product title**. Row and body both show `Reading lamp` for the same message ID.
3. Select **General**, then **Unread badge**. Tab from **Customize the body only** to the Workshop row and press Enter or Space to open it.
4. Try **File**, **Unknown type** and **Malformed product** to see the stock row and body. **Customize the body only** keeps the stock row so you can compare its plain-text summary.
5. With **New product card** and **Unread badge** on and Workshop selected, the row hides the count, as the stock row does. Under **App options**, check `enableMarkAsUnread` and choose **Reload with options**, then choose **New product card** and **Unread badge** again; the selected row keeps its badge and `1 unread` in its name. **Make Workshop ephemeral** hides the count in both modes.
6. Check `enableMention` and choose **Reload with options**. Select **New product card** and check **Mention me in Workshop**. Under the same unread rule, the row shows the stock `@` mark and adds `unread mention` to its accessible name.
7. **Use the default channel name** renames Workshop to UIKit's default `Group Channel`. The recipe keeps the stock row's member title (`Alex`). Select **General**, then focus the Alex row and press Enter or Space to open it.

## Public API

- [product.ts](product.ts) defines the `Product` type, `encodeProduct` for the sender and `decodeProduct`, which checks the custom type, JSON shape, field types and lengths.
- [integration.tsx](integration.tsx) provides `ProductMessageContent` (`MessageContent` with `renderMessageBody`, falling back to the `MessageBody` named export of `@sendbird/uikit-react/ui/MessageContent`) and `renderProductPreview` for `GroupChannelList` `renderChannelPreview`, which delegates non-product rows to `GroupChannelListItem`.
- `ProductChat` mounts both under your authenticated `SendbirdProvider`. Send a text or single-file message with `encodeProduct({ sku, title })` spread into its params, and keep a readable `message` text for clients that use the stock renderer.

The product row shows the unread count, and with `enableMention` the unread mention `@` (`@sendbird/uikit-react/ui/MentionUserLabel`), under the same rule as the stock row: when the channel is not selected or `uikitOptions.groupChannel.enableMarkAsUnread` is on, and never for an ephemeral channel. Channels without their own name (empty, `Group Channel` or `AI Chatbot Widget Channel`) keep the stock row, because UIKit builds their title from member nicknames and localized strings that are not a published API.

Limits: the product row keeps the avatar, title, selection, unread badge and mention mark, and omits the stock timestamp, member count, typing indicator and row actions. Enter and Space open both the custom product row and its default-name fallback. Other stock rows keep UIKit's own keyboard behavior. Check the stock file viewer controls in your own layout, especially on narrow screens. Multiple-file messages are not covered.

## What the smoke test checks

At 1280px and 390px: the card renders inside the stock wrapper; the three invalid payloads and the malformed card with a file fall back to stock bodies; the card coexists with the stock image and file bodies; the file action opens the local file; the stock viewer opens from the product image message and closes. In the list: plain text keeps stock row and body, body-only customization keeps the stock summary, a title edit updates row and body for one message ID, the four fallbacks use stock rendering, the product row shows the unread count and opens with Enter and Space, the product row matches the stock row's unread badge and `@` mark with `enableMarkAsUnread` off and on, with `enableMention` off and on, and for an ephemeral channel whether selected or not, and a default-named channel keeps the stock row with its member title.

Fixture-only: [fixture-messages.tsx](fixture-messages.tsx) renders synthetic messages with local files and adds an **Exit demo viewer** button. [fixture-channel-list.tsx](fixture-channel-list.tsx) supplies a synthetic channel-list store whose "edit" replaces the last message locally. The **App options** form (the `mark-as-unread` and `mention` query parameters) and the **Workshop channel** checkboxes exist only to exercise these rules. Whether a connected list and conversation receive and reconcile message updates is not verified.

[Group channel](https://sendbird.com/docs/chat/uikit/v3/react/modules/group-channel) · [Customize the channel list](https://sendbird.com/docs/chat/uikit/v3/react/tutorial/customize-channel-list) · [Send a message with the Chat SDK](https://sendbird.com/docs/chat/sdk/v4/javascript/message/sending-a-message/send-a-message)
