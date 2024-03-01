import { ReactElement } from 'react';
import './ParentMessageInfoItem.scss';
import { SendableMessageType } from '../../../../utils';
export interface ParentMessageInfoItemProps {
    className?: string;
    message: SendableMessageType;
    showFileViewer?: (bool: boolean) => void;
}
export default function ParentMessageInfoItem({ className, message, showFileViewer, }: ParentMessageInfoItemProps): ReactElement;
