/// <reference types="react" />
import './index.scss';
interface Props {
    coverImage?: string;
    title?: string;
    subTitle?: string;
    amIOperator?: boolean;
    onActionClick?(): void;
}
export default function OpenchannelConversationHeader({ coverImage, title, subTitle, amIOperator, onActionClick, }: Props): JSX.Element;
export {};
