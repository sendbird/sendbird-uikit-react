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

## Public API

- [product.ts](product.ts) defines the `Product` type, `encodeProduct` for the sender and `decodeProduct`, which checks the custom type, JSON shape, field types and lengths.
- [integration.tsx](integration.tsx) provides `ProductMessageContent` (`MessageContent` with `renderMessageBody`, falling back to the `MessageBody` named export of `@sendbird/uikit-react/ui/MessageContent`) and `renderProductPreview` for `GroupChannelList` `renderChannelPreview`, which delegates non-product rows to `GroupChannelListItem`.
- `ProductChat` mounts both under your authenticated `SendbirdProvider`. Send a text or single-file message with `encodeProduct({ sku, title })` spread into its params, and keep a readable `message` text for clients that use the stock renderer.

Limits: the product row keeps the avatar, title, selection and unread badge, and omits the stock timestamp, member count, typing indicator and row actions. The Enter/Space handling applies to the custom product row; stock rows keep UIKit's own keyboard behavior. The card does not change the stock file viewer; check its controls in your own layout, especially on narrow screens. Multiple-file messages are not covered.

## What the smoke test checks

At 1280px and 390px: the card renders inside the stock wrapper; the three invalid payloads and the malformed card with a file fall back to stock bodies; the card coexists with the stock image and file bodies; the file action opens the local file; the stock viewer opens from the product image message and closes. In the list: plain text keeps stock row and body, body-only customization keeps the stock summary, a title edit updates row and body for one message ID, the four fallbacks use stock rendering, and the product row shows the unread count and opens with Enter and Space.

Fixture-only: [fixture-messages.tsx](fixture-messages.tsx) renders synthetic messages with local files and adds an **Exit demo viewer** button. [fixture-channel-list.tsx](fixture-channel-list.tsx) supplies a synthetic channel-list store whose "edit" replaces the last message locally. Whether a connected list and conversation receive and reconcile message updates is not verified.

[Group channel](https://sendbird.com/docs/chat/uikit/v3/react/modules/group-channel) · [Customize the channel list](https://sendbird.com/docs/chat/uikit/v3/react/tutorial/customize-channel-list) · [Send a message with the Chat SDK](https://sendbird.com/docs/chat/sdk/v4/javascript/message/sending-a-message/send-a-message)
