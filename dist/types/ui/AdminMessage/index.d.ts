import { ReactElement } from 'react';
import { AdminMessage as AdminMessageType } from '@sendbird/chat/message';
import './index.scss';
interface AdminMessageProps {
    className?: string | Array<string>;
    message: AdminMessageType;
}
export default function AdminMessage({ className, message, }: AdminMessageProps): ReactElement;
export {};
