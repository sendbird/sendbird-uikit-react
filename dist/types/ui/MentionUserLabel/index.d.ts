/// <reference types="react" />
import './index.scss';
interface MentionUserLabelProps {
    className?: string;
    children?: string;
    isReverse?: boolean;
    color?: string;
    userId?: string;
}
export default function MentionUserLabel({ className, children, isReverse, color, userId, }: MentionUserLabelProps): JSX.Element;
export {};
