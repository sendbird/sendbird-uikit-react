import { EmojiContainer } from '@sendbird/chat';
import { GroupChannel, Member } from '@sendbird/chat/groupChannel';
import { ChannelStateTypes, ParentMessageStateTypes, ThreadListStateTypes } from '../../types';
import { CoreMessageType, SendableMessageType } from '../../../../utils';
export interface ThreadContextInitialState {
    currentChannel: GroupChannel;
    allThreadMessages: Array<CoreMessageType>;
    localThreadMessages: Array<CoreMessageType>;
    parentMessage: SendableMessageType;
    channelState: ChannelStateTypes;
    parentMessageState: ParentMessageStateTypes;
    threadListState: ThreadListStateTypes;
    hasMorePrev: boolean;
    hasMoreNext: boolean;
    emojiContainer: EmojiContainer;
    isMuted: boolean;
    isChannelFrozen: boolean;
    currentUserId: string;
    typingMembers: Member[];
}
declare const initialState: ThreadContextInitialState;
export default initialState;
