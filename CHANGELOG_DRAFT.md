### Fixes
- Fixed a bug where every `SendbirdProvider` mount created a new `SendbirdChat` instance and WebSocket connection instead of reusing the cached one

  To use a separate instance, pass `newInstance: true` explicitly through `sdkInitParams`.
- Fixed a bug where a failure to initialize the Chat SDK, such as an empty `appId`, was not reported through the `onFailed` connection event handler
- Fixed a bug where `GroupChannelList` briefly rendered the empty-list placeholder before the channels loaded when the local cache was disabled
- Fixed a bug where an outgoing message that failed to send could render without any status indicator when a custom message list grouped it
- Fixed a bug where `TypingIndicator` did not remove its group channel handler on unmount
