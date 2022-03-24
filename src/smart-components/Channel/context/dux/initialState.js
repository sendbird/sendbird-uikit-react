export default {
  initialized: false,
  loading: false,
  allMessages: [],
  currentGroupChannel: { members: [] },
  // for scrollup
  hasMorePrev: false,
  lastMessageTimeStamp: 0,
  // for scroll down
  // onScrollDownCallback is added for navigation to different timestamps on messageSearch
  // hasMorePrev, onScrollCallback -> scroll up(default behavior)
  // hasMoreNext, onScrollDownCallback -> scroll down
  hasMoreNext: false,
  latestFetchedMessageTimeStamp: 0,
  emojiContainer: {},
  unreadCount: 0,
  unreadSince: null,
  isInvalid: false,
  messageListParams: null,
};
