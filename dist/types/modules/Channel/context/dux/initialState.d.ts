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
declare const initialState: ChannelInitialStateType;
export default initialState;
