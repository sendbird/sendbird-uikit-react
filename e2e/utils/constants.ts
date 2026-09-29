/** Server response wait time — WebSocket round-trip after sending a message/file. */
export const SERVER_RESPONSE_TIMEOUT = 10_000;

/**
 * After marking a message from another member as unread, the New Messages separator appears but the
 * unread floating button never mounts, so there is nothing to click or dismiss. The server reports
 * the channel read again straight afterwards, so the count it would show stays at zero.
 */
export const UNREAD_PILL_ABSENT = 'The unread floating button does not mount after mark-as-unread, though the New Messages separator does.';

/**
 * The participant list is read once when the accordion opens, and the settings panel does not
 * listen for anyone entering or leaving — its open-channel handlers cover operator, mute, ban and
 * channel changes, but not onUserEntered. A second user who joins moments before the panel opens
 * can therefore be absent from the list with nothing to bring them in, and every case here starts
 * by finding that user's row. Two runs in five went that way.
 *
 * The panel does reload the list after an operator, mute or ban change, and reopening it keeps the
 * operator view — both were checked. What is missing is a way to wait for a newly joined user.
 */
export const OPEN_CHANNEL_PARTICIPANT_NOT_LISTED = 'A user who joins just before the participant accordion opens can be missing from it, and the panel does not watch for anyone entering.';

/**
 * Wait for operator-only UI. The fixtures create channels with the worker user in `operator_ids`,
 * so the role is settled server-side; this covers the client fetching it and re-rendering.
 */
export const OPERATOR_ROLE_TIMEOUT = 20_000;
