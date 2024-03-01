import { ReactElement } from 'react';
import { MultipleFilesMessage } from '@sendbird/chat/message';
import './index.scss';
import { UploadedFileInfoWithUpload } from '../../types';
export declare const ThreadMessageKind: {
    readonly PARENT: "parent";
    readonly CHILD: "child";
};
export type ThreadMessageKindType = typeof ThreadMessageKind[keyof typeof ThreadMessageKind];
interface Props {
    className?: string;
    message: MultipleFilesMessage;
    isByMe?: boolean;
    mouseHover?: boolean;
    isReactionEnabled?: boolean;
    truncateLimit?: number;
    threadMessageKindKey?: string;
    statefulFileInfoList?: UploadedFileInfoWithUpload[];
}
export default function MultipleFilesMessageItemBody({ className, message, isReactionEnabled, threadMessageKindKey, statefulFileInfoList, }: Props): ReactElement;
export {};
