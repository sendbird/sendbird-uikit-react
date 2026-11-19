### Fixes
- Fixed a bug where, with `enableMarkAsUnread` on, the "New Messages" separator did not appear and opening a channel did not mark it as read when the user's `myLastRead` was 0 or the only unread message was an admin message
- With `enableMarkAsUnread` on, when older messages are not loaded yet, the "New Messages" separator now appears only after the first unread message is loaded, instead of on the oldest loaded message. The channel is marked as read once that separator is seen or the unread message banner is closed
- `hasNewMessageSeparator`, passed to `renderMessage` and returned by `getMessagePartsInfo`, can now be `true` for an admin message, and is never `true` for a silent message
- Fixed the connected user keeping its previous nickname and profile image after `SendbirdProvider` applied the `nickname` or `profileUrl` prop; `eventHandlers.connection.onConnected` now receives the updated user
- Fixed a connection that `SendbirdProvider` switched away from before it finished still overwriting the connected user and calling `eventHandlers.connection.onConnected`, or — when it failed — clearing the connected user and calling `eventHandlers.connection.onFailed`
- Fixed the invite list in channel creation crashing when opened before the connection completed, losing users when scrolling through several pages, and showing an outdated list under React StrictMode
