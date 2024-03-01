import { ReactElement } from 'react';
import './index.scss';
import { Colors } from '../../utils/color';
export interface DateSeparatorProps {
    children?: string | ReactElement;
    className?: string | Array<string>;
    separatorColor?: Colors;
}
declare const DateSeparator: ({ children, className, separatorColor, }: DateSeparatorProps) => ReactElement;
export default DateSeparator;
