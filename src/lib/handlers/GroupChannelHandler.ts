import { GroupChannelHandler } from "@sendbird/chat/groupChannel";

/**
 * Returns the instance of GroupChannelHandler
 * workaround for: https://sendbird.atlassian.net/browse/UIKIT-1993
 * Recommended fix: remove instanceOf validation check from SDK
 */
export default GroupChannelHandler;
