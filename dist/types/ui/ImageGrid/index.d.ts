import { ReactElement } from 'react';
import './index.scss';
import { MultipleFilesMessage } from '@sendbird/chat/message';
interface ImageGridProps {
    children: ReactElement[];
    className?: string;
    message: MultipleFilesMessage;
    isReactionEnabled?: boolean;
}
export default function ImageGrid({ children, className, message, isReactionEnabled, }: ImageGridProps): ReactElement;
export {};
