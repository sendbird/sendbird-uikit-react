/// <reference types="react" />
import './index.scss';
import { UserMessage } from '@sendbird/chat/message';
interface Props {
    className?: string | Array<string>;
    message: UserMessage;
    selected?: boolean;
    onClick?: (message: UserMessage) => void;
}
export default function MessageSearchItem({ className, message, selected, onClick, }: Props): JSX.Element;
export {};
