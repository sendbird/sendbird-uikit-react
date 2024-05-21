## Development App

This app is used for development purposes, and when a PR is created, the preview of this app is provided via Netlify.

### Page Structure

- `/`: This is the main page. Feel free to develop on the PlaygroundPage.
- `/group_channel`: This is the group channel page. It's used for QA or testing purposes, so please modify only if necessary.
- `/open_channel`: This is the open channel page. It's used for QA or testing purposes, so please modify only if necessary.
- `/url-builder`: You can dynamically set the app ID or enable/disable specific features by extracting URL parameters.

### App settings
- All app pages can change the app's settings through query params in the URL. (Easily extractable from the url-builder page)
- To add specific features via query params, modify the `utils/paramsBuilder.ts` file.
