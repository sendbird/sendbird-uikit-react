import './index.scss';
import { ReactElement } from 'react';
import { SendableMessageType } from '../../utils';
interface Props {
    className?: string | Array<string>;
    message?: SendableMessageType;
    userId?: string;
    isByMe?: boolean;
    isUnavailable?: boolean;
    onClick?: () => void;
}
export default function QuoteMessage({ message, userId, isByMe, className, isUnavailable, onClick, }: Props): ReactElement;
export {};
