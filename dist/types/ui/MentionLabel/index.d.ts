/// <reference types="react" />
import './index.scss';
interface MentionLabelProps {
    mentionTemplate: string;
    mentionedUserId: string;
    mentionedUserNickname: string;
    isByMe: boolean;
}
export default function MentionLabel(props: MentionLabelProps): JSX.Element;
export {};
