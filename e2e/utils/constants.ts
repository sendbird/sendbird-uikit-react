/** Server response wait time — WebSocket round-trip after sending a message/file. */
export const SERVER_RESPONSE_TIMEOUT = 10_000;

/**
 * Open channel settings renders the participant view, not the operator view, for a channel opened
 * from the channel list. The channel the settings panel reads is served from the SDK cache, and the
 * open-channel list response carries an empty `operators` array, so `isOperator()` is false and the
 * operator panel — along with the participant actions it hosts — never mounts. Observed against a
 * channel whose operator is set at creation time and confirmed present through the Platform API.
 *
 * Scenarios that drive those actions are held here rather than probing the DOM, so they come back
 * as one named reason instead of silently disappearing from the run.
 */
/**
 * A mention sent through the Platform API comes back to the client with `mentioned_message_template`
 * present but `mentioned_users` empty. UIKit renders a mention label only when the message carries
 * both, so nothing marks the mention — in the bubble or on the channel row. Seeding a mention that
 * renders would need it typed through the composer instead.
 */
export const MENTION_NOT_HYDRATED = 'A mention seeded through the Platform API arrives with an empty mentioned_users list, so no mention label renders.';

/**
 * After marking a message from another member as unread, the New Messages separator appears but the
 * unread floating button never mounts, so there is nothing to click or dismiss.
 */
export const UNREAD_PILL_ABSENT = 'The unread floating button does not mount after mark-as-unread, though the New Messages separator does.';

/**
 * Creating an open channel from the list header leaves the view on the list: the new channel is
 * created, but the conversation header for it never mounts.
 */
export const OPEN_CHANNEL_AUTO_ENTER = 'Creating an open channel from the list header does not move the view into the new channel.';

export const OPEN_CHANNEL_OPERATOR_UI = 'Open channel settings shows the participant view for a channel opened from the list, so the operator panel does not mount.';

/**
 * Wait for operator-only UI. The fixtures create channels with the worker user in `operator_ids`,
 * so the role is settled server-side; this covers the client fetching it and re-rendering.
 */
export const OPERATOR_ROLE_TIMEOUT = 20_000;
