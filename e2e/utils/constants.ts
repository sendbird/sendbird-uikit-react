/** Server response wait time — WebSocket round-trip after sending a message/file. */
export const SERVER_RESPONSE_TIMEOUT = 10_000;

/**
 * After marking a message from another member as unread, the New Messages separator appears but the
 * unread floating button never mounts, so there is nothing to click or dismiss. The server reports
 * the channel read again straight afterwards, so the count it would show stays at zero.
 */
export const UNREAD_PILL_ABSENT = 'The unread floating button does not mount after mark-as-unread, though the New Messages separator does.';

/**
 * Wait for operator-only UI. The fixtures create channels with the worker user in `operator_ids`,
 * so the role is settled server-side; this covers the client fetching it and re-rendering.
 */
export const OPERATOR_ROLE_TIMEOUT = 20_000;
