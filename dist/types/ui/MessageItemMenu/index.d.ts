import './index.scss';
import { ReactElement } from 'react';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import type { OpenChannel } from '@sendbird/chat/openChannel';
import { SendableMessageType } from '../../utils/index';
import { ReplyType } from '../../types';
export interface MessageMenuProps {
    className?: string | Array<string>;
    message: SendableMessageType;
    channel: GroupChannel | OpenChannel;
    isByMe?: boolean;
    disabled?: boolean;
    replyType?: ReplyType;
    disableDeleteMessage?: boolean;
    showEdit?: (bool: boolean) => void;
    showRemove?: (bool: boolean) => void;
    deleteMessage?: (message: SendableMessageType) => void;
    resendMessage?: (message: SendableMessageType) => void;
    setQuoteMessage?: (message: SendableMessageType) => void;
    setSupposedHover?: (bool: boolean) => void;
    onReplyInThread?: (props: {
        message: SendableMessageType;
    }) => void;
    onMoveToParentMessage?: () => void;
}
export declare function MessageMenu({ className, message, channel, isByMe, disabled, replyType, disableDeleteMessage, showEdit, showRemove, deleteMessage, resendMessage, setQuoteMessage, setSupposedHover, onReplyInThread, onMoveToParentMessage, }: MessageMenuProps): ReactElement;
export default MessageMenu;
