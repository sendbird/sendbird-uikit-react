import { ReactElement } from 'react';
import './index.scss';
export interface BadgeProps {
    count: string | number;
    maxLevel?: number;
    className?: string | Array<string>;
}
export default function Badge({ count, maxLevel, className, }: BadgeProps): ReactElement;
