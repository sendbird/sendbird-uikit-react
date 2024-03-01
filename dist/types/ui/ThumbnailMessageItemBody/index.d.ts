import './index.scss';
import { ReactElement } from 'react';
import type { FileMessage } from '@sendbird/chat/message';
import { MultipleFilesMessage } from '@sendbird/chat/message';
interface Props {
    className?: string | Array<string>;
    message: FileMessage | MultipleFilesMessage;
    isByMe?: boolean;
    mouseHover?: boolean;
    isReactionEnabled?: boolean;
    showFileViewer?: (bool: boolean) => void;
    style?: Record<string, any>;
}
export default function ThumbnailMessageItemBody({ className, message, isByMe, mouseHover, isReactionEnabled, showFileViewer, style, }: Props): ReactElement;
export {};
