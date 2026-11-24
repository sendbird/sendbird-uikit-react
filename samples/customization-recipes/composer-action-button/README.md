# Composer action button

Place an app button next to the stock composer. The example's **Show writing tip** opens a hint and leaves the draft, Send button and attachment flow to UIKit.

## Run it

From `samples/customization-recipes`, run `npm ci` and `npm run dev`, then open `http://127.0.0.1:5173/composer-action-button/`.

Type a draft and choose **Show writing tip**. The draft stays as typed and nothing is sent. Send it with the stock Send button; it appears once in **Local send log**. Attach a small file to try the stock preview and file send.

## Public API

[integration.tsx](integration.tsx) passes `renderMessageInput` to `GroupChannel` and renders `MessageInputWrapper` from `@sendbird/uikit-react/GroupChannel/components/MessageInputWrapper` with the app button beside it. Mount `ComposerRecipeChannel` under your authenticated `SendbirdProvider`.

Copy [composer-tip.css](composer-tip.css) with `integration.tsx`. The integration imports it, and its rules apply inside the recipe wrapper.

The button sits next to the composer, not inside its editor. The draft, Send button and attachments stay with UIKit. In a broadcast channel, the tip appears only for operators; see [Jump to latest and Send icon](../jump-to-latest-and-send-icon/README.md) for what `MessageInputWrapper` does not expose.

## What the smoke test checks

At 1280px and 390px: the action toggles its tip and `aria-expanded` without changing the draft or sending, the stock Send delivers the unchanged draft exactly once, and a staged file is sent through the stock attachment flow. The broadcast-member case renders neither the composer nor the tip. An isolated host layout check loads the companion stylesheet to verify unrelated elements keep their styles.

Fixture-only: [fixture.tsx](fixture.tsx) provides a synthetic group channel store whose `sendUserMessage` and `sendFileMessage` only record calls. The smoke renders `ComposerWithWritingTip` inside that store. `ComposerRecipeChannel` also mounts with a synthetic SDK session in the browser check; server persistence is not verified.

[Group channel and MessageInputWrapper](https://sendbird.com/docs/chat/uikit/v3/react/modules/group-channel)
