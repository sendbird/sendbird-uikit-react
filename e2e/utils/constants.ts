/** Server response wait time — WebSocket round-trip after sending a message/file. */
export const SERVER_RESPONSE_TIMEOUT = 10_000;

/**
 * After marking a message from another member as unread, the New Messages separator appears but the
 * unread floating button never mounts, so there is nothing to click or dismiss. The server reports
 * the channel read again straight afterwards, so the count it would show stays at zero.
 */
export const UNREAD_PILL_ABSENT = 'The unread floating button does not mount after mark-as-unread, though the New Messages separator does.';

/**
 * The open channel participant list loads when its accordion opens and never loads again. A second
 * user who joins around that moment can be missing from it, and the panel offers no way to ask for
 * it again: Escape does not dismiss it, and both the settings trigger and the accordion header
 * toggle, so reopening lands shut as often as open — and closing it at all costs the operator view
 * the case came for. Registering an operator, muting and banning all read that list back.
 */
export const OPEN_CHANNEL_PARTICIPANT_LIST_STALE = 'The open channel participant list does not reload after a change, and reopening it reliably needs a helper this suite does not have yet.';

/**
 * Wait for operator-only UI. The fixtures create channels with the worker user in `operator_ids`,
 * so the role is settled server-side; this covers the client fetching it and re-rendering.
 */
export const OPERATOR_ROLE_TIMEOUT = 20_000;
