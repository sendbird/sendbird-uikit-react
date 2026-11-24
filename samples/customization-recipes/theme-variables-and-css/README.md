# Theme variables and CSS

Brand the stock conversation in two steps: scoped theme variables for colors and font, then scoped CSS for the bubble and composer geometry that the stylesheet sets as fixed values.

## Run it

From `samples/customization-recipes`, run `npm ci` and `npm run dev`, then open `http://127.0.0.1:5173/theme-variables-and-css/`.

Switch between **UIKit default**, **Theme variables** and **Variables and CSS**. Compare the accent icon inside the chat with the one outside it. Click the heart on the last message or focus it and press Enter or Space to add or remove your local reaction. Then type and send a message with the native composer.

## Public API

[integration.tsx](integration.tsx) wraps `GroupChannel` in a `.branded-chat.target` element under your existing light-theme `SendbirdProvider`. Load `@sendbird/uikit-react/dist/index.css` before [theme.css](theme.css).

| Goal | Use |
| --- | --- |
| Incoming and outgoing colors, hover | `--sendbird-light-background-100/200`, `--sendbird-light-primary-300/400` |
| Font family | `--sendbird-font-family-default` |
| Focused composer | `--sendbird-light-primary-300` for the border and `--sendbird-light-shadow-message-input` for the ring. `--sendbird-message-input-border-active` applies only while the composer is pressed (`:active`). |
| Placeholder and composer border | `--sendbird-light-onlight-03`; keep at least 4.5:1 against the white composer background |
| Bubble radius, padding and text size | A scoped `.sendbird-text-message-item-body` rule, plus `.reactions` to keep the flat bottom edge above the reaction row |
| Composer height and placeholder | Scoped `.sendbird-message-input--textarea` and `--placeholder` rules; change both together |

Variables affect every UIKit component inside their scope, so the accent icon inside the chat turns green while the one outside keeps its default. The class selectors are not a versioned API. Keep them scoped and recheck them when you upgrade UIKit.

## What the smoke test checks

At 1280px and 390px: variables change bubble colors, font and the in-scope accent only, and leave radius and padding at the defaults. The CSS step sets 12px radius, 12px × 16px padding and 16px/24px text, keeps a `12px 12px 0 0` radius on the bubble above a reaction row, and the composer placeholder reaches at least 4.5:1 contrast. The composer stays 56px tall before and after typing, shows the focus color, and its native Send reaches the fixture.

Fixture-only: [fixture.tsx](fixture.tsx) renders `MessageContent` and `MessageInput` with three synthetic messages, one with a heart reaction, instead of a full `GroupChannel`. The smoke test checks the heart count changes from 1 to 2 and back to 1 with both clicks and keyboard input. It also checks the desktop tooltip names Alex. Reactions stay in local state. Dark theme and other message types are not covered.

[Color resources](https://sendbird.com/docs/chat/uikit/v3/react/theme-and-style-resources/color-resources) · [Theme resources](https://sendbird.com/docs/chat/uikit/v3/react/theme-and-style-resources/theme-resources)
