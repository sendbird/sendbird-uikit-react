import React from 'react';
import { EmojiContainer } from '@sendbird/chat';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import './ThreadListItemContent.scss';
import { ReplyType } from '../../../../types';
import { SendableMessageType } from '../../../../utils';
export interface ThreadListItemContentProps {
    className?: string;
    userId: string;
    channel: GroupChannel;
    message: SendableMessageType;
    disabled?: boolean;
    chainTop?: boolean;
    chainBottom?: boolean;
    isMentionEnabled?: boolean;
    isReactionEnabled?: boolean;
    disableQuoteMessage?: boolean;
    replyType?: ReplyType;
    nicknamesMap?: Map<string, string>;
    emojiContainer?: EmojiContainer;
    showEdit?: (bool: boolean) => void;
    showRemove?: (bool: boolean) => void;
    showFileViewer?: (bool: boolean) => void;
    resendMessage?: (message: SendableMessageType) => void;
    toggleReaction?: (message: SendableMessageType, reactionKey: string, isReacted: boolean) => void;
    onReplyInThread?: (props: {
        message: SendableMessageType;
    }) => void;
}
export default function ThreadListItemContent({ className, userId, channel, message, disabled, chainTop, chainBottom, isMentionEnabled, isReactionEnabled, disableQuoteMessage, replyType, nicknamesMap, emojiContainer, showEdit, showRemove, showFileViewer, resendMessage, toggleReaction, onReplyInThread, }: ThreadListItemContentProps): React.ReactElement;
