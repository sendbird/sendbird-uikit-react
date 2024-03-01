import { ReactElement } from 'react';
import './index.scss';
export interface TooltipWrapperProps {
    className?: string | Array<string>;
    children: ReactElement;
    hoverTooltip: ReactElement;
}
export default function TooltipWrapper({ className, children, hoverTooltip, }: TooltipWrapperProps): ReactElement;
