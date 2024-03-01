import { ReactElement } from 'react';
import { AdminMessage } from '@sendbird/chat/message';
import './index.scss';
interface Props {
    className?: string | Array<string>;
    message: AdminMessage;
}
export default function OpenChannelAdminMessage({ className, message, }: Props): ReactElement;
export {};
