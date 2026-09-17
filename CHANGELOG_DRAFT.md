### Fixes
- Fixed an open channel scrolling to the bottom when a message was sent in a **different** channel sharing the same `SendbirdProvider`, which lost the position of a user who had scrolled up to read history
- Fixed a message being clipped at the bottom of the `GroupChannel` message list when it was the first message of a new day and drew a date separator
- Fixed a message being clipped when marking it as unread inserted the "New Messages" separator above it
- Playing a voice message no longer stops when a thread is opened or closed on that same message
- Playing a voice message no longer stops when a different voice message leaves the screen
- A recorded voice message now stops playing when you leave the channel instead of continuing in the background
- The playback position of a voice message now resets when you leave the channel
- Replacing a custom `renderChannelPreview` or `onChannelSelected` on `OpenChannelList` now takes effect, and custom items in `OpenChannelList` and `MessageSearch` no longer trigger React's duplicate-key warning; previously the list kept the previous render prop and click handler until the channel list itself changed
