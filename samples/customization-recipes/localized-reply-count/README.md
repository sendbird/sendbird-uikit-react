# Localized reply count

Switch UIKit's strings at runtime with a partial `stringSet`, and format reply counts with the plural rules of each language.

## Run it

From `samples/customization-recipes`, run `npm ci` and `npm run dev`, then open `http://127.0.0.1:5173/localized-reply-count/`.

Switch **Language** between English, Korean and Russian. The input placeholder and the stock reply labels update in place, and the Copy string, which no language overrides, stays in English. In Russian, the app label shows `2 ответа`, `21 ответ` and `22 ответа`, while the stock label uses one plural string for every count above one. Click either reply control in a row to see which message ID it reports.

## Public API

[integration.tsx](integration.tsx):

- `stringSets` are partial dictionaries. Pass the one for the current language to the `stringSet` prop of your root `SendbirdProvider`; changing it updates the mounted UI.

  ```tsx
  <SendbirdProvider appId={appId} userId={userId} accessToken={accessToken} stringSet={stringSets[language]}>
  ```

- `AppReplyLabel` uses `Intl.PluralRules` to pick the noun, hides zero and calls your click handler. Render it in UI your app owns.

The demo page reads the merged dictionary with `useLocalization` from `@sendbird/uikit-react/hooks/useLocalization` to show an override and an English fallback.

Choose per need. The stock reply control uses `CHANNEL__THREAD_REPLY` / `CHANNEL__THREAD_REPLIES`, and the thread panel header uses `THREAD__THREAD_REPLY` / `THREAD__THREAD_REPLIES`. Both keep only one singular and one plural form; the stock control also keeps participant avatars, the `99+` cap and thread integration. The app label uses `Intl.PluralRules` for the full grammar, shows the raw count (for example `100`) and has no avatars. Set `dateLocale` separately if dates should follow the language too.

## What the smoke test checks

At 1280px and 390px, switching English → Korean → Russian → English keeps the same table element, updates the placeholder, keeps the English fallback, and renders the expected stock and app labels for 0, 1, 2, 5, 21, 22 and 100 replies. Both reply controls for 22 replies report message 1022.

Fixture-only: [fixture.ts](fixture.ts) provides messages with fixed reply counts. Thread loading and persistence are not verified.

[Text localization](https://sendbird.com/docs/chat/uikit/v3/react/theme-and-style-resources/localization-resources/text) · [Date localization](https://sendbird.com/docs/chat/uikit/v3/react/theme-and-style-resources/localization-resources/date)
