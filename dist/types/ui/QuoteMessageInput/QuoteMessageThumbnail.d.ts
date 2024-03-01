import { ReactElement } from 'react';
import type { FileMessage } from '@sendbird/chat/message';
import { MultipleFilesMessage } from '@sendbird/chat/message';
interface Props {
    message: FileMessage | MultipleFilesMessage;
}
export default function QuoteMessageThumbnail({ message }: Props): ReactElement;
export {};
