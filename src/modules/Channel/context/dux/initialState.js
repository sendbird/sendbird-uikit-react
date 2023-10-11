export default {
  initialized: false,
  loading: true,
  isScrolled: false,
  allMessages: [],
  /**
   * localMessages: pending & failed messages
   */
  localMessages: [],
  currentGroupChannel: { members: [] },
  // for scrollup
  hasMorePrev: false,
  oldestMessageTimeStamp: 0,
  // for scroll down
  // onScrollDownCallback is added for navigation to different timestamps on messageSearch
  // hasMorePrev, onScrollCallback -> scroll up(default behavior)
  // hasMoreNext, onScrollDownCallback -> scroll down
  hasMoreNext: false,
  latestMessageTimeStamp: 0,
  emojiContainer: {},
  unreadSince: null,
  /**
   * unreadSince is a formatted date information string
   * It's used only for the {unreadSince && <UnreadCount time={unreadSince} />}
   */
  isInvalid: false,
  messageListParams: null,
};
