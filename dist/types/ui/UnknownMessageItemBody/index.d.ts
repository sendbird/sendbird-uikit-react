import { ReactElement } from 'react';
import './index.scss';
import { BaseMessage } from '@sendbird/chat/message';
interface Props {
    className?: string | Array<string>;
    isByMe?: boolean;
    message: BaseMessage;
    mouseHover?: boolean;
    isReactionEnabled?: boolean;
}
export default function UnknownMessageItemBody({ className, message, isByMe, mouseHover, isReactionEnabled, }: Props): ReactElement;
export {};
