export const actionTypes = {
  FETCH_CHANNEL_START: 'FETCH_CHANNEL_START',
  FETCH_CHANNEL_SUCCESS: 'FETCH_CHANNEL_SUCCESS',
  FETCH_CHANNEL_FAILURE: 'FETCH_CHANNEL_FAILURE',
  RESET_MESSAGES: 'RESET_MESSAGES',
  FETCH_INITIAL_MESSAGES_START: 'FETCH_INITIAL_MESSAGES_START',
  FETCH_INITIAL_MESSAGES_SUCCESS: 'FETCH_INITIAL_MESSAGES_SUCCESS',
  FETCH_INITIAL_MESSAGES_FAILURE: 'FETCH_INITIAL_MESSAGES_FAILURE',
  FETCH_PREV_MESSAGES_SUCCESS: 'FETCH_PREV_MESSAGES_SUCCESS',
  FETCH_PREV_MESSAGES_FAILURE: 'FETCH_PREV_MESSAGES_FAILURE',

  /**
   * Being able to notice which notification messages are newly arrived by the (unread) badge UI
   * last seen at == groupChannel.myLastRead; should not updated when the channel is on entered(use it only once) and receives a new notification.
   * Needs to call markAsRead internally (but not provide as public interfaces) when:
   *    Enters the channel
   *    Receives a new message (when the channel is visible due to the channel unread message count will be reset)
   *    Whenever the channel is visible.
   *    (iOS, AOS) tab bar case, because the notification channel view keeps alive, should update last seen value manually → updateLastSeen(timestamp: LONG)
   */
  SET_LAST_SEEN: 'SET_LAST_SEEN',

  ON_MESSAGE_RECEIVED: 'ON_MESSAGE_RECEIVED',
  ON_MESSAGE_UPDATED: 'ON_MESSAGE_UPDATED',
  ON_MESSAGE_DELETED: 'ON_MESSAGE_DELETED',
  ON_CHANNEL_DELETED: 'ON_CHANNEL_DELETED',
} as const;

// todo: Move to somewhere generic
// using pattern from this video:
// https://youtu.be/jjMbPt_H3RQ?t=316
type ObjectValues<T> = T[keyof T];

export type ActionType = ObjectValues<typeof actionTypes>;
