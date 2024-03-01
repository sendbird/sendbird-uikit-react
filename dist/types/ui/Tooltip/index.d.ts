import { ReactElement } from 'react';
import './index.scss';
export interface TooltipProps {
    className?: string | Array<string>;
    children?: string | ReactElement;
}
export default function Tooltip({ className, children, }: TooltipProps): ReactElement;
