/** Server response wait time — WebSocket round-trip after sending a message/file. */
export const SERVER_RESPONSE_TIMEOUT = 10_000;

/**
 * After marking a message from another member as unread, the New Messages separator appears but the
 * unread floating button never mounts, so there is nothing to click or dismiss. The server reports
 * the channel read again straight afterwards, so the count it would show stays at zero.
 */
export const UNREAD_PILL_ABSENT = 'The unread floating button does not mount after mark-as-unread, though the New Messages separator does.';

/**
 * The open channel participant list loads when its accordion opens and never loads again, and the
 * accordion toggles — so a case that changes a participant and then reads the list back has to
 * reopen it, and reopening flips it shut as often as open. Muting and banning both need that read,
 * and the helper this suite has does not get there reliably yet.
 */
export const OPEN_CHANNEL_PARTICIPANT_LIST_STALE = 'The open channel participant list does not reload after a change, and reopening it reliably needs a helper this suite does not have yet.';

/**
 * Wait for operator-only UI. The fixtures create channels with the worker user in `operator_ids`,
 * so the role is settled server-side; this covers the client fetching it and re-rendering.
 */
export const OPERATOR_ROLE_TIMEOUT = 20_000;
