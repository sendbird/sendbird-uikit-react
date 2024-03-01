import './index.scss';
import { ReactElement } from 'react';
import type { FileMessage } from '@sendbird/chat/message';
import { MultipleFilesMessage } from '@sendbird/chat/message';
interface Props {
    className?: string | Array<string>;
    message: FileMessage | MultipleFilesMessage;
    selected?: boolean;
    onClick?: (message: FileMessage | MultipleFilesMessage) => void;
}
export default function MessageSearchFileItem(props: Props): ReactElement;
export {};
