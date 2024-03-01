import './index.scss';
import { ReactElement } from 'react';
import { SendableMessageType } from '../../utils';
interface Props {
    className?: string | Array<string>;
    replyingMessage: SendableMessageType;
    onClose?: (message: SendableMessageType) => void;
}
export default function QuoteMessageInput({ className, replyingMessage, onClose, }: Props): ReactElement;
export {};
