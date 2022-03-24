export default {
  initialized: false,
  loading: false,
  allMessages: [],
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
  unreadCount: 0,
  unreadSince: null,
  isInvalid: false,
  messageListParams: null,
};
