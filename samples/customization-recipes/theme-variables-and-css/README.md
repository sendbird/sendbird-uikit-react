# Theme variables and CSS

Brand the stock conversation in two steps: scoped theme variables for colors and font, then scoped CSS for the bubble and composer geometry that the stylesheet sets as fixed values.

## Run it

From `samples/customization-recipes`, run `npm ci` and `npm run dev`, then open `http://127.0.0.1:5173/theme-variables-and-css/`.

Switch between **UIKit default**, **Theme variables** and **Variables and CSS**. Compare the accent icon inside the chat with the one outside it. Click the heart on the last message to add or remove your local reaction. This demo also toggles it when you focus it and press Enter or Space; that keyboard handling comes from [fixture.tsx](fixture.tsx), not from UIKit. Then type and send a message with the native composer, or attach a file to see the stock preview.

## Public API

[integration.tsx](integration.tsx) wraps `GroupChannel` in a `.branded-chat.target` element under your existing light-theme `SendbirdProvider`. Load `@sendbird/uikit-react/dist/index.css` before [theme.css](theme.css).

| Goal | Use |
| --- | --- |
| Incoming and outgoing colors, hover | `--sendbird-light-background-100/200`, `--sendbird-light-primary-300/400` |
| Font family | `--sendbird-font-family-default` |
| Focused composer | `--sendbird-light-primary-300` for the border and `--sendbird-light-shadow-message-input` for the ring. `--sendbird-message-input-border-active` applies only while the composer is pressed (`:active`). |
| Placeholder and composer border | `--sendbird-light-onlight-03`; keep at least 4.5:1 against the white composer background |
| Bubble radius, padding and text size | A scoped `.sendbird-text-message-item-body` rule, plus `.reactions` to keep the flat bottom edge above the reaction row |
| Composer height and placeholder | Scoped `.sendbird-message-input--textarea` and `--placeholder` rules; change both together. Skip the placeholder rule while a file is staged (`.sendbird-message-input--has-pending`), where UIKit places it below the file preview. |

Variables affect every UIKit component inside their scope, so the accent icon inside the chat turns green while the one outside keeps its default. The class selectors are not a versioned API. Keep them scoped and recheck them when you upgrade UIKit.

## What the smoke test checks

At 1280px and 390px: variables change bubble colors, font and the in-scope accent only, and leave radius and padding at the defaults. The CSS step sets 12px radius, 12px × 16px padding and 16px/24px text, keeps a `12px 12px 0 0` radius on the bubble above a reaction row, and the composer placeholder reaches at least 4.5:1 contrast. The composer stays 56px tall before and after typing, shows the focus color, and its native Send reaches the fixture. After the staged PNG thumbnail decodes, the smoke compares the branded composer, preview, placeholder and Send positions with stock. It checks that the placeholder sits below the preview and Send delivers the file.

Fixture-only: [fixture.tsx](fixture.tsx) renders `MessageContent` with three synthetic messages, one with a heart reaction, and the stock `MessageInputWrapper` over a local channel store, instead of a full `GroupChannel`. The fixture also routes Enter and Space on the heart to the same local toggle. In UIKit 3.20.1 the stock heart receives focus but does not respond to these keys, so with the copyable [integration.tsx](integration.tsx) it responds to clicks only. The smoke test checks the heart count changes from 1 to 2 and back to 1 with clicks and with the fixture's keyboard handling. It also checks the desktop tooltip names Alex. Reactions stay in local state. Dark theme and other message types are not covered.

[Color resources](https://sendbird.com/docs/chat/uikit/v3/react/theme-and-style-resources/color-resources) · [Theme resources](https://sendbird.com/docs/chat/uikit/v3/react/theme-and-style-resources/theme-resources)
