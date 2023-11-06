import { CoreMessageType, SendableMessageType } from '../../../../utils';
import { GroupChannel, Member } from '@sendbird/chat/groupChannel';
import { EmojiContainer } from '@sendbird/chat';
import type { MessageListParams as MessageListParamsInternal } from '../ChannelProvider';

export interface ChannelInitialStateType {
  allMessages: (SendableMessageType | CoreMessageType)[];
  localMessages: (SendableMessageType | CoreMessageType)[];
  loading: boolean;
  initialized: boolean;
  /** @deprecated Please use `unreadSinceDate` instead. * */
  unreadSince: string;
  unreadSinceDate: Date | null;
  isInvalid: boolean;
  currentGroupChannel: GroupChannel | null;
  hasMorePrev: boolean;
  oldestMessageTimeStamp: number;
  hasMoreNext: boolean;
  latestMessageTimeStamp: number;
  emojiContainer: EmojiContainer;
  readStatus: any;
  messageListParams: null | MessageListParamsInternal;
  typingMembers: Member[];
}

const initialState: ChannelInitialStateType = {
  initialized: false,
  loading: true,
  allMessages: [],
  /**
   * localMessages: pending & failed messages
   */
  localMessages: [],
  currentGroupChannel: null,
  // for scrollup
  hasMorePrev: false,
  oldestMessageTimeStamp: 0,
  // for scroll down
  // onScrollDownCallback is added for navigation to different timestamps on messageSearch
  // hasMorePrev, onScrollCallback -> scroll up(default behavior)
  // hasMoreNext, onScrollDownCallback -> scroll down
  hasMoreNext: false,
  latestMessageTimeStamp: 0,
  emojiContainer: { emojiCategories: [], emojiHash: '' },
  /** @deprecated Please use `unreadSinceDate` instead. * */
  unreadSince: null,
  /**
   * unreadSinceDate is a date information about message unread.
   * It's used only for the {unreadSinceDate && <UnreadCount unreadSinceDate={unreadSinceDate} />}
   */
  unreadSinceDate: null,
  isInvalid: false,
  readStatus: null,
  messageListParams: null,
  typingMembers: [],
};

export default initialState;
