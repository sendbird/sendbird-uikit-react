import { CoreMessageType, SendableMessageType } from '../../../../utils';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { EmojiContainer } from '@sendbird/chat';
import type { MessageListParams as MessageListParamsInternal } from '../ChannelProvider';

export interface ChannelInitialStateType {
  allMessages: (SendableMessageType | CoreMessageType)[];
  localMessages: (SendableMessageType | CoreMessageType)[];
  loading: boolean;
  initialized: boolean;
  unreadSince: string;
  isInvalid: boolean;
  currentGroupChannel: GroupChannel | null;
  hasMorePrev: boolean;
  oldestMessageTimeStamp: number;
  hasMoreNext: boolean;
  latestMessageTimeStamp: number;
  emojiContainer: EmojiContainer;
  readStatus: any;
  messageListParams: null | MessageListParamsInternal;
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
  unreadSince: null,
  /**
   * unreadSince is a formatted date information string
   * It's used only for the {unreadSince && <UnreadCount time={unreadSince} />}
   */
  isInvalid: false,
  readStatus: null,
  messageListParams: null,
};

export default initialState;
