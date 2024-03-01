import './index.scss';
import { ReactElement } from 'react';
import type { UserMessage } from '@sendbird/chat/message';
interface Props {
    className?: string | Array<string>;
    message: UserMessage;
    isByMe?: boolean;
    mouseHover?: boolean;
    isMentionEnabled?: boolean;
    isReactionEnabled?: boolean;
    onMessageHeightChange?: () => void;
}
export default function OGMessageItemBody({ className, message, isByMe, mouseHover, isMentionEnabled, isReactionEnabled, onMessageHeightChange, }: Props): ReactElement;
export {};
