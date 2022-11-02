import { EmojiContainer } from "@sendbird/chat";
import { GroupChannel } from "@sendbird/chat/groupChannel";
import { FileMessage, UserMessage } from "@sendbird/chat/message";
import { ParentMessageInfoStateTypes, ThreadListStateTypes } from "../../types";

export interface ThreadContextInitialState {
  currentChannel: GroupChannel;
  parentMessage: UserMessage | FileMessage;
  parentMessageInfoState: ParentMessageInfoStateTypes;
  threadListState: ThreadListStateTypes;
  hasMorePrev: boolean;
  hasMoreNext: boolean;
  emojiContainer: EmojiContainer;
}

const initialState: ThreadContextInitialState = {
  currentChannel: null,
  parentMessage: null,
  parentMessageInfoState: ParentMessageInfoStateTypes.NIL,
  threadListState: ThreadListStateTypes.NIL,
  hasMorePrev: false,
  hasMoreNext: false,
  emojiContainer: {} as EmojiContainer,
}

export default initialState;
