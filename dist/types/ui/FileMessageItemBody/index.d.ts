import './index.scss';
import { ReactElement } from 'react';
import type { FileMessage } from '@sendbird/chat/message';
interface Props {
    className?: string | Array<string>;
    message: FileMessage;
    isByMe?: boolean;
    mouseHover?: boolean;
    isReactionEnabled?: boolean;
    truncateLimit?: number;
}
export default function FileMessageItemBody({ className, message, isByMe, mouseHover, isReactionEnabled, truncateLimit, }: Props): ReactElement;
export {};
