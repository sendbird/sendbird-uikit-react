import { EmojiContainer } from "@sendbird/chat";
import { GroupChannel } from "@sendbird/chat/groupChannel";
import { BaseMessage, FileMessage, UserMessage } from "@sendbird/chat/message";
import {
  ChannelStateTypes,
  ParentMessageStateTypes,
  ThreadListStateTypes,
} from "../../types";

export interface ThreadContextInitialState {
  currentChannel: GroupChannel;
  allThreadMessages: Array<BaseMessage>;
  parentMessage: UserMessage | FileMessage;
  channelState: ChannelStateTypes;
  parentMessageState: ParentMessageStateTypes;
  threadListState: ThreadListStateTypes;
  hasMorePrev: boolean;
  hasMoreNext: boolean;
  emojiContainer: EmojiContainer;
  isMuted: boolean;
  isChannelFrozen: boolean;
  currentUserId: string;
}

const initialState: ThreadContextInitialState = {
  currentChannel: null,
  allThreadMessages: [],
  parentMessage: null,
  channelState: ChannelStateTypes.NIL,
  parentMessageState: ParentMessageStateTypes.NIL,
  threadListState: ThreadListStateTypes.NIL,
  hasMorePrev: false,
  hasMoreNext: false,
  emojiContainer: {} as EmojiContainer,
  isMuted: false,
  isChannelFrozen: false,
  currentUserId: '',
}

export default initialState;
