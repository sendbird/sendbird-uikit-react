### Features
- Redesigned the message composer's file attachment flow

  Files can now be attached by drag-and-drop or clipboard paste, and are staged inside the composer so they can be reviewed before sending. The file picker, drag-and-drop, and paste all enforce the same type, size, and count constraints. Available in `GroupChannel` and `Thread`, with single-file support in `OpenChannel`.

### Fixes
- Fixed a bug where clicking a search result did not scroll to or highlight the target message
- Fixed a bug where message scroll pagination did not recover after a network disconnection or a search query change
- Fixed a bug where the `Thread` view was reset when another user was banned from or left the channel
- Fixed a bug where the typing indicator was not cleared correctly when the input became empty or the channel changed
- Fixed a bug where the voice message player did not reset its playback position when the channel changed
- Fixed a bug where HTML in the message input was not sanitized when editing a message
- Fixed an inaccurate warning message shown when the mention count limit is exceeded
